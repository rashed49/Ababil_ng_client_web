import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AbabilNgSharedModule } from './../../../common/ababil-ng-shared-module.module';
import { CISModule } from '../../../ababil-modules/cis/cis.module';
import { CISService } from './../../../services/cis/service-api/cis.service';
import { DemandDepositAccountService } from './../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { NomineeService } from '../../../services/nominee/service-api/nominee.service';
import { FixedDepositAccountService } from '../../../services/fixed-deposit-account/service-api/fixed.deposit.account.service';
import { AccountService } from '../../../services/account/service-api/account.service';
import { PensionSchedulerFormComponent } from './form/pension.scheduler.form.component';
import { PensionSchedulerRoutes } from './pension.scheduler.routes';
import { SpecialProfitRateService } from '../../../services/special-profit-rate/service-api/special.profit.rate.service';
import { ProductService } from '../../../services/product/service-api/product.service';
import { DemandDepositProductService } from '../../../services/demand-deposit-product/service-api/demand-deposit-product.service';
import { PensionSchedulerService } from '../../../services/pension-scheduler/service-api/pension.scheduler.service';


@NgModule({
    imports: [
        AbabilNgSharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(PensionSchedulerRoutes)
    ],

    declarations: [
        PensionSchedulerFormComponent
    ],

    providers: [
        CISService,
        DemandDepositAccountService,
        FixedDepositAccountService,
        AccountService,
        PensionSchedulerService,
        ProductService,
        DemandDepositProductService,
        

    ]
})
export class PensionSchedulerModule {

}