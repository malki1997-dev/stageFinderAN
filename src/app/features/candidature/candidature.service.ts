import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CandidatureResponse } from './CandidatureResponse.model';
import { CandidatureDTO } from './candidature.model';

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {

  private apiUrl = 'http://localhost:8080/api/candidatures';

  constructor(private http: HttpClient) { }

  createCandidature(candidature: any, cvChoisi: File, lettreMotivation: File): Observable<any> {
    const formData = new FormData();
    formData.append('userId', candidature.userId);
    formData.append('offreId', candidature.offreId);
    formData.append('statutCandidature', candidature.statutCandidature);
    if (cvChoisi) {
      formData.append('file', cvChoisi, cvChoisi.name);
      formData.append('type', 'cv');
    }
    if (lettreMotivation) {
      formData.append('file', lettreMotivation, lettreMotivation.name);
      formData.append('type', 'lettre');
    }

    return this.http.post(this.apiUrl, formData);
  }

  getCandidaturesByOffre(offreId: number, page: number, size: number): Observable<CandidatureResponse> {
    return this.http.get<CandidatureResponse>(`${this.apiUrl}/offre/${offreId}?page=${page}&size=${size}`);
  }

  updateCandidatureStatus(id: number, statutCandidature: string): Observable<CandidatureDTO> {
    return this.http.patch<CandidatureDTO>(`${this.apiUrl}/${id}/status`, { statutCandidature });
  }

  getMyAppliedOffers(userId: number): Observable<CandidatureDTO[]> {
    const url = `${this.apiUrl}/my-applied-offers/${userId}`;
    console.log('Calling URL:', url);
    return this.http.get<CandidatureDTO[]>(url);
  }
}
