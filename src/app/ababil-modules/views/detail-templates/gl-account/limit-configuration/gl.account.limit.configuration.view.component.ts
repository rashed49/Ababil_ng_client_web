import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { ViewsBaseComponent } from '../../../view.base.component';
import { NotificationService } from '../../../../../common/notification/notification.service';
import { GlAccount, GeneralLedgerAccountLimit } from '../../../../../services/glaccount/domain/gl.account.model';
import { GlAccountService } from '../../../../../services/glaccount/service-api/gl.account.service';
import { GlAccountLimitService } from '../../../../../services/glaccount/service-api/gl.account.limit.service';
import { ApprovalflowService } from '../../../../../services/approvalflow/service-api/approval.flow.service';
import { BankService } from './../../../../../services/bank/service-api/bank.service';
import { Branch } from '../../../../../services/bank/domain/bank.models';


@Component({
    templateUrl: './gl.account.limit.configuration.view.component.html'
})
export class GlAccountLimitConfigurationViewComponent extends ViewsBaseComponent implements OnInit {

    glAccountId: number;
    selectedCurrency: string;
    branches: Map<number, string> = new Map();
    glAccount: GlAccount = new GlAccount();
    currencies: SelectItem[] = [];
    searchMap: Map<string, string> = new Map();
    glAccountLimits: GeneralLedgerAccountLimit[] = [];

    constructor(private route: ActivatedRoute,
        protected location: Location,
        protected router: Router,
        protected approvalflowService: ApprovalflowService,
        protected notificationService: NotificationService,
        private glAccountLimitService: GlAccountLimitService,
        private glAccountService: GlAccountService,
        private bankService: BankService) {
        super(location, router, approvalflowService, notificationService);
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);
        this.fetchBranchs();
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.glAccountId = +params['id'];
            this.fetchGlAccountDetails();
        });

        this.subscribers.querySub = this.route.queryParams
            .subscribe(params => {
                this.command = params['command'];
                this.processId = params['taskId'];
                this.taskId = params['taskId'];
                this.commandReference = params['commandReference'];

                this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                    .subscribe(data => this.glAccountLimits = this.isArray(data) ? data : [data]);
            });
    }

    fetchBranchs() {
        let bankId = 1;
        this.subscribers.fetchBranchsSub = this.bankService
            .fetchBranchProfiles({ bankId: bankId }, new Map())
            .subscribe(data => data.forEach(element => this.branches.set(element.id, element.name + " (" + element.code + ")")));
    }

    fetchGlAccountDetails() {
        this.subscribers.fetchGlAccountDetailsSub = this.glAccountService
            .fetchGlAccountDetails({ id: this.glAccountId })
            .subscribe(data => this.glAccount = data);
    }
}