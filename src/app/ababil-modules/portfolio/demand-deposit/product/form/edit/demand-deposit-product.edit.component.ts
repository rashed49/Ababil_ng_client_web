import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/primeng';
import { Subscriber, Observable, of } from 'rxjs';
import { NotificationService } from '../../../../../../common/notification/notification.service';
import { BaseComponent } from '../../../../../../common/components/base.component';
import { DemandDepositProductService } from '../../../../../../services/demand-deposit-product/service-api/demand-deposit-product.service';
import { DemandDepositProductSaveEvent } from '../demand-deposit-product.form.component';
import { DemandDepositProduct } from '../../../../../../services/demand-deposit-product/domain/demand-deposit-product.model';
import * as commandConstants from '../../../../../../common/constants/app.command.constants';
import * as urlSearchParameterConstants from '../../../../../../common/constants/app.search.parameter.constants';
import { FormBaseComponent } from '../../../../../../common/components/base.form.component';
import { Location } from '@angular/common';
import { ApprovalflowService } from '../../../../../../services/approvalflow/service-api/approval.flow.service';

export const SUCCESS_MSG: string[] = ["demand.deposit.product.update.success", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/demand-deposit-product";


@Component({
    templateUrl: './demand-deposit-product.edit.component.html',
})
export class DemandDepositProductEditFormComponent extends FormBaseComponent implements OnInit {

    constructor(private router: Router,
        private route: ActivatedRoute,
        private demandDepositProductService: DemandDepositProductService,
        private notificationService: NotificationService,
        protected location: Location,
        protected approvalFlowService: ApprovalflowService
    ) {
        super(location, approvalFlowService);
    }

    demandDepositProductFormData: DemandDepositProduct;
    selectedId: number;
    command: string = commandConstants.DEMAND_DEPOSIT_PRODUCT_UPDATE_COMMAND;
    queryParams: any;
    ngOnInit() {
        this.showVerifierSelectionModal = of(false);

        this.subscribers.fetchFixedDepositProductDetailSub = this.route.params.subscribe(
            params => {
                this.selectedId = +params['id'];
                this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
                    this.queryParams = queryParams;
                    if (queryParams['taskId']) {
                        this.taskId = queryParams['taskId'];
                        this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                            data => {

                                if (queryParams['command'] === "ActivateDemandDepositProductCommand") {
                                    this.fetchDemandDepositProductDetails(data);
                                } else {
                                    this.demandDepositProductFormData = data;
                                    this.status = data.status;

                                }
                            }
                        );
                    } else {
                        this.fetchDemandDepositProductDetails(this.selectedId);

                    }
                });
            });

    }


    onSave(event: DemandDepositProductSaveEvent): void {
        let demandDepositProduct = event.demandDepositProductForm;
        demandDepositProduct.id = this.selectedId;
        demandDepositProduct.status = this.status;

        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, DETAILS_UI.concat("?demandDepositProductId=").concat(this.selectedId.toString()).concat("&"), this.location.path().concat("&"));
        this.subscribers.saveSub = this.demandDepositProductService
        this.subscribers.saveFixedDepositProductSub = this.demandDepositProductService.updateDemandDepositProduct(demandDepositProduct, { 'id': this.selectedId + '' }, urlSearchParams).subscribe(
            (data) => {
                if (this.status == undefined || this.status == "INACTIVE" || this.status === null) {
                    this.notificationService.sendSuccessMsg(SUCCESS_MSG[0]);
                } else {
                    this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
                }
                this.navigateAway();
            }
        );
    }

    status: any;
    fetchDemandDepositProductDetails(productId: number) {
        this.demandDepositProductService
            .fetchDemandDepositProductDetails({ id: productId + '' })
            .subscribe(data => {
                this.demandDepositProductFormData = data;
                this.status = data.status;
            });
    }

    fetchDemandDepositProductChequePrefixes() {
        this.demandDepositProductService.fetchDemandDepositProductChequePrefixes({ id: this.selectedId + "" })
            .subscribe(data => {
                this.demandDepositProductFormData.demandDepositProductChequePrefixes = data.content;
            });
    }

    fetchDemandDepositProductChequeBookSize() {
        this.demandDepositProductService.fetchDemandDepositProductChequeBookSizes({ id: this.selectedId + "" })
            .subscribe(data => {
                this.demandDepositProductFormData.demandDepositProductChequeBookSizes = data.content;
            });
    }


    onCancel(): void {
        this.navigateAway();
    }

    navigateAway() {

        if (this.taskId) {
            if (this.queryParams.command === "UpdateDemandDepositProductCommand") {
                this.router.navigate(['approval-flow/pendingtasks']);
            } else {
                this.router.navigate([this.queryParams.product], {
                    relativeTo: this.route,
                    queryParams: {
                        taskId: this.queryParams.taskId,
                        command: this.queryParams.command,
                        commandReference: this.queryParams.commandReference
                    }
                });
            }
        }
        else {
            this.router.navigate([this.queryParams.product], {
                relativeTo: this.route
            });
        }
    }
}
