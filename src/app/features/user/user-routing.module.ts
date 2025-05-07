import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StagiaireListComponent } from './stagiaire-list/stagiaire-list.component';
import { RecruteurListComponent } from './recruteur-list/recruteur-list.component';
import { NonAcceptedRecruteursListComponent } from './non-accepted-recruteurs-list/non-accepted-recruteurs-list.component';
import { UserOffresComponent } from './user-offres/user-offres.component';

const routes: Routes = [
  {path:"stagiaire-list", component:StagiaireListComponent},
  {path:"recruteur-list", component:RecruteurListComponent},
  {path:"na-recruteur-list", component:NonAcceptedRecruteursListComponent},
  {path:"mes-offres", component:UserOffresComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
