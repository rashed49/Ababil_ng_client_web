import { BaseComponent } from './../../../../../../../common/components/base.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RecurringDepositProductService } from '../../../../../../../services/recurring-deposit-product/service-api/recurring.deposit.product.service';
import { RecurringDepositProduct } from '../../../../../../../services/recurring-deposit-product/domain/recurring.deposit.product.model';
import { NotificationService } from '../../../../../../../common/notification/notification.service';
import { FormBaseComponent } from '../../../../../../../common/components/base.form.component';
import { ApprovalflowService } from '../../../../../../../services/approvalflow/service-api/approval.flow.service';
import { Location } from '@angular/common';
import { Subscriber, Observable, of } from 'rxjs';
import { RecurringDepositProductSaveEvent } from '../recurring.deposit.product.form.component';


export const SUCCESS_MSG: string[] = ["recurring.deposit.product.update.success", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/recurring-deposit-product";

@Component({
    selector: 'recurring-deposit-product-form-edit',
    templateUrl: './recurring.deposit.product.form.edit.component.html'
})
export class RecurringDepositProductFormEditComponent extends FormBaseComponent implements OnInit {

    recurringDepositProductId: number;
    recurringDepositProductFormData: Observable<RecurringDepositProduct>;
    command: string = "UpdateRecurringDepositProductCommand";
    status: any;
    queryParams: any;
    @ViewChild('recurringDeposit') recurringDeposit: any;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private recurringDepositProductService: RecurringDepositProductService, protected location: Location, protected approvalFlowService: ApprovalflowService
    ) {
        super(location, approvalFlowService);
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);
        this.subscribers.routeSub = this.route.params
            .subscribe(params => {
                this.recurringDepositProductId = +params['id'];

                this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
                    this.queryParams = queryParams;
                    if (queryParams['taskId']) {

                        this.taskId = queryParams['taskId'];
                        this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                            data => {
                                if (queryParams['command'] === "ActivateRecurringDepositProductCommand") {
                                    this.fetchRecurringDepositProductDetails(data);
                                } else {
                                    this.recurringDepositProductFormData = data;
                                    this.status = data.status;
                                }
                            }
                        );
                    } else {
                        this.fetchRecurringDepositProductDetails(this.recurringDepositProductId);
                    }
                });
            });



    }

    fetchRecurringDepositProductDetails(productId: number) {
        this.recurringDepositProductService
            .fetchRecurringDepositProductDetails({ recurringDepositProductId: productId })
            .subscribe(data => {
                this.recurringDepositProductFormData = data;
                this.status = data.status;
            });
    }

    onCancel(): void {
        this.navigateAway();
    }

    navigateAway() {
        if (this.taskId) {
            if (this.queryParams.command === "UpdateRecurringDepositProductCommand") {
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
    onSave(event: RecurringDepositProductSaveEvent): void {
        let recurringDepositProduct = event.recurringDepositProductForm;
        recurringDepositProduct.id = this.recurringDepositProductId;
        recurringDepositProduct.status = this.status;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, DETAILS_UI.concat("?recurringDepositProductId=").concat(this.recurringDepositProductId.toString()).concat("&"), this.location.path().concat("&"));
        this.subscribers.saveFixedDepositProductSub = this.recurringDepositProductService.updateRecurringDepositProduct({ recurringDepositProductId: this.recurringDepositProductId }, recurringDepositProduct, urlSearchParams).subscribe(
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

}