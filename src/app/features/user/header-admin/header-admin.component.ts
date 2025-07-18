import { Component, OnInit, OnDestroy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.css',
  standalone: true,
  imports: [TieredMenuModule, ButtonModule, CommonModule]
})
export class HeaderAdminComponent implements OnInit, OnDestroy {
  userMenuItems: MenuItem[] = [];
  userName: string = '';
  userImage: string | null = null;
  private authSubscription!: Subscription;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.authService.getCurrentUser().subscribe({
          next: (user) => {
            this.userName = user.nom;
            this.userImage = user.image
              ? `http://localhost:8080/api/files/view?filename=${user.image}`
              : 'assets/images/avatar.png';
            this.updateMenuItems();
            console.log("Nom utilisateur :", this.userName);
            console.log("Image utilisateur :", this.userImage);
          },
          error: (err) => {
            console.error("Erreur lors de la récupération de l'utilisateur :", err);
            this.userName = '';
            this.userImage = null;
            this.updateMenuItems();
          }
        });
      } else {
        this.userName = '';
        this.userImage = null;
        this.updateMenuItems();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
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
        ...(role === 'ADMINISTRATEUR' ? [
          { label: 'Dashboard', routerLink: '/dashboard-admin' },
          { label: 'Ajouter un utilisateur', command: () => this.ajouterUtilisateur() },
          { label: 'Liste des stagiaires', command: () => this.listeStagiaires() },
          { label: 'Liste des entreprises', command: () => this.listeEntreprises() },
          { label: 'Entreprises non acceptées', command: () => this.listeEntreprisesNA() },
        ] : []),

        ...(role === 'RECRUTEUR' ? [
          { label: 'Mes Offres', command: () => this.mesOffres() }
        ] : []),

        ...(role === 'STAGIAIRE' ? [
          { label: 'Mes demandes', routerLink: '/my-applied-offers' }
        ] : []),

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

  ajouterUtilisateur() {
    this.router.navigate(['/add-user']);
  }
}
