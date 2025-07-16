import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OffreDTO } from './offre.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OffreService {

  private apiUrl = 'http://localhost:8080/api/offres';

  constructor(private http: HttpClient) {}

  getOffresByUser(userId: number, page: number, size: number): Observable<{ offres: OffreDTO[], currentPage: number, totalItems: number }> {
    return this.http.get<{ content: OffreDTO[], number: number, totalElements: number }>(
      `${this.apiUrl}/user/${userId}?page=${page}&size=${size}`
    ).pipe(
      map(response => ({
        offres: response.content,
        currentPage: response.number,
        totalItems: response.totalElements
      }))
    );
  }

  getOffreById(id: number): Observable<OffreDTO> {
    return this.http.get<OffreDTO>(`${this.apiUrl}/${id}`);
  }

  getOffres(page: number, size: number): Observable<{ offres: OffreDTO[], currentPage: number, totalItems: number }> {
    return this.http.get<{ offres: OffreDTO[], currentPage: number, totalItems: number }>(
      `${this.apiUrl}?page=${page}&size=${size}`
    );
  }

  deleteOffre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createOffre(offre: OffreDTO, userId: number, categorieId: number): Observable<OffreDTO> {
    const offreToSend = { ...offre, id: undefined };
    let params = new HttpParams()
      .set('userId', userId.toString())
      .set('categorieId', categorieId.toString());
    return this.http.post<OffreDTO>(this.apiUrl, offreToSend, { params });
  }

  updateOffre(id: number, offre: OffreDTO): Observable<OffreDTO> {
    return this.http.put<OffreDTO>(`${this.apiUrl}/${id}`, offre);
  }

  getOffresByVille(ville: string, page: number, size: number): Observable<{ offres: OffreDTO[], currentPage: number, totalItems: number }> {
    return this.http.get<{ offres: OffreDTO[], currentPage: number, totalItems: number }>(
      `${this.apiUrl}/ville/${ville}?page=${page}&size=${size}`
    );
  }

  /**
  getOffres(page: number, size: number, typeCategorie?: string, ville?: string): Observable<{ offres: Offre[], currentPage: number, totalItems: number, totalPages: number }> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());

    if (typeCategorie) {
        params = params.set('typeCategorie', typeCategorie);
    }
    if (ville) {
        params = params.set('ville', ville);
    }

    return this.http.get<{ offres: Offre[], currentPage: number, totalItems: number, totalPages: number }>(this.apiUrl, { params });
}

deleteOffre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
}

// createOffre(offre: Offre, userId: number, categorieId: number): Observable<Offre> {
//     let params = new HttpParams()
//         .set('userId', userId.toString())
//         .set('categorieId', categorieId.toString());
//     return this.http.post<Offre>(`${this.apiUrl}/publier`, offre, { params });
// }
   */

}
