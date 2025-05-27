import { OffreDTO } from "../offre/offre/offre.model";

export interface CandidatureDTO {
  id: number;
  dateCandidature: string;
  statutCandidature: string;
  userId: number;
  offreId: OffreDTO;
  userNom: string;
  userEmail: string;
  cvFileName: string;
  lettreMotivationFileName: string;
}
