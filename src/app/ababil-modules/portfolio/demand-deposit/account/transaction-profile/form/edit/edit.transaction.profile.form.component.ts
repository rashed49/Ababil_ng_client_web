import { BaseComponent } from './../../../../../../../common/components/base.component';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TransactionProfileService } from '../../../../../../../services/transaction-profile/service-api/transaction-profile.service';
import { DemandDepositAccountTransactionProfile } from '../../../../../../../services/transaction-profile/domain/transaction-profile.models';
import { NotificationService } from '../../../../../../../common/notification/notification.service';
import { map }from 'rxjs/operators';

@Component({
    templateUrl: './edit.transaction.profile.form.component.html'
})
export class EditTransactionProfileFormComponent extends BaseComponent implements OnInit {

    params: any;
    queryParams: any;
    accountTransactionProfile: DemandDepositAccountTransactionProfile[] = [];

    @ViewChild('transactionProfile') transactionProfile: any;

    constructor(private location: Location,
        private notificationService: NotificationService,
        private route: ActivatedRoute,
        private transactionProfileService: TransactionProfileService) {
        super();
    }

    ngOnInit(): void {
        this.subscribers.routeSub = this.route.params
            .subscribe(params => {
                this.params = params;
                this.fetchAccountTransactionProfile();
            });
    }

    onSave(event: any) {
        this.subscribers.updateSub = this.transactionProfileService
            .updateAccountTransactionProfiles(this.transactionProfile.accountTransactionProfile, { accountId: this.params.id })
            .subscribe(data => {
                this.notificationService.sendSuccessMsg('account.transaction.profile.update.success');
                this.navigateAway();
            });
    }

    onCancel(): void {
        this.navigateAway();
    }

    navigateAway() {
        this.location.back();
    }

    private fetchAccountTransactionProfile() {
        this.subscribers.accountTransactionProfileSub = this.transactionProfileService
            .fetchAccountTransactionProfiles({ accountId: this.params.id })
            .pipe(map(data => this.accountTransactionProfile = data))
            .subscribe();
    }
}