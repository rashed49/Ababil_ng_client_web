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
import { DemandDepositAccountCloseRequest} from '../../../../services/demand-deposit-account/domain/demand.deposit.account.models';
import { CreditAccountType } from '../../../../common/domain/credit.account.type.enum.model';
import { SelectItem } from 'primeng/api';
import { RecurringDepositAccount } from '../../../../services/recurring-deposit-account/domain/recurring.deposit.account.model';
import { RecurringDepositAccountService } from '../../../../services/recurring-deposit-account/service-api/recurring.deposit.account.service';


@Component({
    selector: 'recurring-deposit-account-close-view',
    templateUrl: './recurring.deposit.account.close.view.component.html'
})

export class RecurringDepositAccountClosingViewComponent extends ViewsBaseComponent implements OnInit {
    recurringDepositDisplay: boolean = false;
    recurringDepositSignatureDisplay: boolean = false;
    recurringDepositAccount: RecurringDepositAccount = new RecurringDepositAccount();
    selectedAccountForTransaction: RecurringDepositAccount = new RecurringDepositAccount();
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
        private recurringDepositAccountService: RecurringDepositAccountService,
        private route: ActivatedRoute,
        protected router: Router,
        private formBuilder: FormBuilder) {
        super(location, router, approvalflowService, notificationService);
    }
    ngOnInit() {
        this.showVerifierSelectionModal = of(false);
        this.fetchRecurringDepositAccount(null);
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
        this.fetchRecurringDepositAccount(this.accountId);
    }
    fetchRecurringDepositAccount(accountId) {
        this.subscribers.fetchDemandDepositAccountDetailsSub = this.recurringDepositAccountService
            .fetchRecurringDepositAccountDetails({ id: accountId + "" }).subscribe(
                data => {
                    if (accountId === this.accountId) {
                        this.recurringDepositAccount = data;
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
        if (formData.destinationAccountId != null) this.fetchRecurringDepositAccount(formData.destinationAccountId);
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
        this.recurringDepositDisplay = true;
    }


    showSignature() {
        this.recurringDepositSignatureDisplay = true;
    }


}