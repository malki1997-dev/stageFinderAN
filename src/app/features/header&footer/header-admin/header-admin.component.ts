import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-admin',
  imports: [TieredMenuModule, ButtonModule],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.css'
})
export class HeaderAdminComponent {


  constructor(private router : Router){}
  userMenuItems: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/dashboard-admin' },
    { label: 'Connexion', routerLink: '/login' },
    { label: 'S\'inscrire', routerLink: '/regchoix' },
    { label: 'Mes demandes', routerLink: '/my-applied-offers' },
    { label: 'Mon profil', routerLink: '/edit-profile' },

  ];

  listeStagiaires() {
    this.router.navigate(['stagiaire-list']);
  }

  listeEntreprises() {
    console.log('recruteur-list');
    this.router.navigate(['recruteur-list']);
  }

  listeEntreprisesNA() {
    this.router.navigate(['na-recruteur-list']);
    }

  mesOffres() {
      this.router.navigate(['mes-offres']);
      }

  tarifs(){
    this.router.navigate(['tarifs-stagiaire'])
  }
}
