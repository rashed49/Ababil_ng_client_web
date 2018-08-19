import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';

import { FormBaseComponent } from '../../../../../common/components/base.form.component';
import * as ababilValidator from '../../../../../common/constants/app.validator.constants';
import * as commandConstants from '../../../../../common/constants/app.command.constants';
import { NotificationService } from '../../../../../common/notification/notification.service';
import { AbabilCustomValidators } from '../../../../../common/validators/ababil.custom.validators';
import { VerifierSelectionEvent } from '../../../../../common/components/verifier-selection/verifier.selection.component';

import { Branch } from './../../../../../services/bank/domain/bank.models';
import { BankService } from '../../../../../services/bank/service-api/bank.service';
import { GlAccountLimitService } from '../../../../../services/glaccount/service-api/gl.account.limit.service';
import { GeneralLedgerAccountLimit, GlAccount } from '../../../../../services/glaccount/domain/gl.account.model';
import { GlAccountService } from '../../../../../services/glaccount/service-api/gl.account.service';
import { Observable, of } from 'rxjs';
import { ApprovalflowService } from '../../../../../services/approvalflow/service-api/approval.flow.service';
import { CurrencyRestriction } from '../../../../../common/domain/currency.enum.model';

export const SUCCESS_MSG: string[] = ["gl.account.limit.configuration.create.success", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/gl-account/limit/detail/";

@Component({
    templateUrl: './create.gl.account.limit.configuration.form.component.html',
    styleUrls: ['./create.gl.account.limit.configuration.form.component.scss']
})
export class CreateGlAccountLimitConfigurationFormComponent extends FormBaseComponent implements OnInit {

    params: any;
    generalLedgerAccountId: number;
    branches: SelectItem[] = [];
    currencies: SelectItem[] = [];
    selectedBranches: number[] = [];
    glAccountLimits: GeneralLedgerAccountLimit[] = [];
    glAccount: GlAccount = new GlAccount();
    createGlLimitConfigurationForm: FormGroup;

    constructor(private bankService: BankService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private glAccountService: GlAccountService,
        private glAccountLimitService: GlAccountLimitService,
        protected location: Location,
        protected approvalFlowService: ApprovalflowService) {
        super(location, approvalFlowService);
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);
        this.command = commandConstants.GL_ACCOUNT_LIMIT_CREATE_COMMAND;
        this.prepareGlLimitConfigurationForm(new GeneralLedgerAccountLimit());
        this.subscribers.routeSub = this.route.params.subscribe(param => {
            this.params = param;
            this.generalLedgerAccountId = +param['id'];
            this.fetchGlAccountDetails();
        });
        this.fetchBranchs();

        this.subscribers.querySub = this.route.queryParams.subscribe(queryParam => {
            this.taskId = queryParam.taskId;
            if (this.taskId) {
                this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                    .subscribe(data => {
                        this.glAccountLimits = data;

                        let tempBranchs: number[] = [];
                        this.glAccountLimits.forEach(element => {
                            tempBranchs.push(element.branchId);
                        });
                        this.selectedBranches = [...tempBranchs];

                        let glAccountLimit = new GeneralLedgerAccountLimit();
                        glAccountLimit.balanceLimit = this.glAccountLimits[0].balanceLimit;
                        glAccountLimit.currencyCode = this.glAccountLimits[0].currencyCode;
                        this.prepareGlLimitConfigurationForm(glAccountLimit);
                    });
            }
        });
    }

    prepareGlLimitConfigurationForm(formData: GeneralLedgerAccountLimit) {
        this.createGlLimitConfigurationForm = this.formBuilder.group({
            branchId: [null, [Validators.required]],
            currencyCode: [formData.currencyCode, [Validators.required]],
            balanceLimit: [formData.balanceLimit,
                [Validators.required,
                Validators.max(ababilValidator.maximumAmount),
                Validators.min(ababilValidator.minimumAmount),
                AbabilCustomValidators.isNumber]
            ]
        });
    }

    fetchBranchs() {
        let bankId = 1;
        this.subscribers.fetchBranchsSub = this.bankService
            .fetchBranchProfiles({ bankId: bankId }, new Map())
            .subscribe(data => this.branches = data.map(element => {
                return { label: element.name + " (" + element.code + ")", value: element.id }
            }));
    }

    fetchGlAccountDetails() {
        this.subscribers.fetchGlAccountDetailsSub = this.glAccountService
            .fetchGlAccountDetails({ id: this.params.id })
            .subscribe(data => {
                this.glAccount = data;
                if(!this.glAccount.isLimitRequired){
                    this.router.navigate(['/glaccount']);
                }
                this.currencies = [{ label: 'Choose', value: null }]
                    .concat(this.glAccount.currencies.map(currency => {
                        return { label: currency.toString(), value: currency }
                    }));

                if (CurrencyRestriction[0].value == this.glAccount.currencyRestriction) { //local currency
                    let glAccountLimit = new GeneralLedgerAccountLimit();
                    glAccountLimit.currencyCode = this.glAccount.currencies[0];
                    this.prepareGlLimitConfigurationForm(glAccountLimit);
                }
            });
    }

    save() {
        this.markFormGroupAsTouched(this.createGlLimitConfigurationForm);
        if (this.formInvalid()) { return }

        this.showVerifierSelectionModal = of(true);
    }

    getGlAccountLimits() {
        let glLimits: GeneralLedgerAccountLimit[] = [];
        this.selectedBranches.forEach(branchId => {
            let glAccountLimit = new GeneralLedgerAccountLimit();
            glAccountLimit.currencyCode = this.createGlLimitConfigurationForm.get('currencyCode').value
            glAccountLimit.balanceLimit = this.createGlLimitConfigurationForm.get('balanceLimit').value;
            glAccountLimit.branchId = branchId;
            glAccountLimit.generalLedgerAccountId = this.params.id;
            glLimits.push(glAccountLimit);
        });
        return glLimits;
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, DETAILS_UI.concat(this.params.id).concat("?"), this.location.path().concat("?"));
        let glAccountLimits = this.getGlAccountLimits();

        this.subscribers.createGeneralLedgerAccountLimitSub = this.glAccountLimitService
            .createGeneralLedgerAccountLimit({ generalLedgerAccountId: this.params.id }, glAccountLimits, urlSearchParams)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
                this.navigateAway();
            })
    }

    formInvalid() {
        return this.createGlLimitConfigurationForm.invalid;
    }

    cancel() {
        this.router.navigate(['glaccount/limit/detail', this.generalLedgerAccountId]);
    }

    navigateAway() {
        this.router.navigate(['glaccount']);
    }

}