import { NgModule } from '@angular/core';
import { AbabilNgSharedModule } from '../../../../common/ababil-ng-shared-module.module';
import { TellerService } from '../../../../services/teller/service-api/teller.service';
import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';
import { GlAccountService } from '../../../../services/glaccount/service-api/gl.account.service';
import { RouterModule } from '@angular/router';
import { TellerRoutes } from './teller.routes';
import { TranslateService } from '@ngx-translate/core';
import { TellerComponent } from './teller.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TellerDetailComponent } from './detail/teller-detail/teller.detail.component';
import { CreateTellerFormComponent } from './form/teller-form/create/create.teller.form.component';
import { EditTellerFormComponent } from './form/teller-form/edit/edit.teller.form.component';
import { TellerFormComponent } from './form/teller-form/teller.form.component';
import { CurrencyService } from '../../../../services/currency/service-api/currency.service';
import { BankService } from '../../../../services/bank/service-api/bank.service';

@NgModule({
    imports: [
        AbabilNgSharedModule,
        RouterModule.forChild(TellerRoutes),
        ReactiveFormsModule
    ],
    declarations: [
        TellerComponent,
        TellerDetailComponent,
        TellerFormComponent,
        CreateTellerFormComponent,
        EditTellerFormComponent

    ],
    providers: [
        TellerService,
        TranslateService,
        ApprovalflowService,
        GlAccountService,
        CurrencyService,
        BankService,

    ]
})
export class TellerModule {
}
