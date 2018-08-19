import { JointCustomerViewComponent } from './detail-templates/joint-customer/joint.customer.view.component';
import { environment } from './../../../environments/environment';
import { GlAccountViewComponent } from './detail-templates/gl-account/gl.account.view.component';
import { OrganizationOwnerViewComponent } from './detail-templates/organization-customer/organization-owner/organization.owner.view.component';
import { OrganizationCustomerViewComponent } from './detail-templates/organization-customer/organization.customer.view.component';
import { PersonalCustomerViewComponent } from './detail-templates/personal-customer/personal.customer.view.component';
import { Routes } from '@angular/router';
import { DemandDepositProductViewComponent } from './detail-templates/demand-deposit-product/demand.deposit.product.view.component';
import { DemandDepositAccountViewComponent } from './detail-templates/demand-deposit-account/demand.deposit.account.view.component';
import { TransactionProfileViewComponent } from './detail-templates/demand-deposit-account/transaction-profile/transaction.profile.view.component';
import { ViewsComponent } from './views.component';
import { DocumentViewComponent } from './detail-templates/document/document.view.component';
import { FixedDepositAccountViewComponent } from './detail-templates/fixed-deposit-account/fixed.deposit.account.view.component';
import { FixedDepositProductViewComponent } from './detail-templates/fixed-deposit-product/fixed.deposit.product.view.component';
import { NomineeViewComponent } from './detail-templates/nominee/nominee.view.component';
import { SignatureViewComponent } from './detail-templates/signature/signature.view.component';
import { RecurringDepositAccountViewComponent } from './detail-templates/recurring-deposit-account/recurring.deposit.account.view.component';

import { TellerViewComponent } from './detail-templates/teller/teller.view.component';
import { TellerAllocationViewComponent } from './detail-templates/teller-allocation/teller.allocation.view.component';

import { ChequePrefixViewComponent } from './detail-templates/cheque-prefix/cheque.prefix.view.component';
import { ChequeBookSizeViewComponent } from './detail-templates/cheque-book-size/cheque.book.size.view.component';
import { ProfitRateViewComponent } from './detail-templates/profit-rate/profit.rate.view.component';
import { RecurringDepositProductViewComponent } from './detail-templates/recurring-deposit-product/recurring.deposit.product.view.component';
import { GeneralLedgerMappingViewComponent } from './detail-templates/general-ledger-mapping/general.ledger.mapping.view.component';
import { ChequeBookCreateViewComponent } from './detail-templates/cheque-book/cheque.book.view.component';
import { BankNoticeCreateViewComponent } from './detail-templates/bank-notice/bank.notice.view.component';



import { GlProfitRateViewComponent } from './detail-templates/gl-account/gl-account-profit-rate/gl.account.profit.rate.view.component'
import { SubLedgerViewComponent } from './detail-templates/gl-account/sub-ledger/sub.ledger.view.component'
import { GlAccountLimitConfigurationViewComponent } from './detail-templates/gl-account/limit-configuration/gl.account.limit.configuration.view.component';
import { SpecialProfitRateViewComponent } from './detail-templates/special-profit-rate/special.profit.rate.view.component';
import { MinimumBalanceViewComponent } from './detail-templates/minimum-balance/minimum.balance.view.component';
import { SpecialInstructionViewComponent } from './detail-templates/special-instruction/special.instruction.view.component';
import { SubjectIndividualViewComponent } from './detail-templates/subject-individual/subject.individual.form.view.component';
import { InlandRemittanceViewLotComponent } from './detail-templates/inland-remittance/lot/inland.remittance.lot.view.component';
import { InlandRemittanceIssueViewComponent } from './detail-templates/inland-remittance/issue/issue-view/inland.remittance.issue.view.component';
import { InlandRemittanceReissueViewComponent } from './detail-templates/inland-remittance/issue/reissue-veiw/inland.remittance.reissue.view.component';
import { InlandRemittanceIssuePaymentViewComponent } from './detail-templates/inland-remittance/issue/payment-view/inland.remittance.issue.payment.view.component';
import { CashDepositViewComponent } from './detail-templates/teller-transaction/cash-deposit/cash.deposit.view.component';
import { CashWithdrawViewComponent } from './detail-templates/teller-transaction/cash-withdraw/cash.withdraw.view.component';
import { DemandDepositAccountClosingViewComponent } from './detail-templates/demand-deposit-account-close/demand.deposit.account.close.view.component';
import { FixedDepositAccountClosingViewComponent } from './detail-templates/fixed-deposit-close-account/fixed.deposit.account.close.view.component';
import { RecurringDepositAccountClosingViewComponent } from './detail-templates/recurring-deposit-close-account/recurring.deposit.account.close.view.component';
import { DormantAccountReactivationViewComponent } from './detail-templates/dormant-account-reactivation/dormant.account.reactivation.view.component';
import { InlandRemittanceChargeConfigurationViewComponent } from './detail-templates/inland-remittance/charge/inland.remittance.charge.configuration.view.component';
import { InlandRemittanceChargeConfigurationDetailViewComponent } from './detail-templates/inland-remittance/charge/detail/inland.remittance.charge.configuration.detail.view.component';
import { FixedDepositWithdrawalAdviceViewComponent } from './detail-templates/fixed-deposit-withdrawal-advice/fixed.deposit.withdrawal.advice.view.component';
import { AccountFreezeViewComponent } from './detail-templates/account-freeze/account.freeze.view.component';
import { FixedDepositWithdrawalTransactionViewComponent } from './detail-templates/fixed-deposit-withdrawal-transaction/fixed.deposit.withdrawal.transaction.view.component';
import { ServiceProviderViewComponent } from './detail-templates/service-provider/service.provider.view.component';
import { DemandDepositChargeConfigurationViewComponent } from './detail-templates/demand-deposit-charge/demand.deposit.charge.configuration.view.component';
import { DemandDepositChargeConfigurationDetailViewComponent } from './detail-templates/demand-deposit-charge/detail/demand.deposit.charge.configuration.detail.view.component';
import { TimeDepositLienViewComponent } from '../../ababil-modules/views/detail-templates/time-deposit-lien/time.deposit.lien.view.component';
import { TimeDepositChargeConfigurationViewComponent } from './detail-templates/time-deposit-charge/time.deposit.charge.configuration.view.component';
import { TimeDepositChargeConfigurationDetailViewComponent } from './detail-templates/time-deposit-charge/detail/time.deposit.charge.configuration.detail.view.component';


