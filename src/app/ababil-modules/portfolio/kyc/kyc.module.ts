import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AbabilNgSharedModule } from './../../../common/ababil-ng-shared-module.module';
import { KycRoutes } from './kyc.routes';
import { KycService } from '../../../services/kyc/service-api/kyc.service';
import { KycIndividualDetailsComponent } from './individual/details/kyc.individual.details.component';
import { KycIndividualEditComponent } from './individual/edit/kyc.individual.edit.component';
import { KycInstituteDetailsComponent } from './institute/details/kyc.institute.details.component';
import { KycInstituteEditComponent } from './institute/edit/kyc.institute.edit.component';


@NgModule({
    imports: [
        AbabilNgSharedModule,
        RouterModule.forChild(KycRoutes)
    ],

    declarations: [
        KycIndividualDetailsComponent,
        KycIndividualEditComponent,
        KycInstituteDetailsComponent,
        KycInstituteEditComponent
    ],

    providers: [
        KycService
    ]
})
export class KycModule {

}