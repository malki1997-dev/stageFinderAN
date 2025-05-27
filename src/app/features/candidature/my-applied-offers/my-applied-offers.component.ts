import { Component, OnInit } from '@angular/core';
import { CandidatureService } from '../candidature.service';
import { CandidatureDTO } from '../candidature.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

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
  userId: number = 5; // Hardcoded for testing; replace with actual userId later

  constructor(private candidatureService: CandidatureService) {}

  ngOnInit(): void {
    this.loadAppliedOffers();
  }


loadAppliedOffers(): void {
    this.candidatureService.getMyAppliedOffers(this.userId).subscribe({
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
