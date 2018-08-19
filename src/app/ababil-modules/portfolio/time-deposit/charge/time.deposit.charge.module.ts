import { NgModule } from '@angular/core';
import { AbabilNgSharedModule } from '../../../../common/ababil-ng-shared-module.module';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmationService } from 'primeng/api';
import { TimeDepositChargeRoutes } from './time.deposit.charge.routes';
import { TimeDepositChargeComponent } from './time.deposit.charge.component';
import { TimeDepositChargeConfigurationFormComponent } from './configuration-form/time.deposit.charge.configuration.form.component';
import { TimeDepositChargeService } from '../../../../services/time-deposit-charge/service-api/time.deposit.charge.service';
import { GlAccountService } from '../../../../services/glaccount/service-api/gl.account.service';
import { FixedDepositProductService } from '../../../../services/fixed-deposit-product/service-api/fixed.deposit.product.service';
import { RecurringDepositProductService } from '../../../../services/recurring-deposit-product/service-api/recurring.deposit.product.service';
import { ProductService } from '../../../../services/product/service-api/product.service';


@NgModule({
  imports: [
    AbabilNgSharedModule,
    RouterModule.forChild(TimeDepositChargeRoutes),
    MatMenuModule
  ],
  declarations: [
    TimeDepositChargeComponent,
    TimeDepositChargeConfigurationFormComponent
  ],
  providers: [
    ConfirmationService,
    TimeDepositChargeService,
    FixedDepositProductService,
    RecurringDepositProductService,
    RecurringDepositProductService,
    GlAccountService,
    ProductService
  ]
})
export class TimeDepositChargeModule { }
