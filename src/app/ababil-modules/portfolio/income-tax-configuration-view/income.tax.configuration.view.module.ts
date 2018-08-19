import { NgModule } from '@angular/core';
import { AbabilNgSharedModule } from './../../../common/ababil-ng-shared-module.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IncomeTaxConfigurationViewRoutes } from './income.tax.configuration.view.routes';
import { IncomeTaxConfigurationViewComponent } from './income.tax.configuration.view.component';
import { MatTabsModule } from '../../../../../node_modules/@angular/material/tabs';
import { IncomeTaxConfigurationService } from '../../../services/income-tax/service-api/income.tax.service';
import { FormsModule, ReactiveFormsModule } from '../../../../../node_modules/@angular/forms';
import { ConfirmationService } from "primeng/api";
import { AccountService } from '../../../services/account/service-api/account.service';
import { CISService } from '../../../services/cis/service-api/cis.service';
import { DemandDepositAccountService } from '../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { RecurringDepositAccountService } from '../../../services/recurring-deposit-account/service-api/recurring.deposit.account.service';
import { FixedDepositAccountService } from '../../../services/fixed-deposit-account/service-api/fixed.deposit.account.service';
import { AbabilLocationService } from '../../../services/location/service-api/location.service';
import { ProductService } from '../../../services/product/service-api/product.service';
import { DemandDepositProductService } from '../../../services/demand-deposit-product/service-api/demand-deposit-product.service';
import { FixedDepositProductService } from '../../../services/fixed-deposit-product/service-api/fixed.deposit.product.service';
import { RecurringDepositProductService } from '../../../services/recurring-deposit-product/service-api/recurring.deposit.product.service';
import { GlAccountService } from '../../../services/glaccount/service-api/gl.account.service';
import { ExchangeRateService } from '../../../services/currency/service-api/exchange.rate.service';
import { CommonConfigurationService } from '../../../services/common-configurations/service-api/common.configurations.service';
import { NomineeService } from '../../../services/nominee/service-api/nominee.service';
import { BankNoticeService } from '../../../services/bank-notice/service-api/bank.notice.service';
import { SpecialInstructionService } from '../../../services/special-instruction/service-api/special.instruction.service';
import { SpecialInstructionTypeService } from '../../../services/special-instruction/service-api/special-instruction-type.service';
import { AccountOperatorService } from '../../../services/account-operator/service-api/account.operator.service';
import { ChequeService } from '../../../services/cheque/service-api/cheque.service';

@NgModule({
  imports: [
    AbabilNgSharedModule,
    CommonModule,
    RouterModule.forChild(IncomeTaxConfigurationViewRoutes),
    MatTabsModule

  ],
  declarations: [
    IncomeTaxConfigurationViewComponent

  ],
  providers: [
    IncomeTaxConfigurationService,
    ConfirmationService,
    AccountService,
    CISService,
    DemandDepositAccountService,
    RecurringDepositAccountService,
    FixedDepositAccountService,
    AbabilLocationService,
    ProductService,
    DemandDepositProductService,
    FixedDepositProductService,
    RecurringDepositProductService,
    GlAccountService,
    ExchangeRateService,
    CommonConfigurationService,
    NomineeService,
    BankNoticeService,
    SpecialInstructionService,
    SpecialInstructionTypeService,
    AccountOperatorService,
    ChequeService
  ]
})
export class IncomeTaxConfigurationViewModule { }