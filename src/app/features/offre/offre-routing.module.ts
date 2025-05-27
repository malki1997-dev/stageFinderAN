import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OffreComponent } from './offre/offre.component';
import { AddOffreComponent } from './offre/add-offre/add-offre.component';
import { SearchBarComponent } from './offre/search-bar/search-bar.component';
import { EditOffreComponent } from './offre/edit-offre/edit-offre.component';

const routes: Routes = [
  {path : "", component : OffreComponent},
  {path : "add-offre", component : AddOffreComponent},
  {path : "edit-offre/:id", component : EditOffreComponent},
  {path : "search", component : SearchBarComponent},
  //{path : "postuler", component : PostulerComponent},
  // { path: 'postuler/:offreId', component: PostulerComponent },
  // { path: 'postuler/:offreId/form', component: PostFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffreRoutingModule { }
