import { NgModule } from "@angular/core";
import { AbabilNgSharedModule } from "../../../common/ababil-ng-shared-module.module";
import { RouterModule } from "@angular/router";
import { AccountRoutes } from "./account.routes";
import { AccountFreezeFormComponent } from "./account-freeze/form/account.freeze.form.component";
import { AccountService } from "../../../services/account/service-api/account.service";
import { DemandDepositAccountService } from "../../../services/demand-deposit-account/service-api/demand.deposit.account.service";
import { ApprovalflowService } from "../../../services/approvalflow/service-api/approval.flow.service";

@NgModule({
  imports: [
    AbabilNgSharedModule,
    RouterModule.forChild(AccountRoutes),
  ],
  declarations: [
    AccountFreezeFormComponent

  ],
  providers: [
    AccountService,
    DemandDepositAccountService,
    ApprovalflowService
 
  ]
})
export class AccountModule { }
