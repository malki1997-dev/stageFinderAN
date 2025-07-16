import { Component, OnInit } from '@angular/core';
import { OffreService } from '../offre.service';
import { OffreDTO } from '../offre.model';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-offre',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    CalendarModule,
    DropdownModule,
    ToastModule
  ],
  templateUrl: './edit-offre.component.html',
  styleUrls: ['./edit-offre.component.css'],
  providers: [MessageService]
})
export class EditOffreComponent implements OnInit {
  offreId: number | null = null;
  displayDialog: boolean = false;
  offre: OffreDTO = {
    id: 0,
    anneesExperience: '',
    description: '',
    ville: '',
    categorieNom: '',
    publieParNom: '',
    nomEntreprise: '',
    salaire: 0,
    competenceExigee: '',
    datePublication: new Date(),
    dateExpiration: new Date(),
    categorieId: 0,
    publieParId: 0
  };

  // Liste des catégories avec id et name
  categories = [
    { id: 1, name: 'INFORMATIQUE' },
    { id: 2, name: 'DEVELOPPEMENT' },
    { id: 3, name: 'CYBERSECURITE' },
    { id: 4, name: 'CLOUD_COMPUTING' },
    { id: 5, name: 'DATA_SCIENCE' },
    { id: 6, name: 'IA' },
    { id: 7, name: 'RESEAUX' },
    { id: 8, name: 'TECHNOLOGIE' },
    { id: 9, name: 'JEUX_VIDEO' },
    { id: 10, name: 'MARKETING' },
    { id: 11, name: 'FINANCE' },
    { id: 12, name: 'COMMERCE' },
    { id: 13, name: 'CONSULTING' },
    { id: 14, name: 'ENTREPRENEURIAT' },
    { id: 15, name: 'GESTION_PROJET' },
    { id: 16, name: 'LOGISTIQUE' },
    { id: 17, name: 'AUDIT' },
    { id: 18, name: 'COMPTABILITE' },
    { id: 19, name: 'INGENIERIE' },
    { id: 20, name: 'BIOTECH' },
    { id: 21, name: 'ENVIRONNEMENT' },
    { id: 22, name: 'ENERGIE' },
    { id: 23, name: 'AEROSPATIAL' },
    { id: 24, name: 'MECANIQUE' },
    { id: 25, name: 'ELECTRONIQUE' },
    { id: 26, name: 'DESIGN' },
    { id: 27, name: 'COMMUNICATION' },
    { id: 28, name: 'JOURNALISME' },
    { id: 29, name: 'PUBLICITE' },
    { id: 30, name: 'MULTIMEDIA' },
    { id: 31, name: 'PHOTOGRAPHIE' },
    { id: 32, name: 'MODE' },
    { id: 33, name: 'LUXE' },
    { id: 34, name: 'RESSOURCES_HUMAINES' },
    { id: 35, name: 'DROIT' },
    { id: 36, name: 'ADMINISTRATION' },
    { id: 37, name: 'SOCIOLOGIE' },
    { id: 38, name: 'POLITIQUE' },
    { id: 39, name: 'TOURISME' },
    { id: 40, name: 'RESTAURATION' },
    { id: 41, name: 'EDUCATION' },
    { id: 42, name: 'LANGUE' },
    { id: 43, name: 'SANTE' },
    { id: 44, name: 'PHARMACIE' },
    { id: 45, name: 'PSYCHOLOGIE' },
    { id: 46, name: 'SOCIAL' },
    { id: 47, name: 'SPORT' },
    { id: 48, name: 'BIOLOGIE' },
    { id: 49, name: 'AGRICULTURE' },
    { id: 50, name: 'ARTISANAT' },
    { id: 51, name: 'AUTRE' }
  ];

  selectedCategory: number = 0; // Catégorie sélectionnée dans le dropdown

  constructor(
    private offreService: OffreService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.offreId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Offre ID reçu :', this.offreId);
    if (this.offreId && this.offreId > 0) {
      this.loadOffre(this.offreId);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'ID de l\'offre non valide'
      });
      this.router.navigate(['/']);
    }
  }

  // Charger les données de l'offre
  loadOffre(id: number) {
    this.offreService.getOffreById(id).subscribe({
      next: (offre) => {
        console.log('Offre chargée :', offre);
        this.offre = {
          ...offre,
          datePublication: new Date(offre.datePublication),
          dateExpiration: new Date(offre.dateExpiration)
        };
        this.selectedCategory = this.offre.categorieId; // Initialiser la catégorie sélectionnée
        console.log('nomEntreprise chargé :', this.offre.nomEntreprise);
        console.log('categorieId chargé :', this.offre.categorieId);
        this.displayDialog = true;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'offre', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger l\'offre. Vérifiez l\'ID ou la connexion au serveur.'
        });
        this.router.navigate(['/']);
      }
    });
  }

  // Soumettre les modifications
  onSubmit() {
    if (this.offre.id) {
      if (this.selectedCategory > 0) {
        this.offre.categorieId = this.selectedCategory; // Mettre à jour categorieId
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Aucune catégorie sélectionnée'
        });
        return;
      }

      console.log('Envoi de l\'offre pour mise à jour (ID: ' + this.offre.id + '):');
      console.log('nomEntreprise envoyé :', this.offre.nomEntreprise);
      console.log('categorieId envoyé :', this.offre.categorieId);
      console.table(this.offre);
      this.offreService.updateOffre(this.offre.id, this.offre).subscribe({
        next: (updatedOffre) => {
          console.log('Offre mise à jour (ID: ' + updatedOffre.id + '):');
          console.log('nomEntreprise retourné :', updatedOffre.nomEntreprise);
          console.log('categorieId retourné :', updatedOffre.categorieId);
          console.table(updatedOffre);
          this.displayDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Offre mise à jour avec succès'
          });
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de l\'offre', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Échec de la mise à jour de l\'offre'
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'ID de l\'offre manquant'
      });
    }
  }

  // Fermer le dialogue
  cancel() {
    this.displayDialog = false;
    this.router.navigate(['/']);
  }
}
