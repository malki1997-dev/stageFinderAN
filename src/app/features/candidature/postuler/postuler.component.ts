import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderBanner3Component } from '../../header&footer/banners/header-banner3/header-banner3.component';
import { PropCvComponent } from '../prop-cv/prop-cv.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-postuler',
  standalone: true,
  imports: [HeaderBanner3Component, PropCvComponent, CommonModule],
  templateUrl: './postuler.component.html',
  styleUrls: ['./postuler.component.css']
})
export class PostulerComponent implements OnInit {
  offreId: number | null = null;
  userId: number  = 5; // TODO: Remplacer par une récupération dynamique

  constructor(private route: ActivatedRoute) {}

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
  }
}
