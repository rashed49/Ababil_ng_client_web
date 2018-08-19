import { Routes } from '@angular/router';
import { KycIndividualDetailsComponent } from './individual/details/kyc.individual.details.component';
import { KycIndividualEditComponent } from './individual/edit/kyc.individual.edit.component';
import { KycInstituteDetailsComponent } from './institute/details/kyc.institute.details.component';
import { KycInstituteEditComponent } from './institute/edit/kyc.institute.edit.component';


export const KycRoutes: Routes = [
    { path: 'individual/details', component: KycIndividualDetailsComponent },
    { path: 'individual/edit', component: KycIndividualEditComponent },
    { path: 'institute/details', component: KycInstituteDetailsComponent },
    { path: 'institute/edit', component: KycInstituteEditComponent }
]