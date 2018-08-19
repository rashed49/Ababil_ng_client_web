import { BankService } from './../../services/bank/service-api/bank.service';
import { NgModule } from '@angular/core';
import { AbabilNgSharedModule } from '../../common/ababil-ng-shared-module.module';
import { ApprovalflowComponent } from './approval.flow.component';
import { ApprovalflowService } from '../../services/approvalflow/service-api/approval.flow.service';
import { CommandService } from '../../services/command/service-api/command.service';

import { RouterModule } from '@angular/router';
import { ApprovalflowRoutes } from './approval.flow.routes';
import { ApprovalflowDetailComponent } from './detail/approvalflow/approval.flow.detail.component';
import { CreateApprovalFlowTaskFormComponent } from './form/task/create/create.approval.flow.task.form.component';
import { EditApprovalFlowTaskFormComponent } from './form/task/edit/edit.approval.flow.task.form.component';
import { ApprovalFlowTaskFormComponent } from './form/task/approval.flow.task.form.component';
import { PendingTaskComponent } from './pending-task/pending.task.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ApprovalflowTaskDetailComponent } from './detail/task/approval.flow.task.detail.component';
import { TranslateService } from '@ngx-translate/core';
import {NotificationService} from '../../common/notification/notification.service';
import {ApprovalflowCommandMappingComponent} from './detail/command-mapping/approval.flow.command.mapping.detail.component';

import {NodeService} from '../../demo/service/nodeservice';
import {FormsModule} from '@angular/forms';

import {VerifyTaskComponent} from './verify/verfiy-task.component';
import { ApprovalflowFormComponent } from './component/approval.flow.form.component';

@NgModule({
  imports: [
    AbabilNgSharedModule,
    RouterModule.forChild(ApprovalflowRoutes),
  ],
  declarations: [
    ApprovalflowComponent,
    ApprovalflowFormComponent,
    ApprovalflowDetailComponent,
    CreateApprovalFlowTaskFormComponent,
    EditApprovalFlowTaskFormComponent,
    ApprovalFlowTaskFormComponent,
    ApprovalflowTaskDetailComponent,
    ApprovalflowCommandMappingComponent,
    PendingTaskComponent,
    VerifyTaskComponent
  ],
  providers: [
    ApprovalflowService,
    TranslateService,
    CommandService,
    NodeService,
    BankService        
  ]
})
export class ApprovalFlowModule {
}
