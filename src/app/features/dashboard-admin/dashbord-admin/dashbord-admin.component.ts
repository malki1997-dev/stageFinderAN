import { Component, OnInit } from '@angular/core';
import { DashboardAdminService } from './dashboard-admin.service';
import { UserDTO } from '../../user/user.model';
import { Router } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { forkJoin } from 'rxjs';
import { UserService } from '../../user/user.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartModule, CommonModule, ButtonModule, CardModule],
  templateUrl: './dashbord-admin.component.html',
  styleUrl: './dashbord-admin.component.css'
})
export class DashbordAdminComponent implements OnInit {

  // Données pour le graphique à barres (inscriptions par mois)
  barChartData: any;
  barChartOptions: any;

  // Données pour le graphique en ligne (publications par mois)
  lineChartData: any;
  lineChartOptions: any;

  // Données pour le graphique en cercle (catégories les plus publiées)
  pieChartData: any;
  pieChartOptions: any;

  // Données pour le deuxième graphique à barres (statistiques des utilisateurs)
  barChartData2: any;
  barChartOptions2: any;

  totalUsers: number = 0;
  totalStagiaires: number = 0;
  totalRecruteurs: number = 0;
  totalCandidatures: number = 0;
  totalOffres: number = 0;
  totalNonAcceptedRecruteurs: number = 0; // Nouvelle propriété pour le nombre de recruteurs non acceptés

  nonAcceptedRecruteurs: UserDTO[] = [];

  constructor(
    private dashboardService: DashboardAdminService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadBarChartData();
    this.loadLineChartData();
    this.loadPieChartData();
    this.loadDashboardData();
  }

  // Charger les données pour le graphique à barres (inscriptions par mois)
  loadBarChartData(): void {
    this.dashboardService.getUsersRegisteredPerMonth().subscribe({
      next: (data) => {
        console.log('Bar chart data:', data);
        const labels = data.map(item => item.month);
        const counts = data.map(item => item.count);

        this.barChartData = {
          labels: labels,
          datasets: [
            {
              label: 'Inscriptions par mois',
              backgroundColor: '#42A5F5',
              data: counts
            }
          ]
        };

        this.barChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Nombre d\'utilisateurs'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Mois'
              }
            }
          },
          plugins: {
            legend: {
              position: 'top'
            },
            title: {
              display: true,
              text: 'Inscriptions d\'Utilisateurs par Mois'
            }
          }
        };
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données du graphique à barres', err);
      }
    });
  }

  // Charger les données pour le graphique en ligne (publications par mois)
  loadLineChartData(): void {
    this.dashboardService.getJobPostingsPerMonth().subscribe({
      next: (data) => {
        console.log('Line chart data:', data);
        const labels = data.map(item => item.month);
        const counts = data.map(item => item.count);

        this.lineChartData = {
          labels: labels,
          datasets: [
            {
              label: 'Publications par mois',
              borderColor: '#66BB6A',
              fill: false,
              data: counts
            }
          ]
        };

        this.lineChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Nombre de publications'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Mois'
              }
            }
          },
          plugins: {
            legend: {
              position: 'top'
            },
            title: {
              display: true,
              text: 'Publications de Stages par Mois'
            }
          }
        };
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données du graphique en ligne', err);
      }
    });
  }

  // Charger les données pour le graphique en cercle (catégories les plus publiées)
  loadPieChartData(): void {
    this.dashboardService.getMostPublishedCategories().subscribe({
      next: (data) => {
        console.log('Pie chart data:', data);
        const labels = data.map(item => item.category);
        const counts = data.map(item => item.count);

        this.pieChartData = {
          labels: labels,
          datasets: [
            {
              data: counts,
              backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                '#FF9F40', '#E7E9ED', '#C9CBCF', '#ADFF2F', '#FFD700'
              ]
            }
          ]
        };

        this.pieChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right'
            },
            title: {
              display: true,
              text: 'Catégories d\'Offres les Plus Publiées'
            }
          }
        };
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données du graphique en cercle', err);
      }
    });
  }

  // Charger les données du tableau de bord
  loadDashboardData(): void {
    forkJoin({
      users: this.dashboardService.getTotalUsers(),
      stagiaires: this.dashboardService.getTotalStagiaires(),
      recruteurs: this.dashboardService.getTotalRecruteurs(),
      candidatures: this.dashboardService.getTotalCandidatures(),
      offres: this.dashboardService.getTotalOffres(),
      nonAcceptedRecruteurs: this.userService.getNonAcceptedRecruteurs(), // Ajout de la récupération des recruteurs non acceptés
      
    }).subscribe({
      next: ({ users, stagiaires, recruteurs, candidatures, offres, nonAcceptedRecruteurs }) => {
        this.totalUsers = users;
        this.totalStagiaires = stagiaires;
        this.totalRecruteurs = recruteurs;
        this.totalCandidatures = candidatures;
        this.totalOffres = offres;
        this.nonAcceptedRecruteurs = nonAcceptedRecruteurs;
        this.totalNonAcceptedRecruteurs = nonAcceptedRecruteurs.length; // Compter le nombre de recruteurs non acceptés

        this.updateBarChart(); // Mise à jour du graphique après toutes les données
      },
      error: (err) => console.error('Erreur lors du chargement des données', err)
    });
  }

  // Mettre à jour le deuxième graphique à barres (statistiques des utilisateurs)
  updateBarChart(): void {
    this.barChartData2 = {
      labels: ['Utilisateurs', 'Stagiaires', 'Recruteurs'],
      datasets: [
        {
          label: 'Nombre',
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
          data: [this.totalUsers, this.totalStagiaires, this.totalRecruteurs]
        }
      ]
    };

    this.barChartOptions2 = {
      responsive: true,
      maintainAspectRatio: false,
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
    this.router.navigate(['']); // À mettre à jour avec le chemin correct
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
            this.totalNonAcceptedRecruteurs = this.nonAcceptedRecruteurs.length; // Mettre à jour le compteur
          }
          this.nonAcceptedRecruteurs = [...this.nonAcceptedRecruteurs];
        }
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour de estValide', err);
      }
    });
  }
  voirRecruteursNonAcceptes() {
    this.router.navigate(['na-recruteur-list']);
    }
}
