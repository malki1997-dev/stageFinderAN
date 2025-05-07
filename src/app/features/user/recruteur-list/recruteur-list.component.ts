import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { UserDTO } from '../user.model';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-recruteur-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './recruteur-list.component.html',
  styleUrls: ['./recruteur-list.component.css']
})
export class RecruteurListComponent implements OnInit {
  recruteurs: UserDTO[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadRecruteurs();
  }

  loadRecruteurs(): void {
    this.userService.getRecruteurs().subscribe({
      next: (recruteurs) => {
        this.recruteurs = recruteurs;
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
        // Update the local array to reflect the change
        const index = this.recruteurs.findIndex(r => r.id === recruteur.id);
        if (index !== -1) {
          this.recruteurs[index] = updatedUser;
          // Trigger change detection if necessary
          this.recruteurs = [...this.recruteurs];
        }
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour de estValide', err);
      }
    });
  }
}
