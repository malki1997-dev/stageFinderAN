import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// PrimeNG Modules
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';

// Application Components
import { SharedModule } from './shared/shared.module';
import { HeaderAdminComponent } from './features/header&footer/header-admin/header-admin.component';
import { FooterComponent } from './features/header&footer/footer/footer.component';
import { NavbarComponent } from './features/header&footer/navbar/navbar.component';

// Services and Interceptors
import { AuthService } from './features/auth/auth.service';
import { authInterceptor } from './core/interceptors/auth.interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // Angular Modules
    CommonModule,
    RouterOutlet,

    // PrimeNG Modules
    DialogModule,
    ButtonModule,
    FileUploadModule,
    InputTextModule,

    // Shared Module
    SharedModule,

    // App Components
    HeaderAdminComponent,
    FooterComponent,
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  visible: boolean = false;

  constructor(public authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // onLogout(): void {
  //   this.authService.logout().subscribe({
  //     next: () => {
  //       localStorage.removeItem('user');
  //       window.location.href = '/login';
  //     }
  //   });
  // }
}
