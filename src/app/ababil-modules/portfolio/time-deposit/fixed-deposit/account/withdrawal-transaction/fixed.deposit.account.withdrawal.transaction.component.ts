import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';
import { Observable, of } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBaseComponent } from "../../../../../../common/components/base.form.component";
import { ApprovalflowService } from "../../../../../../services/approvalflow/service-api/approval.flow.service";
import { FixedDepositAccountService } from "../../../../../../services/fixed-deposit-account/service-api/fixed.deposit.account.service";
import { DemandDepositAccountService } from "../../../../../../services/demand-deposit-account/service-api/demand.deposit.account.service";
import { FixedDepositProductService } from "../../../../../../services/fixed-deposit-product/service-api/fixed.deposit.product.service";
import { FixedDepositProduct } from "../../../../../../services/fixed-deposit-product/domain/fixed.deposit.product.model";
import { FixedDepositAccount } from "../../../../../../services/fixed-deposit-account/domain/fixed.deposit.account.models";
import { SelectItem } from 'primeng/api';
import { TransectionTypes } from "../../../../../../common/domain/fixed.deposit.account.withdrawal.transaction.enum.model";
import { WithdrawalAdvice } from "../../../../../../services/fixed-deposit-principal-withdrawal-advice/domain/fixed.deposit.principal.withdrawal.advice.model";
import { FixedDepositPrincipalWithdrawalAdviceService } from "../../../../../../services/fixed-deposit-principal-withdrawal-advice/service-api/fixed.deposit.principal.withdrawal.advice.service";
import { DemandDepositAccount, DemandDepositAccountBalance } from "../../../../../../services/demand-deposit-account/domain/demand.deposit.account.models";
import { FixedDepositPrincipalWithdrawalTransactionService } from "../../../../../../services/fixed-deposit-principal-withdrawal-transaction/service-api/fixed.deposit.principal.withdrawal.transaction.service";
import { FixedDepositTransaction } from "../../../../../../services/fixed-deposit-principal-withdrawal-transaction/domain/fixed.deposit.principal.withdrawal.transaction.model";
import { NotificationService } from "../../../../../../common/notification/notification.service";
import * as commandConstants from '../../../../../../common/constants/app.command.constants';
import { VerifierSelectionEvent } from "../../../../../../common/components/verifier-selection/verifier.selection.component";
import { NgSsoService } from "../../../../../../services/security/ngoauth/ngsso.service";
import { TellerService } from "../../../../../../services/teller/service-api/teller.service";
import { ChequeService } from "../../../../../../services/cheque/service-api/cheque.service";
import { AmountInWordsService } from "../../../../../../common/services/amount.in.words.service";

export const DETAILS_UI = 'views/withdrawal-transaction-view';

@Component({
    selector: 'withdrawal-transaction',
    templateUrl: './fixed.deposit.account.withdrawal.transaction.component.html'
})
export class FixedDepositAccountWithdrawalTransectionComponent extends FormBaseComponent implements OnInit {

    fixedDepositWithdrawalTransactionForm: FormGroup;
    fixedDepositAccount: FixedDepositAccount = new FixedDepositAccount();
    withdrawalAdvice: WithdrawalAdvice = new WithdrawalAdvice();
    DemandDepositAccount: DemandDepositAccount = new DemandDepositAccount();
    demandDepositAccountBalance: DemandDepositAccountBalance = new DemandDepositAccountBalance();
    fixedDepositTransaction: FixedDepositTransaction = new FixedDepositTransaction();
    fixedDepositProductDetails: FixedDepositProduct = new FixedDepositProduct();

    fixedDepositAccountId: number;
    instrumentNumberLength = null;
    productId: number;
    queryParams: any;
    withdrawalPercentage: number;
    lienAmount: number;
    quardAmount: number;
    depositAccountId: number;
    lienAmonut: number;
    availableBalance: number;
    customerId: number;
    withdrawalAmount: number;
    globalTransactionNumber: number;

    TransectionTypes: SelectItem[] = TransectionTypes;
    transactionTypeCall: boolean = false;
    showChequeInfo: boolean = false;
    required: boolean = false;
    today = new Date();

