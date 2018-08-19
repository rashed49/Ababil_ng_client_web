
import { GlAccountLimitConfigurationFormComponent } from './limit-configuration/form/gl.account.limit.configuration.form.component';
import { BalanceSheetReportMappingCofigurationService } from './../../services/glaccount/service-api/balance.sheet.report.configuration.service';
import { BalanceSheetReportConfigurationComponent } from './balance-sheet-report-mapping-configuration/balance.sheet.report.configuration.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { PickListModule } from 'primeng/components/picklist/picklist';
import { FieldsetModule } from 'primeng/components/fieldset/fieldset';

import {RouterModule} from '@angular/router';
import {AbabilNgSharedModule} from '../../common/ababil-ng-shared-module.module';
import {GlAccountRoutes} from './gl-account.routes';


import {NodeService} from '../../demo/service/nodeservice';
import {TranslateService } from '@ngx-translate/core';
import {GlAccountService} from '../../services/glaccount/service-api/gl.account.service';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { BankService } from './../../services/bank/service-api/bank.service';
import { CurrencyService } from './../../services/currency/service-api/currency.service';
import {GlAccountComponent} from './gl-account.component';
import {GlAccountCreateFormComponent} from './form/create/gl.account.form.create.component';
import {GlAccountFormComponent} from './form/gl.account.form.component';

import {GlAccountEditFormComponent} from './form/edit/gl.account.form.edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GlAccountDetailComponent } from './details/gl.account.detail.component';
import {GlAccountTreeViewComponent} from './treeview/gl.account.tree.component';
import {ApprovalflowService} from '../../services/approvalflow/service-api/approval.flow.service';
import {GlProfitRateFormComponent  } from './profit-rate-configuration/form/gl.profit.rate.form.component';

import { CreateGlAccountLimitConfigurationFormComponent } from './limit-configuration/form/create/create.gl.account.limit.configuration.form.component';
import { GlAccountLimitConfigurationDetailComponent } from './limit-configuration/detail/gl.account.limit.configuration.detail.component';
import { GlAccountLimitService } from './../../services/glaccount/service-api/gl.account.limit.service';
import { GlProfitRateConfigurationComponent } from './profit-rate-configuration/gl.profit.rate.configuration';
import {TreeDragDropService} from 'primeng/primeng';


import {GlSubLedgerComponent} from './sub-ledger/sub.ledger.component';
import {SubLedgerFormComponent} from './sub-ledger/form/sub.ledger.form.component';

import {SubLedgerDetailComponent} from './sub-ledger/details/sub.ledger.detail.component';

import {InputMaskModule} from 'primeng/inputmask';


@NgModule({
  imports: [
    RouterModule.forChild(GlAccountRoutes),
    AbabilNgSharedModule,
    MatTabsModule,
    PickListModule,
    FieldsetModule,
    InputMaskModule
  ],
  declarations: [
    GlAccountComponent,
    GlAccountCreateFormComponent,
    GlAccountFormComponent,
    GlAccountEditFormComponent,
    GlAccountDetailComponent,
    GlAccountTreeViewComponent,
    GlProfitRateConfigurationComponent,
    GlProfitRateFormComponent,
    CreateGlAccountLimitConfigurationFormComponent,
    GlAccountLimitConfigurationFormComponent,
    GlAccountLimitConfigurationDetailComponent,
    GlAccountTreeViewComponent,
    BalanceSheetReportConfigurationComponent,
    GlSubLedgerComponent,
    SubLedgerFormComponent,
    SubLedgerDetailComponent


  ],
  providers:[
    BankService,
    TranslateService,
    GlAccountService,
    ApprovalflowService,
    CurrencyService,
    GlAccountLimitService,    
    ConfirmationService,
    TreeDragDropService,
    BalanceSheetReportMappingCofigurationService
    
  ]
})
export class GlAccountModule { }
