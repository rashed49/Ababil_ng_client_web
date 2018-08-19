import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/primeng';
import { Subscriber, Observable, of } from 'rxjs';
import { NotificationService } from '../../../../../../../common/notification/notification.service';
import { BaseComponent } from '../../../../../../../common/components/base.component';
import { FixedDepositProductService } from '../../../../../../../services/fixed-deposit-product/service-api/fixed.deposit.product.service';
import { FixedDepositProduct } from '../../../../../../../services/fixed-deposit-product/domain/fixed.deposit.product.model';
import * as urlSearchParameterConstants from '../../../../../../../common/constants/app.search.parameter.constants';
import { FormBaseComponent } from '../../../../../../../common/components/base.form.component';
import { ApprovalflowService } from '../../../../../../../services/approvalflow/service-api/approval.flow.service';
import { Location } from '@angular/common';
import { VerifierSelectionEvent } from '../../../../../../../common/components/verifier-selection/verifier.selection.component';
import { FixedDepositProductSaveEvent } from '../fixed.deposit.product.form.component';
import * as mapper from '../fixed.deposit.product.mapper';


export const SUCCESS_MSG: string[] = ["fixed.deposit.product.update.success", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/fixed-deposit-product";

@Component({
    templateUrl: './fixed.deposit.product.edit.component.html',
})
export class FixedDepositProductEditFormComponent extends FormBaseComponent implements OnInit {
    constructor(private router: Router,
        private route: ActivatedRoute,
        private fixedDepositProductService: FixedDepositProductService,
        private notificationService: NotificationService,
        protected location: Location, protected approvalFlowService: ApprovalflowService
    ) {
        super(location, approvalFlowService);
    }

    selectedId: number;
    command: string = "UpdateFixedDepositProductCommand";
    fixedDepositProductFormData: Observable<FixedDepositProduct>;
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

                                if (queryParams['command'] === "ActivateFixedDepositProductCommand") {
                                    this.fetchFixedDepositProductDetails(data);
                                } else {
                                    this.fixedDepositProductFormData = data;
                                    this.status = data.status;

                                }
                            }
                        );
                    } else {
                        this.fetchFixedDepositProductDetails(this.selectedId);
                    }
                });
            });

    }
    status: any;
    fetchFixedDepositProductDetails(productId: number) {
        this.fixedDepositProductService
            .fetchFixedDepositProductDetails({ id: productId + '' })
            .subscribe(data => {
                this.fixedDepositProductFormData = data;
                this.status = data.status;
                console.log(data.status);
            });
    }

    onSave(event: FixedDepositProductSaveEvent): void {
        let fixedDepositProduct = event.fixedDepositProductForm;
        fixedDepositProduct.status = this.status;

        fixedDepositProduct.id = this.selectedId;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, DETAILS_UI.concat("?fixedDepositProductId=").concat(this.selectedId.toString()).concat("&"), this.location.path().concat("&"));


        this.subscribers.saveFixedDepositProductSub = this.fixedDepositProductService.updateFixedDepositProduct(fixedDepositProduct, { 'id': this.selectedId + '' }, urlSearchParams).subscribe(
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


    onCancel(): void {
        this.navigateAway();
    }

    navigateAway() {
        if (this.taskId) {
            if (this.queryParams.command === "UpdateFixedDepositProductCommand") {
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
        } else {
            this.router.navigate([this.queryParams.product], {
                relativeTo: this.route
            });
        }
    }

}