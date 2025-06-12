import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderBanner3Component } from '../../header&footer/banners/header-banner3/header-banner3.component';
import { PropCvComponent } from '../prop-cv/prop-cv.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-postuler',
  standalone: true,
  imports: [HeaderBanner3Component, PropCvComponent, CommonModule],
  templateUrl: './postuler.component.html',
  styleUrls: ['./postuler.component.css']
})
export class PostulerComponent implements OnInit {
  offreId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('offreId');
      this.offreId = id && !isNaN(+id) ? +id : null;
      console.log('PostulerComponent - offreId:', this.offreId);
      console.log('PostulerComponent - Paramètres de la route:', params.keys, params.get('offreId'));
      if (!this.offreId) {
        console.error('offreId invalide ou non défini');
      }
    });

    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('Utilisateur non connecté ou ID manquant');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    } else {
      console.log('PostulerComponent - userId:', userId);
    }
  }

  get userId(): number | null {
    return this.authService.getUserId();
  }
}
