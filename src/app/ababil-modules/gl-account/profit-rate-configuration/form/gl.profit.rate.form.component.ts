import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { NotificationService } from '../../../../common/notification/notification.service';
import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';
import { VerifierSelectionEvent } from '../../../../common/components/verifier-selection/verifier.selection.component';
import { FormBaseComponent } from '../../../../common/components/base.form.component';
import * as commandConstants from '../../../../common/constants/app.command.constants';
import { GlAccount } from "../../../../services/glaccount/domain/gl.account.model";
import { GlAccountService } from '../../../../services/glaccount/service-api/gl.account.service';
import { GeneralLedgerAccountProfitRate, GeneralLedgerAccountProfitRateSlab } from '../../../../services/glaccount/domain/gl.account.model';
export const DETAILS_UI: string = "views/gl-account/profit-rate/";

@Component({
    selector: 'gl-account-profit-rate-form',
    templateUrl: './gl.profit.rate.form.component.html',
})

export class GlProfitRateFormComponent extends FormBaseComponent implements OnInit, OnChanges {

    constructor(private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private glAccountService: GlAccountService,
        private notificationService: NotificationService,
        protected location: Location,
        protected approvalflowService: ApprovalflowService) {
        super(location, approvalflowService)
    }

    urlSearchParam: Map<string, string>;
    subscription: any;
    type: string;
    rowIndex: number;
    errorSet = new Set([]);
    rate: number;
    selectedType: string;
    initialProfitRateFormData: GeneralLedgerAccountProfitRate = new GeneralLedgerAccountProfitRate();
    profitRates: any;
    profitRateForm: FormGroup;
    selectedGlAccountId: number;
    isSlabApplicable: boolean = false;
    generalLedgerAccount: GlAccount[] = [];
    incomeGeneralLedgerAccount: GlAccount[] = [];
    expenseGeneralLedgerAccount: GlAccount[] = [];
    glSlabs: GeneralLedgerAccountProfitRateSlab[] = [];
    isLandingRateNull: boolean = false;
    isBorrowingRateNull: boolean = false;
    profitformData: GeneralLedgerAccountProfitRate;
    isLandingRateBigger: boolean = false;
    isBorrowingRateBigger: boolean = false;
    taskId: number;
    generalLedgerAccountName: string;
    today:Date;
    @Input() generalLedgerAccountId: number;
    @Input() generalLedgerAccountProfitRateId: number;

    @Output('onSave') onSave = new EventEmitter<boolean>();
    ngOnInit() {
        this.today=new Date();
        this.fetchIncomeGeneralLedgerAccount();
        this.fetchExpenseGeneralLedgerAccount();
        this.prepareProfitForm(new GeneralLedgerAccountProfitRate());
        this.command = commandConstants.SAVE_GENERAL_LEDGER_ACCOUNTS_COMMAND;
        this.showVerifierSelectionModal = of(false);
        // this.fetchGlAccountDetails();

        this.subscribers.routeQueryParamSub = this.route.queryParams
            .subscribe(queryParams => {

                this.taskId = queryParams.taskId;
                if (this.taskId) {
                    this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                        .subscribe(data => {
                            this.profitformData = data;
                            this.isSlabApplicable = data.isSlabApplicable;
                            this.prepareProfitForm(this.profitformData);
                            if (this.isSlabApplicable) {
                                this.glSlabs = data.productProfitRateSlabs;
                            }
                        });
                }
                else {

                    if (this.generalLedgerAccountProfitRateId) {
                        this.fetchProfitRate();
                    }
                }

            });
        if (this.taskId) {
            this.generalLedgerAccountId = +this.route.snapshot.paramMap.get('id');
            this.fetchGlAccountDetails();
        }
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        console.log(simpleChanges);
        if (simpleChanges.generalLedgerAccountProfitRateId) {
            this.generalLedgerAccountProfitRateId = simpleChanges.generalLedgerAccountProfitRateId.currentValue;
            if (this.generalLedgerAccountProfitRateId) {
                this.fetchProfitRate();
            } else {
                this.prepareProfitForm(new GeneralLedgerAccountProfitRate());

            }
        }

        if (simpleChanges.generalLedgerAccountId) {
            this.generalLedgerAccountId = simpleChanges.generalLedgerAccountId.currentValue;
            this.prepareProfitForm(new GeneralLedgerAccountProfitRate());

        }

    }

