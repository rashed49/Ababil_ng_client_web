import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbabilNgSharedModule } from './../../../../../common/ababil-ng-shared-module.module';

import { TransactionProfileDetailComponent } from './detail/transaction.profile.detail.component';
import { TransactionProfileFormComponent } from './form/transaction.profile.form.component';
import { CreateTransactionProfileFormComponent } from './form/create/create.transaction.profile.form.component';
import { EditTransactionProfileFormComponent } from './form/edit/edit.transaction.profile.form.component';

import { TransactionProfileService } from './../../../../../services/transaction-profile/service-api/transaction-profile.service';
import { TransactionProfileRoutes } from './transaction.profile.routes';
import { AccountService } from '../../../../../services/account/service-api/account.service';

@NgModule({
  imports: [
    AbabilNgSharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(TransactionProfileRoutes)
  ],
  declarations: [
    TransactionProfileFormComponent,
    TransactionProfileDetailComponent,
    CreateTransactionProfileFormComponent,
    EditTransactionProfileFormComponent
  ],
  providers: [
    AccountService,
    TransactionProfileService
  ]
})
export class TransactionProfileModule { }
