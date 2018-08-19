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
import { DemandDepositAccountCloseRequest } from '../../../../services/demand-deposit-account/domain/demand.deposit.account.models';
import { CreditAccountType } from '../../../../common/domain/credit.account.type.enum.model';
import { SelectItem } from 'primeng/api';
import { FixedDepositAccount } from '../../../../services/fixed-deposit-account/domain/fixed.deposit.account.models';
import { FixedDepositAccountService } from '../../../../services/fixed-deposit-account/service-api/fixed.deposit.account.service';


@Component({
    selector: 'fixed-deposit-account-close-view',
    templateUrl: './fixed.deposit.account.close.view.component.html'
})

export class FixedDepositAccountClosingViewComponent extends ViewsBaseComponent implements OnInit {
    fixedDepositDisplay: boolean = false;
    fixedDepositSignatureDisplay: boolean = false;
    fixedDepositAccount: FixedDepositAccount = new FixedDepositAccount();
    selectedAccountForTransaction: FixedDepositAccount = new FixedDepositAccount();
    demandDepositAccountCloseRequest: DemandDepositAccountCloseRequest = new DemandDepositAccountCloseRequest();
    queryParams: any;
    accountId: number;
    accountClosingForm: FormGroup;
    charges: any;
    creditAccountTypes: SelectItem[] = CreditAccountType;
    accountTitleDisable: boolean = true;
    customerId: number;
    constructor(protected location: Location,
        protected notificationService: NotificationService,
        protected approvalflowService: ApprovalflowService,
        private fixedDepositAccountService: FixedDepositAccountService,
        private route: ActivatedRoute,
        protected router: Router,
        private formBuilder: FormBuilder) {
        super(location, router, approvalflowService, notificationService);
    }
    ngOnInit() {
        this.showVerifierSelectionModal = of(false);
        this.fetchFixedDepositAccount(null);
        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.command = this.queryParams.command;
            this.processId = this.queryParams.taskId;
            this.taskId = this.queryParams.taskId;
            this.accountId = this.queryParams.accountId;
            this.customerId = this.queryParams.customerId;
            this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                .subscribe(data => {
                    this.demandDepositAccountCloseRequest = data;
                    this.prepareAccountClosingForm(data);
                });
        });
        this.fetchFixedDepositAccount(this.accountId);
    }
    fetchFixedDepositAccount(accountId) {
        this.subscribers.fetchDemandDepositAccountDetailsSub = this.fixedDepositAccountService
            .fetchFixedDepositAccountDetails({ id: accountId + "" }).subscribe(
                data => {
                    if (accountId === this.accountId) {
                        this.fixedDepositAccount = data;
                    } else {
                        this.selectedAccountForTransaction = data;
                    }
                }
            );
    }

    prepareAccountClosingForm(formData: DemandDepositAccountCloseRequest) {
        formData = (formData == null ? new DemandDepositAccountCloseRequest : formData);
        this.charges = formData.charges;
        this.accountClosingForm = this.formBuilder.group({
            accountId: formData.accountId,
            netPayable: formData.netPayable,
            profit: formData.profit,
            profitTaxAmount: formData.profitTaxAmount,
            destinationAccountId: formData.destinationAccountId,
            destinationAccountType: formData.destinationAccountType
        });
        if (formData.destinationAccountId != null) this.fetchFixedDepositAccount(formData.destinationAccountId);
        if (formData.destinationAccountType === "PO") {
            this.accountTitleDisable = true;
        } else {
            this.accountTitleDisable = false;
        }
    }


    cancel() {
        this.navigateAway();
    }

    navigateAway() {

        this.router.navigate(['../../', 'approval-flow', 'pendingtasks']);
    }

    showAccountDetail() {
        this.fixedDepositDisplay = true;
    }


    showSignature() {
        this.fixedDepositSignatureDisplay = true;
    }


}