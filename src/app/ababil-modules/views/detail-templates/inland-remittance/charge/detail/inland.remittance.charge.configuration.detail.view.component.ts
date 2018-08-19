import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from "@angular/router";
import { ViewsBaseComponent } from "../../../../view.base.component";
import { ApprovalflowService } from "../../../../../../services/approvalflow/service-api/approval.flow.service";
import { NotificationService } from "../../../../../../common/notification/notification.service";
import { InlandRemittanceChargeConfiguration } from "../../../../../../services/inland-remittance/charge/domain/inland.remittance.charge.configuration.model";
import { InlandRemittanceChargeCalculationInfo } from "../../../../../../services/inland-remittance/charge/domain/inland.remittance.charge.calculation.info.model";
import { InlandRemittanceVatCalculationInfo } from "../../../../../../services/inland-remittance/charge/domain/inland.remittance.vat.calculation.info.model";
import { InlandRemittanceChargeService } from "../../../../../../services/inland-remittance/charge/service-api/inland.remittance.charge.service";
import * as commandConstants from "../../../../../../common/constants/app.command.constants";
@Component({
    selector: 'inland-remittance-charge-configuration-detail-view-component',
    templateUrl: './inland.remittance.charge.configuration.detail.view.component.html'
})
export class InlandRemittanceChargeConfigurationDetailViewComponent extends ViewsBaseComponent implements OnInit {

    chargeConfigurationId: number;
    chargeConfiguration: InlandRemittanceChargeConfiguration = new InlandRemittanceChargeConfiguration();
    queryParams: any;

    constructor(
        protected router: Router,
        private route: ActivatedRoute,
        private inlandRemittanceChargeService: InlandRemittanceChargeService,
        protected location: Location,
        protected notificationService: NotificationService,
        protected workflowService: ApprovalflowService) {
        super(location, router, workflowService, notificationService);
    }

    ngOnInit(): void {
        this.chargeConfiguration.inlandRemittanceVatCalculationInfo.inlandRemittanceSlabVatConfigs

        this.subscribers.querySub = this.route.queryParams.subscribe(query => {
            this.queryParams = query;
            this.taskId = this.queryParams.taskId;

            if (this.queryParams.command === commandConstants.ACTIVATE_INLAND_REMITTANCE_CHARGE_CONFIGURATION_COMMAND) {
                this.subscribers.routeSub = this.route.params.subscribe(param => {
                    this.chargeConfigurationId = param.id;
                    if (this.chargeConfigurationId) {
                        this.subscribers.fetchChargeConfigurationSub = this.inlandRemittanceChargeService
                            .fetchInlandRemittanceChargeConfiguration({ id: this.chargeConfigurationId })
                            .subscribe(data => {
                                this.chargeConfiguration = data;
                                this.chargeConfiguration.inlandRemittanceChargeCalculationInfo = this.chargeConfiguration.inlandRemittanceChargeCalculationInfo ? this.chargeConfiguration.inlandRemittanceChargeCalculationInfo : new InlandRemittanceChargeCalculationInfo();
                                this.chargeConfiguration.inlandRemittanceVatCalculationInfo = this.chargeConfiguration.inlandRemittanceVatCalculationInfo ? this.chargeConfiguration.inlandRemittanceVatCalculationInfo : new InlandRemittanceVatCalculationInfo();
                            });
                    }
                });
            }
            else if (this.queryParams.command === commandConstants.UPDATE_INLAND_REMITTANCE_CHARGE_CONFIGURATION_COMMAND) {
                this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                    .subscribe(data => {
                        this.chargeConfiguration = data.inlandRemittanceChargeInfo.inlandRemittanceChargeConfigurations[this.queryParams.configRow];
                        this.chargeConfiguration.inlandRemittanceChargeCalculationInfo = this.chargeConfiguration.inlandRemittanceChargeCalculationInfo ? this.chargeConfiguration.inlandRemittanceChargeCalculationInfo : new InlandRemittanceChargeCalculationInfo();
                        this.chargeConfiguration.inlandRemittanceVatCalculationInfo = this.chargeConfiguration.inlandRemittanceVatCalculationInfo ? this.chargeConfiguration.inlandRemittanceVatCalculationInfo : new InlandRemittanceVatCalculationInfo();
                    });
            }
        });
    }

    cancel() {
        this.location.back();
    }
}