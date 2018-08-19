import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from './../../../../../../common/components/base.component';
import { Location } from '@angular/common';
import { TransactionProfileService } from '../../../../../../services/transaction-profile/service-api/transaction-profile.service';
import { DemandDepositAccountTransactionProfile } from '../../../../../../services/transaction-profile/domain/transaction-profile.models';
import { AccountService } from '../../../../../../services/account/service-api/account.service';
import { Account } from '../../../../../../services/account/domain/account.model';
import { map }from 'rxjs/operators';
@Component({
    selector: 'transaction-profile-detail',
    templateUrl: './transaction.profile.detail.component.html'
})
export class TransactionProfileDetailComponent extends BaseComponent implements OnInit {

    params: any;
    queryParams: any;
    accountTransactionProfile: DemandDepositAccountTransactionProfile[] = [];
    account: Account = new Account();
    showCreateButton: boolean = true;
    displayButton:boolean=false;

    totalMaxCreditAmountPerTransaction: number = 0;
    totalMaxDebitAmountPerTransaction: number = 0;
    totalMonthlyTotalCreditTxnAmount: number = 0;
    totalMonthlyTotalCreditTxnCount: number = 0;
    totalMonthlyTotalDebitTxnAmount: number = 0;
    totalMonthlyTotalDebitTxnCount: number = 0;

    constructor(private route: ActivatedRoute,
        private accountService: AccountService,
        private router: Router,
        private location: Location,
        private transactionProfileService: TransactionProfileService) {
        super();
    }

    ngOnInit(): void {
        this.subscribers.routeSub = this.route.params
            .subscribe(params => {
                this.params = params;
                this.fetchAccountTransactionProfile();
            });

        this.subscribers.routeSub = this.route.queryParams
            .subscribe(queryParams => {
                this.queryParams = queryParams;
                this.fetchAccountDetails();
            });
    }

    create() {
        this.router.navigate(['transaction-profile', 'create'], {
            queryParams: {
                cus: this.queryParams.cus,
                demandDeposit: this.queryParams.demandDeposit,
                accountId: this.params.id
            }
        });
    }

    edit() {
        this.router.navigate(['transaction-profile', this.params.id, 'edit'], {
            queryParams: {
                cus: this.queryParams.cus,
                demandDeposit: this.queryParams.demandDeposit,
                accountId: this.params.id
            }
        });
    }

    cancel() {
        this.navigateAway();
    }

    navigateAway() {
        if (this.queryParams.demandDeposit !== undefined) {
            this.router.navigate([this.queryParams.demandDeposit], {
                queryParams: { cus: this.queryParams.cus }
            });
        }
    }

    private fetchAccountTransactionProfile() {
        this.subscribers.accountTransactionProfileSub = this.transactionProfileService
            .fetchAccountTransactionProfiles({ accountId: this.params.id })
            .pipe(map(data => {
                this.accountTransactionProfile = data;
                this.showHideCreateAndEditButton();
                this.calculateRowTotal();
            })).subscribe();
    }

    private fetchAccountDetails() {
        this.subscribers.fetchAccountDetailsSub = this.accountService
            .fetchAccountDetails({ accountId: this.queryParams.accountId + "" })
            .pipe(map(account => this.account = account))
            .subscribe();
    }

    private showHideCreateAndEditButton() {
        for (let i = 0; i < this.accountTransactionProfile.length; i++) {
            // if (this.accountTransactionProfile[i].transactionLimitMandatory && this.accountTransactionProfile[i].id) {
            //     this.showCreateButton = false;
            // }
            if( this.accountTransactionProfile[i].id) {
                this.showCreateButton = false;
            }else{
                this.showCreateButton = true;
            }
        }
        this.displayButton=true;
    }

    private calculateRowTotal() {
        for (let i = 0; i < this.accountTransactionProfile.length; i++) {
            this.totalMaxCreditAmountPerTransaction += this.accountTransactionProfile[i].maxCreditAmountPerTransaction;
            this.totalMaxDebitAmountPerTransaction += this.accountTransactionProfile[i].maxDebitAmountPerTransaction;
            this.totalMonthlyTotalCreditTxnAmount += this.accountTransactionProfile[i].monthlyTotalCreditTxnAmount;
            this.totalMonthlyTotalCreditTxnCount += this.accountTransactionProfile[i].monthlyTotalCreditTxnCount;
            this.totalMonthlyTotalDebitTxnAmount += this.accountTransactionProfile[i].monthlyTotalDebitTxnAmount;
            this.totalMonthlyTotalDebitTxnCount += this.accountTransactionProfile[i].monthlyTotalDebitTxnCount;
        }
    }
}