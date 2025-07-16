import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UserDTO } from '../../user/user.model';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-register-stagiaire',
  standalone: true,
  templateUrl: './reg-sta.component.html',
  styleUrls: ['./reg-sta.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule
  ]
})
export class RegisterStagiaireComponent {
  registerForm: FormGroup;
  errorMessage = '';
  cvFile: File | null = null;
  cvFileError = false; // ✅ à ajouter ici

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator = (group: FormGroup) => {
    const pwd = group.get('password')?.value;
    const confirmPwd = group.get('confirmPassword')?.value;
    return pwd === confirmPwd ? null : { mismatch: true };
  };

  onCvSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && file.type === 'application/pdf') {
      this.cvFile = file;
      this.cvFileError = false;
    } else {
      this.cvFile = null;
      this.cvFileError = true;
    }
  }

  onSubmit() {
    if (this.registerForm.invalid || !this.cvFile) {
      this.errorMessage = 'Veuillez remplir tous les champs requis et sélectionner un CV.';
      this.cvFileError = !this.cvFile;
      return;
    }

    const user: any = {
      ...this.registerForm.value,
      role: 'STAGIAIRE'
    };

    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(user)], { type: 'application/json' }));
    formData.append('cvFile', this.cvFile);

    this.authService.registerWithFormData(formData).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        console.error("Erreur :", err);
        this.errorMessage = "Erreur lors de l'inscription.";
      }
    });
  }
}
