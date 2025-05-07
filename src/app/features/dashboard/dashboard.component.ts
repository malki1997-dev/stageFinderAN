import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { forkJoin } from 'rxjs';
import { UserService } from '../user/user.service';
import { UserDTO } from '../user/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalUsers: number = 0;
  totalStagiaires: number = 0;
  totalRecruteurs: number = 0;
  totalCandidatures: number = 0;
  totalOffres: number = 0;

  barChartData: any;
  barChartOptions: any;

  nonAcceptedRecruteurs: UserDTO[] = [];

  constructor(private dashboardService: DashboardService,
              private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    forkJoin({
      users: this.dashboardService.getTotalUsers(),
      stagiaires: this.dashboardService.getTotalStagiaires(),
      recruteurs: this.dashboardService.getTotalRecruteurs(),
      candidatures: this.dashboardService.getTotalCandidatures(),
      offres: this.dashboardService.getTotalOffres()
    }).subscribe({
      next: ({ users, stagiaires, recruteurs, candidatures, offres }) => {
        this.totalUsers = users;
        this.totalStagiaires = stagiaires;
        this.totalRecruteurs = recruteurs;
        this.totalCandidatures = candidatures;
        this.totalOffres = offres;

        this.updateBarChart(); // Mise à jour du graphique après toutes les données
      },
      error: (err) => console.error('Erreur lors du chargement des données', err)
    });
  }

  updateBarChart(): void {
    this.barChartData = {
      labels: ['Utilisateurs', 'Stagiaires', 'Recruteurs'],
      datasets: [
        {
          label: 'Nombre',
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
          data: [this.totalUsers, this.totalStagiaires, this.totalRecruteurs]
        }
      ]
    };

    this.barChartOptions = {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Nombre'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Type d\'utilisateur'
          }
        }
      }
    };
  }

  listeOffres() {
    this.router.navigate(['']); // Mets ici ton bon chemin
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
