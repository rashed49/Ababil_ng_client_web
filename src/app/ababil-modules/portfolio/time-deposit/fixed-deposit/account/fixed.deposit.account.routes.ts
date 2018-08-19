// import { BankNoticeFormComponent } from './bank-notice/form/bank.notice.form.component';
// import { BankNoticeDetailComponent } from './bank-notice/detail/bank-notice-detail/bank.notice.detail.component';
// import { BankNoticeComponent } from './bank-notice/bank.notice.component';
import { Routes } from '@angular/router';
// import { SpecialInstructionComponent } from './special-instruction/special-instruction.component';
import { FixedDepositAccountDetailComponent } from './detail/fixed.deposit.account.detail.component';
// import { ImposeSpecialInstructionComponent } from './special-instruction/form/impose-instruction/impose.special.instruction.component';
// import { SpecialInstructionDetailComponent } from './special-instruction/special-instruction-detail/special.instruction.detail.component';
import { FixedDepositAccountFormComponent } from './form/fixed.deposit.account.form.component';
import { FixedDepositAccountWithdrawalMappingComponent } from './withdrawal-mapping/fixed.deposit.account.withdrawal.mapping.component';
import { FixedDepositAccountWithdrawalTransectionComponent } from './withdrawal-transaction/fixed.deposit.account.withdrawal.transaction.component';
import { DetailFixedDepositAccountWithdrawalMappingComponent } from './withdrawal-mapping/detail/detail.fixed.deposit.account.withdrawal.mapping.component';
import { EditFixedDepositAccountWithdrawalMappingComponent } from './withdrawal-mapping/edit/edit.fixed.deposit.account.withdrawal.mapping.component';
import { FixedDepositAccountClosingFormComponent } from './fixed-deposit-close-account/fixed.deposit.account.closing.form.component';
// import { ChequeComponent } from './cheque/cheque.component';
// import { ChequeDetailComponent } from './cheque/detail/cheque-detail/cheque.detail.component';
// import { CreateChequeBookFormComponent } from './cheque/form/cheque-form/create/create.cheque.form.component';


export const FixedDepositAccountRoutes: Routes = [
  { path: ':id/details', component: FixedDepositAccountDetailComponent, pathMatch: 'full' },
  { path: ':id/details/withdrawal-mapping', component: FixedDepositAccountWithdrawalMappingComponent },
  { path: ':id/details/withdrawal-mapping-detail', component: DetailFixedDepositAccountWithdrawalMappingComponent },
  { path: ':id/details/withdrawal-mapping-edit', component: EditFixedDepositAccountWithdrawalMappingComponent },
  { path: ':id/details/withdrawal-transaction', component: FixedDepositAccountWithdrawalTransectionComponent },
  //   { path: ':id/instructions', component: SpecialInstructionComponent, pathMatch: 'full' },
  //   { path: ':id/instructions/impose', component: ImposeSpecialInstructionComponent },
  //   { path: ':id/instructions/:instructionId', component: SpecialInstructionDetailComponent, pathMatch: 'full' },
  //   { path: ':id/chequebooks', component: ChequeComponent },
  //   { path: ':id/bank-notice', component: BankNoticeComponent },
  //   { path: ':id/bank-notice/details/:bankNoticeId', component: BankNoticeDetailComponent },
  //   { path: ':id/bank-notice/form', component: BankNoticeFormComponent },
  //   { path: ':id/chequebooks/:bookId/details', component: ChequeDetailComponent, pathMatch: 'full' },
  //   { path: ':id/chequebooks/create', component: CreateChequeBookFormComponent },
  { path: 'create', component: FixedDepositAccountFormComponent, pathMatch: 'full' },
  { path: ':id/edit', component: FixedDepositAccountFormComponent, pathMatch: 'full' },
  { path: ':id/close-account', component: FixedDepositAccountClosingFormComponent, pathMatch: 'full'  }

];