let deploymentViewRoutes = [
  { path: '', component: ViewsComponent },
  { path: 'personal-customer', component: PersonalCustomerViewComponent },
  { path: 'subject-individual', component: SubjectIndividualViewComponent },
  { path: 'gl-account', component: GlAccountViewComponent },
  { path: 'gl-account/limit/detail/:id', component: GlAccountLimitConfigurationViewComponent },
  { path: 'gl-account/profit-rate/:id', component: GlProfitRateViewComponent },
  { path: 'gl-account/sub-ledger/:id', component: SubLedgerViewComponent },

  { path: 'demand-deposit-product', component: DemandDepositProductViewComponent },
  { path: 'demand-deposit-product/profit-rate', component: ProfitRateViewComponent },
  { path: 'demand-deposit-product/cheque-prefix', component: ChequePrefixViewComponent },
  { path: 'demand-deposit-product/cheque-book-size', component: ChequeBookSizeViewComponent },
  { path: 'demand-deposit-product/general-ledger-mapping', component: GeneralLedgerMappingViewComponent },
  { path: 'demand-deposit-account', component: DemandDepositAccountViewComponent },
  { path: 'demand-deposit-account/special-profit-rate', component: SpecialProfitRateViewComponent },
  { path: 'demand-deposit-account/minimum-balance', component: MinimumBalanceViewComponent },
  { path: 'demand-deposit-account/special-instruction', component: SpecialInstructionViewComponent },
  { path: 'demand-deposit-charge-configuration', component: DemandDepositChargeConfigurationViewComponent },
  { path: 'demand-deposit-charge-configuration/:id/detail', component: DemandDepositChargeConfigurationDetailViewComponent },
  { path: 'time-deposit-charge-configuration', component: TimeDepositChargeConfigurationViewComponent },
  { path: 'time-deposit-charge-configuration/:id/detail', component: TimeDepositChargeConfigurationDetailViewComponent },
  { path: 'fixed-deposit-account', component: FixedDepositAccountViewComponent },
  { path: 'fixed-deposit-product', component: FixedDepositProductViewComponent },
  { path: 'fixed-deposit-product/profit-rate', component: ProfitRateViewComponent },
  { path: 'fixed-deposit-product/general-ledger-mapping', component: GeneralLedgerMappingViewComponent },
  { path: 'recurring-deposit-product', component: RecurringDepositProductViewComponent },
  { path: 'recurring-deposit-product/profit-rate', component: ProfitRateViewComponent },
  { path: 'recurring-deposit-product/general-ledger-mapping', component: GeneralLedgerMappingViewComponent },
  { path: 'recurring-deposit-account', component: RecurringDepositAccountViewComponent },
  { path: 'fixed-deposit-account/nominee/:id', component: NomineeViewComponent },
  { path: 'fixed-deposit-account/signature', component: SignatureViewComponent },
  { path: 'demand-deposit-account/signature', component: SignatureViewComponent },
  { path: 'recurring-deposit-account/nominee/:id', component: NomineeViewComponent },
  { path: 'recurring-deposit-account/signature', component: SignatureViewComponent },
  { path: 'demand-deposit-account/transaction-profile/:id', component: TransactionProfileViewComponent },
  { path: 'organization-customer', component: OrganizationCustomerViewComponent },
  { path: 'organization', component: OrganizationOwnerViewComponent },
  { path: 'document-view', component: DocumentViewComponent },
  { path: 'gl-account', component: GlAccountViewComponent },
  { path: 'cheque-book', component: ChequeBookCreateViewComponent },
  { path: 'bank-notice', component: BankNoticeCreateViewComponent },
  { path: 'teller', component: TellerViewComponent },
  { path: 'teller-allocation', component: TellerAllocationViewComponent },
  { path: 'joint-customer', component: JointCustomerViewComponent },
  { path: 'teller-transaction/cash-deposit', component: CashDepositViewComponent },
  { path: 'teller-transaction/cash-withdraw', component: CashWithdrawViewComponent },
  { path: 'teller-transaction/:tellerId/cash-withdraw/:voucherNumber', component: CashWithdrawViewComponent },
  { path: 'teller-transaction/:tellerId/cash-deposit/:voucherNumber', component: CashDepositViewComponent },
  { path: 'inland-remittance-charge-configuration', component: InlandRemittanceChargeConfigurationViewComponent },
  { path: 'inland-remittance-charge-configuration/:id/detail', component: InlandRemittanceChargeConfigurationDetailViewComponent },
  { path: 'lot-view', component: InlandRemittanceViewLotComponent },
  { path: 'issue-view', component: InlandRemittanceIssueViewComponent },
  { path: 'reissue-view', component: InlandRemittanceReissueViewComponent },
  { path: 'payment-view', component: InlandRemittanceIssuePaymentViewComponent },
  { path: 'demand-deposit-account/close', component: DemandDepositAccountClosingViewComponent },
  { path: 'fixed-deposit-account/close', component: FixedDepositAccountClosingViewComponent },
  { path: 'recurring-deposit-account/close', component: RecurringDepositAccountClosingViewComponent },
  { path: 'demand-deposit-account/dorment-account-reactivation', component: DormantAccountReactivationViewComponent },
  { path: 'teller-transaction/cash-withdraw', component: CashWithdrawViewComponent },
  { path: 'teller-transaction/:tellerId/cash-withdraw/:voucherNumber', component: CashWithdrawViewComponent },
  { path: 'teller-transaction/:tellerId/cash-deposit/:voucherNumber', component: CashDepositViewComponent },
  { path: 'lot-view', component: InlandRemittanceViewLotComponent },
  { path: 'issue-view', component: InlandRemittanceIssueViewComponent },
  { path: 'reissue-view', component: InlandRemittanceReissueViewComponent },
  { path: 'payment-view', component: InlandRemittanceIssuePaymentViewComponent },
  { path: 'demand-deposit-account/close', component: DemandDepositAccountClosingViewComponent },
  { path: 'demand-deposit-account/dorment-account-reactivation', component: DormantAccountReactivationViewComponent },
  { path: 'withdrawal-advice-view', component: FixedDepositWithdrawalAdviceViewComponent },
  { path: 'fixed-deposit-account/close', component: FixedDepositAccountClosingViewComponent },
  { path: 'recurring-deposit-account/close', component: RecurringDepositAccountClosingViewComponent },
  { path: 'demand-deposit-account/dorment-account-reactivation', component: DormantAccountReactivationViewComponent },
  { path: 'account-freeze', component: AccountFreezeViewComponent },
  { path: 'withdrawal-transaction-view', component: FixedDepositWithdrawalTransactionViewComponent },
  { path: 'service-provider', component: ServiceProviderViewComponent },
  { path: 'time-deposit-lien', component: TimeDepositLienViewComponent }

];

let developmentViewRoutes = [
  { path: '', component: ViewsComponent },
  { path: 'gl-account', component: GlAccountViewComponent },
  { path: 'gl-account/limit/detail/:id', component: GlAccountLimitConfigurationViewComponent },
  { path: 'gl-account/profit-rate/:id', component: GlProfitRateViewComponent },
  { path: 'gl-account/sub-ledger/:id', component: SubLedgerViewComponent },
];

export const ViewsRoutes: Routes = environment.auth === 'LEGACY-ABABIL' ? developmentViewRoutes : deploymentViewRoutes;
