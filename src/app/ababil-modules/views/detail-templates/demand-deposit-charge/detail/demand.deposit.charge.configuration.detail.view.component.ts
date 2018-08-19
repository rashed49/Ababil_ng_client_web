import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from "@angular/router";
import { ViewsBaseComponent } from "../../../view.base.component";
import { ApprovalflowService } from "../../../../../services/approvalflow/service-api/approval.flow.service";

import * as commandConstants from "../../../../../common/constants/app.command.constants";
import { DemandDepositChargeConfiguration } from "../../../../../services/demand-deposit-charge/domain/demand.deposit.charge.configuration.model";
import { DemandDepositChargeService } from "../../../../../services/demand-deposit-charge/service-api/demand.deposit.charge.service";
import { NotificationService } from "../../../../../common/notification/notification.service";
import { DemandDepositChargeCalculationInfo } from "../../../../../services/demand-deposit-charge/domain/demand.deposit.charge.calculation.info.model";
import { DemandDepositVatCalculationInfo } from "../../../../../services/demand-deposit-charge/domain/demand.deposit.vat.calculation.info.model";

@Component({
    selector: 'demand-deposit-charge-configuration-detail-view-component',
    templateUrl: './demand.deposit.charge.configuration.detail.view.component.html'
})
export class DemandDepositChargeConfigurationDetailViewComponent extends ViewsBaseComponent implements OnInit {

    chargeConfigurationId: number;
    chargeConfiguration: DemandDepositChargeConfiguration = new DemandDepositChargeConfiguration();
    queryParams: any;

    constructor(
        protected router: Router,
        private route: ActivatedRoute,
        private demandDepositChargeService: DemandDepositChargeService,
        protected location: Location,
        protected notificationService: NotificationService,
        protected workflowService: ApprovalflowService) {
        super(location, router, workflowService, notificationService);
    }

    ngOnInit(): void {
        this.chargeConfiguration.demandDepositVatCalculationInfo.demandDepositSlabVatConfigs

        this.subscribers.querySub = this.route.queryParams.subscribe(query => {
            this.queryParams = query;
            this.taskId = this.queryParams.taskId;

            if (this.queryParams.command === commandConstants.ACTIVATE_DEMAND_DEPOSIT_CHARGE_CONFIGURATION_COMMAND) {
                this.subscribers.routeSub = this.route.params.subscribe(param => {
                    this.chargeConfigurationId = param.id;
                    if (this.chargeConfigurationId) {
                        this.subscribers.fetchChargeConfigurationSub = this.demandDepositChargeService
                            .fetchDemandDepositChargeConfiguration({ id: this.chargeConfigurationId })
                            .subscribe(data => {
                                this.chargeConfiguration = data;
                                this.chargeConfiguration.demandDepositChargeCalculationInfo = this.chargeConfiguration.demandDepositChargeCalculationInfo ? this.chargeConfiguration.demandDepositChargeCalculationInfo : new DemandDepositChargeCalculationInfo();
                                this.chargeConfiguration.demandDepositVatCalculationInfo = this.chargeConfiguration.demandDepositVatCalculationInfo ? this.chargeConfiguration.demandDepositVatCalculationInfo : new DemandDepositVatCalculationInfo();
                            });
                    }
                });
            }
            else if (this.queryParams.command === commandConstants.UPDATE_DEMAND_DEPOSIT_CHARGE_CONFIGURATION_COMMAND) {
                this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                    .subscribe(data => {
                        this.chargeConfiguration = data.demandDepositChargeInfo.demandDepositChargeConfigurations[this.queryParams.configRow];
                        this.chargeConfiguration.demandDepositChargeCalculationInfo = this.chargeConfiguration.demandDepositChargeCalculationInfo ? this.chargeConfiguration.demandDepositChargeCalculationInfo : new DemandDepositChargeCalculationInfo();
                        this.chargeConfiguration.demandDepositVatCalculationInfo = this.chargeConfiguration.demandDepositVatCalculationInfo ? this.chargeConfiguration.demandDepositVatCalculationInfo : new DemandDepositVatCalculationInfo();
                    });
            }
        });
    }

    cancel() {
        this.location.back();
    }
}