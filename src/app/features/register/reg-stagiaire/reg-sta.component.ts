import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { PasswordModule } from 'primeng/password';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reg-sta',
  imports: [CommonModule, InputTextModule, ReactiveFormsModule, ButtonModule, FileUploadModule, PasswordModule],
  templateUrl: './reg-sta.component.html',
  styleUrl: './reg-sta.component.css'
})
export class RegStaComponent {
  @Output() formSubmitted = new EventEmitter<any>();
  stagiaireForm: FormGroup;
  uploadedCv: File | null = null;
  cvFileError: boolean = false;

  constructor(private fb: FormBuilder) {
    this.stagiaireForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      cvFile: [null],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    // Ajout d'une validation personnalisée pour le fichier
    this.stagiaireForm.get('cvFile')?.setValidators(this.fileValidator);
    this.stagiaireForm.get('cvFile')?.updateValueAndValidity();
  }

  // Validateur pour vérifier que les mots de passe correspondent
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Validateur personnalisé pour le fichier
  fileValidator(control: any) {
    const file = control.value;
    if (!file) return { required: true };
    if (file.size > 5000000 || !file.type.includes('pdf')) {
      return { invalidFile: true };
    }
    return null;
  }

  onCvSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.uploadedCv = file;
      this.stagiaireForm.patchValue({ cvFile: file });
      this.cvFileError = file.size > 5000000 || !file.type.includes('pdf');
    } else {
      this.uploadedCv = null;
      this.stagiaireForm.patchValue({ cvFile: null });
      this.cvFileError = true;
    }
  }

  onSubmit() {
    if (this.stagiaireForm.valid && !this.cvFileError) {
      const formData = {
        ...this.stagiaireForm.value,
        role: 'STAGIAIRE'
      };
      this.formSubmitted.emit(formData);
    }
  }
}
