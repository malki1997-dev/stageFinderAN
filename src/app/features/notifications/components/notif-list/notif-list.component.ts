import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifService } from '../../services/notif.service';
import { NotificationDto } from '../../models/notification-dto';

@Component({
  selector: 'app-notif-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notif-list.component.html',
  styleUrl: './notif-list.component.css'
})
export class NotifListComponent implements OnInit {

  notifications: NotificationDto[] = [];

  constructor(private notifService: NotifService) {}

  ngOnInit(): void
   {
    const userId = 2; // hna 7ssb l userId dyalk
    this.notifService.fetchNotificationsByUser(userId).
    subscribe({
      next: (data) => this.notifications = data,
      error: (err) => console.error(err)
              });
  }
}
