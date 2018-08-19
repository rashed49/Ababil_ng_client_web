import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NomineeRoutes } from './nominee.routes';
import { AbabilNgSharedModule } from './../../../common/ababil-ng-shared-module.module';
import { CISModule } from '../../../ababil-modules/cis/cis.module';

import { NomineeDetailsComponent } from './details/nominee.details.component';
import { NomineeEditComponent } from './edit/nominee.edit.component';

import { CISService } from './../../../services/cis/service-api/cis.service';
import { DemandDepositAccountService } from './../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { NomineeService } from '../../../services/nominee/service-api/nominee.service';
import { FixedDepositAccountService } from '../../../services/fixed-deposit-account/service-api/fixed.deposit.account.service';
import { AccountService } from '../../../services/account/service-api/account.service';


@NgModule({
    imports: [
        AbabilNgSharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(NomineeRoutes)
    ],

    declarations: [
        NomineeDetailsComponent,
        NomineeEditComponent
    ],

    providers: [
        CISService,
        DemandDepositAccountService,
        FixedDepositAccountService,
        NomineeService,
        AccountService

    ]
})
export class NomineeModule {

}