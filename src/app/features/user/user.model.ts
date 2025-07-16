/*import { Role } from "./role.enum";

export interface UserDTO {
  id: number;
  nom: string;
  email: string;
  nomEntreprise?: string;
  rc?: string;
  ice?: string;
  tel?: string;
  cvFile?: string;
  estValide?: boolean;
  adresse?: string;
  image?: string;
  role?: Role;
}*/
import { Role } from "./role.enum";

export interface UserDTO {
  id: number;
  nom: string;
  email: string;
  nomEntreprise?: string;
  rc?: string;
  ice?: string;
  tel?: string;
  cvFile?: string;
  estValide?: boolean;
  adresse?: string;
  image?: string;
  role?: Role;

imageUrl?: string | null;

}

