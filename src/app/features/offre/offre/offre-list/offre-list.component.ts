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

@Component({
  selector: 'app-offre-list',
  imports: [ChipModule, BadgeModule, ButtonModule, CommonModule, PaginatorModule, AddOffreComponent],
  templateUrl: './offre-list.component.html',
  styleUrl: './offre-list.component.css'
})
export class OffreListComponent implements OnInit{

  offres : OffreDTO[] = [];
  // Propriétés pour la pagination
  currentPage: number = 0;
  rowsPerPage: number = 3;
  totalRecords: number = 0;

  constructor(private offreService : OffreService,
              private router : Router
  ){}
  ngOnInit() {
    this.loadOffres(this.currentPage, this.rowsPerPage);
  }

  loadOffres(page: number, size: number) {
    this.offreService.getOffres(page, size).subscribe({
      next: (response) => {
        // Trier les offres par ID croissant
        this.offres = response.offres.sort((a, b) => a.id - b.id);
        console.log('Offres chargées et triées par ID :', this.offres);
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
      this.offreService.deleteOffre(id).subscribe(() => {
        this.loadOffres(this.currentPage, this.rowsPerPage);
      });
    }
  }

  showEditDialog(offre: OffreDTO) {
    if (offre.id) {
      this.router.navigate(['edit-offre', offre.id]); // Naviguer avec l'ID réel
    } else {
      console.error('ID de l\'offre manquant');
    }
  }

    onPostule() {
    this.router.navigate(['postuler']);
    }


}
