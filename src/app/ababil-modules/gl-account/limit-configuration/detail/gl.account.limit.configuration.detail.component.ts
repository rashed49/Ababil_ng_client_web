import { Location } from '@angular/common';
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { FormBaseComponent } from './../../../../common/components/base.form.component';
import * as ababilValidator from '../../../../common/constants/app.validator.constants';
import * as commandConstants from '../../../../common/constants/app.command.constants';
import { AbabilCustomValidators } from '../../../../common/validators/ababil.custom.validators';
import { VerifierSelectionEvent } from '../../../../common/components/verifier-selection/verifier.selection.component';
import { NotificationService } from '../../../../common/notification/notification.service';
import { GlAccount, GeneralLedgerAccountLimit } from '../../../../services/glaccount/domain/gl.account.model';
import { GlAccountLimitService } from '../../../../services/glaccount/service-api/gl.account.limit.service';
import { GlAccountService } from '../../../../services/glaccount/service-api/gl.account.service';
import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';
import { BankService } from './../../../../services/bank/service-api/bank.service';
import { CurrencyRestriction } from '../../../../common/domain/currency.enum.model';

export const SUCCESS_MSG: string[] = ["gl.account.limit.configuration.update.success", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/gl-account/limit/detail/";

@Component({
    templateUrl: './gl.account.limit.configuration.detail.component.html'
})
export class GlAccountLimitConfigurationDetailComponent extends FormBaseComponent implements OnInit {

    glAccountId: number;
    selectedCurrency: string;
    editGlLimitConfigurationForm: FormGroup;
    showDialog: boolean = false;
    createMode: boolean = false;
    showDialogMessage: boolean = false;
    glAccount: GlAccount = new GlAccount();
    glAccountLimit: GeneralLedgerAccountLimit = new GeneralLedgerAccountLimit();
    glAccountLimits: GeneralLedgerAccountLimit[] = [];
    currencies: SelectItem[] = [];
    searchMap: Map<string, string> = new Map();
    branches: Map<number, string> = new Map();
    tempBranches: string[] = [];
    filteredBranch: string;
    filteredGlAccountLimits: GeneralLedgerAccountLimit[] = [];
    localCurrency: boolean = true;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private bankService: BankService,
        private notificationService: NotificationService,
        private glAccountLimitService: GlAccountLimitService,
        private glAccountService: GlAccountService,
        protected location: Location,
        protected approvalFlowService: ApprovalflowService) {
        super(location, approvalFlowService);
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);
        this.command = commandConstants.GL_ACCOUNT_LIMIT_UPDATE_COMMAND;
        this.prepareGlLimitConfigurationForm(new GeneralLedgerAccountLimit);
        this.fetchBranchs();

        this.subscribers.querySub = this.route.queryParams.subscribe(queryParam => {
            this.taskId = queryParam.taskId;

            if (this.taskId) {
                this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                    .subscribe(data => {
                        this.glAccountLimits = this.isArray(data) ? data : [data];
                        this.filteredGlAccountLimits = this.isArray(data) ? data : [data];
                    });
            }

            this.subscribers.routeSub = this.route.params.subscribe(param => {
                this.glAccountId = param.id;
                this.fetchGlAccountDetails();
            });
        });
    }

    prepareGlLimitConfigurationForm(formData: GeneralLedgerAccountLimit) {
        this.editGlLimitConfigurationForm = this.formBuilder.group({
            branchName: [{ value: this.branches.get(formData.branchId), disabled: true }],
            currencyCode: [{ value: formData.currencyCode, disabled: true }],
            balanceLimit: [formData.balanceLimit, [Validators.required, Validators.max(ababilValidator.maximumAmount), Validators.min(ababilValidator.minimumAmount), AbabilCustomValidators.isNumber]]
        });
    }

    fetchGlAccountDetails() {
        this.subscribers.fetchGlAccountDetailsSub = this.glAccountService
            .fetchGlAccountDetails({ id: this.glAccountId })
            .subscribe(data => {
                this.glAccount = data;
                if (this.glAccount.isLimitRequired) {
                    this.currencies = [{ label: 'Choose', value: null }]
                        .concat(this.glAccount.currencies.map(currency => {
                            return { label: currency.toString(), value: currency }
                        }));

                    if (CurrencyRestriction[0].value == this.glAccount.currencyRestriction) {  //local currency
                        this.localCurrency = true;
                        this.selectedCurrency=this.glAccount.currencies[0];
                    } else {
                        this.localCurrency = false;
                    }

                    if (!this.taskId) {
                        this.searchMap.set('currencyCode', this.glAccount.currencies[0]);
                        this.fetchGlAccountsLimits(this.searchMap);
                    }
                } else {
                    this.showDialogMessage = true;
                }
            });
    }

    fetchGlAccountsLimits(urlSearchParams: Map<string, string>) {
        if (urlSearchParams == null) urlSearchParams = new Map();
        this.subscribers.fetchGlAccountsLimitsSub = this.glAccountLimitService
            .fetchGlAccountsLimits({ generalLedgerAccountId: this.glAccountId }, urlSearchParams)
            .subscribe(data => {
                this.glAccountLimits = data;
                this.filteredGlAccountLimits = data;
                this.createMode = this.glAccountLimits.length <= 0 ? true : false;
            });
    }

    fetchBranchs() {
        let bankId = 1;
        this.subscribers.fetchBranchsSub = this.bankService
            .fetchBranchProfiles({ bankId: bankId }, new Map())
            .subscribe(data => data.forEach(element => {
                this.branches.set(element.id, element.name + " (" + element.code + ")");
                this.tempBranches.push(element.name.toUpperCase() + " (" + element.code + ")" + ":::" + element.id);
            }));
    }

    edit(glAccountLimit: GeneralLedgerAccountLimit) {
        this.showDialog = true;
        this.glAccountLimit = glAccountLimit;
        this.prepareGlLimitConfigurationForm(glAccountLimit);
    }

    save() {
        this.markFormGroupAsTouched(this.editGlLimitConfigurationForm);
        if (this.formInvalid()) { return }

        this.showVerifierSelectionModal = of(true);
    }

    getGlAccountLimits() {
        let glAccountLimitToUpdate = new GeneralLedgerAccountLimit();
        glAccountLimitToUpdate.id = this.glAccountLimit.id;
        glAccountLimitToUpdate.generalLedgerAccountId = this.glAccountLimit.generalLedgerAccountId;
        glAccountLimitToUpdate.branchId = this.glAccountLimit.branchId;
        glAccountLimitToUpdate.currencyCode = this.glAccountLimit.currencyCode;
        glAccountLimitToUpdate.balanceLimit = this.editGlLimitConfigurationForm.get('balanceLimit').value;
        return glAccountLimitToUpdate;
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, DETAILS_UI.concat(this.glAccountId + '').concat("?"), this.location.path().concat("?"));
        let glAccountLimit = this.getGlAccountLimits();
        this.showDialog = false;
        this.subscribers.updateGeneralLedgerAccountLimitSub = this.glAccountLimitService
            .updateGeneralLedgerAccountLimit({ generalLedgerAccountId: this.glAccountId, generalLedgerAccountLimitId: glAccountLimit.id }, glAccountLimit, urlSearchParams)
            .subscribe(data => {
                this.refreshDataTable();
                this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
            });
    }

    refreshDataTable() {
        this.searchMap.set('currencyCode', this.selectedCurrency ? this.selectedCurrency : this.glAccount.currencies[0]);
        this.fetchGlAccountsLimits(this.searchMap);
    }

    formInvalid() {
        return this.editGlLimitConfigurationForm.invalid;
    }

    onCurrencyChange(currencyCode) {
        if (currencyCode) {
            this.searchMap.set('currencyCode', currencyCode);
            this.fetchGlAccountsLimits(this.searchMap);
        }
    }

    filterBranch() {
        let filteredBranchIds = this.tempBranches.
            filter(val => val.includes(this.filteredBranch.toUpperCase())).
            map(val => { return +val.split(':::')[1] });

        this.filteredGlAccountLimits = [...this.glAccountLimits.filter(val => {
            return filteredBranchIds.includes(val.branchId);
        })];
    }

    addNew() {
        this.router.navigate(['glaccount/limit/create', this.glAccount.id]);
    }

    cancel() {
        this.router.navigate(['glaccount']);
    }

    redirectGlAccountPage() {
        this.showDialogMessage = false;
        this.cancel();
    }
}