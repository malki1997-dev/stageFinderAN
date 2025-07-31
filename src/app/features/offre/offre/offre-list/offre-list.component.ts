import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OffreService } from '../offre.service';
import { OffreDTO } from '../offre.model';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { Router } from '@angular/router';
import { AddOffreComponent } from '../add-offre/add-offre.component';
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
  styleUrls: ['./offre-list.component.css'],
  standalone: true
})
export class OffreListComponent implements OnInit {
  offres: OffreDTO[] = [];
  currentPage: number = 0;
  rowsPerPage: number = 6;
  totalRecords: number = 0;
  searchVille: string | null = null;

  constructor(
    private offreService: OffreService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('OffreListComponent: Checking token on init');
    const token = this.authService.getToken();
    console.log('OffreListComponent: Token available:', token);
    if (!this.authService.isLoggedIn()) {
      console.log('OffreListComponent: User not logged in, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }
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
    console.log('OffreListComponent: Loading offres, page:', page, 'size:', size, 'ville:', ville);
    if (ville) {
      this.offreService.getOffresByVille(ville, page, size).subscribe({
        next: (response) => {
          console.log('Réponse API (par ville) :', response);
          this.offres = Array.isArray(response.offres)
            ? response.offres.sort((a, b) => new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime())
            : [];
          this.currentPage = response.currentPage ?? 0;
          this.totalRecords = response.totalItems ?? 0;
          console.log('OffreListComponent: Offres chargées par ville:', this.offres);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('OffreListComponent: Erreur lors du chargement des offres par ville:', err);
          this.offres = [];
          this.cdr.detectChanges();
        }
      });
    } else {
      this.offreService.getOffres(page, size).subscribe({
        next: (response) => {
          console.log('Réponse API :', response);
          this.offres = Array.isArray(response.offres)
            ? response.offres.sort((a, b) => new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime())
            : [];
          this.currentPage = response.currentPage ?? 0;
          this.totalRecords = response.totalItems ?? 0;
          console.log('OffreListComponent: Offres chargées:', this.offres);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('OffreListComponent: Erreur lors du chargement des offres:', err);
          this.offres = [];
          this.cdr.detectChanges();
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
    this.currentPage = 0;
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
    const userId = this.authService.getUserId();
    this.router.navigate([`/postuler/${offreId}/form`]);
  }

  onOffreAdded() {
    this.loadOffres(this.currentPage, this.rowsPerPage, this.searchVille);
  }
}
