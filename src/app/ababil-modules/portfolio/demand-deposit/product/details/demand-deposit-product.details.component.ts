import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { map }from 'rxjs/operators';
import { Location } from '@angular/common';
import * as commandConstants from '../../../../../common/constants/app.command.constants';
import { DemandDepositProduct } from '../../../../../services/demand-deposit-product/domain/demand-deposit-product.model';
import { DemandDepositProductService } from '../../../../../services/demand-deposit-product/service-api/demand-deposit-product.service';
import { Observable } from 'rxjs';
import { VerifierSelectionEvent } from '../../../../../common/components/verifier-selection/verifier.selection.component';
import { NotificationService } from './../../../../../common/notification/notification.service';
import { FormBaseComponent } from '../../../../../common/components/base.form.component';
import { ApprovalflowService } from '../../../../../services/approvalflow/service-api/approval.flow.service';

export const SUCCESS_MSG: string[] = ["demand.deposit.product.save.success", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/demand-deposit-product";

@Component({
    templateUrl: './demand-deposit-product.details.component.html'
})
export class DemandDepositProductDetailComponent extends FormBaseComponent implements OnInit {

    constructor(protected location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private demandDepositProductService: DemandDepositProductService,
        private notificationService: NotificationService,
        protected approvalFlowService: ApprovalflowService) {
        super(location, approvalFlowService);
    }

    demandDepositProductDetails: DemandDepositProduct = new DemandDepositProduct();
    demandDepositProductId: number;
    command: string = commandConstants.ACTIVATE_DEMAND_DEPOSIT_PRODUCT_COMMAND;
    verifierSelectionModalVisible: Observable<boolean>;
    queryParams: any = {};

    ngOnInit() {
        this.showVerifierSelectionModal = of(false);
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.demandDepositProductId = +params['id'];
            this.fetchDemandDepositProductDetails();
        });

        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.taskId = params['taskId'];
            this.commandReference = params['commandReference'];
        });
    }

    activate() {
        this.showVerifierSelectionModal = of(true);
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let view_ui = DETAILS_UI.concat("?demandDepositProductId=").concat(this.demandDepositProductId.toString()).concat("&").concat("inactive=true").concat("&");
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("?"));
        this.demandDepositProductService.activateDemandDepositProduct(this.demandDepositProductId, urlSearchParams)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
                this.navigateAway();
            });
    }

    cancel() {
        this.navigateAway();
    }

    navigateAway() {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }

    goToProductProfitRate() {
        const url = this.router.createUrlTree(['/product', this.demandDepositProductId, 'profit-rate'], {
            relativeTo: this.route,
            queryParams: {
                product: this.currentPath(this.location),
                productType: this.demandDepositProductDetails.type
            },
            queryParamsHandling: "merge"
        });
        this.router.navigateByUrl(url);
    }

    goToProductGeneralLedgerMapping() {
        const url = this.router.createUrlTree(['/product', this.demandDepositProductId, 'product-general-ledger-mapping'], {
            relativeTo: this.route,
            queryParams: {
                product: this.currentPath(this.location)
            },
            queryParamsHandling: 'merge'
        });
        this.router.navigateByUrl(url);
    }

    fetchDemandDepositProductDetails() {
        this.subscribers.fetchSub = this.demandDepositProductService
            .fetchDemandDepositProductDetails({ id: this.demandDepositProductId + '' })
            .pipe(map(demandDepositProduct => this.demandDepositProductDetails = demandDepositProduct))
            .subscribe();
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
