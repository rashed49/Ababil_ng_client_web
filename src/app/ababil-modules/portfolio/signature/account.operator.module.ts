import { NgModule } from '@angular/core';
import { AbabilNgSharedModule } from './../../../common/ababil-ng-shared-module.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountOperatorRoutes } from './account.operator.routes';

import { AccountOperatorComponent } from './account.operator.component';

import { CISService } from './../../../services/cis/service-api/cis.service';
import { DemandDepositAccountService } from '../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { ProductService } from '../../../services/product/service-api/product.service';
import { AccountOperatorService } from '../../../services/account-operator/service-api/account.operator.service';

import { ApprovalflowService } from '../../../services/approvalflow/service-api/approval.flow.service';
import { SignatoryFormComponent } from './form/signatory.form.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { SignatoryDetailComponent } from './detail/signatory.detail.component';
import { CreateSignatoryFormComponent } from './form/create/create.signatory.form.component';
import { EditSignatoryFormComponent } from './form/edit/edit.signatory.form.component';
import { AccountService } from '../../../services/account/service-api/account.service';



@NgModule({
  imports: [
    AbabilNgSharedModule,
    CommonModule,
    RouterModule.forChild(AccountOperatorRoutes),
    ReactiveFormsModule,
    FormsModule


  ],
  declarations: [
    AccountOperatorComponent,
    SignatoryDetailComponent,
    CreateSignatoryFormComponent,
    EditSignatoryFormComponent,
    SignatoryFormComponent
  ],
  providers: [
    AccountOperatorService,
    CISService,
    DemandDepositAccountService,
    ProductService,
    ApprovalflowService,
    AccountService
  ]
})
export class AccountOperatorModule { }
