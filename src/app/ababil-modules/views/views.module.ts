import { JointCustomerViewComponent } from './detail-templates/joint-customer/joint.customer.view.component';
import { FatcaViewComponent } from './detail-templates/fatca/fatca.view.component';
import { BankService } from './../../services/bank/service-api/bank.service';
import { GlAccountViewComponent } from './detail-templates/gl-account/gl.account.view.component';
import { OrganizationOwnerViewComponent } from './detail-templates/organization-customer/organization-owner/organization.owner.view.component';
import { OrganizationService } from './../../services/cis/service-api/organization.service';
import { OrganizationCustomerViewComponent } from './detail-templates/organization-customer/organization.customer.view.component';
import { PersonalCustomerViewComponent } from './detail-templates/personal-customer/personal.customer.view.component';
import { ViewsComponent } from './views.component';
import { ImageUploadService } from './../../services/cis/service-api/image.upload.service';
import { CISMiscellaneousService } from './../../services/cis/service-api/cis.misc.service';
import { CISService } from './../../services/cis/service-api/cis.service';
import { ViewsRoutes } from './views.routes';
import { NgModule } from '@angular/core';
import { AbabilNgSharedModule } from '../../common/ababil-ng-shared-module.module';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApprovalflowService } from '../../services/approvalflow/service-api/approval.flow.service';
import { AbabilLocationService } from '../../services/location/service-api/location.service';
import { DemandDepositProductViewComponent } from './detail-templates/demand-deposit-product/demand.deposit.product.view.component';
import { DemandDepositProductService } from '../../services/demand-deposit-product/service-api/demand-deposit-product.service';
import { DemandDepositAccountViewComponent } from './detail-templates/demand-deposit-account/demand.deposit.account.view.component';
import { TransactionProfileViewComponent } from './detail-templates/demand-deposit-account/transaction-profile/transaction.profile.view.component';
import { CurrencyService } from '../../services/currency/service-api/currency.service';
import { DemandDepositAccountService } from '../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { NomineeService } from '../../services/nominee/service-api/nominee.service';
import { ProductService } from '../../services/product/service-api/product.service';
import { TransactionProfileService } from '../../services/transaction-profile/service-api/transaction-profile.service';
import { DocumentService } from '../../services/document/service-api/document.service';
import { GlProfitRateViewComponent } from './detail-templates/gl-account/gl-account-profit-rate/gl.account.profit.rate.view.component';
import { SubLedgerViewComponent } from './detail-templates/gl-account/sub-ledger/sub.ledger.view.component'

import { GlAccountLimitService } from '../../services/glaccount/service-api/gl.account.limit.service';
import { GlAccountLimitConfigurationViewComponent } from './detail-templates/gl-account/limit-configuration/gl.account.limit.configuration.view.component';

import { FixedDepositAccountViewComponent } from './detail-templates/fixed-deposit-account/fixed.deposit.account.view.component';
import { FixedDepositAccountService } from '../../services/fixed-deposit-account/service-api/fixed.deposit.account.service';
import { NomineeViewComponent } from './detail-templates/nominee/nominee.view.component';
import { AccountService } from '../../services/account/service-api/account.service';
import { SignatureViewComponent } from './detail-templates/signature/signature.view.component';
import { AccountOperatorService } from '../../services/account-operator/service-api/account.operator.service';
import { RecurringDepositAccountViewComponent } from './detail-templates/recurring-deposit-account/recurring.deposit.account.view.component';
import { ConfirmationService } from 'primeng/primeng';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { RecurringDepositAccountService } from '../../services/recurring-deposit-account/service-api/recurring.deposit.account.service';
import { RecurringDepositProductService } from '../../services/recurring-deposit-product/service-api/recurring.deposit.product.service';

import { TellerViewComponent } from './detail-templates/teller/teller.view.component';
import { TellerAllocationViewComponent } from './detail-templates/teller-allocation/teller.allocation.view.component';
import { TellerAllocationService } from '../../services/teller/service-api/teller.allocation.service';

