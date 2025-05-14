import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifListComponent } from '../../../features/notifications/components/notif-list/notif-list.component';
import { NotifService } from '../../../features/notifications/services/notif.service';


@Component({
  standalone: true, 
  imports: [
    CommonModule,
    NotifListComponent
],
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  constructor(public notifService: NotifService) {}


  showNotifications = false;


  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

get nbr() {
    return this.notifService.getNbr();  // Méthode pour récupérer le nombre de notifications
  }

}
