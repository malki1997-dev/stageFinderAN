//import { HeaderAdminComponent } from './../../../shared/components/header&footer/header-admin/header-admin.component';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
//import { NotificationService } from '../../services/notification.service';
//import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
//import { Notification } from '../../models/notification.model';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DatePipe } from '@angular/common';
//ajiout
import { HeaderAdminComponent } from '../../user/header-admin/header-admin.component';
import { AuthService } from '../../auth/auth.service'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-navbar',
  imports: [MenubarModule, ButtonModule, MenuModule, OverlayPanelModule, DatePipe, HeaderAdminComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  menuItems: MenuItem[] = [];
  userMenuItems: MenuItem[] = [];
  notifications: Notification[] = [];
  unreadNotifications: string = '0';

  constructor(
    // private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupMenuItems();
    // this.loadNotifications();
  }

  setupMenuItems(): void {
    this.menuItems = [
      { label: 'Accueil', icon: 'pi pi-home', routerLink: [''] },
      { label: 'Offres', icon: 'pi pi-briefcase', routerLink: ['/offres'] }
    ];

    this.userMenuItems = [
      { label: 'Profil', icon: 'pi pi-user', routerLink: ['/user/profile'] },
      { label: 'Compte', icon: 'pi pi-cog', routerLink: ['/user/account'] },
      { label: 'Déconnexion', icon: 'pi pi-sign-out'}
      // { label: 'Déconnexion', icon: 'pi pi-sign-out', command: () => this.logout() }
    ];
  }

  // loadNotifications(): void {
  //   this.notificationService.getUserNotifications().subscribe({
  //     next: (notifications) => {
  //       this.notifications = notifications;
  //       this.unreadNotifications = notifications.filter(n => !n.read).length.toString();
  //     },
  //     error: (err) => {
  //       console.error('Erreur lors du chargement des notifications', err);
  //     }
  //   });
  // }

  // showNotifications(): void {
  //   // Logique pour afficher les notifications (par exemple, marquer comme lues)
  //   this.notificationService.markAsRead().subscribe({
  //     next: () => {
  //       this.unreadNotifications = '0';
  //     }
  //   });
  // }

  // logout(): void {
  //   this.authService.logout().subscribe({
  //     next: () => {
  //       this.router.navigate(['/login']);
  //     },
  //     error: (err) => {
  //       console.error('Erreur lors de la déconnexion', err);
  //     }
  //   });
  // }
}
