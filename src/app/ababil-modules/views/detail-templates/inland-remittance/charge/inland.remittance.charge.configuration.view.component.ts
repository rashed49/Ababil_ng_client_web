import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from "@angular/router";
import { ViewsBaseComponent } from "../../../view.base.component";
import { ApprovalflowService } from "../../../../../services/approvalflow/service-api/approval.flow.service";
import { NotificationService } from "../../../../../common/notification/notification.service";
import { ActivateInlandRemittanceChargeConfigurationCommand } from "../../../../../services/inland-remittance/charge/domain/inland.remittance.charge.configuration.model";
import { of } from "rxjs";

@Component({
    selector: 'inland-remittance-charge-configuration-view-component',
    templateUrl: './inland.remittance.charge.configuration.view.component.html'
})
export class InlandRemittanceChargeConfigurationViewComponent extends ViewsBaseComponent implements OnInit {

    charge: ActivateInlandRemittanceChargeConfigurationCommand = new ActivateInlandRemittanceChargeConfigurationCommand();
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
        this.configRow = this.charge.inlandRemittanceChargeInfo.inlandRemittanceChargeConfigurations.indexOf(event.data);
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