import { NgModule } from '@angular/core';
import { AbabilNgSharedModule } from '../../common/ababil-ng-shared-module.module';
import { CommonModule } from '@angular/common';
import { LocationComponent } from './location.component';
import { RouterModule } from '@angular/router';
import { LocationRoutes } from './location.routes';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AbabilLocationService } from '../../services/location/service-api/location.service';
import { CreateLocationFormComponent } from './form/create/create.location.form.component';
import { LocationDetailComponent } from './detail/location.detail.component';
import { LocationDetailEditComponent } from './detail/edit/location.detail.edit.component';
import { DivisionCreateLocationComponent } from './detail/division/create/location.division.create.component';
import { DivisionEditLocationComponent } from './detail/division/edit/location.division.edit.component';
import { DistrictDetailComponent } from './detail/division/district/location.division.district.component';
import { DistrictCreateComponent } from './detail/division/district/create/location.division.district.create.component';
import { DistrictEditComponent } from './detail/division/district/edit/location.division.district.edit.component';
import { UpazillaDetailComponent } from './detail/division/district/upazilla/location.division.district.upazilla.component';
import { UpazillaCreateComponent } from './detail/division/district/upazilla/create/location.division.district.upazilla.create.component';


import { DocumentService } from '../../services/document/service-api/document.service';


@NgModule({
    imports: [
        AbabilNgSharedModule,
        RouterModule.forChild(LocationRoutes),
        CommonModule,
        ReactiveFormsModule,
        FormsModule
    ],
    declarations: [
        CreateLocationFormComponent,
        LocationComponent,
        LocationDetailComponent,
        LocationDetailEditComponent,
        DivisionCreateLocationComponent,
        DivisionEditLocationComponent,
        DistrictDetailComponent,
        DistrictCreateComponent,
        DistrictEditComponent,
        UpazillaDetailComponent,
        UpazillaCreateComponent

    ],
    providers: [
        TranslateService,
        AbabilLocationService,
        DocumentService
    ]
})
export class LocationModule {

}