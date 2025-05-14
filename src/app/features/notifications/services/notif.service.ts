import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotifService {

  private notifications = [
    { message: 'Nouvelle offre de stage', date: 'Aujourd’hui' },
    { message: 'Ton profil a été visité', date: 'Hier' },
    { message: 'Ton profil a été visité', date: 'Hier' },
    { message: 'Ton profil a été visité', date: 'Hier' },
    { message: 'Rappel : Entretien demain', date: 'Il y a 2 jours' }
  ];

  constructor() { }

  // Getter pour récupérer la liste des notifications
  getNotifications() {
    return this.notifications;
  }

  // Getter pour récupérer le nombre de notifications
  getNbr(): number {
    return this.notifications.length;
  }

}
