import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostulerComponent } from './postuler/postuler.component';
import { PostFormComponent } from './post-form/post-form.component';
import { OffreComponent } from '../offre/offre/offre.component';
import { AddOffreComponent } from '../offre/offre/add-offre/add-offre.component';
import { EditOffreComponent } from '../offre/offre/edit-offre/edit-offre.component';
import { SearchBarComponent } from '../offre/offre/search-bar/search-bar.component';
import { MyAppliedOffersComponent } from './my-applied-offers/my-applied-offers.component';
import { CandidaturesListComponent } from './candidatures-list/candidatures-list.component';

const routes: Routes = [
  { path: '', component: OffreComponent },
  { path: 'add-offre', component: AddOffreComponent },
  { path: 'edit-offre/:id', component: EditOffreComponent },
  { path: 'search', component: SearchBarComponent },
  { path: 'postuler/:offreId', component: PostulerComponent },
  { path: 'postuler/:offreId/form', component: PostFormComponent },
  { path: 'candidatures/:offreId', component: CandidaturesListComponent },
  { path: 'my-applied-offers', component: MyAppliedOffersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidatureRoutingModule { }
