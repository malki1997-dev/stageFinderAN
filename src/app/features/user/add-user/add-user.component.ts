import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './../user.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-add-user',
  standalone: true,
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FileUploadModule,
    DropdownModule
  ]
})
export class AddUserComponent {
  userForm: FormGroup;
  selectedRole: string = '';
  submitted = false;

  cvFile: File | null = null;
  logoFile: File | null = null;

  roles = [
    { label: 'Stagiaire', value: 'STAGIAIRE' },
    { label: 'Recruteur', value: 'RECRUTEUR' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      tel: ['', Validators.required],
      role: ['', Validators.required],
      nomEntreprise: [''], // Pour RECRUTEUR
      rc: [''],
      ice: [''],
      adresse: ['']
    });
  }

  onRoleChange(role: string): void {
    this.selectedRole = role;
  }

  onFileSelect(event: Event, type: 'cvFile' | 'logoFile') {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.length) {
      const file = fileInput.files[0];
      if (type === 'cvFile') this.cvFile = file;
      if (type === 'logoFile') this.logoFile = file;
    }
  }

  canSubmitFiles(): boolean {
    if (this.selectedRole === 'STAGIAIRE') return !!this.cvFile;
    if (this.selectedRole === 'RECRUTEUR') return !!this.logoFile;
    return true;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.userForm.invalid || !this.canSubmitFiles()) return;

    const formValue = this.userForm.value;

    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(formValue)], { type: 'application/json' }));

    if (this.selectedRole === 'STAGIAIRE' && this.cvFile) {
      formData.append('cvFile', this.cvFile);
    }

    if (this.selectedRole === 'RECRUTEUR' && this.logoFile) {
      formData.append('image', this.logoFile);
    }

    this.userService.registerWithFormData(formData).subscribe({
      next: () => {
        alert('✅ Utilisateur ajouté avec succès');
        this.userForm.reset();
        this.cvFile = null;
        this.logoFile = null;
        this.selectedRole = '';
        this.submitted = false;
      },
      error: (err) => {
        console.error(err);
        alert('❌ Une erreur est survenue');
      }
    });
  }
}
