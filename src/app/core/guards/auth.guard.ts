import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service'; // Assurez-vous que le chemin est correct
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
canActivate(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean {
  const token = this.authService.getToken(); // lit access_token

  if (!token) {
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  try {
    const decodedToken: any = jwtDecode(token);
    const expectedRole = route.data['expectedRole'];

    if (expectedRole) {
      if (Array.isArray(expectedRole)) {
        if (!expectedRole.includes(decodedToken.role)) {
          this.router.navigate(['/login']);
          return false;
        }
      } else {
        if (decodedToken.role !== expectedRole) {
          this.router.navigate(['/login']);
          return false;
        }
      }
    }

    return true;
  } catch (e) {
    console.error('Erreur lors du décodage du token :', e);
    this.router.navigate(['/login']);
    return false;
  }
}


}
