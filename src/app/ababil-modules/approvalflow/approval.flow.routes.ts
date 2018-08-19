import { Routes } from '@angular/router';
import { ApprovalflowComponent } from './approval.flow.component';
import { ApprovalflowDetailComponent } from './detail/approvalflow/approval.flow.detail.component';
import { CreateApprovalFlowTaskFormComponent } from './form/task/create/create.approval.flow.task.form.component';
import { ApprovalflowTaskDetailComponent } from './detail/task/approval.flow.task.detail.component';
import { EditApprovalFlowTaskFormComponent } from './form/task/edit/edit.approval.flow.task.form.component';
import { ApprovalflowCommandMappingComponent } from './detail/command-mapping/approval.flow.command.mapping.detail.component';
import { PendingTaskComponent } from './pending-task/pending.task.component';
import { VerifyTaskComponent } from './verify/verfiy-task.component';

export const ApprovalflowRoutes: Routes = [
  { path: '', component: ApprovalflowComponent },
  { path: 'detail/:id', component: ApprovalflowDetailComponent, pathMatch: 'full' },
  { path: 'detail/:id/tasks/:taskid', component: ApprovalflowTaskDetailComponent },
  { path: 'detail/:id/task/create', component: CreateApprovalFlowTaskFormComponent },
  { path: 'detail/:id/tasks/:taskid/edit', component: EditApprovalFlowTaskFormComponent },
  { path: 'command/mappings', component: ApprovalflowCommandMappingComponent },
  { path: 'pendingtasks', component: PendingTaskComponent },
  { path: 'verify', component: VerifyTaskComponent }
];
