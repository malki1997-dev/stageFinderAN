import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { UserDTO } from '../user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { Role } from '../role.enum';
import { AuthService } from '../../auth/auth.service';
import { LoginDTO } from '../../auth/login.dto';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, MessageModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  user: UserDTO = {
    id: 0,
    nom: '',
    email: '',
    rc: '',
    ice: '',
    nomEntreprise: '',
    image: '',
    cvFile: '',
    adresse: '',
    estValide: true,
    tel: '',
    role: Role.STAGIAIRE
  };

  userId: number = 0;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isSubmitting: boolean = false;
  uploadedCv: File | null = null;
  uploadedImage: File | null = null;
  passwordInput: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserIdFromToken() ?? 0;
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const role = this.authService.getUserRole(); // ✅ utilisation correcte

    if (role === Role.ADMINISTRATEUR) {
      this.userService.getUserProfile(this.userId).subscribe({
        next: (userData) => {
          this.user = userData;
          this.user.role ||= Role.ADMINISTRATEUR;
          console.log('✅ Profil ADMINISTRATEUR chargé:', this.user);
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement du profil.';
          console.error(err);
        }
      });
    } else {
      this.authService.getCurrentUser().subscribe({
        next: (userData) => {
          this.user = userData;
          this.user.role ||= Role.STAGIAIRE;
          console.log('✅ Profil STAGIAIRE chargé (via /auth/me) :', this.user);
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement du profil.';
          console.error(err);
        }
      });
    }
  }

  onCvFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadedCv = input.files[0];
      this.user.cvFile = this.uploadedCv.name;
    }
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadedImage = input.files[0];
      this.user.image = this.uploadedImage.name;
    }
  }

 onSubmit(): void {
  //if (!this.user.nom || !this.user.email || !this.passwordInput) {
    //this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
    //this.successMessage = null;
   // return;
 // }

  this.isSubmitting = true;
  this.errorMessage = null;
  this.successMessage = null;

  this.user.password = this.passwordInput;

  const role = this.authService.getUserRole(); // ✅ récupère le rôle connecté

  let updateObservable;

  if (role === Role.ADMINISTRATEUR) {
    updateObservable = this.userService.updateUserProfile(this.userId, this.user); // `/api/users/{id}`
  } else {
    updateObservable = this.authService.updateCurrentUserWithFormData(this.user, this.uploadedImage!, this.uploadedCv!); // `/auth/me`
  }

  updateObservable.subscribe({
    next: () => {
      const credentials: LoginDTO = {
        email: this.user.email,
        password: this.passwordInput
      };

      this.authService.login(credentials).subscribe({
        next: (authRes) => {
          localStorage.setItem('access_token', authRes.token);
          localStorage.setItem('refresh_token', authRes.refreshToken || '');
          this.successMessage = 'Profil mis à jour avec succès.';
          this.isSubmitting = false;
          window.location.reload();
        },
        error: (loginErr) => {
          console.error('Échec de la reconnexion :', loginErr);
          this.successMessage = 'Profil mis à jour, mais échec de la reconnexion.';
          this.isSubmitting = false;
        }
      });
    },
    error: (err: any) => {
      this.errorMessage = 'Erreur lors de la mise à jour du profil.';
      this.successMessage = null;
      this.isSubmitting = false;
      console.error(err);
    }
  });
}

}
