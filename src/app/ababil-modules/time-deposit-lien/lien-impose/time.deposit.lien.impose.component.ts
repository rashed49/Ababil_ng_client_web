import { of } from "rxjs";
import { Location } from '@angular/common';
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SelectItem } from "primeng/components/common/selectitem";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { BaseComponent } from "../../../common/components/base.component";
import { FormBaseComponent } from "../../../common/components/base.form.component";
import * as commandConstants from '../../../common/constants/app.command.constants';
import { AccountService } from "../../../services/account/service-api/account.service";
import { Account } from "../../../services/account/domain/account.model";
import { NotificationService } from "../../../common/notification/notification.service";
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import * as ababilValidators from '../../../common/constants/app.validator.constants';
import { AmountInWordsService } from "../../../common/services/amount.in.words.service";
import { FixedDepositAccount } from "../../../services/fixed-deposit-account/domain/fixed.deposit.account.models";
import { TimeDepositLienService } from "../../../services/time-deposit-lien/service-api/time.deposit.lien.service";
import { TimeDepositLien } from "../../../services/time-deposit-lien/domain/time.deposit.lien.model";
import { TimeDepositLienDetail } from "../../../services/time-deposit-lien/domain/time.deposit.lien.detail.model";
import { TimeDepositLienReferenceTypeService } from "../../../services/time-deposit-lien-reference-type/service-api/time.deposit.lien.reference.type.service";
import { ApprovalflowService } from "../../../services/approvalflow/service-api/approval.flow.service";
import { VerifierSelectionEvent } from "../../../common/components/verifier-selection/verifier.selection.component";
import { AccountNumberFormatter } from "../../../common/components/AccountNumberFormatter/account.number.formatter.component";
import { NgSsoService } from "../../../services/security/ngoauth/ngsso.service";

export const DETAILS_UI = 'views/time-deposit-lien';

@Component({
    selector: 'lien-impose-form',
    templateUrl: './time.deposit.lien.impose.component.html',
    styleUrls: ['./time.deposit.lien.impose.component.scss']
})
export class TimeDepositLienImposeComponent extends AccountNumberFormatter implements OnInit {
    timeDepositLienForm: FormGroup;
    timeDepositLien: TimeDepositLien = new TimeDepositLien();
    timeDepositLienDetail: TimeDepositLienDetail = new TimeDepositLienDetail();
    timeDepositLienDetails: TimeDepositLienDetail[] = [];
    accountTypeMap: Map<number, string> = new Map();
    accountDetails: Account = new Account();
    accountDetail: Account = new Account();
    urlSearchParams: Map<string, string>;

    lienReferenceNumber: string;
    amountInWords: string;
    currencyCode: string;

    accountNumber: number;
    accountId: number;
    referenceTypes: any[] = [];
    referenceId: number;
    eligibleLienAmount: number;
    lienId: number;
    balanceLength = 20;
    basicInfoHide: boolean = false;

    branchCodeLength: number = 3;
    accountNumberLengthWithProductCode: number = 10;
    accountNumberWithProductCode: string = '';

    branchCode: string = '';
    userName$: String;
    userActiveBranch$: number;
    userHomeBranch$: number;

    constructor(private router: Router,
        private route: ActivatedRoute,
        protected location: Location,
        protected approvalFlowService: ApprovalflowService,
        private timeDepositLienService: TimeDepositLienService,
        private formBuilder: FormBuilder,
        protected accountService: AccountService,
        private notificationService: NotificationService,
        private amountInWordService: AmountInWordsService,
        private ngSsoService: NgSsoService,
        private timeDepositLienReferenceTypeService: TimeDepositLienReferenceTypeService) {
        super(accountService, location, approvalFlowService)
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);
        this.subscribers.routerSub = this.route.params.subscribe(params => {
            this.lienId = params['id'];
        });
        this.ngSsoService.account().subscribe(account => {
            this.userActiveBranch$ = account.activeBranch;
            this.formatBranchCode(this.userActiveBranch$.toString(), (code) => this.branchCode = code);
        });


        this.fetchReferenceTypes();
        this.prepareTimeDepositLienForm(new TimeDepositLien());

