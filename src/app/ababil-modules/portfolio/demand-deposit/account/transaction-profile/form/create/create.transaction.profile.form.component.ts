import { BaseComponent } from './../../../../../../../common/components/base.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TransactionProfileService } from '../../../../../../../services/transaction-profile/service-api/transaction-profile.service';
import { DemandDepositAccountTransactionProfile } from '../../../../../../../services/transaction-profile/domain/transaction-profile.models';
import { NotificationService } from './../../../../../../../common/notification/notification.service';
import { TransactionProfileType } from '../../../../../../../services/transaction-profile/domain/transaction-profile-type.model';
import { map }from 'rxjs/operators';

@Component({
    templateUrl: './create.transaction.profile.form.component.html'
})
export class CreateTransactionProfileFormComponent extends BaseComponent implements OnInit {

    queryParams: any;
    demandDepositAccountId: number;
    accountTransactionProfile: DemandDepositAccountTransactionProfile[] = [];
    transactionProfileType: TransactionProfileType[] = [];

    @ViewChild('transactionProfile') transactionProfile: any;

    constructor(private location: Location,
        private notificationService: NotificationService,
        private route: ActivatedRoute,
        private transactionProfileService: TransactionProfileService) {
        super();
    }

    ngOnInit(): void {
        this.subscribers.routeSub = this.route.queryParams
            .subscribe(queryParams => {
                this.queryParams = queryParams;
                this.fetchAccountTransactionProfile();
            });
    }

    onSave(event: any) {
        this.createAccountTransactionProfile();
    }

    onCancel(): void {
        this.navigateAway();
    }

    navigateAway() {
        this.location.back();
    }

    private fetchAccountTransactionProfile() {
        this.subscribers.accountTransactionProfileSub = this.transactionProfileService
            .fetchAccountTransactionProfiles({ accountId: this.queryParams.accountId })
            .pipe(map(data => this.accountTransactionProfile = data))
            .subscribe();
    }

    private createAccountTransactionProfile() {
        this.subscribers.createSub = this.transactionProfileService
            .createAccountTransactionProfile(this.transactionProfile.accountTransactionProfile, { accountId: this.queryParams.accountId })
            .subscribe(data => {
                this.notificationService.sendSuccessMsg('account.transaction.profile.create.success');
                this.navigateAway();
            });
    }
}