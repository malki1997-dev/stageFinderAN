import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderBanner3Component } from '../../header&footer/banners/header-banner3/header-banner3.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-postuler',
  standalone: true,
  imports: [HeaderBanner3Component, CommonModule, ToastModule],
  templateUrl: './postuler.component.html',
  styleUrls: ['./postuler.component.css']
})
export class PostulerComponent implements OnInit {
  offreId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('offreId');
      this.offreId = id && !isNaN(+id) ? +id : null;
      console.log('PostulerComponent - offreId:', this.offreId);
      console.log('PostulerComponent - Paramètres de la route:', params.keys, params.get('offreId'));

      if (!this.offreId) {
        console.error('offreId invalide ou non défini');
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Aucune offre sélectionnée'
        });
        this.router.navigate(['/']);
        return;
      }

      const userId = this.authService.getUserId();
      if (!userId) {
        console.error('Utilisateur non connecté ou ID manquant');
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Veuillez vous connecter pour postuler'
        });
        this.router.navigate(['/login'], { queryParams: { returnUrl: `/postuler/${this.offreId}/form` } });
      } else {
        console.log('PostulerComponent - userId:', userId);
        this.router.navigate([`/postuler/${this.offreId}/form`]);
      }
    });
  }
}
