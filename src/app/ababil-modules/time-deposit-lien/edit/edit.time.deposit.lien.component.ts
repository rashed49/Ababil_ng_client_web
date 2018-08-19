import { of } from "rxjs";
import { Location } from '@angular/common';
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Account } from "../../../services/account/domain/account.model";
import { BaseComponent } from "../../../common/components/base.component";
import { TimeDepositLienService } from "../../../services/time-deposit-lien/service-api/time.deposit.lien.service";
import { AccountService } from "../../../services/account/service-api/account.service";
import { TimeDepositLien } from "../../../services/time-deposit-lien/domain/time.deposit.lien.model";
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { TimeDepositLienDetail } from "../../../services/time-deposit-lien/domain/time.deposit.lien.detail.model";
import { AmountInWordsService } from "../../../common/services/amount.in.words.service";
import { NotificationService } from "../../../common/notification/notification.service";
import { ReferenceType } from "../../../services/time-deposit-lien-reference-type/domain/time.deposit.lien.reference.type.model";
import { TimeDepositLienReferenceTypeService } from "../../../services/time-deposit-lien-reference-type/service-api/time.deposit.lien.reference.type.service";
import * as commandConstants from '../../../common/constants/app.command.constants';
import { ApprovalflowService } from "../../../services/approvalflow/service-api/approval.flow.service";
import { FormBaseComponent } from "../../../common/components/base.form.component";
import { VerifierSelectionEvent } from "../../../common/components/verifier-selection/verifier.selection.component";
import { AccountNumberFormatter } from "../../../common/components/AccountNumberFormatter/account.number.formatter.component";
import { NgSsoService } from "../../../services/security/ngoauth/ngsso.service";
export const DETAILS_UI = 'views/time-deposit-lien'

@Component({
    selector: 'lien-edit',
    templateUrl: './edit.time.deposit.lien.component.html'
})
export class EditTimeDepositLienComponent extends AccountNumberFormatter implements OnInit {

    editTimeDepositLienForm: FormGroup;
    timeDepositLien: TimeDepositLien = new TimeDepositLien();
    referenceType: ReferenceType = new ReferenceType();
    timeDepositLienDetail: TimeDepositLienDetail = new TimeDepositLienDetail();
    accountDetail: Account = new Account();
    timeDepositLienDetails: TimeDepositLienDetail[] = [];
    urlSearchParams: Map<string, string>;
    accountTypeMap: Map<number, string> = new Map();

    lienId: number;
    referenceTypeId: number;
    accountNumber: number;
    accountId: number;
    balanceLength = 20;
    imposeAmount: number;

    displayButton: boolean = false;
    amountInWords: string;

    branchCodeLength: number = 3;
    accountNumberLengthWithProductCode: number = 10;
    accountNumberWithProductCode: string = '';
    branchCode: string = '';
    userName$: String;
    userActiveBranch$: number;
    userHomeBranch$: number;

    constructor(
        private router: Router,
        protected location: Location,
        private route: ActivatedRoute,
        protected accountService: AccountService,
        private formBuilder: FormBuilder,
        private timeDepositLienService: TimeDepositLienService,
        protected approvalFlowService: ApprovalflowService,
        private amountInWordService: AmountInWordsService,
        private ngSsoService: NgSsoService,
        private notificationService: NotificationService,
        private timeDepositLienReferenceTypeService: TimeDepositLienReferenceTypeService) {
        super(accountService,location, approvalFlowService)
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);
        this.subscribers.routerSub = this.route.params.subscribe(params => {
            this.lienId = params['id'];
        });
        this.ngSsoService.account().subscribe(account => {
            //this.userName$ = account.username;
            // this.userHomeBranch$ = account.homeBranch;
            this.userActiveBranch$ = account.activeBranch;
            this.formatBranchCode(this.userActiveBranch$.toString(), (code) => this.branchCode = code);
            //  this.userActiveBranch$ = account.homeBranch;
        });

        
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

