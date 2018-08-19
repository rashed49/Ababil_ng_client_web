import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecurringDepositProductRoutes } from './recurring.deposit.product.routes';
import { AbabilNgSharedModule } from '../../../../../common/ababil-ng-shared-module.module';

import { RecurringDepositProductDetailsComponent } from './details/recurring.deposit.product.details.component';
import { RecurringDepositProductFormEditComponent } from './form/edit/recurring.deposit.product.form.edit.component';
import { RecurringDepositProductFormCreateComponent } from './form/create/recurring.deposit.product.form.create.component';
import { RecurringDepositProductComponent } from './recurring.deposit.product.component';
import { RecurringDepositProductFormComponent } from './form/recurring.deposit.product.form.component';

import { RecurringDepositProductService } from '../../../../../services/recurring-deposit-product/service-api/recurring.deposit.product.service';
import { CurrencyService } from './../../../../../services/currency/service-api/currency.service';
import { ApprovalflowService } from '../../../../../services/approvalflow/service-api/approval.flow.service';


@NgModule({
    imports: [
        AbabilNgSharedModule,
        RouterModule.forChild(RecurringDepositProductRoutes)
    ],
    declarations: [
        RecurringDepositProductComponent,
        RecurringDepositProductDetailsComponent,
        RecurringDepositProductFormComponent,
        RecurringDepositProductFormCreateComponent,
        RecurringDepositProductFormEditComponent
    ],
    providers: [
        ApprovalflowService,
        CurrencyService,
        RecurringDepositProductService
    ]
})
export class RecurringDepositProductModule {

}