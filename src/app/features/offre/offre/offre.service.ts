import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { OffreDTO } from './offre.model';

@Injectable({
  providedIn: 'root'
})
export class OffreService {
  private apiUrl = 'http://localhost:8080/api/offres';

  constructor(private http: HttpClient) {}

  // Helper method to add Authorization header with JWT token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token'); // Changé de 'jwt_token' à 'access_token'
    console.log('OffreService: Token retrieved:', token); // Log pour débogage
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  getOffresByUser(userId: number, page: number, size: number): Observable<{ offres: OffreDTO[], currentPage: number, totalItems: number }> {
    const headers = this.getHeaders();
    return this.http.get<{ content: OffreDTO[], number: number, totalElements: number }>(
      `${this.apiUrl}/user/${userId}?page=${page}&size=${size}`, { headers }
    ).pipe(
      map(response => ({
        offres: response.content,
        currentPage: response.number,
        totalItems: response.totalElements
      }))
    );
  }

  getOffreById(id: number): Observable<OffreDTO> {
    const headers = this.getHeaders();
    return this.http.get<OffreDTO>(`${this.apiUrl}/${id}`, { headers });
  }

  getOffres(page: number, size: number, typeCategorie?: string, ville?: string): Observable<{ offres: OffreDTO[], currentPage: number, totalItems: number }> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());
  if (typeCategorie) {
    params = params.set('typeCategorie', typeCategorie);
  }
  if (ville) {
    params = params.set('ville', ville);
  }
  const headers = this.getHeaders();
  console.log('OffreService: Envoi de la requête à', this.apiUrl, 'avec params:', params.toString());
  return this.http.get<{ offres: any[], currentPage: number, totalItems: number, totalPages: number }>(
    this.apiUrl, { headers, params }
  ).pipe(
    tap(response => console.log('Réponse brute de l\'API :', response)),
    map(response => ({
      offres: response.offres.map(offre => ({
        id: offre.id,
        description: offre.description,
        ville: offre.ville,
        preEmbauche: offre.preEmbauche,
        anneesExperience: offre.anneesExperience,
        datePublication: offre.datePublication,
        dateExpiration: offre.dateExpiration,
        salaire: offre.salaire,
        competenceExigee: offre.competenceExigee,
        categorieNom: offre.categorieNom,
        publieParNom: offre.publieParNom,
        nomEntreprise: offre.nomEntreprise,
        categorieId: offre.categorieId,
        publieParId: offre.publieParId
      })),
      currentPage: response.currentPage ?? 0,
      totalItems: response.totalItems ?? 0
    }))
  );
}

  deleteOffre(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  createOffre(offre: OffreDTO, userId: number, categorieId: number): Observable<OffreDTO> {
    const offreToSend = { ...offre, id: undefined };
    let params = new HttpParams()
      .set('userId', userId.toString())
      .set('categorieId', categorieId.toString());
    const headers = this.getHeaders();
    return this.http.post<OffreDTO>(`${this.apiUrl}/publier`, offreToSend, { headers, params });
  }

  updateOffre(id: number, offre: OffreDTO): Observable<OffreDTO> {
    const headers = this.getHeaders();
    return this.http.put<OffreDTO>(`${this.apiUrl}/${id}`, offre, { headers });
  }

  getOffresByVille(ville: string, page: number, size: number): Observable<{ offres: OffreDTO[], currentPage: number, totalItems: number }> {
    const headers = this.getHeaders();
    return this.http.get<{ content: OffreDTO[], number: number, totalElements: number }>(
      `${this.apiUrl}/ville/${ville}?page=${page}&size=${size}`, { headers }
    ).pipe(
      map(response => ({
        offres: response.content,
        currentPage: response.number,
        totalItems: response.totalElements
      }))
    );
  }
}
