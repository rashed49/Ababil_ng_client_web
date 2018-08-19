import { Routes } from '@angular/router';
import { BankComponent } from './bank.component';
import { BankDetailComponent } from './detail/bank-detail/bank.detail.component';
import { CreateBankFormComponent } from './form/bank-form/create/create.bank.form.component';
import { EditBankFormComponent } from './form/bank-form/edit/edit.bank.form.component';
import { BranchDetailComponent } from './detail/branch-detail/branch.detail.component';
import { CreateBranchFormComponent } from './form/branch-form/create/create.branch.form.component';
import { EditBranchFormComponent } from './form/branch-form/edit/edit.branch.form.component';


export const BankRoutes: Routes = [
    { path: '', component: BankComponent },
    { path: 'detail/:id', component: BankDetailComponent, pathMatch: 'full' },
    { path: 'create', component: CreateBankFormComponent },
    { path: 'detail/:id/edit', component: EditBankFormComponent, pathMatch: 'full' },
    { path: 'detail/:bankId/branches/:branchId', component: BranchDetailComponent },
    { path: 'detail/:bankId/branch/create', component: CreateBranchFormComponent },
    { path: 'detail/:bankId/branches/:branchId/edit', component: EditBranchFormComponent }
];
