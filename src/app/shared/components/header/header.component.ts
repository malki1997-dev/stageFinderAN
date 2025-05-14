import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifService } from '../../../features/notifications/services/notif.service';
import { NotifListComponent } from '../../../features/notifications/components/notif-list/notif-list.component';

@Component({
  standalone: true, 
  imports: [
             CommonModule,
             NotifListComponent

            ],
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  notificationCount: number = 0;  // This will hold the notification count
  showNotifications = false;

  constructor(private notifService: NotifService) {}

  ngOnInit() {
    const userId = 1;  // Replace this with dynamic user ID logic if necessary
    this.notifService.fetchNotificationCount(userId).subscribe(
      count => {
        this.notificationCount = count;  // Set the notification count from the service
      },
      error => {
        console.error('Error fetching notification count', error);
      }
    );
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
}
