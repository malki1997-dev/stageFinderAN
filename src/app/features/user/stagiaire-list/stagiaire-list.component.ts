import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../user.service';
import { FileService } from '../../../core/services/file.service';
import { UserDTO } from '../user.model';
import { EditUserComponent } from '../edit-user/edit-user.component';
//import { DeleteUserComponent } from '../delete-user/delete-user.component';



@Component({
  selector: 'app-stagiaire-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    EditUserComponent,
   // DeleteUserComponent
  ],
  templateUrl: './stagiaire-list.component.html',
  styleUrls: ['./stagiaire-list.component.css']
})
export class StagiaireListComponent implements OnInit {
  stagiaires: UserDTO[] = [];
  selectedUserToEdit?: UserDTO;

  constructor(
    private userService: UserService,
    private fileService: FileService
  ) {}




  ngOnInit(): void {
    this.loadStagiaires();
  }

  loadStagiaires(): void {
    this.userService.getStagiaires().subscribe({
      next: (data) => this.stagiaires = data,
      error: (err) => console.error('❌ Erreur chargement stagiaires :', err)
    });
  }

  viewCV(cvFile: string): void {
    if (cvFile) {
         const url = `${cvFile}?t=${Date.now()}`;
      this.fileService.openFileInNewTab(cvFile, 'cvFile');
    }
  }

  editStagiaire(stagiaire: UserDTO): void {
    this.selectedUserToEdit = stagiaire;
  }
  deleteStagiaire(id: number): void {
  const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce stagiaire ?");
  if (!confirmDelete) return;

  this.userService.deleteUser(id).subscribe({
    next: () => {
      this.stagiaires = this.stagiaires.filter(s => s.id !== id); // Retire de la liste sans reload complet
      alert("Stagiaire supprimé avec succès.");
    },
    error: (err) => {
      console.error("Erreur de suppression :", err);
      alert("Échec de la suppression.");
    }
  });
  
}


  closeEditForm(): void {
    this.selectedUserToEdit = undefined;
  }
}
