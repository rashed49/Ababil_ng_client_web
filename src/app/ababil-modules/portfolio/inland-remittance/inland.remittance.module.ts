import { NgModule } from "@angular/core";
import { AbabilNgSharedModule } from "../../../common/ababil-ng-shared-module.module";
import { RouterModule } from "@angular/router";
import { InlandRemittanceRoutes } from "./inland.remittance.routes";
import { MatMenuModule } from '@angular/material/menu';

import { CreateLotComponent } from "./lot-list/create/create.inland.remittance.lot.component";
import { LotListComponent } from "./lot-list/inland.remittance.lot.list.component";
import { InstrumentListComponent } from "./instrument-list/inland.remittance.instrument.list.component";
import { IssueListComponent } from "./issue-list/inland.remittance.issue.list.component";
import { CreateIssueComponent } from "./issue-list/create/create.inland.remittance.issue.component";
import { DestroyInstrumentComponent } from "./instrument-list/destroy/destroy.inland.remittance.instrument.component";
import { LostInlandRemittanceIssueComponent } from "./issue-list/issue-lost/lost.inland.remittance.issue.component";
import { PaymentIssueComponent } from "./issue-list/issue-payment/payment.inland.remittance.issue.component";
import { RefundIssueComponent } from "./issue-list/issue-refund/refund.inland.remittance.issue.component";
import { ViewIssueComponent } from "./issue-list/issue-view/view.inland.remittance.issue.component";

import { ConfirmationService } from "primeng/api";
import { InlandRemittanceIssueService } from "../../../services/inland-remittance/issue/service-api/inland.remittance.issue.service";
import { InlandRemittanceInstrumentService } from "../../../services/inland-remittance/instrument/service-api/inland.remittance.instrument.service";
import { InlandRemittanceLotService } from "../../../services/inland-remittance/lot/service-api/inland.remittance.lot.service";
import { InlandRemittanceChargeService } from "../../../services/inland-remittance/charge/service-api/inland.remittance.charge.service";
import { CurrencyService } from "../../../services/currency/service-api/currency.service";
import { ExchangeRateService } from "../../../services/currency/service-api/exchange.rate.service";
import { ReissueComponent } from "./issue-list/reissue/inland.remittance.reissue.component";
import { AccountService } from "../../../services/account/service-api/account.service";
import { CISService } from "../../../services/cis/service-api/cis.service";
import { AccountOperatorService } from "../../../services/account-operator/service-api/account.operator.service";
import { InlandRemittanceChargeComponent } from "./charge/inland.remittance.charge";
import { InlandRemittanceChargeConfigurationFormComponent } from "./charge/configuration-form/inland.remittance.charge.configuration.form.component";
import { GlAccountService } from "../../../services/glaccount/service-api/gl.account.service";

@NgModule({
    imports: [
        AbabilNgSharedModule,
        RouterModule.forChild(InlandRemittanceRoutes),
        MatMenuModule
    ],
    declarations: [
        CreateLotComponent,
        CreateIssueComponent,
        PaymentIssueComponent,
        IssueListComponent,
        InlandRemittanceChargeComponent,
        InlandRemittanceChargeConfigurationFormComponent,
        LotListComponent,
        InstrumentListComponent,
        DestroyInstrumentComponent,
        LostInlandRemittanceIssueComponent,
        RefundIssueComponent,
        ViewIssueComponent,
        ReissueComponent
    ],
    providers: [
        ConfirmationService,
        InlandRemittanceLotService,
        InlandRemittanceInstrumentService,
        InlandRemittanceIssueService,
        InlandRemittanceChargeService,
        CurrencyService,
        ExchangeRateService,
        AccountService,
        CISService,
        AccountOperatorService,
        GlAccountService
    ]
})

export class InlandRemittanceModule {
}