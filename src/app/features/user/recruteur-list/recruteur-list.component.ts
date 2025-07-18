import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { UserDTO } from '../user.model';
import { FileService } from '../../../core/services/file.service';

// PrimeNG
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

// Composant de modification
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-recruteur-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    EditUserComponent // 👉 le composant de modification unique (stagiaire + recruteur)
  ],
  templateUrl: './recruteur-list.component.html',
  styleUrls: ['./recruteur-list.component.css']
})
export class RecruteurListComponent implements OnInit {
  recruteurs: UserDTO[] = [];
  selectedRecruteur: UserDTO | null = null;
  showEditDialog: boolean = false;

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

        // Charger les images
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

          // Recharger l'image si elle existe
          if (updatedUser.image) {
            this.fileService.getImageBlobUrl(updatedUser.image, 'image')
              .then(url => {
                this.recruteurs[index].imageUrl = url;
              });
          }

          // Forcer le rafraîchissement de l'affichage
          this.recruteurs = [...this.recruteurs];
        }
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour de estValide', err);
      }
    });
  }

  openEditDialog(recruteur: UserDTO): void {
    this.selectedRecruteur = recruteur;
    this.showEditDialog = true;
  }

  onUserUpdated(): void {
    this.showEditDialog = false;
    this.selectedRecruteur = null;
    this.loadRecruteurs(); // Recharger la liste après modification
  }
    deleteRecruteur(id: number): void {
  const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce recruteur ?");
  if (!confirmDelete) return;

  this.userService.deleteUser(id).subscribe({
    next: () => {
      this.recruteurs = this.recruteurs.filter(s => s.id !== id); // Retire de la liste sans reload complet
      alert("Recruteur supprimé avec succès.");
    },
    error: (err) => {
      console.error("Erreur de suppression :", err);
      alert("Échec de la suppression.");
    }
  });
}
}
