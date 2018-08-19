import { Component } from "@angular/core";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { ViewsBaseComponent } from "../../../view.base.component";
import { Observable, of } from "rxjs";
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from "@angular/router";
import { NotificationService } from "../../../../../common/notification/notification.service";
import { ApprovalflowService } from "../../../../../services/approvalflow/service-api/approval.flow.service";
import { InlandRemittanceLot } from "../../../../../services/inland-remittance/lot/domain/inland.remittance.lot.models";
import { InlandRemittanceLotService } from "../../../../../services/inland-remittance/lot/service-api/inland.remittance.lot.service";

@Component({
    selector: 'lot-view',
    templateUrl: './inland.remittance.lot.view.component.html'
})
export class InlandRemittanceViewLotComponent extends ViewsBaseComponent implements OnInit {
    queryParams: any = {};
    inlandRemittanceLot: InlandRemittanceLot = new InlandRemittanceLot();
    remittanceProductTypeMap: Map<number, any> = new Map();
    inlandRemittanceProductType: string = "";

    constructor(private route: ActivatedRoute,
        private lotService: InlandRemittanceLotService,
        protected workflowService: ApprovalflowService
        , protected router: Router,
        protected notificationService: NotificationService,
        protected location: Location) {
        super(location, router, workflowService, notificationService);

    }
    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);
        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.command = this.queryParams.command;
            this.taskId = this.queryParams.taskId;
            this.processId = this.queryParams.taskId;
            this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                .subscribe(data => {
                    this.inlandRemittanceLot = data;
                    if (this.inlandRemittanceLot) {
                        this.subscribers.fetchLotSub = this.lotService
                            .fetchInlandRemittanceProduct()
                            .subscribe(res => {
                                res.forEach(element => {
                                    this.remittanceProductTypeMap.set(element.id, element.name);
                                    this.inlandRemittanceProductType = this.remittanceProductTypeMap.get(this.inlandRemittanceLot.inlandRemittanceProduct.id)
                                });
                            });
                    }
                });
        });
    }

}