import { Routes } from '@angular/router';
import { TransactionProfileDetailComponent } from './detail/transaction.profile.detail.component';
import { CreateTransactionProfileFormComponent } from './form/create/create.transaction.profile.form.component';
import { EditTransactionProfileFormComponent } from './form/edit/edit.transaction.profile.form.component';


export const TransactionProfileRoutes: Routes = [
    { path: ':id/edit', component: EditTransactionProfileFormComponent },
    { path: ':id/details', component: TransactionProfileDetailComponent },
    { path: 'create', component: CreateTransactionProfileFormComponent }
]