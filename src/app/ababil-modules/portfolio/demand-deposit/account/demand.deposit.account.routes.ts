import { BankNoticeFormComponent } from './bank-notice/form/bank.notice.form.component';
import { BankNoticeDetailComponent } from './bank-notice/detail/bank-notice-detail/bank.notice.detail.component';
import { BankNoticeComponent } from './bank-notice/bank.notice.component';
import { Routes } from '@angular/router';
import { SpecialInstructionComponent } from './special-instruction/special-instruction.component';
import { DemandDepositAccountDetailComponent } from './detail/demand.deposit.account.detail.component';
import { ImposeSpecialInstructionComponent } from './special-instruction/form/impose-instruction/impose.special.instruction.component';
import { SpecialInstructionDetailComponent } from './special-instruction/special-instruction-detail/special.instruction.detail.component';
import { DemandDepositAccountFormComponent } from './form/demand.deposit.account.form.component';
import { ChequeComponent } from './cheque/cheque.component';
import { ChequeDetailComponent } from './cheque/detail/cheque-detail/cheque.detail.component';
import { CreateChequeBookFormComponent } from './cheque/form/cheque-form/create/create.cheque.form.component';
import { AccountMinimumBalanceFormComponent } from './mimimum-balance/form/minimum.balance.form.component';
import { AccountClosingFormComponent } from './account-closing/form/account.closing.form.component';
import { DormantAccountReactivationFormComponent } from './dormant-account-reactivation/dormant.account.reactivation.component';


export const DemandDepositAccountRoutes: Routes = [
  { path: ':id/details', component: DemandDepositAccountDetailComponent, pathMatch: 'full' },
  { path: ':id/instructions', component: SpecialInstructionComponent, pathMatch: 'full' },
  { path: ':id/instructions/impose', component: ImposeSpecialInstructionComponent },
  { path: ':id/instructions/:instructionId', component: SpecialInstructionDetailComponent, pathMatch: 'full' },
  { path: ':id/chequebooks', component: ChequeComponent },
  { path: ':id/bank-notice', component: BankNoticeComponent },
  { path: ':id/bank-notice/details/:bankNoticeId', component: BankNoticeDetailComponent },
  { path: ':id/bank-notice/form', component: BankNoticeFormComponent },
  { path: ':id/chequebooks/:bookId/details', component: ChequeDetailComponent, pathMatch: 'full' },
  { path: ':id/chequebooks/create', component: CreateChequeBookFormComponent },
  { path: 'create', component: DemandDepositAccountFormComponent, pathMatch: 'full' },
  { path: ':id/edit', component: DemandDepositAccountFormComponent, pathMatch: 'full' },
  { path: ':id/minimum-balance/form', component: AccountMinimumBalanceFormComponent, pathMatch: 'full' },
  { path: ':id', component: AccountClosingFormComponent, pathMatch: 'full' },
  { path: ':id/reactivate-dormant-account', component: DormantAccountReactivationFormComponent, pathMatch: 'full' },


];