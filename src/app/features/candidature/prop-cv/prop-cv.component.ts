import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prop-cv',
  standalone: true,
  imports: [ButtonModule, CommonModule],
  templateUrl: './prop-cv.component.html',
  styleUrls: ['./prop-cv.component.css']
})
export class PropCvComponent {
  @Input() offreId: number | null = null;
  @Input() userId: number | null = null; // Changé en nullable
  @Output() cvSelected = new EventEmitter<string>();

  constructor(private router: Router) {}

  memeCv() {
    const selectedChoice = 'OUI';
    console.log('Choix sélectionné :', selectedChoice);
    this.cvSelected.emit(selectedChoice);

    if (this.offreId && this.userId) {
      const formData = new FormData();
      formData.append('userId', this.userId.toString());
      formData.append('offreId', this.offreId.toString());
      formData.append('statutCandidature', 'EN_ATTENTE');

      // TODO: Implémenter la logique pour soumettre la candidature avec le CV existant
      console.log('Soumission avec CV existant:', [...formData.entries()]);
    } else {
      console.error('offreId ou userId non défini pour soumission avec CV existant');
    }
  }

  autreCv() {
    const selectedChoice = 'NON';
    console.log('Choix sélectionné :', selectedChoice);
    this.cvSelected.emit(selectedChoice);
    if (this.offreId) {
      this.router.navigate(['/postuler', this.offreId, 'form']);
    } else {
      console.error('offreId non défini pour la navigation');
      this.router.navigate(['/']); // Rediriger vers la page d'accueil
    }
  }
}
