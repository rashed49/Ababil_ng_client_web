import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ApprovalflowService } from '../../services/approvalflow/service-api/approval.flow.service';
import { ApprovalflowProfile } from '../../services/approvalflow/domain/approval.flow.models';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../common/components/base.component';
import { NotificationService } from '../../common/notification/notification.service';

@Component({
  selector: 'ababil-approvalflow',
  templateUrl: './approval.flow.component.html',
  styleUrls: ['./approval.flow.component.scss']
})
export class ApprovalflowComponent extends BaseComponent implements OnInit {

  constructor(private approvalflowService: ApprovalflowService,
    private route: ActivatedRoute, private router: Router,
    private notificationService: NotificationService) {
    super();
  }

  approvalflowProfiles: ApprovalflowProfile[] = [];
  approvalflowProfile: ApprovalflowProfile = new ApprovalflowProfile();
  urlSearchParam: Map<string, string>;

  @ViewChild('approvalFlowDialog') approvalFlowDialog: any;

  ngOnInit() {
    this.fetchApprovalflowProfiles();
  }

  fetchApprovalflowProfiles() {
    this.urlSearchParam = new Map([['all', 'true']]);
    this.subscribers.fetchApprovalFlowProfilesSub = this.approvalflowService
      .fetchApprovalFlowProfiles(this.urlSearchParam)
      .subscribe(profiles => this.approvalflowProfiles = profiles);
  }

  create() {
    this.approvalFlowDialog.showDialog = true;
  }

  onRowSelect(event) {
    this.router.navigate(['detail', event.data.id], { relativeTo: this.route });
  }

  onSave(approvalflowProfile: ApprovalflowProfile): void {
    this.subscribers.createApprovalflowSub = this.approvalflowService
      .createApprovalflow(approvalflowProfile)
      .subscribe(data => {
        this.approvalFlowDialog.close();
        this.notificationService.sendSuccessMsg("workflow.save.success");
        this.refresh();
      });
  }

  refresh() {
    this.fetchApprovalflowProfiles()
  }
}