    fetchGlAccountDetails() {
        this.subscribers.fetchGlAccountDetailsSub = this.glAccountService
            .fetchGlAccountDetails({ id: this.generalLedgerAccountId })
            .subscribe(data => {
                this.generalLedgerAccountName = data.name;
            });
    }

    fetchProfitRate() {
        if (this.generalLedgerAccountId) {
            this.selectedGlAccountId = this.generalLedgerAccountId;
        }
        else {
            this.selectedGlAccountId = +this.route.snapshot.paramMap.get('id');
        }
        this.subscribers.fetchprofitSub = this.glAccountService.
            fetchProfitRate({ 'generalLedgerAccountId': this.selectedGlAccountId + '', 'generalLedgerAccountProfitRateId': this.generalLedgerAccountProfitRateId + '' })
            .subscribe(profitRate => {
                this.profitformData = profitRate;
                this.isSlabApplicable = profitRate.isSlabApplicable;
                this.prepareProfitForm(this.profitformData);
            });
    }

    prepareProfitForm(formData: GeneralLedgerAccountProfitRate) {
        formData = (formData) ? formData : new GeneralLedgerAccountProfitRate();

        this.profitRateForm = this.formBuilder.group({
            effectiveDate: [formData.effectiveDate ? new Date(formData.effectiveDate) : null, [Validators.required]],
            incomeGeneralLedgerAccountId: [formData.incomeGeneralLedgerAccountId, [Validators.required]],
            expenseGeneralLedgerAccountId: [formData.expenseGeneralLedgerAccountId, [Validators.required]],
            isSlabApplicable: [formData.isSlabApplicable],
            landingRate: [formData.landingRate, [Validators.required, Validators.min(0), Validators.max(100)]],
            borrowingRate: [formData.borrowingRate, [Validators.required, Validators.min(0), Validators.max(100)]]
        });

        if (formData.isSlabApplicable) {
            this.profitRateForm.get('landingRate').clearValidators();
            this.profitRateForm.get('landingRate').updateValueAndValidity();
            this.profitRateForm.get('borrowingRate').clearValidators();
            this.profitRateForm.get('borrowingRate').updateValueAndValidity();
        }

        this.profitRateForm.get('isSlabApplicable').valueChanges
            .subscribe(val => {
                if (val) {
                    this.profitRateForm.get('landingRate').reset();
                    this.profitRateForm.get('landingRate').clearValidators();
                    this.profitRateForm.get('landingRate').updateValueAndValidity();
                    this.profitRateForm.get('borrowingRate').reset();
                    this.profitRateForm.get('borrowingRate').clearValidators();
                    this.profitRateForm.get('borrowingRate').updateValueAndValidity();
                } else {
                    this.profitRateForm.get('landingRate').setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
                    this.profitRateForm.get('landingRate').updateValueAndValidity();
                    this.profitRateForm.get('borrowingRate').setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
                    this.profitRateForm.get('borrowingRate').updateValueAndValidity();
                }
            });

        this.glSlabs = formData.productProfitRateSlabs;
        this.isSlabApplicable = formData.isSlabApplicable;

        this.profitRateForm.get('isSlabApplicable').valueChanges.subscribe(val => {
            this.errorSet = new Set([]);
            this.isSlabApplicable = val;
            this.glSlabs = [];
            if (!this.isSlabApplicable) {
                let slab = new GeneralLedgerAccountProfitRateSlab();
                slab.amountRangeFrom = 0;
                slab.amountRangeTo = 0;
                this.glSlabs = [...this.glSlabs, slab];
            } 
        });

    }

