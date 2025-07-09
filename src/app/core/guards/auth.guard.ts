// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';
// import { AuthService } from '../../features/auth/auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     if (this.authService.isLoggedIn()) {
//       // Vérifier si la route nécessite un rôle spécifique (facultatif)
//       const expectedRole = route.data['role'] as string;
//       if (expectedRole) {
//         const userRole = this.authService.getUserRole();
//         if (userRole !== expectedRole) {
//           // Rediriger si le rôle ne correspond pas
//           return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
//         }
//       }
//       return true;
//     }
//     // Rediriger vers la page de login si non connecté
//     return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
//   }
// }
