import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OffreComponent } from './offre/offre.component';
import { AddOffreComponent } from './offre/add-offre/add-offre.component';
import { SearchBarComponent } from './offre/search-bar/search-bar.component';
import { EditOffreComponent } from './offre/edit-offre/edit-offre.component';
import { PostulerComponent } from './offre/Candidature/postuler/postuler.component';
import { PostFormComponent } from './offre/Candidature/post-form/post-form.component';

const routes: Routes = [
  {path : "", component : OffreComponent},
  {path : "add-offre", component : AddOffreComponent},
  {path : "edit-offre/:id", component : EditOffreComponent},
  {path : "search", component : SearchBarComponent},
  {path : "postuler", component : PostulerComponent},
  //{ path: 'postform/:offreId', component: PostFormComponent },
  { path: 'postform', component: PostFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffreRoutingModule { }
