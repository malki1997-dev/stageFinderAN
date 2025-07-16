import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = 'http://localhost:8080/api/files';

  constructor(private http: HttpClient) {}

  /**
   * 🔓 Ouvre un fichier dans un nouvel onglet sécurisé via JWT
   */
  openFileInNewTab(fileName: string, type: string): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Aucun token JWT trouvé');
      return;
    }

    const url = `${this.apiUrl}/get?filename=${fileName}&type=${type}`;
    const headers = new Headers({
      'Authorization': `Bearer ${token}`
    });

    fetch(url, { method: 'GET', headers })
      .then(response => {
        if (!response.ok) {
          throw new Error('Fichier non trouvé ou accès refusé');
        }
        return response.blob();
      })
      .then(blob => {
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      })
      .catch(error => {
        console.error('Erreur lors de l\'ouverture du fichier :', error);
      });
  }

  /**
   * 💾 Télécharge un fichier sécurisé avec JWT.
   */
  downloadFile(fileName: string, type: string): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Aucun token JWT trouvé');
      return;
    }

    const url = `${this.apiUrl}/get?filename=${fileName}&type=${type}`;
    this.http.get(url, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      }),
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error(`Erreur lors du téléchargement du fichier "${fileName}"`, err);
      }
    });
  }

  /**
   * 🖼️ Récupère une image (logo utilisateur) sécurisée, et retourne son URL local blob.
   */
  getImageBlobUrl(fileName: string, type: string): Promise<string | null> {
    const token = localStorage.getItem('access_token');
    if (!token) return Promise.resolve(null);

    const url = `${this.apiUrl}/get?filename=${fileName}&type=${type}`;
    return this.http.get(url, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      }),
      responseType: 'blob'
    }).toPromise()
      .then(blob => {
        return blob ? URL.createObjectURL(blob) : null;
      })
      .catch((err) => {
        console.error(`Erreur lors du chargement de l'image "${fileName}"`, err);
        return null;
      });
  }
}
