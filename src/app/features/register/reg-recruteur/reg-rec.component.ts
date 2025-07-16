import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UserDTO } from '../../user/user.model';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-register-recruteur',
  standalone: true,
  templateUrl: './reg-rec.component.html',
  styleUrls: ['./reg-rec.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FileUploadModule
  ]
})
export class RegisterRecruteurComponent {
  registerForm: FormGroup;
  errorMessage = '';
  submitted = false;
  logoFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', [Validators.required, Validators.pattern('^(06|07)[0-9]{8}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      nomEntreprise: ['', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÿ0-9 \'\-]{2,}$')]],
      rc: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]{4,20}$')]],
      ice: ['', [Validators.required, Validators.pattern('^[0-9]{15}$')]],
      adresse: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid || !this.logoFile) {
      this.errorMessage = 'Veuillez remplir tous les champs requis.';
      return;
    }

    const formData = new FormData();
    const user: UserDTO = {
      ...this.registerForm.value,
      role: 'RECRUTEUR'
    };
    formData.append('user', new Blob([JSON.stringify(user)], { type: 'application/json' }));

    if (this.logoFile) {
      formData.append('image', this.logoFile);
    }

    this.authService.registerWithFormData(formData).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.errorMessage = "Erreur lors de l'inscription."
    });
  }

  onImageSelected(event: any) {
    const file = event.files?.[0];
    if (file) {
      this.logoFile = file;
      console.log('Logo sélectionné :', file.name);
    }
  }
}
