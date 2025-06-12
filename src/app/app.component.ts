import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from './shared/shared.module';
import { HeaderAdminComponent } from "./features/header&footer/header-admin/header-admin.component";
import { FooterComponent } from './features/header&footer/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { HomeComponent } from "./features/home/home.component";
import { AuthService } from './features/auth/auth.service';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './features/auth/login/login.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    SharedModule,
    HeaderAdminComponent,
    FooterComponent,
    RouterOutlet,
    FileUploadModule,
    InputTextModule,
    CommonModule,
    HomeComponent,
    LoginComponent
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
  //       window.location.href = '/login'; // Redirection forcée pour éviter les problèmes de cache
  //     }
  //   });
  // }
}
