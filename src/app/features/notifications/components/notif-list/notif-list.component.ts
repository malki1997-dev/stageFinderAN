import { Component,Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifService } from '../../services/notif.service';


@Component({
  selector: 'app-notif-list',
  imports: [
    CommonModule
  ],
  templateUrl: './notif-list.component.html',
  styleUrl: './notif-list.component.css',
  standalone:true
})
export class NotifListComponent {
  
   // Injection du service
  constructor(public notifService: NotifService) {}

  // Utiliser les méthodes du service pour récupérer les données
  get notifications()
                        {
             return this.notifService.getNotifications();  // Méthode pour récupérer les notifications
                        }

  get nbr()
             {
            return this.notifService.getNbr();  // Méthode pour récupérer le nombre de notifications
             }


}
