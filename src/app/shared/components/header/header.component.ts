import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,  // 👈 ajoute ça !
  imports: [
    CommonModule
  ],
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  notifications = [
    { message: 'Nouvelle offre de stage disponible', date: 'Aujourd’hui' },
    { message: 'Ton profil a été visité', date: 'Hier' },
    { message: 'Ton profil a été visité', date: 'Hier' },
    { message: 'Rappel : Entretien demain', date: 'Il y a 2 jours' }
  ];

  showNotifications = false;

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
}
