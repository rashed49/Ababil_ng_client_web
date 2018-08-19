import { Routes } from '@angular/router';
import { AccountOperatorComponent } from './account.operator.component';
import { SignatoryFormComponent } from './form/signatory.form.component';
import { CreateSignatoryFormComponent } from './form/create/create.signatory.form.component';
import { SignatoryDetailComponent } from './detail/signatory.detail.component';
import { EditSignatoryFormComponent } from './form/edit/edit.signatory.form.component';

export const AccountOperatorRoutes: Routes = [
    { path: '', component: AccountOperatorComponent },
    { path: 'signatories/create', component: CreateSignatoryFormComponent },
    { path: 'signatories/detail/:signatoryId', component: SignatoryDetailComponent},
    { path: 'signatories/detail/:signatoryId/edit', component: EditSignatoryFormComponent}

]