    status: string;
    referenceNumber: string;
    selectedTransactionType: string;
    amountInWords: string;
    currencyCode: string;

    userName$: String;
    userActiveBranch$: number;
    userHomeBranch$: number;
    activityId: number;

    constructor(private router: Router,
        protected approvalFlowService: ApprovalflowService,
        private route: ActivatedRoute,
        protected location: Location,
        private ngSsoService: NgSsoService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private tellerService: TellerService,
        private chequeService: ChequeService,
        private fixedDepositAccountService: FixedDepositAccountService,
        private depositAccountService: DemandDepositAccountService,
        private fixedDepositProductService: FixedDepositProductService,
        private amountInWordService: AmountInWordsService,
        private fixedDepositPrincipalWithdrawalAdviceService: FixedDepositPrincipalWithdrawalAdviceService,
        private fixedDepositPrincipalWithdrawalTransactionService: FixedDepositPrincipalWithdrawalTransactionService) {

        super(location, approvalFlowService)
    }
    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);

        this.ngSsoService.account().subscribe(account => {
            this.userName$ = account.username;
            // this.userActiveBranch$ = account.activeBranch;
            // this.userHomeBranch$ = account.homeBranch;
        });
        this.subscribers.queryParamSub = this.route.queryParams.subscribe(
            queryParams => {
                this.queryParams = queryParams;
                this.fixedDepositAccountId = queryParams['accountId'];
                this.productId = queryParams['productId'];
                this.referenceNumber = queryParams['referenceNumber'];
            });
        this.subscribers.fetchInstrumentNumberLengthSub = this.chequeService.fetchChequeNumberLength().subscribe(
            data => this.instrumentNumberLength = data
        )
        this.prepareFixedDepositWithdralalTransactionForm(this.fixedDepositTransaction);
        this.fetchFixedDepositAccountDetails();
        this.fetchFixedDepositWithdrawalAdvice();
    }

    prepareFixedDepositWithdralalTransactionForm(fixedDepositTransaction: FixedDepositTransaction) {

        this.fixedDepositWithdrawalTransactionForm = this.formBuilder.group({
            transactionAmount: [fixedDepositTransaction.transactionAmount, [Validators.required]],
            narration: [fixedDepositTransaction.narration],
            instrumentDate: [fixedDepositTransaction.instrumentDate],
            instrumentNumber: [fixedDepositTransaction.instrumentNumber],
        });

        this.fixedDepositWithdrawalTransactionForm.get('transactionAmount').valueChanges.subscribe(value => {
            let amount = this.fixedDepositWithdrawalTransactionForm.get('transactionAmount').value;
            this.amountInWords = this.amountInWordService.convertAmountToWords(amount, this.currencyCode || null);
        });

    }

    updateFixedDepositWithdrawalTransaction() {
        this.markFormGroupAsTouched(this.fixedDepositWithdrawalTransactionForm);
        this.transactionTypeCall = true;
        if (this.fixedDepositWithdrawalTransactionForm.invalid) return;
        this.showVerifierSelectionModal = of(true);
        if (this.selectedTransactionType == "DEPOSIT") {
            this.showVerifierSelectionModal = of(true);
        } else {
            this.command = commandConstants.CREATE_FIXED_DEPOSIT_WITHDRAWAL_TRANSACTION;
        }
    }

    onVerifierSelect(event: VerifierSelectionEvent) {

        let view_ui = DETAILS_UI + `?fixedDepositAccountId=${this.fixedDepositAccountId}&productId=${this.productId}&referenceNumber=${this.referenceNumber}&`;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));

        let fixedDepositTransaction = new FixedDepositTransaction();
        fixedDepositTransaction.referenceNumber = this.referenceNumber;
        fixedDepositTransaction.fixedDepositAccountId = this.fixedDepositAccountId;
        fixedDepositTransaction.casaAccountId = this.depositAccountId;
        fixedDepositTransaction.transactionAmount = this.fixedDepositWithdrawalTransactionForm.get('transactionAmount').value;
        fixedDepositTransaction.narration = this.fixedDepositWithdrawalTransactionForm.get('narration').value;
        fixedDepositTransaction.instrumentNumber = this.fixedDepositWithdrawalTransactionForm.get('instrumentNumber').value;
        fixedDepositTransaction.instrumentDate = this.fixedDepositWithdrawalTransactionForm.get('instrumentDate').value;

        if (this.selectedTransactionType == "DEPOSIT") {
            fixedDepositTransaction.activityId = 406;
            this.updateFixedDepositWithdrawalTransactionCredit(fixedDepositTransaction, urlSearchParams, event);
        } else {
            fixedDepositTransaction.activityId = 405;
            this.updateFixedDepositWithdrawalTransactionDebit(fixedDepositTransaction, urlSearchParams, event);
        }
    }

    updateFixedDepositWithdrawalTransactionDebit(fixedDepositTransactionToSave, urlSearchParams, event) {


        let urlQueryParamMap = new Map();
        urlQueryParamMap.set("activityId", fixedDepositTransactionToSave.activityId);
        urlQueryParamMap.set("userId", this.userName$);
        this.subscribers.fatchGlobalTransactionNumberSub = this.tellerService.fetchGlobalTxnNo(urlQueryParamMap)
            .subscribe(data => {
                this.globalTransactionNumber = data;
                console.log(data);
                fixedDepositTransactionToSave.globalTxnNo = this.globalTransactionNumber;

                this.subscribers.withdrawalTransactionSub = this.fixedDepositPrincipalWithdrawalTransactionService
                    .updateFixedDepositWithdrawalTransactionDebit(fixedDepositTransactionToSave, { fixedDepositAccountId: this.fixedDepositAccountId }, urlSearchParams)
                    .subscribe(data => {
                        event.approvalFlowRequired
                            ? this.notificationService.sendSuccessMsg("fixed.deposit.withdrawal.Transaction.verify.send", { voucher: fixedDepositTransactionToSave.globalTxnNo })
                            : this.notificationService.sendSuccessMsg("fixed.deposit.withdrawal.Transaction.debited.success", { voucher: fixedDepositTransactionToSave.globalTxnNo });
                        this.prepareFixedDepositWithdralalTransactionForm(new FixedDepositTransaction);
                        this.back();
                    });
            });

    }
    updateFixedDepositWithdrawalTransactionCredit(fixedDepositTransactionToSave, urlSearchParams, event) {
        let urlQueryParamMap = new Map();
        urlQueryParamMap.set("activityId", fixedDepositTransactionToSave.activityId);
        urlQueryParamMap.set("userId", this.userName$);
        this.subscribers.fatchGlobalTransactionNumberSub = this.tellerService.fetchGlobalTxnNo(urlQueryParamMap)
            .subscribe(data => {
                this.globalTransactionNumber = data;
                console.log(data);
                fixedDepositTransactionToSave.globalTxnNo = this.globalTransactionNumber;
                this.subscribers.withdrawalTransactionSub = this.fixedDepositPrincipalWithdrawalTransactionService
                    .updateFixedDepositWithdrawalTransactionCredit(fixedDepositTransactionToSave, { fixedDepositAccountId: this.fixedDepositAccountId }, urlSearchParams)
                    .subscribe(data => {
                        event.approvalFlowRequired
                            ? this.notificationService.sendSuccessMsg("fixed.deposit.withdrawal.Transaction.verify.send", { voucher: fixedDepositTransactionToSave.globalTxnNo })
                            : this.notificationService.sendSuccessMsg("fixed.deposit.withdrawal.Transaction.credited.success", { voucher: fixedDepositTransactionToSave.globalTxnNo });
                        this.prepareFixedDepositWithdralalTransactionForm(new FixedDepositTransaction);
                        this.back();
                    });
            });
    }

    showChequeInformation() {
        if (this.selectedTransactionType == "DEPOSIT") {
            this.showChequeInfo = true;
            this.fixedDepositWithdrawalTransactionForm.controls.instrumentDate.setValidators(Validators.required);
            this.fixedDepositWithdrawalTransactionForm.controls.instrumentDate.updateValueAndValidity();
            this.fixedDepositWithdrawalTransactionForm.controls.instrumentNumber.setValidators(Validators.required);
            this.fixedDepositWithdrawalTransactionForm.controls.instrumentNumber.updateValueAndValidity();
        } else {
            this.showChequeInfo = false;
            this.fixedDepositWithdrawalTransactionForm.get('instrumentDate').reset();
            this.fixedDepositWithdrawalTransactionForm.get('instrumentNumber').reset();
            this.fixedDepositWithdrawalTransactionForm.controls.instrumentDate.clearValidators();
            this.fixedDepositWithdrawalTransactionForm.controls.instrumentDate.updateValueAndValidity();
            this.fixedDepositWithdrawalTransactionForm.controls.instrumentNumber.clearValidators();
            this.fixedDepositWithdrawalTransactionForm.controls.instrumentNumber.updateValueAndValidity();
        }
    }

    fetchFixedDepositAccountDetails() {
        this.subscribers.fetchFixedDepositAccountDetailsSub = this.fixedDepositAccountService
            .fetchFixedDepositAccountDetails({ fixedDepositAccountId: this.fixedDepositAccountId + "" })
            .subscribe(data => {
                this.fixedDepositAccount = data;
                this.currencyCode = this.fixedDepositAccount.currencyCode;
                this.status = this.fixedDepositAccount.status;
                this.customerId = this.fixedDepositAccount.customerId;
                this.lienAmount = ((this.fixedDepositAccount.fixedDepositAccountBalance.lienAmount) ? (this.fixedDepositAccount.fixedDepositAccountBalance.lienAmount) : 0);
                this.quardAmount = ((this.fixedDepositAccount.fixedDepositAccountBalance.quardAmount) ? (this.fixedDepositAccount.fixedDepositAccountBalance.quardAmount) : 0);

                this.subscribers.fetchSub = this.fixedDepositProductService
                    .fetchFixedDepositProductDetails({ id: this.productId + '' })
                    .subscribe(data => {
                        this.fixedDepositProductDetails = data;
                        this.withdrawalPercentage = this.fixedDepositProductDetails.withdrawalPercentage;
                        this.withdrawalAmount = ((this.fixedDepositAccount.fixedDepositAccountBalance.balance * ((this.withdrawalPercentage) ? (this.withdrawalPercentage) : 0) / 100) - ((this.fixedDepositAccount.fixedDepositAccountBalance.lienAmount + this.fixedDepositAccount.fixedDepositAccountBalance.quardAmount) ? (this.fixedDepositAccount.fixedDepositAccountBalance.lienAmount + this.fixedDepositAccount.fixedDepositAccountBalance.quardAmount) : 0));
                    });
            });
    }

    fetchFixedDepositWithdrawalAdvice() {
        this.subscribers.fatchFixedDepositWithdrawalAdviceSub = this.fixedDepositPrincipalWithdrawalAdviceService
            .fetchFixedDepositWithdrawalAdvice({ fixedDepositAccountId: this.fixedDepositAccountId, referenceNumber: this.referenceNumber })
            .subscribe(data => {
                this.withdrawalAdvice = data;
                this.depositAccountId = this.withdrawalAdvice.depositAccountId;
                this.demandDepositAccountDetails();
            });
    }

    demandDepositAccountDetails() {
        this.subscribers.fatchDemandDepositAccountSub = this.depositAccountService.fetchDemandDepositAccountDetails({ id: this.depositAccountId })
            .subscribe(data => {
                this.DemandDepositAccount = data;
                this.lienAmonut = this.DemandDepositAccount.balance.lienAmount;
                this.availableBalance = this.DemandDepositAccount.balance.availableBalance;
            });
    }
    formatInstrumentNumber() {
        this.fixedDepositWithdrawalTransactionForm.controls.instrumentNumber.setValue(this.fixedDepositWithdrawalTransactionForm.controls.instrumentNumber.value.padStart(this.instrumentNumberLength, 0));
    }

    navigateAway() {
        this.router.navigate([this.queryParams['account']], {
            queryParams: {
                cus: this.queryParams['cus'],
                accountId: this.queryParams['accountId'],
                productId: this.queryParams['productId'],
                referenceNumber: this.queryParams['referenceNumber']
            }
        });
    }

    back() {
        this.navigateAway();
    }
}