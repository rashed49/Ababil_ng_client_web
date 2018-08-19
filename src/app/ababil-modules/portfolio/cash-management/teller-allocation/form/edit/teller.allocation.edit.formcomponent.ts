import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/primeng';
import { Subscriber, Observable } from 'rxjs';
import { NotificationService, NotificationType } from '../../../../../../common/notification/notification.service';
import { BaseComponent } from '../../../../../../common/components/base.component';
import { TellerAllocationSaveEvent, initialTellerAllocationFormData } from '../teller.allocation.form.component';
import * as commandConstants from '../../../../../../common/constants/app.command.constants';
import * as urlSearchParameterConstants from '../../../../../../common/constants/app.search.parameter.constants';
import * as mapper from '../teller.allocation.mapper';
import { TellerAllocation } from '../../../../../../services/teller/domain/teller.models';
import { TellerAllocationService } from '../../../../../../services/teller/service-api/teller.allocation.service';
import { FormBaseComponent } from '../../../../../../common/components/base.form.component';
import { Location } from '@angular/common';
import { ApprovalflowService } from '../../../../../../services/approvalflow/service-api/approval.flow.service';

export const SUCCESS_MSG: string[] = ["teller.allocation.update.success", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/teller-allocation?";


@Component({
  selector: 'teller-allocation-edit-form',
  templateUrl: './teller.allocation.edit.form.component.html',
})
export class TellerAllocationEditFormComponent extends FormBaseComponent implements OnInit {

  tellerAllocationFormData: Observable<TellerAllocation>;
  private selectedId: number;
  command: string = commandConstants.TELLER_ALLOCATION_UPDATE_COMMAND;

  constructor(
    protected location: Location,
    protected approvalFlowService: ApprovalflowService,
    private tellerAllocationService: TellerAllocationService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService) {
    super(location, approvalFlowService);
  }

  ngOnInit() {
    this.subscribers.routeSub = this.route.params.subscribe(params => {
      this.selectedId = +params['id'];
      this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
        if (queryParams['taskId']) {
          this.taskId = queryParams['taskId'];
          this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
            data => {
              this.tellerAllocationFormData = data;
            });
        } else {
          this.fetchTellerAllocationDetail();
        }
      });

    });

  }
  fetchTellerAllocationDetail() {
    this.subscribers.fetchSub = this.tellerAllocationService.fetchTellerAllocationDetail({ id: this.selectedId + "" }).subscribe(
      data => {
        this.tellerAllocationFormData = data;
      }
    );
  }

  onSave(event: TellerAllocationSaveEvent): void {
    let tellerAllocation = mapper.maptellerAllocation(event);
    let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, DETAILS_UI, this.location.path().concat("?"));
    this.subscribers.updateSub = this.tellerAllocationService.updateTellerAllocation(tellerAllocation, { "id": this.selectedId + "" }, urlSearchParams).subscribe(
      (data) => {
        this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
        this.navigateAway();
      })

  }

  onCancel(): void {
    this.navigateAway();
  }

  navigateAway() {
    if (this.taskId) {
      this.router.navigate(['approval-flow/pendingtasks']);
    } else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }

  }

}