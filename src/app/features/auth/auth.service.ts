import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO } from '../user/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl: string = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.apiUrl}/login`, { email, password });
  }

  logout(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/logout`, {});
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  getUser(): { id: number, role: string, nom: string } | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserId(): number | null {
    const user = this.getUser();
    return user ? user.id : null;
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }
}
