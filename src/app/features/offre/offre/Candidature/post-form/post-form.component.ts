import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeaderBanner3Component } from "../../../../header&footer/banners/header-banner3/header-banner3.component";

@Component({
  selector: 'app-post-form',
  imports: [ReactiveFormsModule,
    FileUploadModule,
    ButtonModule,
    ToastModule,
    CommonModule, HeaderBanner3Component],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css',
  providers: [MessageService]
})
export class PostFormComponent implements OnInit {
  postulerForm: FormGroup;
  uploadedCv: File | null = null;
  uploadedLettreMotivation: File | null = null;
  offreId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    this.postulerForm = this.fb.group({
      cvFile: [null, Validators.required],
      lettreMotivationFile: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    // Récupérer l'ID de l'offre depuis les paramètres de la route
    this.route.paramMap.subscribe(params => {
      const id = params.get('offreId');
      this.offreId = id ? +id : null;
    });
  }

  onCvUpload(event: any) {
    const file = event.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Le CV doit être au format PDF'
        });
        this.postulerForm.get('cvFile')?.setValue(null);
        return;
      }
      this.uploadedCv = file;
      this.postulerForm.patchValue({ cvFile: file });
    }
  }

  onLettreMotivationUpload(event: any) {
    const file = event.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'La lettre de motivation doit être au format PDF'
        });
        this.postulerForm.get('lettreMotivationFile')?.setValue(null);
        return;
      }
      this.uploadedLettreMotivation = file;
      this.postulerForm.patchValue({ lettreMotivationFile: file });
    }
  }

  onSubmit() {
    if (this.postulerForm.invalid || !this.offreId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Erreur',
        detail: 'Veuillez sélectionner un CV et une lettre de motivation'
      });
      return;
    }

    const formData = new FormData();
    if (this.uploadedCv) {
      formData.append('cv', this.uploadedCv, this.uploadedCv.name);
    }
    if (this.uploadedLettreMotivation) {
      formData.append('lettreMotivation', this.uploadedLettreMotivation, this.uploadedLettreMotivation.name);
    }

    this.http.post(`http://localhost:8080/api/candidatures/postuler/${this.offreId}`, formData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Votre candidature a été soumise avec succès'
        });
        this.postulerForm.reset();
        this.uploadedCv = null;
        this.uploadedLettreMotivation = null;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors de la soumission de la candidature'
        });
        console.error('Erreur lors de la soumission:', err);
      }
    });
  }
}
