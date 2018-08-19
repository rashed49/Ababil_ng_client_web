import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbabilNgSharedModule } from '../../../../../common/ababil-ng-shared-module.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FixedDepositAccountRoutes } from './fixed.deposit.account.routes';
import { AbabilLocationService } from '../../../../../services/location/service-api/location.service';
import { ChequeService } from '../../../../../services/cheque/service-api/cheque.service';
import { CISService } from '../../../../../services/cis/service-api/cis.service';
import { CommandService } from '../../../../../services/command/service-api/command.service';
import { ConfirmationService } from 'primeng/primeng';
import { CurrencyService } from '../../../../../services/currency/service-api/currency.service';
import { FixedDepositAccountService } from './../../../../../services/fixed-deposit-account/service-api/fixed.deposit.account.service';
import { NodeService } from '../../../../../demo/service/nodeservice';
import { NomineeService } from '../../../../../services/nominee/service-api/nominee.service';
import { ProductService } from '../../../../../services/product/service-api/product.service';
import { TranslateService } from '@ngx-translate/core';
import { ApprovalflowService } from '../../../../../services/approvalflow/service-api/approval.flow.service';
import { AccountService } from './../../../../../services/account/service-api/account.service';
import { FixedDepositAccountDetailComponent } from './detail/fixed.deposit.account.detail.component';
import { FixedDepositAccountFormComponent } from './form/fixed.deposit.account.form.component';
import { DemandDepositAccountService } from './../../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { FixedDepositProductService } from '../../../../../services/fixed-deposit-product/service-api/fixed.deposit.product.service';
import { FixedDepositAccountWithdrawalMappingComponent } from './withdrawal-mapping/fixed.deposit.account.withdrawal.mapping.component';
import { FixedDepositAccountWithdrawalTransectionComponent } from './withdrawal-transaction/fixed.deposit.account.withdrawal.transaction.component';
import { FixedDepositPrincipalWithdrawalAdviceService } from '../../../../../services/fixed-deposit-principal-withdrawal-advice/service-api/fixed.deposit.principal.withdrawal.advice.service';
import { DetailFixedDepositAccountWithdrawalMappingComponent } from './withdrawal-mapping/detail/detail.fixed.deposit.account.withdrawal.mapping.component';
import { EditFixedDepositAccountWithdrawalMappingComponent } from './withdrawal-mapping/edit/edit.fixed.deposit.account.withdrawal.mapping.component';
// import { DemandDepositProductService } from '../../../../../services/portfolio/demand-deposit/product/service-api/demand-deposit-product.service';
// import { AccountOpeningChannelPipe } from './../../../../../common/pipes/account.opening.channel.pipe';
import { KycService } from '../../../../../services/kyc/service-api/kyc.service';
import { FixedDepositAccountClosingFormComponent } from './fixed-deposit-close-account/fixed.deposit.account.closing.form.component';
import { AccountOperatorService } from '../../../../../services/account-operator/service-api/account.operator.service';
import { FixedDepositPrincipalWithdrawalTransactionService } from '../../../../../services/fixed-deposit-principal-withdrawal-transaction/service-api/fixed.deposit.principal.withdrawal.transaction.service';
import { TellerService } from '../../../../../services/teller/service-api/teller.service';
import { MatTabsModule } from '../../../../../../../node_modules/@angular/material/tabs';
import { CISMiscellaneousService } from '../../../../../services/cis/service-api/cis.misc.service';
import { TimeDepositChargeService } from '../../../../../services/time-deposit-charge/service-api/time.deposit.charge.service';


@NgModule({
  imports: [
    AbabilNgSharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(FixedDepositAccountRoutes),
    MatTabsModule
  ],
  declarations: [
    FixedDepositAccountDetailComponent,
    FixedDepositAccountFormComponent,
    FixedDepositAccountWithdrawalMappingComponent,
    FixedDepositAccountWithdrawalTransectionComponent,
    DetailFixedDepositAccountWithdrawalMappingComponent,
    EditFixedDepositAccountWithdrawalMappingComponent,
    // ImposeSpecialInstructionComponent,
    // SpecialInstructionComponent,
    // SpecialInstructionDetailComponent,
    // BankNoticeComponent,
    // BankNoticeDetailComponent,
    // BankNoticeFormComponent,
    // DemandDepositProductService,
    // AccountOpeningChannelPipe
    FixedDepositAccountClosingFormComponent
  ],
  providers: [
    AbabilLocationService,
    ChequeService,
    CISService,
    CommandService,
    CurrencyService,
    ConfirmationService,
    FixedDepositAccountService,
    DemandDepositAccountService,
    KycService,
    NodeService,
    NomineeService,
    ProductService,
    TranslateService,
    ApprovalflowService,
    AccountService,
    FixedDepositProductService,
    AccountOperatorService,
    TimeDepositChargeService,
    FixedDepositPrincipalWithdrawalAdviceService,
    AccountOperatorService,
    FixedDepositPrincipalWithdrawalTransactionService,
    TellerService,
    ChequeService,
    CISMiscellaneousService
  ]
})
export class FixedDepositAccountModule { }
