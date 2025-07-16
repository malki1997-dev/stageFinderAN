import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDTO } from './user.model';
import { map, Observable } from 'rxjs';
import { Role } from './role.enum';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { catchError, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient,
              private authService: AuthService
  ) {}

getAllUsers(): Observable<UserDTO[]> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<UserDTO[]>(`${this.apiUrl}/users`, { headers }).pipe(
    map(users => {
      console.log('✅ Utilisateurs récupérés depuis le backend :', users);
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

  updateEstValide(userId: number, estValide: boolean): Observable<UserDTO> {
    return this.http.patch<UserDTO>(`${this.apiUrl}/users/${userId}`, { estValide });
  }

  getNonAcceptedRecruteurs(): Observable<UserDTO[]> {
    return this.getAllUsers().pipe(
      map(users => users.filter(user => user.role === Role.RECRUTEUR && !user.estValide))
    );
  }

  getUserProfile(userId: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/users/${userId}/profile`);
  }

  updateUserProfile(userId: number, userDTO: UserDTO, ): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/users/${userId}/profile`, userDTO);
  }

  // updateUserProfileWithFiles(userId: number, formData: FormData): Observable<UserDTO> {
  //   return this.http.put<UserDTO>(`${this.apiUrl}/users/${userId}/profile`, formData);
  // }

  ////////////////////////////////////
createUserAsAdmin(user: UserDTO): Observable<UserDTO> {
  return this.http.post<UserDTO>(`${this.apiUrl}/users/admin/users`, user);
}
registerWithFormData(formData: FormData): Observable<UserDTO> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
    // Pas besoin de 'Content-Type': multipart/form-data
  });

  return this.http.post<UserDTO>(`${this.apiUrl}/users/multipart`, formData, { headers });
}
//////////////


updateUser(id: number, formData: FormData): Observable<UserDTO> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.put<UserDTO>(`${this.apiUrl}/users/multipart/${id}`, formData, { headers });
}

deleteUser(id: number): Observable<void> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.delete<void>(`${this.apiUrl}/users/${id}`, { headers });
}




  
}