import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';
import { FormBaseComponent } from "../../../../../../../common/components/base.form.component";
import { Router, ActivatedRoute } from "@angular/router";
import { ApprovalflowService } from "../../../../../../../services/approvalflow/service-api/approval.flow.service";
import { NotificationService } from "../../../../../../../common/notification/notification.service";
import { FixedDepositAccountService } from "../../../../../../../services/fixed-deposit-account/service-api/fixed.deposit.account.service";
import { DemandDepositAccountService } from "../../../../../../../services/demand-deposit-account/service-api/demand.deposit.account.service";
import { FixedDepositProductService } from "../../../../../../../services/fixed-deposit-product/service-api/fixed.deposit.product.service";
import { FixedDepositPrincipalWithdrawalAdviceService } from "../../../../../../../services/fixed-deposit-principal-withdrawal-advice/service-api/fixed.deposit.principal.withdrawal.advice.service";
import { DemandDepositAccount } from "../../../../../../../services/demand-deposit-account/domain/demand.deposit.account.models";
import { FixedDepositAccount } from "../../../../../../../services/fixed-deposit-account/domain/fixed.deposit.account.models";
import { FixedDepositProduct } from "../../../../../../../services/fixed-deposit-product/domain/fixed.deposit.product.model";
import { WithdrawalAdvice } from "../../../../../../../services/fixed-deposit-principal-withdrawal-advice/domain/fixed.deposit.principal.withdrawal.advice.model";
import { map } from 'rxjs/operators';
@Component({
    selector: 'detail-withdrawal-mapping',
    templateUrl: './detail.fixed.deposit.account.withdrawal.mapping.component.html'
})
export class DetailFixedDepositAccountWithdrawalMappingComponent extends FormBaseComponent implements OnInit {

    depositAccounts: any[] = [];
    demanDepositAccounts: DemandDepositAccount[] = [];
    fixedDepositAccount: FixedDepositAccount = new FixedDepositAccount();
    fixedDepositProductDetails: FixedDepositProduct = new FixedDepositProduct();
    DemandDepositAccount: DemandDepositAccount = new DemandDepositAccount();
    withdrawalAdvice: WithdrawalAdvice = new WithdrawalAdvice();

    queryParams: any;
    demandDepositAccountTypeMap: Map<number, any> = new Map();

    depositAccountId: number;
    customerId: number;
    productId: number;
    withdrawalAmount: number;
    withdrawalPercentage: number;
    fixedDepositAccountId: number;
    lienAmount: number;
    quardAmount: number;

    status: string;
    demandDepositAccountType: string = "";
    referenceNumber: string;

    constructor(private router: Router,
        protected approvalFlowService: ApprovalflowService,
        private route: ActivatedRoute,
        protected location: Location,
        private notificationService: NotificationService,
        private fixedDepositAccountService: FixedDepositAccountService,
        private depositAccountService: DemandDepositAccountService,
        private fixedDepositProductService: FixedDepositProductService,
        private fixedDepositPrincipalWithdrawalAdviceService: FixedDepositPrincipalWithdrawalAdviceService) {
        super(location, approvalFlowService);
    }

    ngOnInit(): void {

        this.subscribers.queryParamSub = this.route.queryParams.subscribe(
            queryParams => {
                this.queryParams = queryParams;
                this.fixedDepositAccountId = queryParams['accountId'];
                this.productId = queryParams['productId'];
                this.referenceNumber = queryParams['referenceNumber'];

            });
        this.fetchFixedDepositAccountDetails();
        this.fetchFixedDepositWithdrawalAdvice();
    }

    fetchFixedDepositAccountDetails() {
        this.subscribers.fetchFixedDepositAccountDetailsSub = this.fixedDepositAccountService
            .fetchFixedDepositAccountDetails({ fixedDepositAccountId: this.fixedDepositAccountId + "" })
            .subscribe(data => {
                this.fixedDepositAccount = data;
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

                let searchParam = new Map<string, string>();
                searchParam.set('customerId', this.customerId + '');
                this.subscribers.fetchDemandDepositAccountSub = this.depositAccountService.fetchDemandDepositAccounts(searchParam)
                    .pipe(map(m => m.content.filter(f => f.status == "ACTIVATED")))
                    .subscribe(data => {
                        this.depositAccounts = [{ label: 'Choose  Account:', value: null }].concat(data.map(element => {
                            return { label: element.number, value: element.id }
                        }));
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
            });
    }

    editWithdrawalAdivce() {
        this.router.navigate(['../', 'withdrawal-mapping-edit'], {
            relativeTo: this.route,
            queryParams: {
                account: this.currentPath(this.location),
                accountId: this.fixedDepositAccountId,
                productId: this.productId,
                referenceNumber: this.referenceNumber
            },
            queryParamsHandling: 'merge'
        });
    }

    navigateAway() {
        this.router.navigate(['../'], {
            relativeTo: this.route,
            queryParams: {
                cus: this.queryParams['cus'],
                accountId: this.queryParams['accountId'],
                productId: this.queryParams['productId']
            }
        });

    }

    back() {
        this.navigateAway();
    }


    goToWithdrawalTransaction() {
        // const url = this.router.createUrlTree(['withdrawal-transaction'], {
        //   relativeTo: this.route,
        //   queryParams: {
        //  account: this.currentPath(this.location),
        //     accountId: this.fixedDepositAccountId,
        //     productId: this.productId
        //   },
        //   queryParamsHandling: "merge"
        // });
        // this.router.navigateByUrl(url);

        this.router.navigate(['../', 'withdrawal-transaction'], {
            relativeTo: this.route,
            queryParams: {
                account: this.currentPath(this.location),
                accountId: this.fixedDepositAccountId,
                productId: this.productId,
                referenceNumber: this.referenceNumber
            },
            queryParamsHandling: 'merge'
        });
    }

}