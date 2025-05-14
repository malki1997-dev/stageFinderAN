import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationDto } from '../models/notification-dto';  // path correct selon project structure dyalek
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class NotifService {

  private apiUrl = 'http://localhost:8080/api/notifications';  // base URL

  constructor(private http: HttpClient) { }

  // récupérer notifications d'un utilisateur par son id
  fetchNotificationsByUser(userId: number): Observable<NotificationDto[]>
   {
  return this.http.get<NotificationDto[]>(`${this.apiUrl}/user/${userId}`);
   }

   // notif.service.ts
fetchNotificationCount(userId: number): Observable<number>
 {
  return this.http.get<NotificationDto[]>(`${this.apiUrl}/user/${userId}`).pipe(
    map(notifications => notifications.length)
  );
 }


  
}
