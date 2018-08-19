import { Routes } from '@angular/router';
import { RecurringDepositAccountDetailsComponent } from './detail/recurring.deposit.account.details.component';
import { RecurringDepositAccountFormEditComponent } from './form/edit/recurring.deposit.account.form.edit.component';
import { RecurringDepositAccountFormCreateComponent } from './form/create/recurring.deposit.account.form.create.component';
import { RecurringDepositAccountClosingFormComponent } from './recurring-deposit-close-account/recurring.deposit.account.closing.form.component';


export const RecurringDepositAccountRoutes: Routes = [
  { path: ':id/details', component: RecurringDepositAccountDetailsComponent, pathMatch: 'full' },
  { path: ':id/edit', component: RecurringDepositAccountFormEditComponent, pathMatch: 'full' },
  { path: 'create', component: RecurringDepositAccountFormCreateComponent, pathMatch: 'full' },
  { path: ':id/close-account', component: RecurringDepositAccountClosingFormComponent, pathMatch: 'full'  }

];