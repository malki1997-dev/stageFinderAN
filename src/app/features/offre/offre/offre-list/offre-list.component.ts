import { Component, OnInit } from '@angular/core';
import { OffreService } from '../offre.service';
import { OffreDTO } from '../offre.model';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { Router } from '@angular/router';
import { AddOffreComponent } from "../add-offre/add-offre.component";
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-offre-list',
  imports: [
    ChipModule,
    BadgeModule,
    ButtonModule,
    CommonModule,
    PaginatorModule,
    AddOffreComponent,
    SearchBarComponent
  ],
  templateUrl: './offre-list.component.html',
  styleUrl: './offre-list.component.css',
  standalone: true
})
export class OffreListComponent implements OnInit {
  offres: OffreDTO[] = [];
  currentPage: number = 0;
  rowsPerPage: number = 3;
  totalRecords: number = 0;
  searchVille: string | null = null;

  constructor(
    private offreService: OffreService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadOffres(this.currentPage, this.rowsPerPage);
  }

  get isRecruteur(): boolean {
    return this.authService.getUserRole() === 'RECRUTEUR';
  }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'ADMINISTRATEUR';
  }

  get isStagiaire(): boolean {
    return this.authService.getUserRole() === 'STAGIAIRE';
  }

  loadOffres(page: number, size: number, ville: string | null = null) {
    if (ville) {
      this.offreService.getOffresByVille(ville, page, size).subscribe({
        next: (response) => {
          this.offres = response.offres.sort((a, b) => a.id - b.id);
          this.currentPage = response.currentPage;
          this.totalRecords = response.totalItems;
          console.log('Offres chargées par ville:', this.offres);
        },
        error: (err) => {
          console.error('Erreur lors du chargement des offres par ville:', err);
        }
      });
    } else {
      this.offreService.getOffres(page, size).subscribe({
        next: (response) => {
          this.offres = response.offres.sort((a, b) => a.id - b.id);
          this.currentPage = response.currentPage;
          this.totalRecords = response.totalItems;
          console.log('Offres chargées:', this.offres);
        },
        error: (err) => {
          console.error('Erreur lors du chargement des offres:', err);
        }
      });
    }
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.rowsPerPage = event.rows;
    this.loadOffres(this.currentPage, this.rowsPerPage, this.searchVille);
  }

  onSearch(ville: string) {
    this.searchVille = ville || null;
    this.currentPage = 0; // Reset to first page
    this.loadOffres(this.currentPage, this.rowsPerPage, this.searchVille);
  }

  deleteOffre(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      this.offreService.deleteOffre(id).subscribe({
        next: () => {
          this.loadOffres(this.currentPage, this.rowsPerPage, this.searchVille);
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

  onPostule(offreId: number) {
    if (offreId) {
      this.router.navigate(['postuler', offreId]);
    } else {
      console.error('offreId non défini');
    }
  }

  onOffreAdded() {
    this.loadOffres(this.currentPage, this.rowsPerPage, this.searchVille);
  }
}
