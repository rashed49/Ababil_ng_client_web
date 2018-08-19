import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BaseComponent } from '../../../../common/components/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApprovalflowService } from './../../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from './../../../../common/components/base.form.component';
import { Subscriber, Observable, of } from 'rxjs';
import * as commandConstants from '../../../../common/constants/app.command.constants';
import { VerifierSelectionEvent } from '../../../../common/components/verifier-selection/verifier.selection.component';
import value from '*.json';
import { Notice } from './../../../../services/bank-notice/domain/notice.models';
import { NotificationService } from '../../../../common/notification/notification.service';
import { ViewsBaseComponent } from './../../view.base.component';
import { DemandDepositAccountService } from '../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { DemandDepositAccount, DemandDepositAccountCloseRequest, ReactivateDemandDepositAccountCommandDetails } from '../../../../services/demand-deposit-account/domain/demand.deposit.account.models';
import { CreditAccountType } from '../../../../common/domain/credit.account.type.enum.model';
import { SelectItem } from 'primeng/api';


@Component({
    selector: 'dormant-account-reactivation-view',
    templateUrl: './dormant.account.reactivation.view.component.html'
})

export class DormantAccountReactivationViewComponent extends ViewsBaseComponent implements OnInit {
    demandDepositDisplay: boolean = false;
    demandDepositSignatureDisplay: boolean = false;
    demandDepositAccount: DemandDepositAccount = new DemandDepositAccount();
    queryParams: any;
    accountId: number;
    accountClosingForm: FormGroup;
    charges: any;
    accountTitleDisable: boolean = true;
    customerId: number;
    reactivationViewForm: FormGroup;
    reactivationDetail: ReactivateDemandDepositAccountCommandDetails = new ReactivateDemandDepositAccountCommandDetails();
    constructor(protected location: Location,
        protected notificationService: NotificationService,
        protected approvalflowService: ApprovalflowService,
        private demandDepositAccountService: DemandDepositAccountService,
        private route: ActivatedRoute,
        protected router: Router,
        private formBuilder: FormBuilder) {
        super(location, router, approvalflowService, notificationService);
    }
    ngOnInit() {
        this.showVerifierSelectionModal = of(false);
        this.prepareForm(null);
        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.command = this.queryParams.command;
            this.processId = this.queryParams.taskId;
            this.taskId = this.queryParams.taskId;
            this.accountId = this.queryParams.accountId;
            this.customerId = this.queryParams.customerId;
            this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                .subscribe(data => {
                    this.reactivationDetail = data;
                    this.prepareForm(data);
                });
        });
        this.fetchDemandDepositAccount(this.accountId);
    }
    fetchDemandDepositAccount(accountId) {
        this.subscribers.fetchDemandDepositAccountDetailsSub = this.demandDepositAccountService
            .fetchDemandDepositAccountDetails({ id: accountId + "" }).subscribe(
                data => {
                    this.demandDepositAccount = data;
                });
    }

    prepareForm(formData: ReactivateDemandDepositAccountCommandDetails) {
        formData = (formData == null ? new ReactivateDemandDepositAccountCommandDetails() : formData);
        this.charges = formData.charges;
        console.log(formData.charges);
        this.reactivationViewForm = this.formBuilder.group({
            comment: formData.comment
        });
    }
    cancel() {
        this.navigateAway();
    }

    navigateAway() {

        this.router.navigate(['../../', 'approval-flow', 'pendingtasks']);
    }
}