import { Routes } from '@angular/router';
import { RecurringDepositProductComponent } from './recurring.deposit.product.component';
import { RecurringDepositProductFormCreateComponent } from './form/create/recurring.deposit.product.form.create.component';
import { RecurringDepositProductDetailsComponent } from './details/recurring.deposit.product.details.component';
import { RecurringDepositProductFormEditComponent } from './form/edit/recurring.deposit.product.form.edit.component';


export const RecurringDepositProductRoutes: Routes = [
    { path: '', component: RecurringDepositProductComponent },
    { path: 'create', component: RecurringDepositProductFormCreateComponent },
    { path: 'detail/:id', component: RecurringDepositProductDetailsComponent },
    { path: 'detail/:id/edit', component: RecurringDepositProductFormEditComponent }
]