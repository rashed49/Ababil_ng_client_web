import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { SelectItem, LazyLoadEvent } from 'primeng/primeng';
import { Subscriber, Observable, of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';
import { ViewsBaseComponent } from '../../view.base.component';
import { NotificationService } from '../../../../common/notification/notification.service';
import { CurrencyRestriction } from '../../../../common/domain/currency.enum.model';
import { Teller, TellerLimit, TellerAllocation } from '../../../../services/teller/domain/teller.models';
import { TellerType } from '../../../../common/domain/teller.enum.model';
import { Currency } from '../../../../services/currency/domain/currency.models';
import { GlAccount } from '../../../../services/glaccount/domain/gl.account.model';
import { initialTellerFormData } from '../../../portfolio/cash-management/teller/form/teller-form/teller.form.component';
import { GlAccountService } from '../../../../services/glaccount/service-api/gl.account.service';
import { CurrencyService } from '../../../../services/currency/service-api/currency.service';
import { initialTellerAllocationFormData } from '../../../portfolio/cash-management/teller-allocation/form/teller.allocation.form.component';
import { TellerAllocationService } from '../../../../services/teller/service-api/teller.allocation.service';
import { Branch } from '../../../../services/bank/domain/bank.models';
import { BankService } from '../../../../services/bank/service-api/bank.service';


@Component({
    selector: 'teller-allocation-view',
    templateUrl: './teller.allocation.view.component.html'
})
export class TellerAllocationViewComponent extends ViewsBaseComponent implements OnInit {

    tellerAllocationForm: FormGroup;
    id: number;
    selectedBranchId: number;
    tellers: Teller[] = [];
    branches: Branch[];
    constructor(
        private formBuilder: FormBuilder,
        protected location: Location,
        private route: ActivatedRoute,
        protected router: Router,
        protected notificationService: NotificationService,
        private glAccountService: GlAccountService,
        private tellerAllocationService: TellerAllocationService,
        protected approvalFlowService: ApprovalflowService,
        private bankService: BankService) {
        super(location, router, approvalFlowService, notificationService);
    }

    ngOnInit() {
        this.showVerifierSelectionModal = of(false);
        this.prepareTellerAllocationForm(null);
        this.fetchTellers(null, true);
        this.fetchBranches();
        this.subscribers.routeSub = this.route.queryParams.subscribe(params => {
            this.command = params['command'];
            this.processId = params['taskId'];
            this.taskId = params['taskId'];
            this.commandReference = params['commandReference'];
            this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                .subscribe(data => {
                    this.prepareTellerAllocationForm(data);
                });
        });
    }

    prepareTellerAllocationForm(formData: TellerAllocation) {
        (formData == null) ? formData = initialTellerAllocationFormData : formData;
        this.id = formData.id
        this.tellerAllocationForm = this.formBuilder.group({
            allocatedTo: [formData.allocatedTo, [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
            autoAllocate: [formData.autoAllocate],
            teller: [formData.teller, [Validators.required]],
        });
        if (formData.teller !== undefined) {
            this.selectedBranchId = formData.teller.branchId;
        }

    }

    fetchTellers(branchId: string, unallocated: boolean) {
        let urlSearchParam = new Map([['branchId', branchId], ["unallocated",unallocated + '']]);
        this.subscribers.fetchSubs = this.tellerAllocationService.fetchTellers(urlSearchParam).subscribe(
            profiles => {
                this.tellers = profiles.content;
            });
    }

    fetchBranches() {
        this.bankService.fetchBranchProfiles({ bankId: 1 }, new Map()).subscribe(
            data => {
                this.branches = data;
            });
    }

}