import { Component } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { HeaderAdminComponent } from '../user/header-admin/header-admin.component';
import { FooterComponent } from '../header&footer/footer/footer.component';
import { Router, RouterOutlet } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../auth/auth.service'
import { CommonModule, NgIf } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [DialogModule,
    ButtonModule,
    SharedModule,
    CommonModule,
    HeaderAdminComponent,
    FooterComponent,
    RouterOutlet,
    FormsModule,
    TableModule,
    FileUploadModule,
    InputTextModule],

  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


  searchQuery: string = '';
  featuredOffers: any[] = [
    { id: 1, description: 'Stage en Développement Web', ville: 'Casablanca', categorie: 'Informatique' },
    { id: 2, description: 'Stage en Marketing Digital', ville: 'Rabat', categorie: 'Marketing' },
    { id: 3, description: 'Stage en Cybersécurité', ville: 'Marrakech', categorie: 'Sécurité' }
  ];

  constructor(private router: Router) {}

  onSearch() {
    this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
  }

  navigateToApply(offerId: number) {
    this.router.navigate(['/apply', offerId]);
  }

  navigateToAddOffer() {
    this.router.navigate(['/add-offer']);
  }

  navigateToSearch() {
throw new Error('Method not implemented.');
}
}
