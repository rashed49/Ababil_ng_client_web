import { BankNoticeFormComponent } from './bank-notice/form/bank.notice.form.component';
import { BankNoticeDetailComponent } from './bank-notice/detail/bank-notice-detail/bank.notice.detail.component';
import { BankNoticeComponent } from './bank-notice/bank.notice.component';
import { NgModule } from '@angular/core';
import { AbabilNgSharedModule } from '../../../../common/ababil-ng-shared-module.module';
import { RouterModule } from '@angular/router';
import { DemandDepositAccountRoutes } from './demand.deposit.account.routes';
import { CISMiscellaneousService } from '../../../../services/cis/service-api/cis.misc.service';
import { AbabilLocationService } from '../../../../services/location/service-api/location.service';
import { ChequeService } from '../../../../services/cheque/service-api/cheque.service';
import { CISService } from '../../../../services/cis/service-api/cis.service';
import { CommandService } from '../../../../services/command/service-api/command.service';
import { ConfirmationService, TabMenuModule } from 'primeng/primeng';
import { CurrencyService } from '../../../../services/currency/service-api/currency.service';
import { DemandDepositAccountService } from '../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { DemandDepositProductService } from '../../../../services/demand-deposit-product/service-api/demand-deposit-product.service';
import { NodeService } from '../../../../demo/service/nodeservice';
import { NomineeService } from '../../../../services/nominee/service-api/nominee.service';
import { NotificationService } from '../../../../common/notification/notification.service';
import { ProductService } from '../../../../services/product/service-api/product.service';
import { SpecialInstructionService } from '../../../../services/special-instruction/service-api/special.instruction.service';
import { SpecialInstructionTypeService } from '../../../../services/special-instruction/service-api/special-instruction-type.service';
import { TranslateService } from '@ngx-translate/core';
import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';
import { BankNoticeService } from '../../../../services/bank-notice/service-api/bank.notice.service';
import { AccountService } from './../../../../services/account/service-api/account.service';

import { ChequeComponent } from './cheque/cheque.component';
import { ChequeDetailComponent } from './cheque/detail/cheque-detail/cheque.detail.component';
import { ChequeBookFormComponent } from './cheque/form/cheque-form/cheque.form.component';
import { CreateChequeBookFormComponent } from './cheque/form/cheque-form/create/create.cheque.form.component';
import { DemandDepositAccountDetailComponent } from './detail/demand.deposit.account.detail.component';
import { DemandDepositAccountFormComponent } from './form/demand.deposit.account.form.component';
import { ImposeSpecialInstructionComponent } from './special-instruction/form/impose-instruction/impose.special.instruction.component';
import { SpecialInstructionComponent } from './special-instruction/special-instruction.component'
import { SpecialInstructionDetailComponent } from './special-instruction/special-instruction-detail/special.instruction.detail.component';
import { SpecialProfitRateService } from '../../../../services/special-profit-rate/service-api/special.profit.rate.service';
import { AccountMinimumBalanceFormComponent } from './mimimum-balance/form/minimum.balance.form.component';
import { AccountClosingFormComponent } from './account-closing/form/account.closing.form.component';
import { AccountOperatorService } from '../../../../services/account-operator/service-api/account.operator.service';
import { KycService } from '../../../../services/kyc/service-api/kyc.service';
import { CommonConfigurationService } from '../../../../services/common-configurations/service-api/common.configurations.service';
import { DormantAccountReactivationFormComponent } from './dormant-account-reactivation/dormant.account.reactivation.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ChargeTableComponent } from '../../../../common/components/charge-component/charge.component';
import { GlAccountService } from '../../../../services/glaccount/service-api/gl.account.service';


@NgModule({
  imports: [
    AbabilNgSharedModule,
    RouterModule.forChild(DemandDepositAccountRoutes),
    MatTabsModule
  ],
  declarations: [
    ChequeBookFormComponent,
    ChequeDetailComponent,
    ChequeComponent,
    CreateChequeBookFormComponent,
    DemandDepositAccountDetailComponent,
    DemandDepositAccountFormComponent,
    ImposeSpecialInstructionComponent,
    SpecialInstructionComponent,
    SpecialInstructionDetailComponent,
    AccountMinimumBalanceFormComponent,
    BankNoticeComponent,
    BankNoticeDetailComponent,
    BankNoticeFormComponent,
    AccountClosingFormComponent,
    DormantAccountReactivationFormComponent
  ],
  providers: [
    AbabilLocationService,
    ChequeService,
    CISService,
    CommandService,
    CurrencyService,
    ConfirmationService,
    DemandDepositAccountService,
    DemandDepositProductService,
    KycService,
    NodeService,
    NomineeService,
    ProductService,
    SpecialInstructionService,
    SpecialInstructionTypeService,
    SpecialProfitRateService,
    TranslateService,
    ApprovalflowService,
    BankNoticeService,
    AccountService,
    AccountOperatorService,
    CommonConfigurationService,
    GlAccountService,
    CISMiscellaneousService
  ]
})
export class DemandDepositAccountModule { }
