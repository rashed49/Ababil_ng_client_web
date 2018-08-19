//angular imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

//primeng imports
import { SelectItem } from 'primeng/api';
import { MenuItem, TreeNode } from 'primeng/primeng';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';

//rxjs imports
import { Subscriber, of } from 'rxjs';
import { Observable } from 'rxjs';

//services
import { NotificationService } from '../../../../../common/notification/notification.service';
import { ApprovalflowService } from '../../../../../services/approvalflow/service-api/approval.flow.service';

//other components
import { ViewsBaseComponent } from '../../../view.base.component';

//models
import { GlAccount } from '../../../../../services/glaccount/domain/gl.account.model';

//glaccount profit rate imports
import { GlAccountService } from '../../../../../services/glaccount/service-api/gl.account.service';
import { GeneralLedgerAccountProfitRate } from '../../../../../services/glaccount/domain/gl.account.model';
import { GLAccountProfitRateMerged } from '../../../../../services/glaccount/domain/gl.account.model';

// //verifier
// import { VerifierSelectionEvent } from '../../../../../common/components/verifier-selection/verifier.selection.component';


@Component({
    selector: 'gl-account-profit-rates-view',
    templateUrl: './gl.account.profit.rate.view.component.html'
})


export class GlProfitRateViewComponent extends ViewsBaseComponent implements OnInit {

    queryParams: any;
    urlSearchParams: Map<string, string>;
    generalLedgerAccountId: number;
    profitRates: GeneralLedgerAccountProfitRate = new GeneralLedgerAccountProfitRate();
    profitRateMergedTotal: GLAccountProfitRateMerged[];
    len: number;
    verifierSelectionModalVisible: boolean = true;
    gneralLedgerAccountName:string=null;
    constructor(
        private glAcountService: GlAccountService,
        private route: ActivatedRoute,
        protected location: Location,
        protected router: Router,
        protected notificationService: NotificationService,
        protected approvalflowService: ApprovalflowService,
    ) {
        super(location, router, approvalflowService, notificationService);
    }
    
    ngOnInit() {
        this.showVerifierSelectionModal = of(false);

        this.subscribers.routeSub = this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.command = params['command'];
            this.processId = params['taskId'];
            this.taskId = params['taskId'];
            this.commandReference = params['commandReference'];
            this.generalLedgerAccountId=+this.route.snapshot.paramMap.get('id');
            this.subscribers.fetchGlAccountSub=this.glAcountService.fetchGlAccountDetails({id:this.generalLedgerAccountId})
            .subscribe(
                data=>
                this.gneralLedgerAccountName=data.name
            );

            
            this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                .subscribe(data => {
                    this.profitRates = data;
                    let profitRateMergedFull: GLAccountProfitRateMerged[] = [];

                    if (this.profitRates.isSlabApplicable) {
                        profitRateMergedFull = this.profitRates.productProfitRateSlabs.map(slab => {
                            return {
                                id: this.profitRates.id,
                                profitRateId: slab.id,
                                effectiveDate: this.profitRates.effectiveDate,
                                amountRangeFrom: slab.amountRangeFrom,
                                amountRangeTo: slab.amountRangeTo,
                                landingRate: slab.landingRate,
                                borrowingRate: slab.borrowingRate
                            }
                        });
                    } else {
                        profitRateMergedFull = [data];
                    }
                    this.profitRateMergedTotal = [...profitRateMergedFull];
                });
        });
    }

    getSearchMap(): Map<string, any> {
        const searchMap = new Map();
        return searchMap;
    }

    // cancel() {
    //     this.navigateAway();
    // }

    // navigateAway() {
    //     this.router.navigate(['../../']);
    // }

}