        this.subscribers.fatchLienDetailSub = this.timeDepositLienService.fetchTimeDepositLien({ lienId: this.lienId })
            .subscribe(data => {
                this.timeDepositLien = data;
                this.editTimeDepositLienForm.get('note').setValue(this.timeDepositLien.note);
                this.referenceTypeId = this.timeDepositLien.referenceTypeId;
                this.timeDepositLienDetails = this.timeDepositLien.timeDepositLienDetails
                    .map(lien => {
                        return {
                            accountId: lien.accountId,
                            accountNumber: lien.accountNumber,
                            eligibleLienAmount: lien.eligibleLienAmount,
                            id: lien.id,
                            imposeAmount: 0,
                            imposeDate: lien.imposeDate,
                            lastWithdrawalDate: lien.lastWithdrawalDate,
                            lienBalance: lien.lienBalance,
                            status: lien.status,
                            withdrawalAmount: 0,
                        }
                    });
                this.timeDepositLien.timeDepositLienDetails.map(accountDetail => accountDetail.accountId)
                    .map(accountId => {
                        this.fetchAccountDetail(accountId);
                    });
                this.subscribers.referenceTypeSub = this.timeDepositLienReferenceTypeService.fetchReferencetype({ referenceTypeId: this.referenceTypeId })
                    .subscribe(data => {
                        this.referenceType = data;
                    });
            });
        this.prepareTimeDepositEditLienForm(new TimeDepositLien());
    }

    prepareTimeDepositEditLienForm(formData: TimeDepositLien) {
        this.editTimeDepositLienForm = this.formBuilder.group({
            referenceTypeId: [formData.referenceTypeId],
            lienReferenceNumber: [formData.lienReferenceNumber],
            note: [formData.note],
            accountId: [null, [Validators.required]],
            imposeAmount: [null, [Validators.required]],
            lienBalance: [{ value: this.timeDepositLienDetail.lienBalance, disabled: true }],
            eligibleLienAmount: [{ value: this.timeDepositLienDetail.eligibleLienAmount, disabled: true }]
        });

        // this.editTimeDepositLienForm.get('accountId').valueChanges
        //     .pipe(debounceTime(1500), distinctUntilChanged(), filter(val => val))
        //     .subscribe(value => {
        //         this.accountNumber = value;
        //         this.searchAccountByAccountNumber(this.accountNumber);
        //     });
        this.editTimeDepositLienForm.get('imposeAmount').valueChanges.subscribe(value => {
            let amount = this.editTimeDepositLienForm.get('imposeAmount').value;
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
                    this.editTimeDepositLienForm.controls.accountId.setValue(this.accountId);
                    this.setLienBalanceInfo(this.accountId);
                } else {
                    this.accountDetail = new Account();
                    this.editTimeDepositLienForm.get('accountId').reset();
                    this.editTimeDepositLienForm.get('lienBalance').reset();
                    this.editTimeDepositLienForm.get('eligibleLienAmount').reset();
                    this.notificationService.sendErrorMsg("invalid.account.number");
                }
            });
    }

    setLienBalanceInfo(accountId) {
        this.subscribers.accountEligibleLienSub = this.timeDepositLienService.fetchAccountEligibleLien({ accountId: this.accountId })
            .subscribe(data => {
                this.timeDepositLienDetail = data;
                this.editTimeDepositLienForm.get('lienBalance').setValue(this.timeDepositLienDetail.lienBalance);
                this.editTimeDepositLienForm.get('eligibleLienAmount').setValue(this.timeDepositLienDetail.eligibleLienAmount);
            });
    }

    addLienImpose() {
        if (this.accountNumber) {
        this.markFormGroupAsTouched(this.editTimeDepositLienForm)
        if (this.editTimeDepositLienForm.invalid) return;

        this.timeDepositLienDetail = new TimeDepositLienDetail();
        this.timeDepositLienDetail.accountId = this.accountId;
        this.timeDepositLienDetail.accountNumber = this.accountNumber;
        this.timeDepositLienDetail.imposeAmount = this.editTimeDepositLienForm.get('imposeAmount').value;
        this.timeDepositLienDetail.eligibleLienAmount = this.editTimeDepositLienForm.get('eligibleLienAmount').value;
        this.timeDepositLienDetails = [this.timeDepositLienDetail, ...this.timeDepositLienDetails]

        this.editTimeDepositLienForm.get('lienBalance').reset();
        this.editTimeDepositLienForm.get('eligibleLienAmount').reset();
        this.accountNumberWithProductCode = '';
        this.accountNumber = null;
        this.editTimeDepositLienForm.get('imposeAmount').reset();
        }
        else{
            this.markFormGroupAsTouched(this.editTimeDepositLienForm)
            if (this.editTimeDepositLienForm.invalid) return;

        }
    }

    timeDepositLienUpdate(timeDepositLienToSave, urlSearchParams, event) {
        this.subscribers.updateLienSub = this.timeDepositLienService.updateTimeDepositLien(timeDepositLienToSave, urlSearchParams)
            .subscribe(data => {
                event.approvalFlowRequired
                    ? this.notificationService.sendSuccessMsg("workflow.task.verify.send")
                    : this.notificationService.sendSuccessMsg("time.deposit.lien.update.success");
                this.prepareTimeDepositEditLienForm(new TimeDepositLien());
                this.back();
            });
    }

    updateTimedepositLien() {
        this.showVerifierSelectionModal = of(true);
        this.command = commandConstants.UPDATE_TIME_DEPOSIT_LIEN;
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let view_ui = DETAILS_UI + `?`;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));

        this.editTimeDepositLienForm.get('note').setValidators(Validators.required);
        this.editTimeDepositLienForm.get('note').updateValueAndValidity();
        if (this.editTimeDepositLienForm.get('note').invalid) return;
        else {
            this.timeDepositLien.note = this.editTimeDepositLienForm.get('note').value;
            this.timeDepositLien.timeDepositLienDetails = this.timeDepositLienDetails;
            this.timeDepositLienUpdate(this.timeDepositLien, urlSearchParams, event);
        }

    }

    fetchAccountDetail(accountId) {
        this.subscribers.AccountDetailSub = this.accountService.fetchAccountDetails({ accountId: accountId })
            .subscribe(data => {
                this.accountDetail = data;
                this.accountTypeMap.set(this.accountDetail.id, this.accountDetail.number);
            });
    }
    deleteTimeDepositLienDetail(index) {
        let temp = Object.assign([], this.timeDepositLienDetails);
        temp.splice(index, 1);
        this.timeDepositLienDetails = Object.assign([], temp);
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
    back() {
        this.router.navigate(['../'], { relativeTo: this.route });
    }
}