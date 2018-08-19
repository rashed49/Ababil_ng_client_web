import { NgModule } from '@angular/core';
import { AbabilNgSharedModule } from '../../common/ababil-ng-shared-module.module';
import { BankService } from '../../services/bank/service-api/bank.service';
import { RouterModule } from '@angular/router';
import { BankRoutes } from './bank.routes';
import { TranslateService } from '@ngx-translate/core';
import { BankComponent } from './bank.component';
import { BankDetailComponent } from './detail/bank-detail/bank.detail.component';
import { BranchDetailComponent } from './detail/branch-detail/branch.detail.component'
import { BankFormComponent } from './form/bank-form/bank.form.component';
import { BranchFormComponent } from './form/branch-form/branch.form.component';
import { CreateBankFormComponent } from './form/bank-form/create/create.bank.form.component';
import { EditBankFormComponent } from './form/bank-form/edit/edit.bank.form.component';
import { CreateBranchFormComponent } from './form/branch-form/create/create.branch.form.component';
import { EditBranchFormComponent } from './form/branch-form/edit/edit.branch.form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CISMiscellaneousService } from './../../services/cis/service-api/cis.misc.service';
import { ApprovalflowService } from '../../services/approvalflow/service-api/approval.flow.service';
import { AbabilLocationService } from '../../services/location/service-api/location.service';


@NgModule({
    imports: [
        AbabilNgSharedModule,
        RouterModule.forChild(BankRoutes),
        ReactiveFormsModule
    ],
    declarations: [
        BankComponent,
        BankDetailComponent,
        BankFormComponent,
        BranchFormComponent,
        CreateBankFormComponent,
        EditBankFormComponent,
        EditBranchFormComponent,
        CreateBranchFormComponent,
        BranchDetailComponent
    ],
    providers: [
        BankService,
        TranslateService,
        ApprovalflowService,
        AbabilLocationService,
        CISMiscellaneousService
    ]
})
export class BankModule {
}
