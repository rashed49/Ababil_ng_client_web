import { Routes } from '@angular/router';
import { NomineeDetailsComponent } from './details/nominee.details.component';
import { NomineeEditComponent } from './edit/nominee.edit.component';
//import { ShortIndividualDetailComponent } from '../../cis/individual/short-individual-form/detail/short.individual.detail.component';




export const NomineeRoutes: Routes = [
    // { path: ':nomineeId/details/view', component: ShortIndividualDetailComponent },
    { path: ':nomineeId/details', component: NomineeDetailsComponent },
    { path: ':nomineeId/edit', component: NomineeEditComponent },
    { path: 'create', component: NomineeEditComponent }
]