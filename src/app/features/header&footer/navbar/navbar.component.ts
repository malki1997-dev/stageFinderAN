import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../auth/auth.service'; // Re-enable AuthService
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { PopoverModule } from 'primeng/popover'; // Replaced OverlayPanelModule
import { DatePipe, CommonModule } from '@angular/common';
import { UserDTO } from '../../user/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MenubarModule, ButtonModule, MenuModule, PopoverModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  menuItems: MenuItem[] = [];
  userMenuItems: MenuItem[] = [];
  user: Partial<UserDTO> | null = null;
 // isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupMenuItems();
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.user = isAuthenticated ? this.authService.getUser() : null;
    });
  }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'ADMINISTRATEUR';
  }

  get isRecruteur(): boolean {
    return this.authService.getUserRole() === 'RECRUTEUR';
  }

  get isStagiaire(): boolean {
    return this.authService.getUserRole() === 'STAGIAIRE';
  }

  setupMenuItems(): void {
    this.menuItems = [
      { label: 'Accueil', icon: 'pi pi-home', routerLink: [''] },
      { label: 'Offres', icon: 'pi pi-briefcase', routerLink: [''] }
    ];

    this.userMenuItems = [
      { label: 'Profil', icon: 'pi pi-user', routerLink: ['/user/profile'] },
      { label: 'Compte', icon: 'pi pi-cog', routerLink: ['/user/account'] },
      { label: 'Déconnexion', icon: 'pi pi-sign-out', command: () => this.logout() }
    ];
  }

  logout(): void {
    this.authService.logout(); // Synchronous call
    this.router.navigate(['/login']);
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

  mesDemandes(){
    this.router
    .navigate(['my-applied-offers'])
  }

  dashbord(){
    this.router.navigate(['dashboard-admin'])
  }
}