import { FixedDepositProductViewComponent } from './detail-templates/fixed-deposit-product/fixed.deposit.product.view.component';
import { FixedDepositProductService } from '../../services/fixed-deposit-product/service-api/fixed.deposit.product.service';
import { ProfitRateViewComponent } from './detail-templates/profit-rate/profit.rate.view.component';
import { ChequePrefixViewComponent } from './detail-templates/cheque-prefix/cheque.prefix.view.component';
import { RecurringDepositProductViewComponent } from './detail-templates/recurring-deposit-product/recurring.deposit.product.view.component';
import { GeneralLedgerMappingViewComponent } from './detail-templates/general-ledger-mapping/general.ledger.mapping.view.component';
import { ProductGeneralLedgerAssignmentService } from "../../services/product-general-ledger-assignment/service-api/product-general-ledger-assignment.service";
import { ChequeBookSizeViewComponent } from './detail-templates/cheque-book-size/cheque.book.size.view.component';
import { ChequeBookCreateViewComponent } from './detail-templates/cheque-book/cheque.book.view.component';
import { ChequeService } from '../../services/cheque/service-api/cheque.service';
import { BankNoticeCreateViewComponent } from './detail-templates/bank-notice/bank.notice.view.component';
import { GlAccountService } from '../../services/glaccount/service-api/gl.account.service';
import { MinimumBalanceViewComponent } from './detail-templates/minimum-balance/minimum.balance.view.component';
import { SpecialProfitRateViewComponent } from './detail-templates/special-profit-rate/special.profit.rate.view.component';
import { ShortIndividualViewComponent } from './detail-templates/short-individual-form-view/view.short.individual.form.component';
import { SpecialProfitRateService } from '../../services/special-profit-rate/service-api/special.profit.rate.service';
import { SubjectIndividualViewComponent } from './detail-templates/subject-individual/subject.individual.form.view.component';
import { IndividualFormViewComponent } from './detail-templates/individual-form/individual.form.view.component';
import { SpecialInstructionViewComponent } from './detail-templates/special-instruction/special.instruction.view.component';
import { SpecialInstructionService } from '../../services/special-instruction/service-api/special.instruction.service';
import { SpecialInstructionTypeService } from '../../services/special-instruction/service-api/special-instruction-type.service';
import { DocumentViewComponent } from './detail-templates/document/document.view.component';
import { FatcaDescriptionService } from '../../services/cis/service-api/fatca.description.service';
import { MatTabsModule } from '@angular/material/tabs';
import { InlandRemittanceViewLotComponent } from './detail-templates/inland-remittance/lot/inland.remittance.lot.view.component';
import { InlandRemittanceLotService } from '../../services/inland-remittance/lot/service-api/inland.remittance.lot.service';
import { InlandRemittanceIssueViewComponent } from './detail-templates/inland-remittance/issue/issue-view/inland.remittance.issue.view.component';
import { InlandRemittanceReissueViewComponent } from './detail-templates/inland-remittance/issue/reissue-veiw/inland.remittance.reissue.view.component';
import { InlandRemittanceIssuePaymentViewComponent } from './detail-templates/inland-remittance/issue/payment-view/inland.remittance.issue.payment.view.component';
import { CashDepositViewComponent } from './detail-templates/teller-transaction/cash-deposit/cash.deposit.view.component';
import { ExchangeRateService } from '../../services/currency/service-api/exchange.rate.service';
import { CommonConfigurationService } from '../../services/common-configurations/service-api/common.configurations.service';
import { TellerService } from '../../services/teller/service-api/teller.service';
import { BankNoticeService } from '../../services/bank-notice/service-api/bank.notice.service';
import { CashWithdrawViewComponent } from './detail-templates/teller-transaction/cash-withdraw/cash.withdraw.view.component';
import { DemandDepositAccountClosingViewComponent } from './detail-templates/demand-deposit-account-close/demand.deposit.account.close.view.component';
import { RecurringDepositAccountClosingViewComponent } from './detail-templates/recurring-deposit-close-account/recurring.deposit.account.close.view.component';
import { FixedDepositAccountClosingViewComponent } from './detail-templates/fixed-deposit-close-account/fixed.deposit.account.close.view.component';
import { DormantAccountReactivationViewComponent } from './detail-templates/dormant-account-reactivation/dormant.account.reactivation.view.component';
import { InlandRemittanceChargeConfigurationViewComponent } from './detail-templates/inland-remittance/charge/inland.remittance.charge.configuration.view.component';
import { InlandRemittanceChargeConfigurationDetailViewComponent } from './detail-templates/inland-remittance/charge/detail/inland.remittance.charge.configuration.detail.view.component';
import { InlandRemittanceChargeService } from '../../services/inland-remittance/charge/service-api/inland.remittance.charge.service';
import { FixedDepositWithdrawalAdviceViewComponent } from './detail-templates/fixed-deposit-withdrawal-advice/fixed.deposit.withdrawal.advice.view.component';
import { AccountFreezeViewComponent } from './detail-templates/account-freeze/account.freeze.view.component';
import { FixedDepositWithdrawalTransactionViewComponent } from './detail-templates/fixed-deposit-withdrawal-transaction/fixed.deposit.withdrawal.transaction.view.component';
import { FixedDepositPrincipalWithdrawalAdviceService } from '../../services/fixed-deposit-principal-withdrawal-advice/service-api/fixed.deposit.principal.withdrawal.advice.service';
import { ServiceProviderViewComponent } from './detail-templates/service-provider/service.provider.view.component';
import { DemandDepositChargeConfigurationViewComponent } from './detail-templates/demand-deposit-charge/demand.deposit.charge.configuration.view.component';
import { DemandDepositChargeConfigurationDetailViewComponent } from './detail-templates/demand-deposit-charge/detail/demand.deposit.charge.configuration.detail.view.component';
import { DemandDepositChargeService } from '../../services/demand-deposit-charge/service-api/demand.deposit.charge.service';
import { TimeDepositLienViewComponent } from '../../ababil-modules/views/detail-templates/time-deposit-lien/time.deposit.lien.view.component';
import { TimeDepositLienReferenceTypeService } from '../../services/time-deposit-lien-reference-type/service-api/time.deposit.lien.reference.type.service';
import { TimeDepositChargeConfigurationViewComponent } from './detail-templates/time-deposit-charge/time.deposit.charge.configuration.view.component';
import { TimeDepositChargeConfigurationDetailViewComponent } from './detail-templates/time-deposit-charge/detail/time.deposit.charge.configuration.detail.view.component';
import { TimeDepositChargeService } from '../../services/time-deposit-charge/service-api/time.deposit.charge.service';



