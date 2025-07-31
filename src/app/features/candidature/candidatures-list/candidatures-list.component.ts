import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CandidatureService } from '../candidature.service';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { CandidatureDTO } from '../candidature.model';

@Component({
  selector: 'app-candidatures-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    PaginatorModule,
    TableModule,
    SelectModule,
    FormsModule
  ],
  templateUrl: './candidatures-list.component.html',
  styleUrls: ['./candidatures-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidaturesListComponent implements OnInit {
  candidatures: CandidatureDTO[] = [];
  offreId: number | null = null;
  currentPage: number = 0;
  rowsPerPage: number = 10;
  totalRecords: number = 0;
  isUpdating = false;
  statutOptions = [
    { label: 'En attente', value: 'EN_ATTENTE' },
    { label: 'Accepté', value: 'ACCEPTE' },
    { label: 'Rejeté', value: 'REJETE' }
  ];

  constructor(
    private candidatureService: CandidatureService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('offreId');
      this.offreId = id && !isNaN(+id) ? +id : null;

      if (this.offreId) {
        this.loadCandidatures(this.currentPage, this.rowsPerPage);
      }
    });
  }

  loadCandidatures(page: number, size: number) {
    if (this.offreId && !this.isUpdating) {
      this.candidatureService.getCandidaturesByOffre(this.offreId, page, size).subscribe({
        next: (response) => {
          this.candidatures = response.content.map(c => ({
            ...c,
            statutCandidature: ['EN_ATTENTE', 'ACCEPTE', 'REJETE'].includes(c.statutCandidature)
              ? c.statutCandidature
              : 'EN_ATTENTE',
            isUpdating: false
          }));
          this.currentPage = response.number;
          this.totalRecords = response.totalElements;
          this.cd.markForCheck();
        },
        error: (err) => {
          console.error('Erreur lors du chargement des candidatures:', err);
          alert('Erreur lors du chargement des candidatures.');
        }
      });
    }
  }

  onPageChange(event: any) {
    if (!this.isUpdating) {
      this.currentPage = event.page;
      this.rowsPerPage = event.rows;
      this.loadCandidatures(this.currentPage, this.rowsPerPage);
    }
  }

  updateStatus(candidature: CandidatureDTO, statut: string) {
    if (candidature.id && !this.isUpdating) {
      this.isUpdating = true;
      candidature.isUpdating = true;
      this.candidatureService.updateCandidatureStatus(candidature.id, statut).subscribe({
        next: (updatedCandidature) => {
          const index = this.candidatures.findIndex(c => c.id === candidature.id);
          if (index !== -1) {
            this.candidatures[index] = {
              ...this.candidatures[index],
              statutCandidature: updatedCandidature.statutCandidature || statut,
              isUpdating: false
            };
            this.candidatures = [...this.candidatures]; // Trigger change detection
          }
          this.isUpdating = false;
          this.cd.markForCheck();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du statut:', err);
          alert('Erreur lors de la mise à jour du statut.');
          this.isUpdating = false;
          candidature.isUpdating = false;
          this.loadCandidatures(this.currentPage, this.rowsPerPage); // Revert to server state
          this.cd.markForCheck();
        }
      });
    }
  }

  viewFile(fileName: string, type: string) {
    if (!fileName) {
      console.error('Nom du fichier manquant');
      alert('Aucun fichier disponible.');
      return;
    }

    const url = `http://localhost:8080/api/candidatures/file/${fileName}?type=${type}`;
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get(url, { headers, responseType: 'blob' }).subscribe({
      next: (blob) => {
        const fileURL = window.URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du fichier:', err);
        alert('Impossible de charger le fichier. Vérifiez vos autorisations ou contactez l\'administrateur.');
      }
    });
  }
}
