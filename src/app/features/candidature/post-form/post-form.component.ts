import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderBanner3Component } from '../../../../app/features/header&footer/banners/header-banner3/header-banner3.component';
import { AuthService } from '../../../../app/features/auth/auth.service';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FileUploadModule,
    ButtonModule,
    ToastModule,
    CommonModule,
    HeaderBanner3Component
  ],
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css'],
  providers: [MessageService]
})
export class PostFormComponent implements OnInit {
  postulerForm: FormGroup;
  uploadedCv: File | null = null;
  uploadedLettreMotivation: File | null = null;
  offreId: number | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.postulerForm = this.fb.group({
      cvFile: [null, Validators.required],
      lettreMotivationFile: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('offreId');
      this.offreId = id && !isNaN(+id) ? +id : null;
      console.log('PostFormComponent - offreId récupéré:', this.offreId);
      console.log('PostFormComponent - Paramètres de la route:', params.keys, params.get('offreId'));
      if (!this.offreId) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Aucune offre sélectionnée. Veuillez accéder à ce formulaire via une offre valide.'
        });
      }
    });

    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('Utilisateur non connecté ou ID manquant');
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez vous connecter pour postuler.'
      });
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    }
  }

  onCvUpload(event: any) {
    const file = event.files[0];
    console.log('CV sélectionné:', file);
    if (file) {
      if (file.type !== 'application/pdf') {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Le CV doit être au format PDF'
        });
        this.postulerForm.get('cvFile')?.setValue(null);
        this.uploadedCv = null;
        return;
      }
      this.uploadedCv = file;
      this.postulerForm.get('cvFile')?.setValue(file);
      this.postulerForm.get('cvFile')?.markAsTouched();
      console.log('Formulaire après CV:', this.postulerForm.value, 'Valide:', this.postulerForm.valid);
    }
  }

  onLettreMotivationUpload(event: any) {
    const file = event.files[0];
    console.log('Lettre sélectionnée:', file);
    if (file) {
      if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'La lettre de motivation doit être au format PDF ou DOCX'
        });
        this.postulerForm.get('lettreMotivationFile')?.setValue(null);
        this.uploadedLettreMotivation = null;
        return;
      }
      this.uploadedLettreMotivation = file;
      this.postulerForm.get('lettreMotivationFile')?.setValue(file);
      this.postulerForm.get('lettreMotivationFile')?.markAsTouched();
      console.log('Formulaire après lettre:', this.postulerForm.value, 'Valide:', this.postulerForm.valid);
    }
  }

  onSubmit() {
    console.log('Soumission du formulaire déclenchée');
    console.log('Formulaire:', this.postulerForm.value, 'Valide:', this.postulerForm.valid);
    console.log('offreId:', this.offreId);

    const userId = this.authService.getUserId();
    console.log('userId:', userId);

    if (this.postulerForm.invalid || !this.offreId || !userId) {
      console.log('Formulaire invalide ou IDs manquants');
      this.messageService.add({
        severity: 'warn',
        summary: 'Erreur',
        detail: 'Veuillez sélectionner un CV, une lettre de motivation et vérifier les IDs'
      });
      this.postulerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('offreId', this.offreId.toString());
    formData.append('statutCandidature', 'EN_ATTENTE');
    if (this.uploadedCv) {
      console.log('CV Type MIME:', this.uploadedCv.type);
      formData.append('file', this.uploadedCv, this.uploadedCv.name);
      formData.append('type', 'cv');
    }
    if (this.uploadedLettreMotivation) {
      console.log('Lettre Type MIME:', this.uploadedLettreMotivation.type);
      formData.append('file', this.uploadedLettreMotivation, this.uploadedLettreMotivation.name);
      formData.append('type', 'lettre');
    }

    console.log('FormData envoyé:', [...formData.entries()]);

    this.http.post('http://localhost:8080/api/candidatures', formData).subscribe({
      next: (response) => {
        console.log('Réponse du serveur:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Votre candidature a été soumise avec succès'
        });
        this.postulerForm.reset();
        this.uploadedCv = null;
        this.uploadedLettreMotivation = null;
        this.isLoading = false;
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Erreur serveur:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors de la soumission de la candidature: ' + (err.error?.message || err.statusText)
        });
        this.isLoading = false;
      }
    });
  }
}
