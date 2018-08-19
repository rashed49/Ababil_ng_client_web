import { BalanceSheetReportConfigurationComponent } from './balance-sheet-report-mapping-configuration/balance.sheet.report.configuration.component';
import {Routes} from '@angular/router';
import {GlAccountComponent} from './gl-account.component';
import {GlAccountCreateFormComponent} from '../gl-account/form/create/gl.account.form.create.component'; 
import {GlAccountDetailComponent} from './details/gl.account.detail.component';
import {GlAccountEditFormComponent} from './form/edit/gl.account.form.edit.component';
import {GlAccountTreeViewComponent} from './treeview/gl.account.tree.component';
import {PreviousRouteRecorder} from '../../services/util/previous.route.recorder';
import {GlProfitRateFormComponent} from './profit-rate-configuration/form/gl.profit.rate.form.component';
import { GlProfitRateConfigurationComponent } from './profit-rate-configuration/gl.profit.rate.configuration';
import { CreateGlAccountLimitConfigurationFormComponent } from './limit-configuration/form/create/create.gl.account.limit.configuration.form.component';
import { GlAccountLimitConfigurationDetailComponent } from './limit-configuration/detail/gl.account.limit.configuration.detail.component';
import { GlAccountLimitConfigurationFormComponent } from './limit-configuration/form/gl.account.limit.configuration.form.component';
import {GlSubLedgerComponent} from './sub-ledger/sub.ledger.component';
import {SubLedgerDetailComponent} from './sub-ledger/details/sub.ledger.detail.component';


export const GlAccountRoutes: Routes = [
  {path: '', component: GlAccountTreeViewComponent},
  {path: 'search',component: GlAccountComponent},
  {path: 'create',component:GlAccountCreateFormComponent},
  {path: 'detail/:id',component:GlAccountDetailComponent},
  {path: 'detail/:id/edit',component:GlAccountEditFormComponent},
  {path: 'profit-rate',component:GlProfitRateConfigurationComponent},
  {path: 'profit-rate/:id/form',component:GlProfitRateFormComponent},
  {path: 'sub-ledger',component:GlSubLedgerComponent},
  {path: 'sub-ledger/details/:id',component:SubLedgerDetailComponent},
  // {path: 'profit-rate/:id/form/:profitRateId',component:GlProfitRateFormComponent},
  //{path: 'profit-rate/:id/detail/:profitRateId', component: GlProfitRateDetailComponent},
  {path: 'limit', component:GlAccountLimitConfigurationFormComponent},
  {path: 'limit/create/:id',component:CreateGlAccountLimitConfigurationFormComponent},
  {path: 'limit/detail/:id',component:GlAccountLimitConfigurationDetailComponent},
  {path: 'balance-sheet-configuration', component: BalanceSheetReportConfigurationComponent}
]
