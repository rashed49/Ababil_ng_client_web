import { FixedDepositProductFormComponent } from './form/fixed.deposit.product.form.component';
import { Routes } from '@angular/router';
import { FixedDepositProductComponent } from './fixed.deposit.product.component';
import {FixedDepositProductDetailComponent} from './detail/fixed.deposit.product.detail.component'
import {FixedDepositProductFormCreateComponent } from './form/create/fixed.deposit.product.create.component';
import { FixedDepositProductEditFormComponent } from './form/edit/fixed.deposit.product.edit.component';

export const FixedDepositProductRoutes: Routes = [
    { path: '', component: FixedDepositProductComponent },
    { path: 'create', component: FixedDepositProductFormCreateComponent },
    { path: 'detail/:id', component: FixedDepositProductDetailComponent },
    { path: 'detail/:id/edit', component: FixedDepositProductEditFormComponent }
];
