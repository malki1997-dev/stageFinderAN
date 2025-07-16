import { Offre } from "./offre.model";

export interface OffreResponse {
  offres: Offre[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}
