import { Component, OnInit } from "@angular/core";
import { of } from "rxjs";
import { map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FormBaseComponent } from "../../../../../../common/components/base.form.component";
import { NotificationService } from "../../../../../../common/notification/notification.service";
import * as commandConstants from '../../../../../../common/constants/app.command.constants';
import { ApprovalflowService } from "../../../../../../services/approvalflow/service-api/approval.flow.service";
import { FixedDepositAccountService } from "../../../../../../services/fixed-deposit-account/service-api/fixed.deposit.account.service";
import { FixedDepositAccount } from "../../../../../../services/fixed-deposit-account/domain/fixed.deposit.account.models";
import { DemandDepositAccountService } from "../../../../../../services/demand-deposit-account/service-api/demand.deposit.account.service";
import { DemandDepositAccount } from "../../../../../../services/demand-deposit-account/domain/demand.deposit.account.models";
import { FixedDepositProductService } from "../../../../../../services/fixed-deposit-product/service-api/fixed.deposit.product.service";
import { FixedDepositProduct } from "../../../../../../services/fixed-deposit-product/domain/fixed.deposit.product.model";
import { WithdrawalAdvice } from "../../../../../../services/fixed-deposit-principal-withdrawal-advice/domain/fixed.deposit.principal.withdrawal.advice.model";
import { FixedDepositPrincipalWithdrawalAdviceService } from "../../../../../../services/fixed-deposit-principal-withdrawal-advice/service-api/fixed.deposit.principal.withdrawal.advice.service";
import { VerifierSelectionEvent } from "../../../../../../common/components/verifier-selection/verifier.selection.component";
import { AmountInWordsService } from "../../../../../../common/services/amount.in.words.service";


export const DETAILS_UI = 'views/withdrawal-advice-view';

@Component({
    selector: 'withdrawal-mapping',
    templateUrl: './fixed.deposit.account.withdrawal.mapping.component.html'
})
export class FixedDepositAccountWithdrawalMappingComponent extends FormBaseComponent implements OnInit {

    fixedDepositWithdrawalAdviceForm: FormGroup;
    depositAccounts: any[] = [];
    demanDepositAccounts: DemandDepositAccount[] = [];
    withdrawalAdvice: WithdrawalAdvice = new WithdrawalAdvice();
    fixedDepositAccount: FixedDepositAccount = new FixedDepositAccount();
    fixedDepositProductDetails: FixedDepositProduct = new FixedDepositProduct();
    DemandDepositAccount: DemandDepositAccount = new DemandDepositAccount();

    queryParams: any;
    demandDepositAccountTypeMap: Map<number, any> = new Map();

    id: number;
    customerId: number;
    productId: number;
    withdrawalAmount: number;
    withdrawalPercentage: number;
    fixedDepositAccountId: number;
    lienAmount: number;
    quardAmount: number;
    depositAccountId: number;
    today = new Date();

    status: string;
    demandDepositAccountType: string = "";
    referenceNumber: string;
    amountInWords:string;
    currencyCode:string;

    constructor(private router: Router,
        protected approvalFlowService: ApprovalflowService,
        private route: ActivatedRoute,
        protected location: Location,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private fixedDepositAccountService: FixedDepositAccountService,
        private depositAccountService: DemandDepositAccountService,
        private amountInWordService: AmountInWordsService,
        private fixedDepositProductService: FixedDepositProductService,
        private fixedDepositPrincipalWithdrawalAdviceService: FixedDepositPrincipalWithdrawalAdviceService) {
        super(location, approvalFlowService);
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);
        this.subscribers.queryParamSub = this.route.queryParams.subscribe(
            queryParams => {
                this.queryParams = queryParams;
                this.fixedDepositAccountId = queryParams['accountId'];
                this.productId = queryParams['productId'];
                this.referenceNumber = queryParams['referenceNumber']
            });
        this.fetchFixedDepositAccountDetails();
        if (!this.referenceNumber) {
            this.fetchReferenceNumber();
        }


        if (this.referenceNumber) {
            this.subscribers.fatchFixedDepositWithdrawalAdviceSub = this.fixedDepositPrincipalWithdrawalAdviceService
                .fetchFixedDepositWithdrawalAdvice({ fixedDepositAccountId: this.fixedDepositAccountId, referenceNumber: this.referenceNumber })
                .subscribe(data => {
                    this.withdrawalAdvice = data;
                    this.id = this.withdrawalAdvice.id;
                    this.depositAccountId = this.withdrawalAdvice.depositAccountId;

                    this.subscribers.fatchDemandDepositAccountSub = this.depositAccountService.fetchDemandDepositAccountDetails({ id: this.depositAccountId })
                        .subscribe(data => {
                            this.DemandDepositAccount = data;
                            this.prepareFixedDepositWithdralalAdviceForm(this.withdrawalAdvice);
                        });
                });
        }

