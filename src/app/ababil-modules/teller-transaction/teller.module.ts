import { NgModule } from '@angular/core';
import { AbabilNgSharedModule } from '../../common/ababil-ng-shared-module.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TellerComponent } from './teller.component';
import { TellerDashboardComponent } from './dashboard/teller.dashboard.component';
import { TellerRoutes } from './teller.route';
import { TellerService } from '../../services/teller/service-api/teller.service';
import { CashDepositComponent } from '../teller-transaction/cash-deposit/cash.deposit.component';
import { CurrencyService } from '../../services/currency/service-api/currency.service';
import { CashWithdrawComponent } from './cash-withdraw/cash.withdraw.component';
import { DemandDepositAccountService } from '../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { CashTransferComponent } from './cash-transfer/cash.transfer.component';
import { DenominationBalanceService } from '../../services/teller/service-api/denomination.balance.service';
import { ChartModule } from 'primeng/components/chart/chart';
import { GlAccountService } from '../../services/glaccount/service-api/gl.account.service';
import { ExchangeRateService } from '../../services/currency/service-api/exchange.rate.service';
import { CommonConfigurationService } from '../../services/common-configurations/service-api/common.configurations.service';
import { BankService } from '../../services/bank/service-api/bank.service';
import { AccountService } from '../../services/account/service-api/account.service';
import { CISService } from '../../services/cis/service-api/cis.service';
import { ConfirmationService } from 'primeng/api';
import { AbabilLocationService } from '../../services/location/service-api/location.service';
import { NomineeService } from '../../services/nominee/service-api/nominee.service';
import { ProductService } from '../../services/product/service-api/product.service';
import { DemandDepositProductService } from '../../services/demand-deposit-product/service-api/demand-deposit-product.service';
import { BankNoticeService } from '../../services/bank-notice/service-api/bank.notice.service';
import { SpecialInstructionService } from '../../services/special-instruction/service-api/special.instruction.service';
import { SpecialInstructionTypeService } from '../../services/special-instruction/service-api/special-instruction-type.service';
import { AccountOperatorService } from '../../services/account-operator/service-api/account.operator.service';
import { FixedDepositAccountService } from '../../services/fixed-deposit-account/service-api/fixed.deposit.account.service';
import { RecurringDepositAccountService } from '../../services/recurring-deposit-account/service-api/recurring.deposit.account.service';
import { BearerInformationComponent } from './bearer-information/bearer.information.component';
import { TabMenuModule } from 'primeng/primeng';
import { SidebarModule } from 'primeng/sidebar';
import { AccountNumberFormatter } from '../../common/components/AccountNumberFormatter/account.number.formatter.component';
import { ChequeService } from '../../services/cheque/service-api/cheque.service';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { TellerActivityLog } from './teller-activity-log/teller.activity.log.component';
import {ProgressBarModule} from 'primeng/progressbar';

@NgModule({
  imports: [
    RouterModule.forChild(TellerRoutes),
    AbabilNgSharedModule,
    ChartModule,
    TabMenuModule,
    SidebarModule,
    ConfirmDialogModule,
    ProgressBarModule
  ],
  declarations: [
    TellerComponent,
    TellerDashboardComponent,
    CashDepositComponent,
    CashWithdrawComponent,
    CashTransferComponent,
    BearerInformationComponent,
    AccountNumberFormatter,
    TellerActivityLog
  ],
  providers: [
    TranslateService,
    TellerService,
    CurrencyService,
    DemandDepositAccountService,
    DenominationBalanceService,
    GlAccountService,
    ExchangeRateService,
    BankService,
    CommonConfigurationService,
    AccountService,
    CISService,
    ConfirmationService,
    AbabilLocationService,
    NomineeService,
    ProductService,
    DemandDepositProductService,
    BankNoticeService,
    SpecialInstructionService,
    SpecialInstructionTypeService,
    AccountOperatorService,
    FixedDepositAccountService,
    RecurringDepositAccountService,
    ChequeService,
  ],
})
export class TellerModule {

}
