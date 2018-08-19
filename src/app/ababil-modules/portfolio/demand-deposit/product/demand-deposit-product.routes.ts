import { Routes } from '@angular/router';
import { DemandDepositProductComponent } from './demand-deposit-product.component';
import { DemandDepositProductDetailComponent } from './details/demand-deposit-product.details.component';
import { DemandDepositProductCreateFormComponent } from './form/create/demand-deposit-product.create.component';
import { DemandDepositProductEditFormComponent } from './form/edit/demand-deposit-product.edit.component';
import { ChequeBookSizeComponent } from './cheque-book-size/cheque-book-size.component';
import { ChequePrefixComponent } from './cheque-prefix/cheque-prefix.component';

export const DemandDepositProductRoutes: Routes = [
    { path: '', component: DemandDepositProductComponent },
    { path: 'create', component: DemandDepositProductCreateFormComponent },
    { path: 'detail/:id', component: DemandDepositProductDetailComponent },
    { path: 'detail/:id/edit', component: DemandDepositProductEditFormComponent },
    { path: 'detail/:id/cheque-book-size', component: ChequeBookSizeComponent },
    { path: 'detail/:id/cheque-book-size/:chequeBookSizeId/edit/', component: ChequeBookSizeComponent },
    { path: 'detail/:id/cheque-prefix', component: ChequePrefixComponent },
    { path: 'detail/:id/cheque-prefix/:chequePrefixId', component: ChequePrefixComponent },
];