    addSlab() {
        let slab = new GeneralLedgerAccountProfitRateSlab();
        let checker; 
        if (this.glSlabs.length == 0) {
            slab.amountRangeFrom = 0;
            slab.amountRangeTo = null;
            this.glSlabs = [...this.glSlabs, slab];
        } else {
            checker= this.checkValidity();
            if(checker){
            slab.amountRangeFrom = +this.glSlabs[this.glSlabs.length - 1].amountRangeTo;
            slab.landingRate = 0;
            slab.borrowingRate = 0;
            slab.amountRangeTo = null;
            this.glSlabs = [...this.glSlabs, slab];
        }
        }


        
    }

    fetchIncomeGeneralLedgerAccount() {
        let incomeUrlSearchParam: Map<string, string> = new Map();
        incomeUrlSearchParam.set("leaf-type", "NODE");
        incomeUrlSearchParam.set("account-nature", "INCOME");
        this.subscribers.fetchIncomeGeneralLedgerSub = this.glAccountService
            .fetchGeneralLedgerAccountsWithType(incomeUrlSearchParam)
            .subscribe(data => this.incomeGeneralLedgerAccount = [...data]);
    }

    fetchExpenseGeneralLedgerAccount() {
        let expenseUrlSearchParam: Map<string, string> = new Map();
        expenseUrlSearchParam.set("leaf-type", "NODE");
        expenseUrlSearchParam.set("account-nature", "EXPENDITURE");
        this.subscribers.fetchExpenseGeneralLedgerSub = this.glAccountService
            .fetchGeneralLedgerAccountsWithType(expenseUrlSearchParam)
            .subscribe(data => this.expenseGeneralLedgerAccount = [...data]);
    }


    checkValidity() {
            return this.onEditValidation(this.glSlabs[this.glSlabs.length-1], this.glSlabs.length-1);
    }

    onEditValidation(data, index) {
        let amountFrom = data.amountRangeFrom;
        let amountTo = data.amountRangeTo;
        let landingRate = data.landingRate;
        let borrowingRate = data.borrowingRate;
        let amountToIsNumber = this.isNumber(amountTo);
        let rateValid;
        let amountToValid;
        this.rowIndex = index;
        let checker;
        if (landingRate == null || borrowingRate == null || landingRate > 100 || borrowingRate > 100) {
            rateValid = false;
        }
        else {
            rateValid = true;
        }

        if (!amountToIsNumber && amountTo != null) {
            amountToValid = false;
        }
        if (amountToIsNumber && amountFrom >= amountTo) {
            amountToValid = false;
        }

        if (amountTo == null) {
            amountToValid = true;
        }
        if (rateValid && amountToValid) {
            if (this.errorSet.has(this.rowIndex)) {
                this.errorSet.delete(this.rowIndex);
            }
        } else {
            if (!this.errorSet.has(this.rowIndex)) {
                this.errorSet.add(this.rowIndex);
            }
        }
        if (this.errorSet.size == 0) {
          checker=true;
        }
        if (this.errorSet.size > 0) {;
           checker=false;
        }
        return checker;
    }

    onDeleteRow() {
        let deleteIndex = this.glSlabs.length - 1;
        this.glSlabs.splice(deleteIndex, 1);
        this.glSlabs = [...this.glSlabs];
        if (this.errorSet.has(deleteIndex)) {
            this.errorSet.delete(deleteIndex);
        }
        if (this.errorSet.size == 0) {
        } 
    }


