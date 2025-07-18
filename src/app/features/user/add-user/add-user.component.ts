import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './../user.service';

// PrimeNG
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

      // Champs spécifiques au recruteur
      nomEntreprise: [''],
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

  onSubmit(): void {
  this.submitted = true;
  if (this.userForm.invalid) return;

  const raw = this.userForm.value;

  // Construire dynamiquement le bon objet utilisateur
  const userPayload: any = {
    nom: raw.nom,
    email: raw.email,
    password: raw.password,
    tel: raw.tel,
    role: raw.role
  };

  if (raw.role === 'RECRUTEUR') {
    userPayload.nomEntreprise = raw.nomEntreprise;
    userPayload.rc = raw.rc;
    userPayload.ice = raw.ice;
    userPayload.adresse = raw.adresse;
  }

  // ✅ Supprimer explicitement les champs recruteur si c'est un stagiaire
  if (raw.role === 'STAGIAIRE') {
    delete userPayload.nomEntreprise;
    delete userPayload.rc;
    delete userPayload.ice;
    delete userPayload.adresse;
  }

  const formData = new FormData();
  formData.append('user', new Blob([JSON.stringify(userPayload)], { type: 'application/json' }));

  if (raw.role === 'STAGIAIRE' && this.cvFile) {
    formData.append('cvFile', this.cvFile);
  }

  if (raw.role === 'RECRUTEUR' && this.logoFile) {
    formData.append('image', this.logoFile);
  }

  this.userService.registerWithFormData(formData).subscribe({
    next: () => {
      alert('✅ Utilisateur ajouté avec succès');
      this.userForm.reset();
      this.selectedRole = '';
      this.cvFile = null;
      this.logoFile = null;
      this.submitted = false;
    },
    error: (err) => {
      console.error(err);
      alert('❌ Une erreur est survenue lors de l’enregistrement');
    }
  });
}
}
