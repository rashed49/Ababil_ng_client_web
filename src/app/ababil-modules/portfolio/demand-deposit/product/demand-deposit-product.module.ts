import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbabilNgSharedModule } from '../../../../common/ababil-ng-shared-module.module';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemandDepositProductRoutes } from './demand-deposit-product.routes';
import { DemandDepositProductComponent } from './demand-deposit-product.component';
import { DemandDepositProductDetailComponent } from './details/demand-deposit-product.details.component';
import { DemandDepositProductCreateFormComponent } from './form/create/demand-deposit-product.create.component';
import { DemandDepositProductFormComponent } from './form/demand-deposit-product.form.component';
import { DemandDepositProductService } from '../../../../services/demand-deposit-product/service-api/demand-deposit-product.service';
import { DemandDepositProductEditFormComponent } from './form/edit/demand-deposit-product.edit.component';
import { ChequeBookSizeComponent } from './cheque-book-size/cheque-book-size.component';
import { ChequePrefixComponent } from './cheque-prefix/cheque-prefix.component';
import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';
import { CurrencyService } from '../../../../services/currency/service-api/currency.service';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';

@NgModule({
  imports: [
    RouterModule.forChild(DemandDepositProductRoutes),
    AbabilNgSharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    DemandDepositProductComponent,
    DemandDepositProductDetailComponent,
    DemandDepositProductCreateFormComponent,
    DemandDepositProductFormComponent,
    DemandDepositProductEditFormComponent,
    ChequeBookSizeComponent,
    ChequePrefixComponent
  ],
  providers: [
    CurrencyService,
    DemandDepositProductService,
    ApprovalflowService,
    ConfirmationService
  ]
})

export class DemandDepositProductModule { }
