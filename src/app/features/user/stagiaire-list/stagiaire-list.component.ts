import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { UserDTO } from '../user.model';

@Component({
  selector: 'app-stagiaire-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './stagiaire-list.component.html',
  styleUrls: ['./stagiaire-list.component.css']
})
export class StagiaireListComponent implements OnInit {
  stagiaires: UserDTO[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadStagiaires();
  }

  loadStagiaires(): void {
    this.userService.getStagiaires().subscribe({
      next: (stagiaires) => {
        this.stagiaires = stagiaires;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des stagiaires', err);
      }
    });
  }

  viewCV(cvFile: string): void {
    if (cvFile) {
      window.open(cvFile, '_blank');
    }
  }
}
