import { NgModule } from '@angular/core';
import { AbabilNgSharedModule } from '../../../../common/ababil-ng-shared-module.module';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmationService } from 'primeng/api';
import { DemandDepositChargeRoutes } from './demand.deposit.charge.routes';
import { DemandDepositChargeComponent } from './demand.deposit.charge.component';
import { DemandDepositChargeConfigurationFormComponent } from './configuration-form/demand.deposit.charge.configuration.form.component';
import { DemandDepositChargeService } from '../../../../services/demand-deposit-charge/service-api/demand.deposit.charge.service';
import { GlAccountService } from '../../../../services/glaccount/service-api/gl.account.service';
import { DemandDepositProductService } from '../../../../services/demand-deposit-product/service-api/demand-deposit-product.service';


@NgModule({
  imports: [
    AbabilNgSharedModule,
    RouterModule.forChild(DemandDepositChargeRoutes),
    MatMenuModule
  ],
  declarations: [
    DemandDepositChargeComponent,
    DemandDepositChargeConfigurationFormComponent
  ],
  providers: [
    ConfirmationService,
    DemandDepositChargeService,
    DemandDepositProductService,
    GlAccountService
  ]
})
export class DemandDepositChargeModule { }
