import { CandidatureDTO } from "./candidature.model";

export interface CandidatureResponse {
  content: CandidatureDTO[];
  number: number;
  totalElements: number;
  totalPages: number;
}
