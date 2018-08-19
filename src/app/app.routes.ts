import { RefreshGuard } from './services/security/refresh-guard.service';
import { FourOFourComponent } from './four.o.four.component';
import { AuthRedirectComponent } from './auth.redirect.component';
import { environment } from './../environments/environment';
import { NoPreloading, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/security/auth-guard.service';
import { LoginGuard } from 'angular-spa/auth';
import { NgSsoGuard } from './services/security/ngoauth/ngsso.service';



const routesWithKecloakAuth: Routes = [
  { path: '', loadChildren: './app-main/main.module#MainModule', canActivate: [LoginGuard] }   
];

const routesWithLegacyAbabilAuth: Routes = [
  { path: '', loadChildren: './app-main/main.module#MainModule', canActivate: [AuthGuard]},
  { path: 'redirect', component: AuthRedirectComponent},
  { path: 'not-found', component: FourOFourComponent} 
];

const routsWithNgSso: Routes = [
    { path: '', loadChildren: './app-main/main.module#MainModule', canActivate: [NgSsoGuard] }
];

const routesWithNoAuth: Routes = [
  { path: '', loadChildren: './app-main/main.module#MainModule'},
];

export const appRoutes: any = RouterModule.forRoot(
    ( environment.auth==='KEYCLOAK'
        ?routesWithKecloakAuth
        :(environment.auth==='LEGACY-ABABIL')
            ?routesWithLegacyAbabilAuth
            :(environment.auth === 'NGSSO')
                ?routsWithNgSso
                :routesWithNoAuth), { preloadingStrategy: NoPreloading });
