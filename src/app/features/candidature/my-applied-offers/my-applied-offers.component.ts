import { Component, OnInit } from '@angular/core';
import { CandidatureService } from '../candidature.service';
import { CandidatureDTO } from '../candidature.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-my-applied-offers',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './my-applied-offers.component.html',
  styleUrls: ['./my-applied-offers.component.css']
})
export class MyAppliedOffersComponent implements OnInit {
  appliedOffers: CandidatureDTO[] = [];
  errorMessage: string | null = null;

  constructor(
    private candidatureService: CandidatureService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAppliedOffers();
  }

  loadAppliedOffers(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('Utilisateur non connecté ou ID manquant');
      this.errorMessage = 'Veuillez vous connecter pour voir vos candidatures.';
      this.router.navigate(['/login']);
      return;
    }

    this.candidatureService.getMyAppliedOffers(userId).subscribe({
      next: (candidatures) => {
        this.appliedOffers = candidatures;
        this.errorMessage = null;
        console.log('Candidatures chargées:', this.appliedOffers);
      },
      error: (err) => {
        this.errorMessage = 'Impossible de charger les offres postulées. Veuillez réessayer plus tard.';
        console.error('Erreur:', err);
      }
    });
  }
}
