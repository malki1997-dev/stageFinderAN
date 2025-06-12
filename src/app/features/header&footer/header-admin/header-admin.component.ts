import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.css',
  standalone: true,
  imports: [TieredMenuModule, ButtonModule, CommonModule]
})
export class HeaderAdminComponent implements OnInit {
  userMenuItems: MenuItem[] = [];

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.updateMenuItems();
    console.log("#####");
    console.log(this.isAdmin);
    console.log("#####");
    console.log(this.isAdmin);
  }

  get isAdmin(): boolean {
    return this.authService.getUserRole() == 'ADMINISTRATEUR';
  }

  get isRecruteur(): boolean {
    return this.authService.getUserRole() == 'RECRUTEUR';
  }

  private updateMenuItems(): void {
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getUserRole();
      this.userMenuItems = [
        ...(role === 'ADMINISTRATEUR' ? [{ label: 'Dashboard', routerLink: '/dashboard-admin' }] : []),
        ...(role === 'STAGIAIRE' ? [{ label: 'Mes demandes', routerLink: '/my-applied-offers' }] : []),
        { label: 'Mon profil', routerLink: '/edit-profile' },
        { label: 'Déconnexion', command: () => this.onLogout() }
      ];
    } else {
      this.userMenuItems = [
        { label: 'Connexion', routerLink: '/login' },
        { label: 'S\'inscrire', routerLink: '/regchoix' }
      ];
    }
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
        this.updateMenuItems();
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion:', err);
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
        this.updateMenuItems();
      }
    });
  }

  listeStagiaires() {
    this.router.navigate(['stagiaire-list']);
  }

  listeEntreprises() {
    this.router.navigate(['recruteur-list']);
  }

  listeEntreprisesNA() {
    this.router.navigate(['na-recruteur-list']);
  }

  mesOffres() {
    this.router.navigate(['mes-offres']);
  }

  tarifs() {
    this.router.navigate(['tarifs-stagiaire']);
  }
}
