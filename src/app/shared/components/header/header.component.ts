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

  notificationCount: number = 0;
  showNotifications = false;

  constructor(private notifService: NotifService) {}

  ngOnInit() {
    this.loadNotificationCount();
  }

  loadNotificationCount() {
    const userId = 2;
    this.notifService.fetchNotificationCount(userId).subscribe(
      count => this.notificationCount = count,
      error => console.error('Error fetching notification count', error)
    );
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;

    if (this.notificationCount > 0) {
      const userId = 2;
      this.notifService.markAllAsRead(userId).subscribe(
        () => {
          console.log('Notifications marked as read.');
          this.notificationCount = 0;
        },
        error => console.error('Error updating notifications', error)
      );
    }
  }
}
