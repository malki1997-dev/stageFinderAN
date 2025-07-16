import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserDTO} from '../../features/user/user.model';
import { AuthResponse } from '../../features/auth/auth-response.model';
import {jwtDecode} from 'jwt-decode';
import { Role } from '../../features/user/role.enum';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
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
    const token = localStorage.getItem('access_token');
    this.isAuthenticatedSubject.next(!!token);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }, { headers }).pipe(
      tap((response) => {
        if (response.token) { // ✅ Correction ici
          localStorage.setItem('access_token', response.token);
          localStorage.setItem('refresh_token', response.refreshToken || '');
          this.isAuthenticatedSubject.next(true);
        } else {
          console.error('Token manquant dans la réponse');
        }
      })
    );
  }
register(user: UserDTO, cvFile?: File, imageFile?: File): Observable<AuthResponse> {
  const formData = new FormData();

  formData.append('nom', user.nom);
  formData.append('email', user.email);
  //formData.append('password', user.password || '');
  formData.append('tel', user.tel || '');
  formData.append('adresse', user.adresse || '');
  formData.append('role', user.role ?? 'STAGIAIRE');

  if (user.nomEntreprise) formData.append('nomEntreprise', user.nomEntreprise);
  if (user.rc) formData.append('RC', user.rc);
  if (user.ice) formData.append('ICE', user.ice);
  if (cvFile) formData.append('cv', cvFile);
  if (imageFile) formData.append('image', imageFile);

  // Ajoute le pipe ici :
  return this.http.post<AuthResponse>(`${this.apiUrl}/register`, formData).pipe(
    catchError((error) => {
      console.error('❌ Erreur backend :', error.error); // ✅ Affiche l’erreur du backend
      return throwError(() => error);
    })
  );
}
checkPhoneNumberExists(tel: string) {
  return this.http.get<boolean>(`http://localhost:8080/auth/check-tel?tel=${tel}`);
}






logout(): Observable<void> {
  return new Observable<void>((observer) => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isAuthenticatedSubject.next(false);
    observer.next();
    observer.complete();
  });
}


  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
  getDecodedToken(): any | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (e) {
      console.error('Erreur de décodage du token', e);
      return null;
    }
  }

 // isLoggedIn(): boolean {
   // return !!thi s.getToken();
  //}
  isLoggedIn(): boolean {
  const token = this.getToken();
  if (!token) return false;

  try {
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000); // en secondes
    return decoded.exp && decoded.exp > now;
  } catch (e) {
    return false;
  }
}


  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('Aucun token de rafraîchissement disponible'));
    }

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${refreshToken}`);

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, {}, { headers }).pipe(
      tap((response) => {
        if (response.token) { // ✅ Correction ici aussi
          localStorage.setItem('access_token', response.token);
          if (response.refreshToken) {
            localStorage.setItem('refresh_token', response.refreshToken);
          }
        } else {
          this.logout();
        }
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }
  registerWithFormData(formData: FormData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, formData);
  }
  registerAdmin(userData: UserDTO): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('http://localhost:8080/auth/register-admin', userData);
  }
  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
  
    try {
      const decoded: any = jwtDecode(token);
      return decoded.id || null;
    } catch (e) {
      console.error('Erreur de décodage du token :', e);
      return null;
    }
  }
 getUserRole(): Role | undefined {
  const token = this.getToken();
  if (!token) return undefined;

  try {
    const decoded: any = jwtDecode(token);
    const roleStr = decoded?.role;

    if (roleStr && Object.values(Role).includes(roleStr as Role)) {
      return roleStr as Role;
    }
  } catch (e) {
    console.error('Erreur lors de la récupération du rôle depuis le token:', e);
  }

  return undefined;
}


getCurrentUser(): Observable<UserDTO> {
  return this.http.get<UserDTO>(`${this.apiUrl}/me`);
}
getAuthHeaders(): HttpHeaders {
  const token = this.getToken();
  return new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
}
  getUserEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.email || null;
    } catch (e) {
      console.error('Erreur de décodage du token pour l\'email', e);
      return null;4
    }
  }
 /* getUserName(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.nom || null;
    } catch (e) {
      console.error('Erreur de décodage du token pour le nom', e);
      return null;
    }
  }*/
  getUserId(): number | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.id || null;
  } catch (e) {
    console.error('Erreur de décodage du token :', e);
    return null;
  }
}
  getUserImage(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.image || null;
    } catch (e) {
      console.error('Erreur de décodage du token pour l\'image', e);
      return null;
    }
  }
  getUser(): Partial<UserDTO> | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return {
      id: decoded.id || null,
      email: decoded.email || null,
      nom: decoded.nom || null,
      role: decoded.role || null,
      tel: decoded.tel || null,
      adresse: decoded.adresse || null,
      image: decoded.image || null,
    };
  } catch (e) {
    console.error('Erreur de décodage du token pour getUser()', e);
    return null;
  }
}



  
  
}
