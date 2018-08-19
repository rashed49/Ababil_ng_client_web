import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlAccountService } from '../../../../../../services/glaccount/service-api/gl.account.service';
import { GlAccount } from '../../../../../../services/glaccount/domain/gl.account.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscriber, of } from 'rxjs';
import { Location } from '@angular/common';
import { BaseComponent } from '../../../../../../common/components/base.component';
import * as commandConstants from '../../../../../../common/constants/app.command.constants';
import { FixedDepositProduct } from '../../../../../../services/fixed-deposit-product/domain/fixed.deposit.product.model';
import { FixedDepositProductService } from '../../../../../../services/fixed-deposit-product/service-api/fixed.deposit.product.service';
import { Observable } from 'rxjs';
import { VerifierSelectionEvent } from '../../../../../../common/components/verifier-selection/verifier.selection.component';
import { NotificationService } from './../../../../../../common/notification/notification.service';
import * as urlSearchParameterConstants from '../../../../../../common/constants/app.search.parameter.constants';
import { ApprovalflowService } from '../../../../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from '../../../../../../common/components/base.form.component';

export const SUCCESS_MSG: string[] = ["fixed.deposit.account.activated", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/fixed-deposit-product";

@Component({
    templateUrl: './fixed.deposit.product.detail.component.html',

})
export class FixedDepositProductDetailComponent extends FormBaseComponent implements OnInit {

    tenors: number[];
    fixedDepositProductDetails: FixedDepositProduct = new FixedDepositProduct();
    fixedDepositProductId: number;
    verifierSelectionModalVisible: Observable<boolean>;
    command: string = commandConstants.ACTIVATE_FIXED_DEPOSIT_PRODUCT_COMMAND;
    queryParams: any = {};

    constructor(
        protected location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private fixedDepositProductService: FixedDepositProductService,
        private notificationService: NotificationService,
        protected approvalFlowService: ApprovalflowService) {
        super(location, approvalFlowService);

    }

    ngOnInit() {
        this.showVerifierSelectionModal = of(false);
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.fixedDepositProductId = +params['id'];
            this.fetchFixedDepositProductDetails();
        });

        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.taskId = params['taskId'];
            this.commandReference = params['commandReference'];
        });
    }

    fetchFixedDepositProductDetails() {
        this.subscribers.fetchSub = this.fixedDepositProductService
            .fetchFixedDepositProductDetails({ id: this.fixedDepositProductId + '' })
            .subscribe(data => {
                this.fixedDepositProductDetails = data;
                this.tenors = [...data.tenors];
            });
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
        let view_ui = DETAILS_UI.concat("?fixedDepositProductId=").concat(this.fixedDepositProductId.toString()).concat("&").concat("inactive=true").concat("&");
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("?"));
        this.fixedDepositProductService.activateFixedDepositProduct(this.fixedDepositProductId, urlSearchParams)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
                this.navigateAway();
            });
    }

    goToProductProfitRate() {
        const url = this.router.createUrlTree(['/product', this.fixedDepositProductId, 'profit-rate'], {
            relativeTo: this.route,
            queryParams: {
                product: this.currentPath(this.location)
            },
            queryParamsHandling: "merge"
        });
        this.router.navigateByUrl(url);
    }

    goToProductGeneralLedgerMapping() {
        const url = this.router.createUrlTree(['/product', this.fixedDepositProductId, 'product-general-ledger-mapping'], {
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