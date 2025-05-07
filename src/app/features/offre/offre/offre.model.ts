export interface OffreDTO {
  id: number;
  description: string;
  ville: string;
  anneesExperience: string;
  datePublication: Date;
  dateExpiration: Date;
  salaire: number;
  competenceExigee: string;
  categorieNom: string;
  publieParNom: string;
  nomEntreprise: string;
  categorieId: number;
  publieParId: number;
}
