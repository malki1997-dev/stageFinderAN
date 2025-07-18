import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDTO } from './user.model';
import { map, Observable, catchError, throwError } from 'rxjs';
import { Role } from './role.enum';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/users`).pipe(
      map(users => {
        console.log('✅ Utilisateurs récupérés :', users);
        return users;
      }),
      catchError(err => {
        console.error('❌ Erreur lors de la récupération des utilisateurs', err);
        return throwError(() => err);
      })
    );
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

  getNonAcceptedRecruteurs(): Observable<UserDTO[]> {
    return this.getAllUsers().pipe(
      map(users => users.filter(user => user.role === Role.RECRUTEUR && !user.estValide))
    );
  }

  updateEstValide(userId: number, estValide: boolean): Observable<UserDTO> {
    return this.http.patch<UserDTO>(`${this.apiUrl}/users/${userId}`, { estValide });
  }

  getUserProfile(userId: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/users/${userId}/profile`);
  }

  updateUserProfile(userId: number, userDTO: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/users/${userId}/profile`, userDTO);
  }

  createUserAsAdmin(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.apiUrl}/users/admin/users`, user);
  }

  registerWithFormData(formData: FormData): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.apiUrl}/users/multipart`, formData);
  }

  updateUser(id: number, formData: FormData): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/users/multipart/${id}`, formData);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }
}
