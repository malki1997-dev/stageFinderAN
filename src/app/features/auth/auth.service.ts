import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserDTO } from '../../features/user/user.model';
import { Role } from '../../features/user/role.enum';
import { jwtDecode } from 'jwt-decode';

export interface AuthResponse {
  token: string;
  refreshToken: string;
  message: string;
}

export interface DecodedToken {
  id: number;
  email: string;
  nom: string;
  role: Role;
  tel?: string;
  adresse?: string;
  image?: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  redirectToLogin() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:8080/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const isAuthenticated = this.isLoggedIn();
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  login(email: string, password: string): Observable<UserDTO> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }, { headers }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('access_token', response.token);
          console.log('Token saved:', response.token);
          localStorage.setItem('refresh_token', response.refreshToken || '');
          this.isAuthenticatedSubject.next(true);
        } else {
          throw new Error('Token manquant dans la réponse');
        }
      }),
      mergeMap(() => this.http.get<UserDTO>(`${this.apiUrl}/me`, { headers: this.getAuthHeaders() }).pipe(
        tap(user => {
          localStorage.setItem('user', JSON.stringify(user));
          console.log('User info:', user);
        }),
        catchError(error => {
          console.error('Failed to fetch user info from /auth/me:', error);
          let errorMessage = 'Erreur lors de la récupération des informations utilisateur';
          if (error.status === 401) {
            errorMessage = 'Token invalide ou session expirée';
            this.logout(); // Clear invalid token
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          return throwError(() => new Error(errorMessage));
        })
      )),
      catchError(error => {
        console.error('Login failed:', error);
        let errorMessage = 'Une erreur s\'est produite lors de la connexion';
        if (error.status === 401) {
          errorMessage = 'Identifiants incorrects. Vérifiez votre email ou mot de passe.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  register(user: UserDTO, cvFile?: File, imageFile?: File): Observable<AuthResponse> {
    const formData = new FormData();
    formData.append('nom', user.nom || '');
    formData.append('email', user.email || '');
    formData.append('password', user.password || '');
    formData.append('tel', user.tel || '');
    formData.append('adresse', user.adresse || '');
    formData.append('role', user.role || 'STAGIAIRE');
    if (user.nomEntreprise) formData.append('nomEntreprise', user.nomEntreprise);
    if (user.rc) formData.append('RC', user.rc);
    if (user.ice) formData.append('ICE', user.ice);
    if (cvFile) formData.append('cv', cvFile);
    if (imageFile) formData.append('image', imageFile);

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, formData).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('access_token', response.token);
          localStorage.setItem('refresh_token', response.refreshToken || '');
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(error => {
        console.error('Register failed:', error);
        return throwError(() => new Error(error.error?.message || 'Erreur lors de l\'inscription'));
      })
    );
  }

  registerAdmin(user: UserDTO): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register-admin`, { ...user, role: 'ADMINISTRATEUR' }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('access_token', response.token);
          localStorage.setItem('refresh_token', response.refreshToken || '');
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(error => {
        console.error('Register admin failed:', error);
        return throwError(() => new Error(error.error?.message || 'Erreur lors de l\'inscription administrateur'));
      })
    );
  }

  checkPhoneNumberExists(tel: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-tel?tel=${tel}`).pipe(
      catchError(error => {
        console.error('Check phone number failed:', error);
        return throwError(() => new Error('Erreur lors de la vérification du numéro de téléphone'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp > now;
    } catch (e) {
      console.error('Erreur de décodage du token:', e);
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  getUser(): Partial<UserDTO> | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      return {
        id: decoded.id,
        email: decoded.email,
        nom: decoded.nom,
        role: decoded.role || null,
        tel: decoded.tel,
        adresse: decoded.adresse,
        image: decoded.image
      };
    } catch (e) {
      console.error('Erreur de décodage du token pour getUser:', e);
      return null;
    }
  }

  getUserId(): number | null {
    const user = this.getUser();
    return user?.id || null;
  }

  getUserEmail(): string | null {
    const user = this.getUser();
    return user?.email || null;
  }

  getUserRole(): Role | null {
    const user = this.getUser();
    return user?.role || null;
  }

  getUserImage(): string | null {
    const user = this.getUser();
    return user?.image || null;
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('Aucun token de rafraîchissement disponible'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`
    });

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, {}, { headers }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('access_token', response.token);
          localStorage.setItem('refresh_token', response.refreshToken || '');
          this.isAuthenticatedSubject.next(true);
        } else {
          this.logout();
        }
      }),
      catchError(error => {
        this.logout();
        return throwError(() => new Error(error.error?.message || 'Erreur lors du rafraîchissement du token'));
      })
    );
  }

  getCurrentUser(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/me`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Get current user failed:', error);
        return throwError(() => new Error('Erreur lors de la récupération de l\'utilisateur'));
      })
    );
  }
}
