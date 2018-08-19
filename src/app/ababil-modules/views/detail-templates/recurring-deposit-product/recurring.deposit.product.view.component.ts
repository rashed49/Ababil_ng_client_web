import { RecurringDepositProductService } from './../../../../services/recurring-deposit-product/service-api/recurring.deposit.product.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of, Subject } from 'rxjs';
import { RecurringDepositProduct } from '../../../../services/recurring-deposit-product/domain/recurring.deposit.product.model';
import * as commandConstants from '../../../../common/constants/app.command.constants';
import { NotificationService } from '../../../../common/notification/notification.service';
import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';
import { ViewsBaseComponent } from "../../view.base.component";
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';


@Component({
    selector: 'recurring-deposit-product-views',
    templateUrl: './recurring.deposit.product.view.component.html'
})
export class RecurringDepositProductViewComponent extends ViewsBaseComponent implements OnInit {
    installmentSizes: number[] = [];
    tenors: number[] = [];
    queryParams: any = {};
    recurringDepositProductId: number;
    recurringDepositProduct: RecurringDepositProduct = new RecurringDepositProduct();
    verifierSelectionModalVisible: Observable<boolean>;
    command: string = commandConstants.ACTIVATE_RECURRING_DEPOSIT_PRODUCT_COMMAND;
    productDataChanged: Subject<RecurringDepositProduct> = new Subject<RecurringDepositProduct>();

    constructor(protected router: Router,
        private route: ActivatedRoute,
        protected location: Location,
        protected notificationService: NotificationService,
        private recurringDepositProductService: RecurringDepositProductService, protected workflowService: ApprovalflowService) {
        super(location, router, workflowService, notificationService);
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);
        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.command = this.queryParams.command;
            this.taskId = this.queryParams.taskId;
            this.processId = this.queryParams.taskId;
            this.recurringDepositProductId = this.queryParams.recurringDepositProductId;
            if ((this.queryParams.inactive) && (this.queryParams.command === "ActivateRecurringDepositProductCommand")) {
                this.fetchRecurringDepositProductDetails();
            } else {
                this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                    .subscribe(data => {
                        this.recurringDepositProduct = data;
                        this.productDataChanged.next(data);
                    });
            }
            // this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
            // .subscribe(data => {
            //   this.recurringDepositProduct = data;

            //   this.productDataChanged.next(data);


            // });  
        });
        this.productDataChanged
            .pipe(debounceTime(1500), distinctUntilChanged())
            .subscribe(model => {
                this.tenors = [...model.tenors];
                this.installmentSizes = [...model.installmentSizes];
            });
    }

    fetchRecurringDepositProductDetails() {
        this.subscribers.fetchSub = this.recurringDepositProductService
            .fetchRecurringDepositProductDetails({ recurringDepositProductId: this.recurringDepositProductId })
            .pipe(map(data => {
                this.recurringDepositProduct = data;
                this.productDataChanged.next(data);
            }))
            .subscribe();
    }

    cancel() {
        this.location.back();
    }

    navigateAway() {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }

    goToProfitRate() {
        this.router.navigate(['profit-rate/'], {
            relativeTo: this.route,
            queryParams: {
                productId: this.recurringDepositProductId,
                routeBack: this.currentPath(this.location),
                cus: this.queryParams.cus
            }
        });
    }

    goToProductGeneralLedgerMapping() {
        this.router.navigate(['general-ledger-mapping/'], {
            relativeTo: this.route,
            queryParams: {
                productId: this.recurringDepositProductId,
                routeBack: this.currentPath(this.location),
                cus: this.queryParams.cus
            }
        });
    }
}