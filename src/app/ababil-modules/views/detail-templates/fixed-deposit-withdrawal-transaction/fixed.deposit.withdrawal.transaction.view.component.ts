import { Component, OnInit } from "@angular/core";
import { ViewsBaseComponent } from "../../view.base.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { Observable, of } from "rxjs";
import { ApprovalflowService } from "../../../../services/approvalflow/service-api/approval.flow.service";
import { NotificationService } from "../../../../common/notification/notification.service";
import { FixedDepositAccountService } from "../../../../services/fixed-deposit-account/service-api/fixed.deposit.account.service";
import { FixedDepositProductService } from "../../../../services/fixed-deposit-product/service-api/fixed.deposit.product.service";
import { DemandDepositAccountService } from "../../../../services/demand-deposit-account/service-api/demand.deposit.account.service";
import { FixedDepositAccount } from "../../../../services/fixed-deposit-account/domain/fixed.deposit.account.models";
import { FixedDepositProduct } from "../../../../services/fixed-deposit-product/domain/fixed.deposit.product.model";
import { DemandDepositAccount } from "../../../../services/demand-deposit-account/domain/demand.deposit.account.models";
import { FixedDepositTransaction } from "../../../../services/fixed-deposit-principal-withdrawal-transaction/domain/fixed.deposit.principal.withdrawal.transaction.model";
import { WithdrawalAdvice } from "../../../../services/fixed-deposit-principal-withdrawal-advice/domain/fixed.deposit.principal.withdrawal.advice.model";
import { FixedDepositPrincipalWithdrawalAdviceService } from "../../../../services/fixed-deposit-principal-withdrawal-advice/service-api/fixed.deposit.principal.withdrawal.advice.service";
import { AmountInWordsService } from "../../../../common/services/amount.in.words.service";


@Component({
    selector: 'withdrawal-transaction-view',
    templateUrl: './fixed.deposit.withdrawal.transaction.view.component.html'
})
export class FixedDepositWithdrawalTransactionViewComponent extends ViewsBaseComponent implements OnInit {

    queryParams: any = {};
    fixedDepositAccount: FixedDepositAccount = new FixedDepositAccount();
    fixedDepositProductDetails: FixedDepositProduct = new FixedDepositProduct();
    DemandDepositAccount: DemandDepositAccount = new DemandDepositAccount();
    fixedDepositTransaction: FixedDepositTransaction = new FixedDepositTransaction();
    withdrawalAdvice: WithdrawalAdvice = new WithdrawalAdvice();

    fixedDepositAccountId: number;
    customerId: number;
    withdrawalAmount: number;
    withdrawalPercentage: number;
    depositAccountId: number;
    productId: number;
    lienAmount: number;
    quardAmount: number;
    lienAmonut: number;
    availableBalance: number;

    status: string;
    referenceNumber: string;
    amountInWords:string;
    currencyCode:string;

    constructor(private route: ActivatedRoute,
        protected workflowService: ApprovalflowService,
        protected router: Router,
        protected notificationService: NotificationService,
        protected location: Location,
        private fixedDepositAccountService: FixedDepositAccountService,
        private fixedDepositProductService: FixedDepositProductService,
        private depositAccountService: DemandDepositAccountService,
        private amountInWordService: AmountInWordsService,
        private fixedDepositPrincipalWithdrawalAdviceService: FixedDepositPrincipalWithdrawalAdviceService) {
        super(location, router, workflowService, notificationService);
    }
    ngOnInit(): void {
        this.subscribers.queryParamSub = this.route.queryParams.subscribe(
            queryParams => {
                this.queryParams = queryParams;
                this.fixedDepositAccountId = queryParams['fixedDepositAccountId'];
                this.productId = queryParams['productId'];
                this.referenceNumber = queryParams['referenceNumber']
            });

     

        this.showVerifierSelectionModal = of(false);
        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.command = this.queryParams.command;
            this.taskId = this.queryParams.taskId;
            this.processId = this.queryParams.taskId;
            this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                .subscribe(data => {
                    this.fixedDepositTransaction = data;
                    this.depositAccountId = this.fixedDepositTransaction.casaAccountId;
                    this.amountInWords = this.amountInWordService.convertAmountToWords(this.fixedDepositTransaction.transactionAmount, this.currencyCode || null);
                });
        });
        this.fetchFixedDepositAccountDetails();
        this.fetchFixedDepositWithdrawalAdvice();
    }

    fetchFixedDepositAccountDetails() {
        this.subscribers.fetchFixedDepositAccountDetailsSub = this.fixedDepositAccountService
            .fetchFixedDepositAccountDetails({ fixedDepositAccountId: this.fixedDepositAccountId })
            .subscribe(data => {
                this.fixedDepositAccount = data;
                this.currencyCode=this.fixedDepositAccount.currencyCode;
                this.status = this.fixedDepositAccount.status;
                this.customerId = this.fixedDepositAccount.customerId;
                this.lienAmount = ((this.fixedDepositAccount.fixedDepositAccountBalance.lienAmount) ? (this.fixedDepositAccount.fixedDepositAccountBalance.lienAmount) : 0);
                this.quardAmount = ((this.fixedDepositAccount.fixedDepositAccountBalance.quardAmount) ? (this.fixedDepositAccount.fixedDepositAccountBalance.quardAmount) : 0);
                this.subscribers.fetchSub = this.fixedDepositProductService.fetchFixedDepositProductDetails({ id: this.productId + '' })
                    .subscribe(data => {
                        this.fixedDepositProductDetails = data;
                        this.withdrawalPercentage = this.fixedDepositProductDetails.withdrawalPercentage;
                        this.withdrawalAmount = (((this.fixedDepositAccount.fixedDepositAccountBalance.balance * ((this.withdrawalPercentage) ? (this.withdrawalPercentage) : 0) / 100) - ((this.fixedDepositAccount.fixedDepositAccountBalance.lienAmount + this.fixedDepositAccount.fixedDepositAccountBalance.quardAmount) ? (this.fixedDepositAccount.fixedDepositAccountBalance.lienAmount + this.fixedDepositAccount.fixedDepositAccountBalance.quardAmount) : 0)));
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

}