        this.prepareFixedDepositWithdralalAdviceForm(this.withdrawalAdvice);

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
                        this.withdrawalAmount = (((this.fixedDepositAccount.fixedDepositAccountBalance.balance * ((this.withdrawalPercentage) ? (this.withdrawalPercentage) : 0) / 100) - ((this.fixedDepositAccount.fixedDepositAccountBalance.lienAmount + this.fixedDepositAccount.fixedDepositAccountBalance.quardAmount) ? (this.fixedDepositAccount.fixedDepositAccountBalance.lienAmount + this.fixedDepositAccount.fixedDepositAccountBalance.quardAmount) : 0)));
                    });
                if (!this.lienAmount && !this.quardAmount) {
                    let searchParam = new Map<string, string>();
                    searchParam.set('customerId', this.customerId + '');
                    this.subscribers.fetchDemandDepositAccountSub = this.depositAccountService.fetchDemandDepositAccounts(searchParam)
                        .pipe(map(m => m.content.filter(f => f.status == "ACTIVATED")))
                        .subscribe(data => {
                            this.depositAccounts = [{ label: 'Choose Account:', value: null }].concat(data.map(element => {
                                return { label: element.number, value: element.id }
                            }));
                        });
                }
            });
    }

    prepareFixedDepositWithdralalAdviceForm(withdrawalAdvice: WithdrawalAdvice) {
        if (!withdrawalAdvice) {
            withdrawalAdvice = new WithdrawalAdvice();
        }
        this.fixedDepositWithdrawalAdviceForm = this.formBuilder.group({

            depositAccountId: [withdrawalAdvice.depositAccountId, [Validators.required]],
            withdrawalLimit: [withdrawalAdvice.withdrawalLimit, [Validators.required]],
            expiryDate: [withdrawalAdvice.expiryDate == null ? null : new Date(withdrawalAdvice.expiryDate), [Validators.required]],
        });
        this.fixedDepositWithdrawalAdviceForm.get('withdrawalLimit').valueChanges.subscribe(value => {
            let amount = this.fixedDepositWithdrawalAdviceForm.get('withdrawalLimit').value;
            this.amountInWords = this.amountInWordService.convertAmountToWords(amount, this.currencyCode || null);
        });
    }
    saveFixedDepositWithdrawalAdvice() {
        this.markFormGroupAsTouched(this.fixedDepositWithdrawalAdviceForm);
        if (this.fixedDepositWithdrawalAdviceForm.invalid) return;

        this.showVerifierSelectionModal = of(true);
        if (this.id) {
            this.command = commandConstants.CREATE_FIXED_DEPISIT_WITHDRAWAL_ADVICE;
        } else {
            this.command = commandConstants.UPDATE_FIXED_DEPISIT_WITHDRAWAL_ADVICE;
        }

    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let view_ui = DETAILS_UI + `?fixedDepositAccountId=${this.fixedDepositAccountId}&referenceNumber=${this.referenceNumber}&productId=${this.productId}&`;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));
        let withdrawalAdvice = new WithdrawalAdvice();

        withdrawalAdvice.depositAccountId = this.fixedDepositWithdrawalAdviceForm.get('depositAccountId').value;
        withdrawalAdvice.expiryDate = this.fixedDepositWithdrawalAdviceForm.get('expiryDate').value;
        withdrawalAdvice.withdrawalLimit = this.fixedDepositWithdrawalAdviceForm.get('withdrawalLimit').value;
        withdrawalAdvice.referenceNumber = this.referenceNumber;
        withdrawalAdvice.fixedDepositAccount = this.fixedDepositAccountId;

        if (this.id) {
            this.updateFixedDepositWithdrawalAdvice(withdrawalAdvice, urlSearchParams, event)
        } else {
            this.createFixedDepositWithdrawalAdvice(withdrawalAdvice, urlSearchParams, event);
        }
    }

    createFixedDepositWithdrawalAdvice(WithdrawalAdviceToSave, urlSearchParams, event) {
        this.subscribers.withdrawalAdviceSub = this.fixedDepositPrincipalWithdrawalAdviceService.createFixedDepositWithdrawalAdvice(WithdrawalAdviceToSave, { fixedDepositAccountId: this.fixedDepositAccountId }, urlSearchParams)
            .subscribe(data => {
                event.approvalFlowRequired
                    ? this.notificationService.sendSuccessMsg("workflow.task.verify.send")
                    : this.notificationService.sendSuccessMsg("fixed.deposit.withdrawal.advice.creation.success");
                this.prepareFixedDepositWithdralalAdviceForm(new WithdrawalAdvice);
                this.back();

            });
    }
    updateFixedDepositWithdrawalAdvice(WithdrawalAdviceToSave, urlSearchParams, event) {
        this.subscribers.withdrawalAdviceSub = this.fixedDepositPrincipalWithdrawalAdviceService.updateFixedDepositWithdrawalAdvice(WithdrawalAdviceToSave, { fixedDepositAccountId: this.fixedDepositAccountId, referenceNumber: this.referenceNumber }, urlSearchParams)
            .subscribe(data => {
                event.approvalFlowRequired
                    ? this.notificationService.sendSuccessMsg("workflow.task.verify.send")
                    : this.notificationService.sendSuccessMsg("fixed.deposit.withdrawal.advice.updated.success");
                this.back();
            });
    }
    fetchReferenceNumber() {
        this.subscribers.fatchFixedDepositWithdrawalNumberSub = this.fixedDepositPrincipalWithdrawalAdviceService
            .fetchFixedDepositWithdrawalAdviceNumber({ fixedDepositAccountId: this.fixedDepositAccountId })
            .subscribe(data => {
                this.referenceNumber = data;
            });
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