    showError(data, index) {
        let amountFrom = data.amountRangeFrom;
        let amountTo = data.amountRangeTo;
        let landingRate = data.landingRate;
        let borrowingRate = data.borrowingRate;
        let amountToIsNumber = amountTo;
        let rateValid = true;
        let amountToValid = true;
        this.rowIndex = index;

        if (landingRate == null || borrowingRate == null || landingRate > 100 || borrowingRate > 100) {
            rateValid = false;
        }
        else {
            rateValid = true;
        }

        if (!amountToIsNumber && amountTo != null) {
            amountToValid = false;
        }
        if (amountToIsNumber && amountFrom >= amountTo) {
            amountToValid = false;
        }


        if (amountTo == null) {
            amountToValid = true;
        }
        if (rateValid && amountToValid) {
            return 'valid-row';
        }
        else {
            return 'invalid-datatable-row';
        }

    }

    formInvalid() {
        let checker=this.checkValidity();
        return (this.profitRateForm.invalid || (this.isSlabApplicable && this.glSlabs.length == 0)|| !checker);
    }

    save() {
        this.markFormGroupAsTouched(this.profitRateForm);
        if (!this.formInvalid()) {
            this.command = this.generalLedgerAccountProfitRateId
                ? commandConstants.UPDATE_GENERAL_LEDGER_ACCOUNT_PROFIT_RATE_COMMAND
                : commandConstants.CREATE_GENERAL_LEDGER_ACCOUNT_PROFIT_RATE_COMMAND;

            this.showVerifierSelectionModal = of(true);
        }
        if(this.taskId){
            this.router.navigate(['/approval-flow/pendingtasks']);
        }
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        this.generalLedgerAccountProfitRateId
            ? this.updateGeneralLedgerAccountProfitRate(event)
            : this.createGeneralLedgerAccountProfitRate(event);
    }

    createGeneralLedgerAccountProfitRate(event: VerifierSelectionEvent) {
        let profitRate: GeneralLedgerAccountProfitRate = this.profitRateForm.value;
        profitRate.productProfitRateSlabs = this.glSlabs;
        profitRate.generalLedgerAccountId = this.generalLedgerAccountId;

        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, DETAILS_UI.concat(this.generalLedgerAccountId + '?'), this.location.path().concat("/" + this.generalLedgerAccountId + "/form?"));
        this.subscribers.createProfitRateSubs = this.glAccountService.
            createProfitRate(profitRate, { 'generalLedgerAccountId': this.generalLedgerAccountId + '' }, urlSearchParams)
            .subscribe(data => {
                this.onSave.emit(true);
                event.approvalFlowRequired
                    ? this.notificationService.sendSuccessMsg("workflow.task.verify.send")
                    : this.notificationService.sendSuccessMsg("glaccount.profitrate.save.success");
            });
    }

    updateGeneralLedgerAccountProfitRate(event: VerifierSelectionEvent) {
        let profitRate: GeneralLedgerAccountProfitRate;
        profitRate = this.profitRateForm.value;
        profitRate.productProfitRateSlabs = this.glSlabs;
        profitRate.generalLedgerAccountId = this.generalLedgerAccountId;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, DETAILS_UI.concat(this.generalLedgerAccountId + '?'), this.location.path().concat("/" + this.generalLedgerAccountId + "/form?"));
        this.subscribers.updateProfitRateSubs = this.glAccountService
            .updateProfitRate(profitRate, { 'generalLedgerAccountId': this.generalLedgerAccountId + '', 'generalLedgerAccountProfitRateId': this.generalLedgerAccountProfitRateId + '' }, urlSearchParams)
            .subscribe(data => {
                this.onSave.emit(true);
                event.approvalFlowRequired
                    ? this.notificationService.sendSuccessMsg("workflow.task.verify.send")
                    : this.notificationService.sendSuccessMsg("glaccount.profitrate.update.success");
            });
    }
    formcancel() {
        this.router.navigate(['/approval-flow/pendingtasks']);
    }
    cancel() {
        this.navigateAway();
        this.router.navigate(['/glaccount/profit-rate']);
    }

    navigateAway() {
        if (this.taskId) {
            this.router.navigate(['approval-flow/pendingtasks']);
        } else {
            this.router.navigate(['../'], {
                relativeTo: this.route,
            });
        }
    }
}


