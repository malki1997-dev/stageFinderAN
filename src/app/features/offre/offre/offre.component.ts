import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { OffreListComponent } from "./offre-list/offre-list.component";
import { HeaderBannerComponent } from "../../header&footer/banners/header-banner/header-banner.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-offre',
  imports: [SearchBarComponent, OffreListComponent, HeaderBannerComponent, ],
  templateUrl: './offre.component.html',
  styleUrl: './offre.component.css'
})
export class OffreComponent {
  searchResults: any = null;

    constructor(private http: HttpClient) {}

  onSearch(query: string) {

  }

  onFiltersChanged(filters: any) {

  }

  onSearchSubmitted(data: { typeCategorie: string, ville: string }) {
    console.log('Recherche :', data);
    // Exemple de requête au backend
    this.http.get(`http://localhost:8080/api/offres?typeCategorie=${data.typeCategorie}&ville=${data.ville}`)
        .subscribe({
            next: (response) => {
                this.searchResults = response;
                console.log('Résultats de la recherche :', response);
            },
            error: (error) => console.error('Erreur lors de la recherche :', error)
        });

      }
}
