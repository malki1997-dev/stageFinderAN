import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { OffreService } from '../offre.service';
import { OffreDTO } from '../offre.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { Ville } from '../offre-ville.enum';

@Component({
  selector: 'app-add-offre',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    CalendarModule,
    DropdownModule,
    CheckboxModule
  ],
  templateUrl: './add-offre.component.html',
  styleUrls: ['./add-offre.component.css']
})
export class AddOffreComponent {
  @Output() offreAdded = new EventEmitter<void>();

  displayDialog: boolean = false;
  newOffre: OffreDTO = {
    id: 0,
    anneesExperience: '',
    description: '',
    preEmbauche: false,
    ville: '',
    nomEntreprise: '',
    salaire: 0,
    competenceExigee: '',
    dateExpiration: new Date(),
    datePublication: new Date(),
    publieParNom: '',
    categorieNom: '',
    publieParId: 0,
    categorieId: 0,
  };

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

  villes = Object.values(Ville).map(ville => ({
    label: ville.toUpperCase(),
    value: ville.toUpperCase()
  }));

  selectedCategory: number = 0;
  selectedVille: string = '';

  constructor(
    private offreService: OffreService,
    private router: Router,
    private authService: AuthService
  ) {
    console.log('Villes disponibles:', this.villes);
  }

  showDialog() {
    this.newOffre = {
      id: 0,
      anneesExperience: '',
      description: '',
      preEmbauche: false,
      ville: '',
      nomEntreprise: '',
      salaire: 0,
      competenceExigee: '',
      dateExpiration: new Date(),
      datePublication: new Date(),
      publieParNom: '',
      categorieNom: '',
      publieParId: 0,
      categorieId: 0
    };
    this.selectedCategory = 0;
    this.selectedVille = '';
    console.log('showDialog: selectedVille initialisé à:', this.selectedVille);
    this.displayDialog = true;
  }

  onSubmit(): void {
    console.log('onSubmit: selectedVille:', this.selectedVille, 'newOffre:', this.newOffre);
    if (this.selectedCategory <= 0) {
      console.error('Aucune catégorie sélectionnée');
      return;
    }
    if (!this.selectedVille) {
      console.error('Aucune ville sélectionnée');
      return;
    }

    this.newOffre.categorieId = this.selectedCategory;
    this.newOffre.ville = this.selectedVille.toUpperCase(); // Assurer que la ville est en majuscules

    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('Utilisateur non connecté ou ID manquant');
      return;
    }

    this.newOffre.publieParId = userId;

    this.offreService.createOffre(this.newOffre, userId, this.newOffre.categorieId).subscribe({
      next: (nouvelleOffre) => {
        console.log('Offre créée:', nouvelleOffre);
        this.offreAdded.emit();
        this.displayDialog = false;
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Erreur lors de la création de l\'offre', err);
      }
    });
  }
}
