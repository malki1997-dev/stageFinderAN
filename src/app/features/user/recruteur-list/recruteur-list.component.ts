import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { UserDTO } from '../user.model';
import { ButtonModule } from 'primeng/button';
import { FileService } from '../../../core/services/file.service';

@Component({
  selector: 'app-recruteur-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './recruteur-list.component.html',
  styleUrls: ['./recruteur-list.component.css']
})
export class RecruteurListComponent implements OnInit {
  recruteurs: UserDTO[] = [];

  constructor(
    private userService: UserService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.loadRecruteurs();
  }

 loadRecruteurs(): void {
  this.userService.getRecruteurs().subscribe({
    next: (recruteurs) => {
      this.recruteurs = recruteurs;

      // Charger les images sécurisées (logo) via token
      this.recruteurs.forEach(recruteur => {
        if (recruteur.image) {
          this.fileService.getImageBlobUrl(recruteur.image, 'image')
            .then(url => {
              recruteur.imageUrl = url;
              console.log(`✅ Image chargée pour ${recruteur.nom}:`, url);
            })
            .catch(err => console.error(`❌ Erreur image pour ${recruteur.nom}`, err));
        } else {
          console.log(`ℹ️ Pas d'image pour ${recruteur.nom}`);
        }
      });
    },
    error: (err) => {
      console.error('Erreur lors du chargement des recruteurs', err);
    }
  });
}

toggleEstValide(recruteur: UserDTO): void {
  const newEstValide = !recruteur.estValide;
  this.userService.updateEstValide(recruteur.id, newEstValide).subscribe({
    next: (updatedUser) => {
      const index = this.recruteurs.findIndex(r => r.id === recruteur.id);
      if (index !== -1) {
        this.recruteurs[index] = updatedUser;

        // Recharge image si nécessaire
        if (updatedUser.image) {
          this.fileService.getImageBlobUrl(updatedUser.image, 'image')
            .then(url => {
              this.recruteurs[index].imageUrl = url;
              console.log(`🔄 Image rechargée après MAJ pour ${updatedUser.nom}:`, url);
            });
        }

        this.recruteurs = [...this.recruteurs];
      }
    },
    error: (err) => {
      console.error('Erreur lors de la mise à jour de estValide', err);
    }
  });
}}
