import { NgModule } from '@angular/core';
import { AbabilNgSharedModule } from './../../common/ababil-ng-shared-module.module';
import { RouterModule } from '@angular/router';
import { IdentityRoutes } from './identity.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { IdentityComponent } from './identity.component';
import { IdentityTypeFormComponent } from './form/identity-type-form/identity.type.form.component';
import { IdentityService } from './../../services/identity/service-api/identity.service';
import { TranslateService } from '@ngx-translate/core';


@NgModule({
    imports: [
        AbabilNgSharedModule,
        RouterModule.forChild(IdentityRoutes),
        ReactiveFormsModule,
        CommonModule
    ],
    declarations: [
        IdentityComponent,
        IdentityTypeFormComponent
    ],
    providers: [
        IdentityService,
        TranslateService
    ]
})
export class IdentityModule {

}