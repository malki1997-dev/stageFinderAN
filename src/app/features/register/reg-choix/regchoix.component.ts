import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-regchoix',
  imports: [ButtonModule, CommonModule],
  templateUrl: './regchoix.component.html',
  styleUrl: './regchoix.component.css'
})
export class RegchoixComponent {
  constructor(private router:Router){}
  @Output() roleSelected = new EventEmitter<string>();

  selectStagiaire() {
    const selectedRole = 'STAGIAIRE';
    console.log('Rôle sélectionné :', selectedRole);
    this.roleSelected.emit(selectedRole);
    this.router.navigate(['regsta']);
  }

  selectEntreprise() {
    const selectedRole = 'RECRUTEUR';
    console.log('Rôle sélectionné :', selectedRole);
    this.roleSelected.emit(selectedRole);
    this.router.navigate(['regrec']);
  }
}
