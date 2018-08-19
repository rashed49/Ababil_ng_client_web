import { Component, OnInit } from "@angular/core";
import { InlandRemittanceInstrumentPaymentInfo } from "../../../../../../services/inland-remittance/issue/domain/inland.remittance.issue.payment.models";
import { ViewsBaseComponent } from "../../../../view.base.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { ApprovalflowService } from "../../../../../../services/approvalflow/service-api/approval.flow.service";
import { NotificationService } from "../../../../../../common/notification/notification.service";
import { InlandRemittanceLotService } from "../../../../../../services/inland-remittance/lot/service-api/inland.remittance.lot.service";
import { Observable, of } from "rxjs";

@Component({
    selector: 'payment-view',
    templateUrl: './inland.remittance.issue.payment.view.component.html'
})
export class InlandRemittanceIssuePaymentViewComponent extends ViewsBaseComponent implements OnInit {


    inlandRemittanceInstrumentPaymentInfo: InlandRemittanceInstrumentPaymentInfo = new InlandRemittanceInstrumentPaymentInfo();
    queryParams: any;
    inlandRemittanceProductType: string = "";
    remittanceProductTypeMap: Map<number, any> = new Map();
    productId: number;

    constructor(private route: ActivatedRoute,
        protected workflowService: ApprovalflowService
        , protected router: Router,
        protected notificationService: NotificationService,
        private lotService: InlandRemittanceLotService,
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
                    this.inlandRemittanceInstrumentPaymentInfo = data;
                    this.productId=this.inlandRemittanceInstrumentPaymentInfo.productId;
                    console.log(this.inlandRemittanceInstrumentPaymentInfo);

                    if (this.inlandRemittanceInstrumentPaymentInfo) {
                        this.subscribers.fetchLotSub = this.lotService
                            .fetchInlandRemittanceProduct()
                            .subscribe(res => {
                                res.forEach(element => {
                                    this.remittanceProductTypeMap.set(element.id, element.name);
                                    this.inlandRemittanceProductType = this.remittanceProductTypeMap.get(this.productId);
                                    console.log( this.inlandRemittanceProductType);
                                });
                            });
                    }
                });
        });
    }
}