@NgModule({
    imports: [
        AbabilNgSharedModule,
        RouterModule.forChild(ViewsRoutes),
        ScrollPanelModule,
        MatTabsModule
    ],
    declarations: [
        ViewsComponent,
        DocumentViewComponent,
        PersonalCustomerViewComponent,
        DemandDepositProductViewComponent,
        DemandDepositAccountViewComponent,
        GlAccountLimitConfigurationViewComponent,
        PersonalCustomerViewComponent,
        TransactionProfileViewComponent,
        PersonalCustomerViewComponent,
        OrganizationCustomerViewComponent,
        OrganizationOwnerViewComponent,
        GlAccountViewComponent,
        GlProfitRateViewComponent,
        SubLedgerViewComponent,
        FixedDepositAccountViewComponent,
        NomineeViewComponent,
        SignatureViewComponent,
        RecurringDepositAccountViewComponent,
        TellerViewComponent,
        TellerAllocationViewComponent,
        FixedDepositProductViewComponent,
        ProfitRateViewComponent,
        RecurringDepositProductViewComponent,
        GeneralLedgerMappingViewComponent,
        ChequePrefixViewComponent,
        ChequeBookSizeViewComponent,
        ChequeBookCreateViewComponent,
        BankNoticeCreateViewComponent,
        MinimumBalanceViewComponent,
        SpecialProfitRateViewComponent,
        ShortIndividualViewComponent,
        SubjectIndividualViewComponent,
        IndividualFormViewComponent,
        SpecialInstructionViewComponent,
        FatcaViewComponent,
        DocumentViewComponent,
        JointCustomerViewComponent,
        InlandRemittanceChargeConfigurationViewComponent,
        InlandRemittanceChargeConfigurationDetailViewComponent,
        InlandRemittanceViewLotComponent,
        InlandRemittanceIssueViewComponent,
        InlandRemittanceReissueViewComponent,
        InlandRemittanceIssuePaymentViewComponent,
        JointCustomerViewComponent,
        CashDepositViewComponent,
        CashWithdrawViewComponent,
        DemandDepositAccountClosingViewComponent,
        DormantAccountReactivationViewComponent,
        FixedDepositWithdrawalAdviceViewComponent,
        RecurringDepositAccountClosingViewComponent,
        FixedDepositAccountClosingViewComponent,
        DormantAccountReactivationViewComponent,
        AccountFreezeViewComponent,
        FixedDepositWithdrawalTransactionViewComponent,
        ServiceProviderViewComponent,
        DemandDepositChargeConfigurationViewComponent,
        DemandDepositChargeConfigurationDetailViewComponent,
        TimeDepositLienViewComponent,
        TimeDepositChargeConfigurationDetailViewComponent,
        TimeDepositChargeConfigurationViewComponent
    ],
    providers: [
        BankService,
        TranslateService,
        ApprovalflowService,
        AbabilLocationService,
        CISService,
        DemandDepositProductService,
        CISMiscellaneousService,
        CurrencyService,
        DemandDepositAccountService,
        ImageUploadService,
        NomineeService,
        ProductService,
        TransactionProfileService,
        OrganizationService,
        DocumentService,
        BankService,
        GlAccountService,
        GlAccountLimitService,
        FixedDepositAccountService,
        AccountService,
        AccountOperatorService,
        ConfirmationService,
        RecurringDepositAccountService,
        RecurringDepositProductService,
        TellerAllocationService,
        FixedDepositProductService,
        ProductGeneralLedgerAssignmentService,
        ChequeService,
        SpecialProfitRateService,
        SpecialInstructionService,
        SpecialInstructionTypeService,
        FatcaDescriptionService,
        InlandRemittanceLotService,
        ExchangeRateService,
        CommonConfigurationService,
        TellerService,
        BankNoticeService,
        FixedDepositPrincipalWithdrawalAdviceService,
        InlandRemittanceChargeService,
        DemandDepositChargeService,
        TimeDepositLienReferenceTypeService,
        TimeDepositChargeService
    ]
})
export class ViewsModule {
}
