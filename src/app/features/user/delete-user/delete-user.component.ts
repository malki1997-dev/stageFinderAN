import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { UserDTO } from '../user.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
})
export class DeleteUserComponent implements OnInit {
  users: UserDTO[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error('Erreur lors du chargement', err),
    });
  }

  deleteUser(id: number): void {
    const confirmation = window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
    if (!confirmation) return;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter((user) => user.id !== id);
        alert("Utilisateur supprimé avec succès.");
      },
      error: (err) => {
        console.error("Erreur lors de la suppression :", err);
        alert("Échec de la suppression.");
      },
    });
  }
}
