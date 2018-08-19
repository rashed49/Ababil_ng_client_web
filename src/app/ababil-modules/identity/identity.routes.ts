import { Routes } from '@angular/router';
import { IdentityComponent } from './identity.component';
import { IdentityTypeFormComponent } from '../identity/form/identity-type-form/identity.type.form.component';

export const IdentityRoutes: Routes = [
    { path: '', component: IdentityComponent },
    { path: 'edit', component: IdentityTypeFormComponent }
    
];