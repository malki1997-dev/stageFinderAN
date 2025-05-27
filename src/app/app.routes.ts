import { Routes } from '@angular/router';
import { HeaderAdminComponent } from './features/header&footer/header-admin/header-admin.component';
import { LoginComponent } from './features/login/login.component';
import { RegchoixComponent } from './features/register/regchoix/regchoix.component';
import { RegRecComponent } from './features/register/reg-rec/reg-rec.component';
import { RegStaComponent } from './features/register/reg-sta/reg-sta.component';
import { TarifsStagiaireComponent } from './features/tarifs-stagiaire/tarifs-stagiaire.component';
import { DashbordAdminComponent } from './features/dashboard-admin/dashbord-admin/dashbord-admin.component';

export const routes: Routes = [
  {path:"login", component : LoginComponent},
  {path:"regchoix", component : RegchoixComponent },
  {path:"regrec", component : RegRecComponent },
  {path:"regsta", component : RegStaComponent },
  {path:"tarifs-stagiaire", component : TarifsStagiaireComponent},
  { path : "" , loadChildren:()=>import('../app/features/offre/offre.module').then(m=>m.OffreModule)},
  { path : "" , loadChildren:()=>import('../app/features/user/user.module').then(m=>m.UserModule)},
  { path : "" , loadChildren:()=>import('../app/features/candidature/candidature.module').then(m=>m.CandidatureModule)},
  { path : "" , loadChildren:()=>import('../app/features/dashboard-admin/dashboard-admin.module').then(m=>m.DashboardAdminModule)},

  //{ path : "", component:HeaderAdminComponent},

];
