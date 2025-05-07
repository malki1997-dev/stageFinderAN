import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDTO } from './user.model';
import { map, Observable } from 'rxjs';
import { Role } from './role.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/users`);
  }

  getStagiaires(): Observable<UserDTO[]> {
    return this.getAllUsers().pipe(
      map(users => users.filter(user => user.role === Role.STAGIAIRE))
    );
  }

  getRecruteurs(): Observable<UserDTO[]> {
    return this.getAllUsers().pipe(
      map(users => users.filter(user => user.role === Role.RECRUTEUR))
    );
  }

  updateEstValide(userId: number, estValide: boolean): Observable<UserDTO> {
    return this.http.patch<UserDTO>(`${this.apiUrl}/users/${userId}`, { estValide });
  }

  getNonAcceptedRecruteurs(): Observable<UserDTO[]> {
    return this.getAllUsers().pipe(
      map(users => users.filter(user => user.role === Role.RECRUTEUR && !user.estValide))
    );
  }
}
