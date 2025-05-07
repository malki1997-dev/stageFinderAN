import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OffreDTO } from '../../offre/offre/offre.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardAdminService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getUsersRegisteredPerMonth(): Observable<{ month: string, count: number }[]> {
    return this.http.get<{ month: string, count: number }[]>(`${this.apiUrl}/dashboard/users-registered-per-month`);
  }

  getJobPostingsPerMonth(): Observable<{ month: string, count: number }[]> {
    return this.http.get<{ month: string, count: number }[]>(`${this.apiUrl}/dashboard/job-postings-per-month`);
  }

  getMostPublishedCategories(): Observable<{ category: string, count: number }[]> {
    return this.http.get<{ category: string, count: number }[]>(`${this.apiUrl}/dashboard/most-published-categories`);
  }

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

  getRecentOffres(limit: number = 5): Observable<OffreDTO[]> {
    return this.http.get<OffreDTO[]>(`${this.apiUrl}/recent-offres?limit=${limit}`);
  }
}
