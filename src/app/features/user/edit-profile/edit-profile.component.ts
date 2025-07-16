import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { UserDTO } from '../user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { Role } from '../role.enum';

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
    role: Role.ADMINISTRATEUR // Ajuste selon le rôle par défaut
  };
  userId: number = 5; // Hardcodé pour l'instant, à remplacer par l'utilisateur connecté
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isSubmitting: boolean = false;
  uploadedCv: File | null = null;
  uploadedImage: File | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userService.getUserProfile(this.userId).subscribe({
      next: (userData) => {
        this.user = userData;
        // Assurer une valeur par défaut pour role si non défini
        if (!this.user.role) {
          this.user.role = Role.STAGIAIRE; // Valeur par défaut
        }
        console.log('Profil chargé:', this.user);
        console.log('Role de l\'utilisateur:', this.user.role);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement du profil. Veuillez réessayer.';
        console.error('Erreur:', err);
      }
    });
  }

  onCvFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedCv = input.files[0];
      this.user.cvFile = this.uploadedCv.name;
    }
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedImage = input.files[0];
      this.user.image = this.uploadedImage.name;
    }
  }

  onSubmit(): void {
    // Validation simple avant soumission
    if (!this.user.nom || !this.user.email) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      this.successMessage = null;
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.userService.updateUserProfile(this.userId, this.user).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.successMessage = 'Profil mis à jour avec succès !';
        this.errorMessage = null;
        this.isSubmitting = false;
        console.log('Profil mis à jour:', updatedUser);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la mise à jour du profil. Veuillez réessayer.';
        this.successMessage = null;
        this.isSubmitting = false;
        console.error('Erreur:', err);
      }
    });
  }
}
