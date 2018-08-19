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
import { Teller, TellerLimit } from '../../../../services/teller/domain/teller.models';
import { TellerType } from '../../../../common/domain/teller.enum.model';
import { Currency } from '../../../../services/currency/domain/currency.models';
import { GlAccount } from '../../../../services/glaccount/domain/gl.account.model';
import { initialTellerFormData } from '../../../portfolio/cash-management/teller/form/teller-form/teller.form.component';
import { GlAccountService } from '../../../../services/glaccount/service-api/gl.account.service';
import { CurrencyService } from '../../../../services/currency/service-api/currency.service';
import { Branch } from '../../../../services/bank/domain/bank.models';
import { BankService } from '../../../../services/bank/service-api/bank.service';


@Component({
    selector: 'teller-view',
    templateUrl: './teller.view.component.html'
})
export class TellerViewComponent extends ViewsBaseComponent implements OnInit {

    currencyRestrictions: SelectItem[] = CurrencyRestriction;
    selectedCurrency: string;
    tellerForm: FormGroup;
    teller: Teller = new Teller();
    tellerTypes: SelectItem[] = TellerType;
    tellerLimitForm: FormGroup;
    tellerLimits: TellerLimit[];
    currencies: Currency[];
    glId: number;
    glAccounts: GlAccount[];
    glAccountMap: Map<number, string>;
    allowedGlTransaction: boolean = false;
    allowedClientTransaction: boolean = false;
    denominationRequired: boolean = false;
    forceLimit: boolean = false;
    selectedCurrencyType: string;
    selectedTellerLimit: TellerLimit;
    urlSearchParam: Map<string, string>;
    subscription: any;
    selectedIndex: number;
    id: number;
    multipleCurrencyLimit: boolean = false;
    glMap: Map<number, string> = new Map();
    branches: Branch[];
    currencyMap: Map<string, string> = new Map();
    constructor(
        private formBuilder: FormBuilder,

        protected location: Location,
        private route: ActivatedRoute,
        protected router: Router,
        protected notificationService: NotificationService,
        private currencyService: CurrencyService,
        private glAccountService: GlAccountService,
        protected approvalFlowService: ApprovalflowService,
        private bankService: BankService) {
        super(location, router, approvalFlowService, notificationService);
    }

    ngOnInit() {
        this.tellerLimits = [];
        this.showVerifierSelectionModal = of(false);
        this.prepareTellerForm(null);
        this.subscribers.routeSub = this.route.queryParams.subscribe(params => {
            this.command = params['command'];
            this.processId = params['taskId'];
            this.taskId = params['taskId'];
            this.commandReference = params['commandReference'];
            this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                .subscribe(data => {
                    this.prepareTellerForm(data);
                    if (data.tellerLimits !== undefined) {
                        this.tellerLimits = data.tellerLimits;
                    }
                    else {
                        this.tellerLimits = null;
                    }
                });
            this.fetchGlAccounts();
            this.fetchBranches();
            this.fetchCurrencies();

        });
    }


    prepareTellerForm(formData: Teller) {
        (formData == null) ? formData = initialTellerFormData : formData;
        this.id = formData.id;
        this.tellerForm = this.formBuilder.group({
            code: [formData.code, [Validators.required, Validators.minLength(1), Validators.maxLength(32)]],
            title: [formData.title, [Validators.required, Validators.minLength(1), Validators.maxLength(32)]],
            glId: [formData.glId, [Validators.required, Validators.minLength(1), Validators.maxLength(32)]],
            branchId: [formData.branchId, [Validators.required]],
            tellerType: [formData.tellerType],
            currencyRestriction: [formData.currencyRestriction],
            allowedGlTransaction: [formData.allowedGlTransaction],
            allowedClientTransaction: [formData.allowedClientTransaction],
            denominationRequired: [formData.denominationRequired],
            forceLimit: [formData.forceLimit],
            tellerStatus: [formData.tellerStatus, [Validators.required, Validators.minLength(1), Validators.maxLength(32)]]
        });
    }

    fetchGlAccounts() {
        let urlSearchParam = new Map([['roots', 'false'], ["aspage", "false"]]);
        this.glAccountService.fetchGlAccounts(urlSearchParam)
            .subscribe(glAccounts => this.glAccounts = glAccounts);
    }
    
    fetchBranches() {
        this.bankService.fetchBranchProfiles({ bankId: 1 }, new Map()).subscribe(
            data => {
                this.branches = data;
            });
    }
    private fetchCurrencies() {
        this.subscribers.fetchCurr = this.currencyService.fetchCurrencies(new Map())
            .subscribe(data => {
                this.currencies = data.content;
                for (let currency of this.currencies) {
                    this.currencyMap.set(currency.code, currency.name);
                }
            });
    }

}