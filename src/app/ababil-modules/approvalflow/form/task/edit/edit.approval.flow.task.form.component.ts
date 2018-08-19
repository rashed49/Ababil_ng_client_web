import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskFormData, TaskSaveEvent } from '../approval.flow.task.form.component';
import { ApprovalflowService } from '../../../../../services/approvalflow/service-api/approval.flow.service';
import { NotificationService } from '../../../../../common/notification/notification.service';
import { BaseComponent } from '../../../../../common/components/base.component';

@Component({
  selector: 'edit-approval-flow-task-form',
  templateUrl: './edit.approval.flow.task.form.component.html',
})
export class EditApprovalFlowTaskFormComponent extends BaseComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private workFlowService: ApprovalflowService, private notificationService: NotificationService) {
    super();
  }

  taskformData: Observable<TaskFormData>;
  selectedTaskId: number;
  selectedProfileId: number;

  ngOnInit() {
    this.subscribers.routeSub = this.route.params.subscribe(params => {
      this.selectedTaskId = +params['taskid'];
      this.selectedProfileId = +params['id'];
    });
    this.fetchTaskDetails();
  }

  fetchTaskDetails() {
    this.taskformData = this.workFlowService.fetchApprovalflowTaskDetail({ id: this.selectedTaskId + "", profileId: this.selectedProfileId + "" }).pipe(map(task => task));
    this.subscribers.formDatasub = this.taskformData.subscribe();
  }

  onCancel(): void {
    this.navigateAway();
  }

  navigateAway() {
    this.router.navigate(['../'], { relativeTo: this.route })
  }

  onSave(event: TaskSaveEvent): void {
    this.subscribers.saveSub = this.workFlowService.updateApprovalflowTask(event.task, { id: this.selectedTaskId + "", profileId: this.selectedProfileId + "" }).subscribe(
      (data) => {
        this.notificationService.sendSuccessMsg("workflow.task.update.success");
        this.navigateAway();
      }
    )
  }


}