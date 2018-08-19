import { FixedDepositProductFormComponent } from './form/fixed.deposit.product.form.component';
import { AbabilNgSharedModule } from './../../../../../common/ababil-ng-shared-module.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FixedDepositProductRoutes } from './fixed.deposit.product.routes';
import { FixedDepositProductService } from '../../../../../services/fixed-deposit-product/service-api/fixed.deposit.product.service';
import { TranslateService } from '@ngx-translate/core';
import { ApprovalflowService } from '../../../../../services/approvalflow/service-api/approval.flow.service';
import { CurrencyService } from '../../../../../services/currency/service-api/currency.service';
import { ProductGeneralLedgerAssignmentService } from './../../../../../services/product-general-ledger-assignment/service-api/product-general-ledger-assignment.service';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { FixedDepositProductComponent } from './fixed.deposit.product.component';
import { FixedDepositProductDetailComponent } from './detail/fixed.deposit.product.detail.component';
import { FixedDepositProductFormCreateComponent } from './form/create/fixed.deposit.product.create.component';
import { FixedDepositProductEditFormComponent } from './form/edit/fixed.deposit.product.edit.component';

@NgModule({
    imports: [
        AbabilNgSharedModule,
        RouterModule.forChild(FixedDepositProductRoutes),
    ],
    declarations: [
        FixedDepositProductFormComponent,
        FixedDepositProductComponent,
        FixedDepositProductDetailComponent,
        FixedDepositProductFormCreateComponent,
        FixedDepositProductEditFormComponent
    ],
    providers: [
        ApprovalflowService,
        CurrencyService,
        FixedDepositProductService
    ]
})
export class FixedDepositProductModule {

}