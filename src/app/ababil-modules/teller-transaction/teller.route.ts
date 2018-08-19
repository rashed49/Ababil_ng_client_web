import {Routes} from '@angular/router';
import {TellerComponent} from './teller.component';
import {TellerDashboardComponent} from './dashboard/teller.dashboard.component';
import {CashDepositComponent} from './cash-deposit/cash.deposit.component';
import {CashWithdrawComponent} from './cash-withdraw/cash.withdraw.component';
import { CashTransferComponent } from './cash-transfer/cash.transfer.component';
import { TellerActivityLog } from './teller-activity-log/teller.activity.log.component';

export const TellerRoutes: Routes = [
  {path: '', component: TellerComponent},
  {path: 'dashboard', component: TellerDashboardComponent},
  {path: 'cash-deposit', component: CashDepositComponent},
  {path: 'cash-withdraw', component: CashWithdrawComponent},
  {path: 'cash-transfer', component: CashTransferComponent},
   {path: ':tellerId/activityLog', component: TellerActivityLog}
];
