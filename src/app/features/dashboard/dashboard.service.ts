import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private router:Router) {}

  getTotalUsers(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/users/count`);
  }

  getTotalStagiaires(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/users/count?role=STAGIAIRE`);
  }

  getTotalRecruteurs(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/users/count?role=RECRUTEUR`);
  }

  getTotalCandidatures(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/candidatures/count`);
  }

  getTotalOffres(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/offres/count`);
  }

  
}
