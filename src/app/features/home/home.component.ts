import { Component } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { HeaderAdminComponent } from '../header&footer/header-admin/header-admin.component';
import { FooterComponent } from '../header&footer/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../auth/auth.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [DialogModule,
    ButtonModule,
    SharedModule,
    CommonModule,
    HeaderAdminComponent,
    FooterComponent,
    RouterOutlet,
    FileUploadModule,
    InputTextModule],

  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  visible: boolean = false;
  constructor(public authService: AuthService) {}

    get isLoggedIn(): boolean {
      return this.authService.isLoggedIn();
    }
}
