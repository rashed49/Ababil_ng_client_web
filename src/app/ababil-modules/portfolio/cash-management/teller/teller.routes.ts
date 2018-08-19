import { Routes} from '@angular/router';
import { TellerComponent } from './teller.component';

import { TellerDetailComponent } from './detail/teller-detail/teller.detail.component';
import { CreateTellerFormComponent } from './form/teller-form/create/create.teller.form.component';
import { EditTellerFormComponent } from './form/teller-form/edit/edit.teller.form.component';
import { TellerFormComponent } from './form/teller-form/teller.form.component';


export const TellerRoutes: Routes = [
    {path: '', component: TellerComponent},
    {path: 'detail/:id', component: TellerDetailComponent, pathMatch: 'full'},
    {path: 'create', component: CreateTellerFormComponent},
    {path: 'detail/:id/edit', component: EditTellerFormComponent, pathMatch: 'full' }
    
];
