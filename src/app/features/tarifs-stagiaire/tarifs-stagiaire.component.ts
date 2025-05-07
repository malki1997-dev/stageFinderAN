import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { HeaderBanner2Component } from "../header&footer/banners/header-banner2/header-banner2.component";

@Component({
  selector: 'app-tarifs-stagiaire',
  imports: [CommonModule, ButtonModule, BadgeModule, HeaderBanner2Component],
  templateUrl: './tarifs-stagiaire.component.html',
  styleUrl: './tarifs-stagiaire.component.css'
})
export class TarifsStagiaireComponent {
  @Output() planSelected = new EventEmitter<string>();

    selectStarter() {
        this.planSelected.emit('STARTER');
    }

    selectSerious() {
        this.planSelected.emit('SERIOUS');
    }
}
