import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from "@angular/router";
import { ViewsBaseComponent } from "../../../view.base.component";
import { ApprovalflowService } from "../../../../../services/approvalflow/service-api/approval.flow.service";

import * as commandConstants from "../../../../../common/constants/app.command.constants";
import { TimeDepositChargeConfiguration } from "../../../../../services/time-deposit-charge/domain/time.deposit.charge.configuration.model";
import { TimeDepositChargeService } from "../../../../../services/time-deposit-charge/service-api/time.deposit.charge.service";
import { NotificationService } from "../../../../../common/notification/notification.service";
import { TimeDepositVatCalculationInfo } from "../../../../../services/time-deposit-charge/domain/time.deposit.vat.calculation.info.model";
import { TimeDepositChargeCalculationInfo } from "../../../../../services/time-deposit-charge/domain/time.charge.calculation.info.model";

@Component({
    selector: 'time-deposit-charge-configuration-detail-view-component',
    templateUrl: './time.deposit.charge.configuration.detail.view.component.html'
})
export class TimeDepositChargeConfigurationDetailViewComponent extends ViewsBaseComponent implements OnInit {

    chargeConfigurationId: number;
    chargeConfiguration: TimeDepositChargeConfiguration = new TimeDepositChargeConfiguration();
    queryParams: any;

    constructor(
        protected router: Router,
        private route: ActivatedRoute,
        private timeDepositChargeService: TimeDepositChargeService,
        protected location: Location,
        protected notificationService: NotificationService,
        protected workflowService: ApprovalflowService) {
        super(location, router, workflowService, notificationService);
    }

    ngOnInit(): void {
        this.chargeConfiguration.timeDepositVatCalculationInfo.timeDepositSlabVatConfigs

        this.subscribers.querySub = this.route.queryParams.subscribe(query => {
            this.queryParams = query;
            this.taskId = this.queryParams.taskId;

            if (this.queryParams.command === commandConstants.ACTIVATE_TIME_DEPOSIT_CHARGE_CONFIGURATION_COMMAND) {
                this.subscribers.routeSub = this.route.params.subscribe(param => {
                    this.chargeConfigurationId = param.id;
                    if (this.chargeConfigurationId) {
                        this.subscribers.fetchChargeConfigurationSub = this.timeDepositChargeService
                            .fetchTimeDepositChargeConfiguration({ id: this.chargeConfigurationId })
                            .subscribe(data => {
                                this.chargeConfiguration = data;
                                this.chargeConfiguration.timeDepositChargeCalculationInfo = this.chargeConfiguration.timeDepositChargeCalculationInfo ? this.chargeConfiguration.timeDepositChargeCalculationInfo : new TimeDepositChargeCalculationInfo();
                                this.chargeConfiguration.timeDepositVatCalculationInfo = this.chargeConfiguration.timeDepositVatCalculationInfo ? this.chargeConfiguration.timeDepositVatCalculationInfo : new TimeDepositVatCalculationInfo();
                            });
                    }
                });
            }
            else if (this.queryParams.command === commandConstants.UPDATE_TIME_DEPOSIT_CHARGE_CONFIGURATION_COMMAND) {
                this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                    .subscribe(data => {
                        this.chargeConfiguration = data.timeDepositChargeInfo.timeDepositChargeConfigurations[this.queryParams.configRow];
                        this.chargeConfiguration.timeDepositChargeCalculationInfo = this.chargeConfiguration.timeDepositChargeCalculationInfo ? this.chargeConfiguration.timeDepositChargeCalculationInfo : new TimeDepositChargeCalculationInfo();
                        this.chargeConfiguration.timeDepositVatCalculationInfo = this.chargeConfiguration.timeDepositVatCalculationInfo ? this.chargeConfiguration.timeDepositVatCalculationInfo : new TimeDepositVatCalculationInfo();
                    });
            }
        });
    }

    cancel() {
        this.location.back();
    }
}