import { Routes } from '@angular/router';
import { AccountFreezeFormComponent } from './account-freeze/form/account.freeze.form.component';

export const AccountRoutes: Routes = [
  { path: 'account-freeze', component: AccountFreezeFormComponent, pathMatch: 'full'}  
];