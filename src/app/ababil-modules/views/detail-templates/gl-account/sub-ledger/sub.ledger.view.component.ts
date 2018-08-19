import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SelectItem } from 'primeng/api';
import { MenuItem, TreeNode } from 'primeng/primeng';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Subscriber, of } from 'rxjs';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../../../common/notification/notification.service';
import { ApprovalflowService } from '../../../../../services/approvalflow/service-api/approval.flow.service';
import { ViewsBaseComponent } from '../../../view.base.component';
import { GlAccount } from '../../../../../services/glaccount/domain/gl.account.model';


import { GlAccountService } from '../../../../../services/glaccount/service-api/gl.account.service';
import { GeneralLedgerAccountProfitRate } from '../../../../../services/glaccount/domain/gl.account.model';
import { GLAccountProfitRateMerged } from '../../../../../services/glaccount/domain/gl.account.model';
import { SubLedger } from '../../../../../services/glaccount/domain/sub.ledger.model';

// //verifier
// import { VerifierSelectionEvent } from '../../../../../common/components/verifier-selection/verifier.selection.component';


@Component({
    selector: 'sub-ledger-view',
    templateUrl: './sub.ledger.view.component.html'
})


export class SubLedgerViewComponent extends ViewsBaseComponent implements OnInit {

    queryParams: any;
    urlSearchParams: Map<string, string>;
    generalLedgerAccountId: number;
    subLedgers: SubLedger = new SubLedger();
    verifierSelectionModalVisible: boolean = true;
    name:string=null;
    allBranch: boolean = false;

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
             this.generalLedgerAccountId =+this.route.snapshot.paramMap.get('id');

            this.subscribers.fetchGlAccountSub=this.glAcountService.fetchGlAccountDetails({id:this.generalLedgerAccountId})
            .subscribe(
                data=>
                this.name=data.name
            );

            
            this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                .subscribe(data => {
                    this.subLedgers = data;
                    this.allBranch = this.subLedgers.areAllBranchAllowed;

                });
        });
    }

    getSearchMap(): Map<string, any> {
        const searchMap = new Map();
        return searchMap;
    }

}