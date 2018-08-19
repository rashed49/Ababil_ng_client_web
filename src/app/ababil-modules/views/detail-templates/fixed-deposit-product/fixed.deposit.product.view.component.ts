import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlAccountService } from '../../../../services/glaccount/service-api/gl.account.service';
import { GlAccount } from '../../../../services/glaccount/domain/gl.account.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscriber, of } from 'rxjs';
import { Location } from '@angular/common';
import { BaseComponent } from '../../../../common/components/base.component';
import * as commandConstants from '../../../../common/constants/app.command.constants';
import { FixedDepositProduct } from '../../../../services/fixed-deposit-product/domain/fixed.deposit.product.model';
import { FixedDepositProductService } from '../../../../services/fixed-deposit-product/service-api/fixed.deposit.product.service';
import { Observable } from 'rxjs';
import { VerifierSelectionEvent } from '../../../../common/components/verifier-selection/verifier.selection.component';
import { NotificationService } from './../../../../common/notification/notification.service';
import * as urlSearchParameterConstants from '../../../../common/constants/app.search.parameter.constants';
import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from '../../../../common/components/base.form.component';
import { ViewsBaseComponent } from "../../view.base.component";


@Component({
    templateUrl: './fixed.deposit.product.view.component.html',

})
export class FixedDepositProductViewComponent extends ViewsBaseComponent implements OnInit {

    tenors: number[];
    fixedDepositProductDetails: FixedDepositProduct = new FixedDepositProduct();
    fixedDepositProductId: number;
    verifierSelectionModalVisible: Observable<boolean>;
    queryParams: any = {};

    constructor(
        protected location: Location,
        private route: ActivatedRoute,
        protected router: Router,
        private fixedDepositProductService: FixedDepositProductService,
        protected notificationService: NotificationService,
        protected workflowService: ApprovalflowService) {
        super(location, router, workflowService, notificationService);

    }

    ngOnInit() {
        this.showVerifierSelectionModal = of(false);
        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.command = this.queryParams.command;
            this.taskId = this.queryParams.taskId;
            this.processId = this.queryParams.taskId;
            this.fixedDepositProductId = this.queryParams.fixedDepositProductId;
            console.log(this.fixedDepositProductId);
        });
        if ( (this.queryParams.inactive) && (this.queryParams.command === "ActivateFixedDepositProductCommand") ) {
            this.fetchFixedDepositProductDetails();
        } else {
            this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                .subscribe(data => {
                    this.fixedDepositProductDetails = data;
                    console.log(data);
                    this.tenors = [...data.tenors];
                });
        }

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
        this.location.back();
    }

    navigateAway() {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }


    goToProfitRate() {
        this.router.navigate(['profit-rate/'], {
            relativeTo: this.route,
            queryParams: {
                productId: this.fixedDepositProductId,
                routeBack: this.currentPath(this.location),
                cus: this.queryParams.cus
            }
        });
    }

    goToProductGeneralLedgerMapping() {
        this.router.navigate(['general-ledger-mapping/'], {
            relativeTo: this.route,
            queryParams: {
                productId: this.fixedDepositProductId,
                routeBack: this.currentPath(this.location),
                cus: this.queryParams.cus
            }
        });
    }
}