import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserDTO } from '../user.model';
import { UserService } from '../user.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Role } from '../role.enum'; // si tu l’as

@Component({
  selector: 'app-edit-user',
  standalone: true,
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule]
})
export class EditUserComponent implements OnChanges {
  @Input() user!: UserDTO;
  @Output() updated = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  selectedCvFile: File | null = null;
  selectedImageFile: File | null = null;


  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.buildForm();
    }
  }

  onImageChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedImageFile = input.files[0];
  }
}


  buildForm(): void {
    this.form = this.fb.group({
      nom: [this.user.nom, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      tel: [this.user.tel, Validators.required]
    });

    if (this.user.role === 'RECRUTEUR') {
      this.form.addControl('nomEntreprise', this.fb.control(this.user.nomEntreprise || ''));
      this.form.addControl('rc', this.fb.control(this.user.rc || ''));
      this.form.addControl('ice', this.fb.control(this.user.ice || ''));
      this.form.addControl('adresse', this.fb.control(this.user.adresse || ''));
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedCvFile = input.files[0];
    }
  }

  save(): void {
    const formData = new FormData();

    const userPayload: any = {
      nom: this.form.value.nom,
      email: this.form.value.email,
      tel: this.form.value.tel
    };

    if (this.user.role === 'RECRUTEUR') {
      userPayload.nomEntreprise = this.form.value.nomEntreprise;
      userPayload.rc = this.form.value.rc;
      userPayload.ice = this.form.value.ice;
      userPayload.adresse = this.form.value.adresse;
    }

    formData.append(
      'user',
      new Blob([JSON.stringify(userPayload)], { type: 'application/json' })
    );

    if (this.selectedCvFile) {
      formData.append('cvFile', this.selectedCvFile);
    }
if (this.selectedImageFile) {
  formData.append('image', this.selectedImageFile);
}

    this.userService.updateUser(this.user.id!, formData).subscribe({
      next: () => {
        alert('✅ Utilisateur mis à jour');
        this.updated.emit();
      },
      error: (error) => {
        console.error('❌ Erreur backend :', error);
        alert('❌ Erreur lors de la mise à jour');
      }
    });
  }

  close(): void {
    this.cancel.emit();
  }
}
