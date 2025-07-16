import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CandidatureService } from '../candidature.service';
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
  styleUrls: ['./candidatures-list.component.css']
})
export class CandidaturesListComponent implements OnInit {
  candidatures: CandidatureDTO[] = [];
  offreId: number | null = null;
  currentPage: number = 0;
  rowsPerPage: number = 10;
  totalRecords: number = 0;
  statutOptions = [
    { label: 'En attente', value: 'EN_ATTENTE' },
    { label: 'Accepté', value: 'ACCEPTE' },
    { label: 'Rejeté', value: 'REJETE' }
  ];

  constructor(
    private candidatureService: CandidatureService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef // <-- Injection du ChangeDetectorRef
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
    if (this.offreId) {
      this.candidatureService.getCandidaturesByOffre(this.offreId, page, size).subscribe({
        next: (response) => {
          this.candidatures = response.content.map(c => {
            const candidature = {
              ...c,
              statutCandidature: ['EN_ATTENTE', 'ACCEPTE', 'REJETE'].includes(c.statutCandidature)
                ? c.statutCandidature
                : 'EN_ATTENTE'
            };
            console.log('Candidature ID:', candidature.id, 'Statut:', candidature.statutCandidature);
            return candidature;
          });
          this.currentPage = response.number;
          this.totalRecords = response.totalElements;

          // Forcer Angular à détecter les changements
          this.cd.markForCheck();
        },
        error: (err) => {
          console.error('Erreur lors du chargement des candidatures:', err);
        }
      });
    }
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.rowsPerPage = event.rows;
    this.loadCandidatures(this.currentPage, this.rowsPerPage);
  }

  updateStatus(candidature: CandidatureDTO, statut: string) {
    if (candidature.id) {
      this.candidatureService.updateCandidatureStatus(candidature.id, statut).subscribe({
        next: (updatedCandidature) => {
          candidature.statutCandidature = updatedCandidature.statutCandidature;
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du statut:', err);
        }
      });
    }
  }

  getFileViewUrl(fileName: string, type: string): string {
    return `http://localhost:8080/api/candidatures/file/view/${fileName}?type=${type}`;
  }

  getFileUrl(fileName: string, type: string): string {
    return `http://localhost:8080/api/candidatures/file/${fileName}?type=${type}`;
  }
}
