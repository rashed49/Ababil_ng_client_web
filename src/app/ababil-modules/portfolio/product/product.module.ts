import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbabilNgSharedModule } from '../../../common/ababil-ng-shared-module.module';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductRoutes } from './product.routes';
import { ProductComponent } from './product.component';
import { ProductDetailComponent } from './details/product.details.component';
import { ProductService } from '../../../services/product/service-api/product.service';
import { ProfitRateComponent } from './profit-rate/profit-rate.component';
import { ProfitRateDetailComponent } from './profit-rate/detail/profit-rate.details.component';
import { ProfitRateFormComponent } from './profit-rate/form/profit-rate.form.component';
import { ApprovalflowService } from '../../../services/approvalflow/service-api/approval.flow.service';
import { CurrencyService } from '../../../services/currency/service-api/currency.service';
import { ProductGeneralLedgerAssignmentService } from './../../../services/product-general-ledger-assignment/service-api/product-general-ledger-assignment.service';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { ProductGeneralLedgerMappingComponent } from './product-general-ledger-mapping/product-general-ledger-mapping.component';
import { DemandDepositProductService } from '../../../services/demand-deposit-product/service-api/demand-deposit-product.service';
import { GlAccountService } from '../../../services/glaccount/service-api/gl.account.service';


@NgModule({
  imports: [
    RouterModule.forChild(ProductRoutes),
    AbabilNgSharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ProductComponent,
    ProductDetailComponent,
    ProfitRateComponent,
    ProfitRateDetailComponent,
    ProfitRateFormComponent,
    ProductGeneralLedgerMappingComponent
  ],
  providers: [
    CurrencyService,
    ProductService,
    ApprovalflowService,
    ProductGeneralLedgerAssignmentService,
    ConfirmationService,
    DemandDepositProductService,
    GlAccountService
  ]
})

export class ProductModule { }
