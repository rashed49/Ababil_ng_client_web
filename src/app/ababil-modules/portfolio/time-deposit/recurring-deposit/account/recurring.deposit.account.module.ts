import { NgModule } from "@angular/core";
import { AbabilNgSharedModule } from "../../../../../common/ababil-ng-shared-module.module";
import { RouterModule } from "@angular/router";
import { RecurringDepositAccountService } from "../../../../../services/recurring-deposit-account/service-api/recurring.deposit.account.service";
import { ConfirmationService } from "primeng/components/common/confirmationservice";
import { RecurringDepositProductService } from "../../../../../services/recurring-deposit-product/service-api/recurring.deposit.product.service";
import { CISService } from "../../../../../services/cis/service-api/cis.service";
import { NomineeService } from "../../../../../services/nominee/service-api/nominee.service";
import { AbabilLocationService } from "../../../../../services/location/service-api/location.service";
import { DemandDepositAccountService } from "../../../../../services/demand-deposit-account/service-api/demand.deposit.account.service";
import { AccountService } from "../../../../../services/account/service-api/account.service";
import { CurrencyService } from "../../../../../services/currency/service-api/currency.service";
import { ProductService } from "../../../../../services/product/service-api/product.service";
import { RecurringDepositAccountRoutes } from "./recurring.deposit.account.routes";
import { RecurringDepositAccountDetailsComponent } from "./detail/recurring.deposit.account.details.component";
import { RecurringDepositAccountFormComponent } from "./form/recurring.deposit.account.form.component";
import { RecurringDepositAccountFormEditComponent } from "./form/edit/recurring.deposit.account.form.edit.component";
import { RecurringDepositAccountFormCreateComponent } from "./form/create/recurring.deposit.account.form.create.component";
import { KycService } from "../../../../../services/kyc/service-api/kyc.service";
import { RecurringDepositAccountClosingFormComponent } from "./recurring-deposit-close-account/recurring.deposit.account.closing.form.component";
import { AccountOperatorService } from "../../../../../services/account-operator/service-api/account.operator.service";
import { PensionSchedulerService } from '../../../../../services/pension-scheduler/service-api/pension.scheduler.service';
import { MatTabsModule } from "../../../../../../../node_modules/@angular/material/tabs";
import { CISMiscellaneousService } from '../../../../../services/cis/service-api/cis.misc.service';
import { TimeDepositChargeService } from "../../../../../services/time-deposit-charge/service-api/time.deposit.charge.service";

@NgModule({
  imports: [
    AbabilNgSharedModule,
    RouterModule.forChild(RecurringDepositAccountRoutes),
    MatTabsModule
  ],
  declarations: [
    RecurringDepositAccountDetailsComponent,
    RecurringDepositAccountFormComponent,
    RecurringDepositAccountFormCreateComponent,
    RecurringDepositAccountFormEditComponent,
    RecurringDepositAccountClosingFormComponent
  ],
  providers: [
    AccountService,
    AbabilLocationService,
    CISService,
    CurrencyService,
    ConfirmationService,
    DemandDepositAccountService,
    KycService,
    NomineeService,
    ProductService,
    RecurringDepositAccountService,
    RecurringDepositProductService,
    AccountOperatorService,
    PensionSchedulerService,
    TimeDepositChargeService,
    CISMiscellaneousService
  ]
})
export class RecurringDepositAccountModule { }
