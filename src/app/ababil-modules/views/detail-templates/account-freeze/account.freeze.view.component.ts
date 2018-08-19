import { Location } from '@angular/common';
import { NotificationService } from './../../../../common/notification/notification.service';
import { BaseComponent } from './../../../../common/components/base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OnInit } from "@angular/core";
import { Observable, of } from 'rxjs';
import { VerifierSelectionEvent } from '../../../../common/components/verifier-selection/verifier.selection.component';
import * as urlSearchParameterConstants from '../../../../common/constants/app.search.parameter.constants';
import { ApprovalflowService } from './../../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from './../../../../common/components/base.form.component';
import { ProductService } from '../../../../services/product/service-api/product.service';
import { FreezeAccount, Account } from '../../../../services/account/domain/account.model';
import { AccountService } from '../../../../services/account/service-api/account.service';
import { ViewsBaseComponent } from '../../view.base.component';
export let initialAccountFreezeFormData: FreezeAccount = new FreezeAccount();
export const DETAILS_UI: string = "views/demand-deposit-account/minimum-balance?";

@Component({
    templateUrl: './account.freeze.view.component.html',

})

export class AccountFreezeViewComponent extends ViewsBaseComponent implements OnInit {

    constructor(protected route: ActivatedRoute,
        protected router: Router,
        private accountService: AccountService,
        protected notificationService: NotificationService,
        private formBuilder: FormBuilder,
        protected location: Location,
        protected approvalflowService: ApprovalflowService) {
        super(location, router, approvalflowService, notificationService);
    }
    accountId: number;
    queryParams: any = {};
    routeBack: any;
    customerUrl: any;
    accountIsFreezable: boolean;
    freezeCommand: string;
    freezeAccountDetails: FreezeAccount = new FreezeAccount();
    account: Account = new Account();

    ngOnInit() {
        this.showVerifierSelectionModal = of(false);

        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.command = this.queryParams.command;
            this.taskId = this.queryParams.taskId;
            this.processId = this.queryParams.taskId;
            this.accountId = this.queryParams.accountId;
            this.commandReference = this.queryParams.commandReference;
            this.fetchAccount();
        });

        this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
            .subscribe(data => {
                this.freezeAccountDetails = data;
            });
    }

    fetchAccount() {
        this.subscribers.fetchAccountDetailsSub = this.accountService
            .fetchAccountDetails({ accountId: this.accountId + "" }).subscribe(
                data => {
                    this.account = data;
                    this.setAccountFreezeWiseData();
                }
            );
    }
    setAccountFreezeWiseData() {
        if ((this.account.status == 'ACTIVATED' || this.account.status == 'DORMANT') && !this.account.freeze) {
            this.accountIsFreezable = true;
            this.freezeCommand = 'IMPOSE_FREEZE';
        }
        else if (this.account.freeze) {
            this.accountIsFreezable = false;
            this.freezeCommand = 'WITHDRAW_FREEZE';
        }
        this.menuTitle();
        this.saveButtonLabel();
    }

    menuTitle(): string {
        let title: string = '';
        if (this.accountIsFreezable) {
            title = 'Freeze Account';
        }
        else if (!this.accountIsFreezable) {
            title = 'Unfreezed Account';
        }
        return title;
    }

    saveButtonLabel(): string {
        let label: string = 'Verify';
        // if (this.accountIsFreezable) {
        //     label = 'Freeze';
        // }
        // else if (!this.accountIsFreezable) {
        //     label = 'Unfreezed';
        // }
        return label;
    }

    navigateAway() {
        this.router.navigate(['/approval-flow/pendingtasks']);
    }

    // navigateAway() {
    //     this.router.navigate(["../../details"], {
    //         relativeTo: this.route,
    //         queryParams: {
    //             cus: this.customerUrl
    //         }
    //     });
    // }

    cancel() {
        this.navigateAway();
    }
}
