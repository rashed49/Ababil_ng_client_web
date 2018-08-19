import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BaseComponent } from '../../../../../common/components/base.component';
import { DemandDepositAccountTransactionProfile } from '../../../../../services/transaction-profile/domain/transaction-profile.models';
import { DemandDepositAccount } from '../../../../../services/demand-deposit-account/domain/demand.deposit.account.models';
import { DemandDepositAccountService } from '../../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { TransactionProfileService } from '../../../../../services/transaction-profile/service-api/transaction-profile.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'transaction-profile-view',
    templateUrl: './transaction.profile.view.component.html'
})
export class TransactionProfileViewComponent extends BaseComponent implements OnInit {

    params: any;
    queryParams: any;
    accountTransactionProfile: DemandDepositAccountTransactionProfile[] = [];
    demandDepositAccount: DemandDepositAccount = new DemandDepositAccount();

    constructor(private route: ActivatedRoute,
        private demandDepositAccountService: DemandDepositAccountService,
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
                this.fetchDemandDepositAccountDetails();
            });
    }

    cancel() {
        this.location.back();
    }

    private fetchAccountTransactionProfile() {
        this.subscribers.accountTransactionProfileSub = this.transactionProfileService
            .fetchAccountTransactionProfiles({ accountId: this.params.id })
            .pipe(map(data => this.accountTransactionProfile = data))
            .subscribe();
    }

    private fetchDemandDepositAccountDetails() {
        this.subscribers.fetchAccountDetailsSub = this.demandDepositAccountService
            .fetchDemandDepositAccountDetails({ id: this.queryParams.accountId })
            .pipe(map(account => this.demandDepositAccount = account))
            .subscribe();
    }
}