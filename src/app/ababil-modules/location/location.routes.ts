import { Routes } from '@angular/router';
import { LocationComponent } from './location.component';
import { LocationDetailComponent } from './detail/location.detail.component';
import { LocationDetailEditComponent } from './detail/edit/location.detail.edit.component';
import { CreateLocationFormComponent } from './form/create/create.location.form.component';
import { DivisionEditLocationComponent } from './detail/division/edit/location.division.edit.component';
import { DivisionCreateLocationComponent } from './detail/division/create/location.division.create.component';
import { DistrictDetailComponent } from './detail/division/district/location.division.district.component';
import { DistrictCreateComponent } from './detail/division/district/create/location.division.district.create.component';
import { DistrictEditComponent } from './detail/division/district/edit/location.division.district.edit.component';
import { UpazillaDetailComponent } from './detail/division/district/upazilla/location.division.district.upazilla.component';
import { UpazillaCreateComponent } from './detail/division/district/upazilla/create/location.division.district.upazilla.create.component';

export const LocationRoutes: Routes = [
    { path: '', component: LocationComponent },
    { path: 'create', component: CreateLocationFormComponent },
    { path: 'country/:id', component: LocationDetailComponent, pathMatch: 'full' },
    { path: 'country/:id/edit', component: LocationDetailEditComponent },
    { path: 'country/:id/create', component: DivisionCreateLocationComponent },
    { path: 'country/:id/division/:divisionId', component: DistrictDetailComponent },
    { path: 'country/:id/division/:divisionId/edit', component: DivisionEditLocationComponent },
    { path: 'country/:id/division/:divisionId/create', component: DistrictCreateComponent },
    { path: 'country/:id/division/:divisionId/district/:districtId', component: UpazillaDetailComponent },
    { path: 'country/:id/division/:divisionId/district/:districtId/edit', component: DistrictEditComponent },
    { path: 'country/:id/division/:divisionId/district/:districtId/create', component: UpazillaCreateComponent }

]