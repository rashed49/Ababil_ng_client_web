import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormBaseComponent } from '../../../../common/components/base.form.component';
import { BankService } from '../../../../services/bank/service-api/bank.service';
import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';
import { SelectItem } from 'primeng/api';
import { GeneralLedgerAccountLimit, GlAccount } from '../../../../services/glaccount/domain/gl.account.model';
import * as ababilValidator from '../../../../common/constants/app.validator.constants';
import { GlAccountService } from '../../../../services/glaccount/service-api/gl.account.service';
import { of } from 'rxjs';
import { map }from 'rxjs/operators';
import * as commandConstants from '../../../../common/constants/app.command.constants';
import { VerifierSelectionEvent } from '../../../../common/components/verifier-selection/verifier.selection.component';
import { GlAccountLimitService } from '../../../../services/glaccount/service-api/gl.account.limit.service';
import { NotificationService } from '../../../../common/notification/notification.service';

export const SUCCESS_MSG: string[] = ["gl.account.limit.configuration.create.success", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/gl-account/limit/detail/";

@Component({
    templateUrl: './gl.account.limit.configuration.form.component.html'
})
export class GlAccountLimitConfigurationFormComponent extends FormBaseComponent implements OnInit {

    branches: SelectItem[] = [];
    glLimitConfigurationForm: FormGroup;
    selectedBranches: number[] = [];
    selectedGlAccount: number = null;
    glAccounts: SelectItem[] = [];
    glAccountLimits: GeneralLedgerAccountLimit[] = [];
    glAccount: GlAccount = new GlAccount();
    errorSet = new Set([]);
    balanceLength = 20; //actual= 15. ',' and '.' takes one length

    constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private bankService: BankService,
        private glAccountService: GlAccountService,
        private glAccountLimitService: GlAccountLimitService,
        private notificationService: NotificationService,
        protected location: Location,
        protected approvalFlowService: ApprovalflowService) {
        super(location, approvalFlowService);
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);
        this.command = commandConstants.GL_ACCOUNT_LIMIT_CREATE_COMMAND;

        this.prepareGlLimitConfigurationForm(new GeneralLedgerAccountLimit());
        this.fetchBranchs();
        this.fetchGlAccounts();

        this.subscribers.querySub = this.route.queryParams.subscribe(queryParam => {
            this.taskId = queryParam.taskId;
            if (this.taskId) {
                this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                    .subscribe(data => {
                        this.glAccountLimits = data;

                        let tempBranchs: number[] = [];
                        this.glAccountLimits.forEach(element => {
                            if (!tempBranchs.includes(element.branchId)) {
                                tempBranchs.push(element.branchId);
                            }
                        });
                        this.selectedBranches = [...tempBranchs];

                        let glAccountLimit = new GeneralLedgerAccountLimit();
                        glAccountLimit.generalLedgerAccountId = this.glAccountLimits[0].generalLedgerAccountId;
                        this.prepareGlLimitConfigurationForm(glAccountLimit);
                    });
            }
        });
    }

    fetchGlAccounts() {
        let urlSearchParam = new Map([['limit', 'true']]);
        this.subscribers.fetchGlAccountsSub = this.glAccountService.fetchGlAccounts(urlSearchParam)
            .subscribe(data => this.glAccounts = data);
    }

    prepareGlLimitConfigurationForm(formData: GeneralLedgerAccountLimit) {
        this.glLimitConfigurationForm = this.formBuilder.group({
            branchId: [null, [Validators.required]],
            generalLedgerAccountId: [formData.generalLedgerAccountId, [Validators.required]]
        });

        this.glLimitConfigurationForm.get('generalLedgerAccountId').valueChanges
            .subscribe(val => {
                this.fetchGlAccountLimits(val, this.selectedBranches);
            });

        this.glLimitConfigurationForm.get('branchId').valueChanges
            .subscribe(val => {
                this.fetchGlAccountLimits(this.glLimitConfigurationForm.get('generalLedgerAccountId').value, this.selectedBranches);
            });
    }

    fetchGlAccountLimits(glAccountId: number, selectedBranches: number[]) {
        let urlSearchParams: Map<string, string> = new Map();
        if (glAccountId && selectedBranches.length == 1) {
            urlSearchParams.set('branchId', selectedBranches[0] + "");
            this.subscribers.fetchGlAccountsLimitsSub = this.glAccountLimitService
                .fetchGlAccountsLimits({ generalLedgerAccountId: glAccountId }, urlSearchParams)
                .subscribe(data => {
                    if (data.length) {
                        this.glAccountLimits = data;
                        this.checkDataTableValidity();
                    } else {
                        this.fetchGlAccountDetails(glAccountId);
                    }
                });
        }
        else if (glAccountId && selectedBranches.length > 1) {
            this.fetchGlAccountDetails(glAccountId);
        } else {
            this.glAccountLimits = [];
        }
    }

    fetchGlAccountDetails(glAccountId: number) {
        this.subscribers.fetchGlAccountDetailsSub = this.glAccountService.
            fetchGlAccountDetails({ id: glAccountId })
            .pipe(map(data => {
                this.glAccount = data;
                this.fillGlLimitTable();
            })).subscribe();
    }

    fillGlLimitTable() {
        let glLimits: GeneralLedgerAccountLimit[] = [];
        if (this.glAccount.currencies) {
            this.glAccount.currencies.forEach(currencyCode => {
                let glAccountLimit = new GeneralLedgerAccountLimit();
                glAccountLimit.currencyCode = currencyCode;
                glAccountLimit.isMonthlyLimitAllowed = false;
                glLimits.push(glAccountLimit);
            });
            this.glAccountLimits = [...glLimits];
            this.checkDataTableValidity();
        }
    }

    fetchBranchs() {
        let bankId = 1;
        this.subscribers.fetchBranchsSub = this.bankService
            .fetchBranchProfiles({ bankId: bankId }, new Map())
            .subscribe(data => this.branches = data.map(element => {
                return { label: element.name + " (" + element.code + ")", value: element.id }
            }));
    }

    checkDataTableValidity() {
        for (let i = 0; i < this.glAccountLimits.length; i++) {
            this.onEditValidation(this.glAccountLimits[i], i);
        }
    }

    onEditValidation(rowData: GeneralLedgerAccountLimit, index) {
        let cleenSheet = true;
        if (!rowData.balanceLimit) {
            cleenSheet = false;
            this.addError(index);
        } else if (ababilValidator.ValidatorConstants.MAXIMUM_AMOUNT < rowData.balanceLimit) {
            cleenSheet = false;
            this.addError(index);
        }

        if (rowData.isMonthlyLimitAllowed) {
            if (!rowData.monthlyLimit) {
                cleenSheet = false;
                this.addError(index);
            } else if (rowData.balanceLimit < rowData.monthlyLimit) {
                cleenSheet = false;
                this.addError(index);
            }
        } else {
            this.glAccountLimits[index].monthlyLimit = null;
        }

        if (cleenSheet && this.errorSet.has(index)) {
            this.errorSet.delete(index);
        }
    }

    addError(index) {
        if (!this.errorSet.has(index)) {
            this.errorSet.add(index);
        }
    }

    errorMessage(){
        return document.querySelector('.invalid-datatable-row');
    }

    save() {
        this.markFormGroupAsTouched(this.glLimitConfigurationForm);
        if (this.formInvalid()) return;
        this.showVerifierSelectionModal = of(true);
    }

    getGlAccountLimits() {
        let glLimits: GeneralLedgerAccountLimit[] = [];
        this.selectedBranches.forEach(branchId => {
            this.glAccountLimits.forEach(element => {
                let glAccountLimit = new GeneralLedgerAccountLimit();
                glAccountLimit.branchId = branchId;
                glAccountLimit.generalLedgerAccountId = this.glLimitConfigurationForm.get('generalLedgerAccountId').value;
                glAccountLimit.balanceLimit = element.balanceLimit;
                glAccountLimit.currencyCode = element.currencyCode;
                glAccountLimit.isMonthlyLimitAllowed = element.isMonthlyLimitAllowed;
                glAccountLimit.monthlyLimit = element.monthlyLimit;
                glLimits.push(glAccountLimit);
            });
        });
        return glLimits;
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let generalLedgerAccountId = this.glLimitConfigurationForm.get('generalLedgerAccountId').value;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, DETAILS_UI.concat(generalLedgerAccountId + "").concat("?"), this.location.path().concat("?"));
        let glAccountLimits = this.getGlAccountLimits();

        this.subscribers.createGeneralLedgerAccountLimitSub = this.glAccountLimitService
            .createGeneralLedgerAccountLimit({ generalLedgerAccountId: generalLedgerAccountId }, glAccountLimits, urlSearchParams)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
                this.back();
            });
    }

    formInvalid() {
        this.checkDataTableValidity();
        return this.glLimitConfigurationForm.invalid || (this.errorSet.size > 0);
    }

    back() {
        this.router.navigate(['../'], { relativeTo: this.route });
    }
}