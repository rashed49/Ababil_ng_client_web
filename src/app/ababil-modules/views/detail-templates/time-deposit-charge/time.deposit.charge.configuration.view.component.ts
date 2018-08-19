import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from "@angular/router";
import { ViewsBaseComponent } from "../../view.base.component";
import { ApprovalflowService } from "../../../../services/approvalflow/service-api/approval.flow.service";
import { NotificationService } from "../../../../common/notification/notification.service";
import { ActivateTimeDepositChargeConfigurationCommand } from "../../../../services/time-deposit-charge/domain/time.deposit.charge.configuration.model";
import { of } from "rxjs";

@Component({
    selector: 'time-deposit-charge-configuration-view-component',
    templateUrl: './time.deposit.charge.configuration.view.component.html'
})
export class TimeDepositChargeConfigurationViewComponent extends ViewsBaseComponent implements OnInit {

    charge: ActivateTimeDepositChargeConfigurationCommand = new ActivateTimeDepositChargeConfigurationCommand();
    queryParams: any;
    configRow: number;

    constructor(
        protected router: Router,
        private route: ActivatedRoute,
        protected location: Location,
        protected notificationService: NotificationService,
        protected workflowService: ApprovalflowService) {
        super(location, router, workflowService, notificationService);
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);

        this.subscribers.querySub = this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.command = this.queryParams.command;
            this.taskId = this.queryParams.taskId;
            this.processId = this.queryParams.taskId;
            this.commandReference = this.queryParams.commandReference;

            this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                .subscribe(data => this.charge = data);
        });
    }

    onChargeConfigurationRowSelect(event) {
        this.configRow = this.charge.timeDepositChargeInfo.timeDepositChargeConfigurations.indexOf(event.data);
        this.router.navigate([event.data.id, 'detail'], {
            relativeTo: this.route,
            queryParams: { configRow: this.configRow },
            queryParamsHandling: "merge"
        });
    }

    cancel() {
        this.location.back();
    }
}