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
import { SpecialProfitRateFormComponent } from './form/special.profit.rate.form.component';
import { AccountSpecialProfitRateRoutes } from './special.profit.rate.routes';
import { SpecialProfitRateService } from '../../../services/special-profit-rate/service-api/special.profit.rate.service';
import { ProductService } from '../../../services/product/service-api/product.service';
import { DemandDepositProductService } from '../../../services/demand-deposit-product/service-api/demand-deposit-product.service';


@NgModule({
    imports: [
        AbabilNgSharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(AccountSpecialProfitRateRoutes)
    ],

    declarations: [
        SpecialProfitRateFormComponent
    ],

    providers: [
        CISService,
        DemandDepositAccountService,
        FixedDepositAccountService,
        AccountService,
        SpecialProfitRateService,
        ProductService,
        DemandDepositProductService,
        

    ]
})
export class AccountSpecialProfitRateModule {

}