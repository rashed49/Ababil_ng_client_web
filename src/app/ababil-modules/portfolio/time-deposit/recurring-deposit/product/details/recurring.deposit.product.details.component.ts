import { RecurringDepositProductService } from './../../../../../../services/recurring-deposit-product/service-api/recurring.deposit.product.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecurringDepositProduct } from '../../../../../../services/recurring-deposit-product/domain/recurring.deposit.product.model';
import { VerifierSelectionEvent } from '../../../../../../common/components/verifier-selection/verifier.selection.component';
import * as commandConstants from '../../../../../../common/constants/app.command.constants';
import { NotificationService } from '../../../../../../common/notification/notification.service';
import { FormBaseComponent } from '../../../../../../common/components/base.form.component';
import { ApprovalflowService } from '../../../../../../services/approvalflow/service-api/approval.flow.service';

export const SUCCESS_MSG: string[] = ["recurring.deposit.account.activated", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/recurring-deposit-product";

@Component({
    selector: 'recurring-deposit-product-details',
    templateUrl: './recurring.deposit.product.details.component.html'
})
export class RecurringDepositProductDetailsComponent extends FormBaseComponent implements OnInit {
    installmentSizes : number[]= [];
    tenors: number[] = [];
    queryParams: any = {};
    recurringDepositProductId: number;
    recurringDepositProduct: RecurringDepositProduct = new RecurringDepositProduct();
    verifierSelectionModalVisible: Observable<boolean>;
    command: string = commandConstants.ACTIVATE_RECURRING_DEPOSIT_PRODUCT_COMMAND;

    constructor(private router: Router,
        private route: ActivatedRoute,
        protected location: Location,
        private notificationService: NotificationService,
        private recurringDepositProductService: RecurringDepositProductService, protected approvalFlowService: ApprovalflowService) {
        super(location, approvalFlowService);
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.recurringDepositProductId = +params['id'];
            this.fetchDemandDepositProductDetails();
        });

        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.taskId = params['taskId'];
            this.commandReference = params['commandReference'];
        });
    }

    fetchDemandDepositProductDetails() {
        this.subscribers.fetchSub = this.recurringDepositProductService
            .fetchRecurringDepositProductDetails({ recurringDepositProductId: this.recurringDepositProductId })
            .pipe(map(data => {
                this.recurringDepositProduct = data;
                this.tenors = [...this.recurringDepositProduct.tenors];
                this.installmentSizes = [...this.recurringDepositProduct.installmentSizes];
            })).subscribe();
    }

    cancel() {
        this.navigateAway();
    }

    navigateAway() {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }

    activate() {
        this.showVerifierSelectionModal = of(true);
    }


    onVerifierSelect(event: VerifierSelectionEvent) {
        let view_ui = DETAILS_UI.concat("?recurringDepositProductId=").concat(this.recurringDepositProductId.toString()).concat("&").concat("inactive=true").concat("&");
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("?"));
        this.recurringDepositProductService.activateRecurringDepositProduct(this.recurringDepositProductId, urlSearchParams)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
                this.navigateAway();
            });
    }

    goToProductProfitRate() {
        const url = this.router.createUrlTree(['/product', this.recurringDepositProductId, 'profit-rate'], {
            relativeTo: this.route,
            queryParams: {
                product: this.currentPath(this.location)
            },
            queryParamsHandling: "merge"
        });
        this.router.navigateByUrl(url);
    }

    goToProductGeneralLedgerMapping() {
        const url = this.router.createUrlTree(['/product', this.recurringDepositProductId, 'product-general-ledger-mapping'], {
            relativeTo: this.route,
            queryParams: {
                product: this.currentPath(this.location)
            },
            queryParamsHandling: 'merge'
        });
        this.router.navigateByUrl(url);
    }
    goToEditPage() {

        this.router.navigate(['edit'], { relativeTo: this.route,
        
            queryParams: {
                product: this.currentPath(this.location)
            },
            queryParamsHandling: 'merge'
        });
        
    }
}