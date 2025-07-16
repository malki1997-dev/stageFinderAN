import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { UserDTO } from '../user.model';

@Component({
  selector: 'app-non-accepted-recruteurs-list',
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './non-accepted-recruteurs-list.component.html',
  styleUrl: './non-accepted-recruteurs-list.component.css'
})
export class NonAcceptedRecruteursListComponent implements OnInit{
  nonAcceptedRecruteurs: UserDTO[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadNonAcceptedRecruteurs();
  }

  loadNonAcceptedRecruteurs(): void {
    this.userService.getNonAcceptedRecruteurs().subscribe({
      next: (recruteurs) => {
        this.nonAcceptedRecruteurs = recruteurs;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des recruteurs non acceptés', err);
      }
    });
  }

  toggleEstValide(recruteur: UserDTO): void {
    const newEstValide = !recruteur.estValide;
    this.userService.updateEstValide(recruteur.id, newEstValide).subscribe({
      next: (updatedUser) => {
        const index = this.nonAcceptedRecruteurs.findIndex(r => r.id === recruteur.id);
        if (index !== -1) {
          this.nonAcceptedRecruteurs[index] = updatedUser;
          if (updatedUser.estValide) {
            this.nonAcceptedRecruteurs.splice(index, 1); // Retirer si validé
          }
          this.nonAcceptedRecruteurs = [...this.nonAcceptedRecruteurs];
        }
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour de estValide', err);
      }
    });
  }
}
