import { Routes } from "@angular/router";
import { LotListComponent } from "./lot-list/inland.remittance.lot.list.component";
import { InstrumentListComponent } from "./instrument-list/inland.remittance.instrument.list.component";
import { IssueListComponent } from "./issue-list/inland.remittance.issue.list.component";
import { CreateIssueComponent } from "./issue-list/create/create.inland.remittance.issue.component";
import { ReissueComponent } from "./issue-list/reissue/inland.remittance.reissue.component";
import { InlandRemittanceChargeComponent } from "./charge/inland.remittance.charge";
import { InlandRemittanceChargeConfigurationFormComponent } from "./charge/configuration-form/inland.remittance.charge.configuration.form.component";
// import { DestroyInstrumentComponent } from "./instrument-list/destroy/destroy.inland.remittance.instrument.component";
// import { CreateLotComponent } from "./lot-list/create/create.inland.remittance.lot.component";
// import { LostInlandRemittanceIssueComponent } from "./issue-list/issue-lost/lost.inland.remittance.issue.component";
// import { PaymentIssueComponent } from "./issue-list/issue-payment/payment.inland.remittance.issue.component";
// import { RefundIssueComponent } from "./issue-list/issue-refund/refund.inland.remittance.issue.component";
// import { ViewIssueComponent } from "./issue-list/issue-view/view.inland.remittance.issue.component";

export const InlandRemittanceRoutes: Routes = [
    { path: 'lot-list', component: LotListComponent },
    { path: 'issue-list', component: IssueListComponent },
    { path: 'instrument-list', component: InstrumentListComponent },
    { path: 'instrument-list/Issue-create', component: CreateIssueComponent },
    { path: 'issue-list/reissue', component: ReissueComponent },
    //{ path: 'lot-list/lot-create', component: CreateLotComponent },
    // { path: 'instrument-list/destroy-instrument', component: DestroyInstrumentComponent },
    // { path: 'payment-issue', component: PaymentIssueComponent },
    // { path: 'lost-issue', component: LostInlandRemittanceIssueComponent },
    // { path: 'refund-issue', component: RefundIssueComponent },
    // { path: 'view-issue', component: ViewIssueComponent },
    { path: 'charge', component: InlandRemittanceChargeComponent },
    { path: 'charge/create', component: InlandRemittanceChargeConfigurationFormComponent },
    { path: 'charge/:id/edit', component: InlandRemittanceChargeConfigurationFormComponent }
]