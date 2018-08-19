import { NgModule } from '@angular/core';
import { AbabilNgSharedModule } from '../../../../common/ababil-ng-shared-module.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {NotificationService} from '../../../../common/notification/notification.service';

import { TellerAllocationComponent } from "./teller.allocation.component";
import { TellerAllocationDetailComponent } from "./detail/teller.allocation.detail.component";
import { TellerAllocationFormComponent } from "./form/teller.allocation.form.component";
import { TellerAllocationCreateFormComponent } from "./form/create/teller.allocation.create.form.component";
import { TellerAllocationEditFormComponent } from "./form/edit/teller.allocation.edit.formcomponent";
import { TellerAllocationService } from "../../../../services/teller/service-api/teller.allocation.service";
import { TranslateService } from "@ngx-translate/core";
import { CurrencyService } from "../../../../services/currency/service-api/currency.service";
import { ApprovalflowService } from "../../../../services/approvalflow/service-api/approval.flow.service";
import { TellerAllocationRoutes } from './teller.allocation.routes';
import { TellerService } from '../../../../services/teller/service-api/teller.service';
import { BankService } from '../../../../services/bank/service-api/bank.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';


@NgModule({
    imports: [
        AbabilNgSharedModule,
        RouterModule.forChild(TellerAllocationRoutes),
        ReactiveFormsModule,
        FormsModule,
        ConfirmDialogModule
    ],
    declarations: [
        TellerAllocationComponent,
        TellerAllocationDetailComponent,
        TellerAllocationFormComponent,
     TellerAllocationCreateFormComponent,
        TellerAllocationEditFormComponent
    ],
    providers: [
        TellerAllocationService,
        TranslateService,
        CurrencyService, 
        ApprovalflowService,
        TellerService,
        BankService,
        ConfirmationService
    ]
})
export class TellerAllocationModule {
}
