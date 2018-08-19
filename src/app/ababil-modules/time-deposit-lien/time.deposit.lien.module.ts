import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AbabilNgSharedModule } from "../../common/ababil-ng-shared-module.module";
import { LienRoutes } from "../time-deposit-lien/time.deposit.lien.routes";
import { TimeDepositLienComponent } from "../time-deposit-lien/time.deposit.lien.component";
import { TimeDepositLienImposeComponent } from "../time-deposit-lien/lien-impose/time.deposit.lien.impose.component";
import { DetailTimeDepositLienComponent } from "../time-deposit-lien/detail/detail.time.deposit.lien.component";
import { TimeDepositLienService } from "../../services/time-deposit-lien/service-api/time.deposit.lien.service";
import { AccountService } from "../../services/account/service-api/account.service";
import { EditTimeDepositLienComponent } from "../../ababil-modules/time-deposit-lien/edit/edit.time.deposit.lien.component";
import { TimeDepositLienReferenceTypeService } from "../../services/time-deposit-lien-reference-type/service-api/time.deposit.lien.reference.type.service";


@NgModule({

    imports: [AbabilNgSharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(LienRoutes)
    ],
    declarations: [
        TimeDepositLienComponent,
        TimeDepositLienImposeComponent,
        DetailTimeDepositLienComponent,
        EditTimeDepositLienComponent
    ],
    providers: [
        TimeDepositLienService,
        TimeDepositLienReferenceTypeService,
        AccountService
    ]
})
export class TimeDepositLienModule {

}