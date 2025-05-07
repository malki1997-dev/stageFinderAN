import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-reg-sta',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, FileUploadModule],
  templateUrl: './reg-sta.component.html',
  styleUrl: './reg-sta.component.css'
})
export class RegStaComponent {
  @Output() formSubmitted = new EventEmitter<any>();
    stagiaireForm: FormGroup;
    uploadedCv: File | null = null;

    constructor(private fb: FormBuilder) {
        this.stagiaireForm = this.fb.group({
            nom: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            tel: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
            cvFile: [null, Validators.required]
        });
    }

    onCvUpload(event: any) {
        const file = event.files[0];
        if (file) {
            this.uploadedCv = file;
            this.stagiaireForm.patchValue({ cvFile: file });
        }
    }

    onSubmit() {
        if (this.stagiaireForm.valid) {
            const formData = {
                ...this.stagiaireForm.value,
                role: 'STAGIAIRE'
            };
            this.formSubmitted.emit(formData);
        }
    }
}