        this.subscribers.fetchBranchCodeLengthSub = this.accountService.fetchBranchCodeLength().subscribe(
            data => {
                this.branchCodeLength = +data;
                this.subscribers.fetchAcoountNumberLength = this.accountService.fetchAccountLengthConfiguration().subscribe(
                    accountLength => {
                        this.accountNumberLengthWithProductCode = (+accountLength) - (+this.branchCodeLength);
                    }
                )
            }

        )
    }

    prepareTimeDepositLienForm(formData: TimeDepositLien) {
        this.timeDepositLienForm = this.formBuilder.group({
            referenceTypeId: [formData.referenceTypeId, [Validators.required]],
            lienReferenceNumber: [formData.lienReferenceNumber, [Validators.required]],
            note: [formData.note, [Validators.required]],
            accountId: [null, [Validators.required]],
            imposeAmount: [null, Validators.required],
            lienBalance: [{ value: this.timeDepositLienDetail.lienBalance, disabled: true }],
            eligibleLienAmount: [{ value: this.timeDepositLienDetail.eligibleLienAmount, disabled: true }]
        });

        this.timeDepositLienForm.get('imposeAmount').valueChanges.subscribe(value => {
            let amount = this.timeDepositLienForm.get('imposeAmount').value;
            this.amountInWords = this.amountInWordService.convertAmountToWords(amount, this.accountDetail.currencyCode || null);
        });
    }

    searchAccountByAccountNumber(accountNumber) {
        this.urlSearchParams = new Map([['accountNumber', accountNumber]]);
        this.subscribers.searchAccountSub = this.accountService
            .fetchAccounts(this.urlSearchParams)
            .subscribe(data => {
                this.accountDetail = data.content[0];
                if (this.accountDetail && this.accountDetail.id) {
                    this.accountId = this.accountDetail.id;
                    this.timeDepositLienForm.controls.accountId.setValue(this.accountId);
                    this.setLienBalanceInfo(this.accountId);
                } else {
                    this.accountDetail = new Account();
                    this.timeDepositLienForm.get('accountId').reset();
                    this.timeDepositLienForm.get('lienBalance').reset();
                    this.timeDepositLienForm.get('eligibleLienAmount').reset();
                    this.notificationService.sendErrorMsg("invalid.account.number");
                }
            });
    }

    setLienBalanceInfo(accountId) {
        this.subscribers.accountEligibleLienSub = this.timeDepositLienService.fetchAccountEligibleLien({ accountId: this.accountId })
            .subscribe(data => {
                this.timeDepositLienDetail = data;
                this.timeDepositLienForm.get('lienBalance').setValue(this.timeDepositLienDetail.lienBalance);
                this.timeDepositLienForm.get('eligibleLienAmount').setValue(this.timeDepositLienDetail.eligibleLienAmount);
            });
    }

    addLienImpose() {
        if (this.accountNumber) {
            this.markFormGroupAsTouched(this.timeDepositLienForm)
            if (this.timeDepositLienForm.invalid) return;
            this.timeDepositLienDetail = new TimeDepositLienDetail();
            this.timeDepositLienDetail.accountId = this.accountId;
            this.timeDepositLienDetail.accountNumber = this.accountNumber;
            this.timeDepositLienDetail.imposeAmount = this.timeDepositLienForm.get('imposeAmount').value;
            this.timeDepositLienDetail.eligibleLienAmount = this.timeDepositLienForm.get('eligibleLienAmount').value;
            this.timeDepositLienDetails = [this.timeDepositLienDetail, ...this.timeDepositLienDetails]

            if (this.timeDepositLienDetails.length > 0) {
                this.basicInfoHide = true;
            }

            this.timeDepositLienForm.get('lienBalance').reset();
            this.timeDepositLienForm.get('eligibleLienAmount').reset();
            this.accountNumberWithProductCode = '';
            this.accountNumber = null;
            this.timeDepositLienForm.get('imposeAmount').reset();
        }
        else{
            this.markFormGroupAsTouched(this.timeDepositLienForm)
            if (this.timeDepositLienForm.invalid) return;

        }
    }

    createTimeDepositLien(timeDepositLienToSave, urlSearchParams, event) {
        this.subscribers.createLienSub = this.timeDepositLienService.createTimeDepositLien(timeDepositLienToSave, urlSearchParams)
            .subscribe(data => {
                event.approvalFlowRequired
                    ? this.notificationService.sendSuccessMsg("workflow.task.verify.send")
                    : this.notificationService.sendSuccessMsg("time.deposit.lien.createtion.success");
                this.prepareTimeDepositLienForm(new TimeDepositLien());
                this.back();
            });
    }

    saveTimeDepositLien() {
        this.showVerifierSelectionModal = of(true);
        this.command = commandConstants.CREATE_TIME_DEPOSIT_LIEN;;
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let view_ui = DETAILS_UI + `?`;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));
        this.timeDepositLien = new TimeDepositLien();
        this.timeDepositLien.referenceTypeId = this.timeDepositLienForm.get('referenceTypeId').value;
        this.timeDepositLien.lienReferenceNumber = this.timeDepositLienForm.get('lienReferenceNumber').value;
        this.timeDepositLien.note = this.timeDepositLienForm.get('note').value;
        this.timeDepositLien.timeDepositLienDetails = this.timeDepositLienDetails;

        this.createTimeDepositLien(this.timeDepositLien, urlSearchParams, event);
    }
    deleteTimeDepositLienDetail(index) {
        let temp = Object.assign([], this.timeDepositLienDetails);
        temp.splice(index, 1);
        this.timeDepositLienDetails = Object.assign([], temp);
    }

    fetchReferenceTypes() {
        this.timeDepositLienReferenceTypeService.fetchReferenceTypes()
            .subscribe(data => {
                this.referenceTypes = [{ label: 'Choose Reference Type', value: null }].concat(data.map(element => {
                    return { label: element.referenceType, value: element.id }
                }));
            });
    }
    fetchAccountDetail(accountId) {
        this.subscribers.AccountDetailSub = this.accountService.fetchAccountDetails({ accountId: accountId })
            .subscribe(data => {
                this.accountDetails = data;
                this.accountTypeMap.set(this.accountDetails.id, this.accountDetails.number);
            });
    }

    formatAccountNumberToShow() {
        if (this.accountNumberWithProductCode && this.accountNumberWithProductCode != '') {
            if (this.branchCode != '') {
                this.formatAccountNumberWithBranchCode(this.branchCode, this.accountNumberWithProductCode, this.accountNumberLengthWithProductCode, (formattedAccountNumber) => {
                    this.accountNumber = formattedAccountNumber;
                    this.searchAccountByAccountNumber(this.accountNumber);
                });
            }
            this.formattedAccountNumberWithProductCode(this.accountNumberWithProductCode, this.accountNumberLengthWithProductCode, (code) => this.accountNumberWithProductCode = code);
        }
    }
    formatBranchCodeToShow() {
        if (this.branchCode != '') {
            this.formatBranchCode(this.branchCode, (code) => this.branchCode = code);
            if (this.accountNumberWithProductCode != '') {
                this.formatAccountNumberToShow();
            }
        }
    }


    displaySaveButton() {
        if (this.timeDepositLienDetails.length == 0) {
            return true;
        } else {
            return false;
        }
    }

    back() {
        this.router.navigate(['../'], { relativeTo: this.route });
    }
}