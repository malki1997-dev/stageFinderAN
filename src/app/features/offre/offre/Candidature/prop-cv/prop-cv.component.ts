import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prop-cv',
  imports: [ButtonModule, CommonModule],
  templateUrl: './prop-cv.component.html',
  styleUrl: './prop-cv.component.css'
})
export class PropCvComponent {
  constructor(private router:Router){}
  @Output() cvSelected = new EventEmitter<string>();

  memeCv() {
    const selectedChoice = 'OUI';
    console.log('Choix sélectionné :', selectedChoice);
    this.cvSelected.emit(selectedChoice);
    this.router.navigate(['#']);
  }

  autreCv() {
    const selectedChoice = 'NON';
    console.log('Choix sélectionné :', selectedChoice);
    this.cvSelected.emit(selectedChoice);
    this.router.navigate(['postform']);
  }
}
