import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-reg-rec',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, FileUploadModule],
  templateUrl: './reg-rec.component.html',
  styleUrl: './reg-rec.component.css'
})
export class RegRecComponent {
  @Output() formSubmitted = new EventEmitter<any>();
    recruteurForm: FormGroup;
    uploadedImage: File | null = null;

    constructor(private fb: FormBuilder) {
        this.recruteurForm = this.fb.group({
            nom: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            nomEntreprise: ['', Validators.required],
            // (ex. : RC 123456 Casablanca).
            RC: ['', Validators.required, Validators.pattern(/^\d{5,7}(?:\s[A-Za-z]+)?$/)],
            // Exemple : 001234567000012
            ICE: ['', Validators.required, Validators.pattern(/^\d{15}$/)],
            tel: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
            adresse: ['', Validators.required],
            image: [null]
        });
    }

    onImageUpload(event: any) {
        const file = event.files[0];
        if (file) {
            this.uploadedImage = file;
            this.recruteurForm.patchValue({ image: file });
        }
    }

    onSubmit() {
        if (this.recruteurForm.valid) {
            const formData = {
                ...this.recruteurForm.value,
                role: 'RECRUTEUR'
            };
            this.formSubmitted.emit(formData);
        }
    }
}
