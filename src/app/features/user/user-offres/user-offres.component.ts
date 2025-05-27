import { Component, OnInit } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { Router } from '@angular/router';
import { OffreDTO } from '../../offre/offre/offre.model';
import { OffreService } from '../../offre/offre/offre.service';
import { AddOffreComponent } from '../../offre/offre/add-offre/add-offre.component';

@Component({
  selector: 'app-user-offres',
  standalone: true,
  imports: [ChipModule, BadgeModule, ButtonModule, CommonModule, PaginatorModule, AddOffreComponent],
  templateUrl: './user-offres.component.html',
  styleUrls: ['./user-offres.component.css']
})
export class UserOffresComponent implements OnInit {
  offres: OffreDTO[] = [];
  currentPage: number = 0;
  rowsPerPage: number = 3;
  totalRecords: number = 0;
  userId: number = 5; // TODO: Remplacer par une récupération dynamique

  constructor(
    private offreService: OffreService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadOffres(this.currentPage, this.rowsPerPage);
  }

  loadOffres(page: number, size: number) {
    this.offreService.getOffresByUser(this.userId, page, size).subscribe({
      next: (response) => {
        this.offres = response.offres;
        console.log('Offres de l\'utilisateur chargées :', this.offres);
        this.currentPage = response.currentPage;
        this.totalRecords = response.totalItems;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des offres :', err);
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.rowsPerPage = event.rows;
    this.loadOffres(this.currentPage, this.rowsPerPage);
  }

  deleteOffre(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      this.offreService.deleteOffre(id).subscribe({
        next: () => {
          this.loadOffres(this.currentPage, this.rowsPerPage);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de l\'offre :', err);
        }
      });
    }
  }

  showEditDialog(offre: OffreDTO) {
    if (offre.id) {
      this.router.navigate(['edit-offre', offre.id]);
    } else {
      console.error('ID de l\'offre manquant');
    }
  }

  viewCandidatures(offreId: number) {
    if (offreId) {
      this.router.navigate(['candidatures', offreId]);
    } else {
      console.error('offreId non défini pour voir les candidatures');
    }
  }
}
