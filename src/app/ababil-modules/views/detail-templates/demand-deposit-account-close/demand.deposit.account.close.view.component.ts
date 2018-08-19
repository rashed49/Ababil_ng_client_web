import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
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
import { DemandDepositAccount, DemandDepositAccountCloseRequest } from '../../../../services/demand-deposit-account/domain/demand.deposit.account.models';
import { CreditAccountType } from '../../../../common/domain/credit.account.type.enum.model';
import { SelectItem } from 'primeng/api';
import { AmountInWordsService } from '../../../../common/services/amount.in.words.service';
import { ChargeTableComponent } from '../../../../common/components/charge-component/charge.component';
import { GlAccountService } from '../../../../services/glaccount/service-api/gl.account.service';


@Component({
    selector: 'demand-deposit-account-close-view',
    templateUrl: './demand.deposit.account.close.view.component.html'
})



export class DemandDepositAccountClosingViewComponent extends ViewsBaseComponent implements OnInit {
    demandDepositDisplay: boolean = false;
    demandDepositSignatureDisplay: boolean = false;
    demandDepositAccount: DemandDepositAccount = new DemandDepositAccount();
    selectedAccountForTransaction:DemandDepositAccount = new DemandDepositAccount();
    demandDepositAccountCloseRequest: DemandDepositAccountCloseRequest = new DemandDepositAccountCloseRequest();
    queryParams: any;
    accountId: number;
    accountClosingForm: FormGroup;
    charges: any;
    creditAccountTypes: SelectItem[] = CreditAccountType;
    accountTitleDisable:boolean = true;
    customerId: number;
    amountInWords: string;
    @ViewChild('chargeTable') chargeTable: any;
    constructor(protected location: Location,
        protected notificationService: NotificationService,
        protected approvalflowService: ApprovalflowService,
        private demandDepositAccountService: DemandDepositAccountService,
        private route: ActivatedRoute,
        protected router: Router,
        private formBuilder: FormBuilder,
    private amountInWordsService: AmountInWordsService,
private glAccountService: GlAccountService) {
        super(location, router, approvalflowService, notificationService);
    }
    ngOnInit() {
        this.showVerifierSelectionModal = of(false);
        this.prepareAccountClosingForm(null);
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
        this.fetchDemandDepositAccount(this.accountId);
    }
    fetchDemandDepositAccount(accountId) {
        this.subscribers.fetchDemandDepositAccountDetailsSub = this.demandDepositAccountService
            .fetchDemandDepositAccountDetails({ id: accountId + "" }).subscribe(
                data => {
                    if(accountId === this.accountId){
                        this.demandDepositAccount = data; 
                        this.chargeTable.currencyCode = data.currencyCode;
                        this.accountBalance = data.balance.currentBalance;
                    }else{
                        this.selectedAccountForTransaction = data;
                        this.transactionAccountNumber = data.number;
                        this.transactionAccountTitle = data.name;
                    }
                }
            );
    }

    prepareAccountClosingForm(formData: DemandDepositAccountCloseRequest) {
        formData = (formData == null ? new DemandDepositAccountCloseRequest() : formData);
        this.charges= formData.charges;
        this.accountClosingForm = this.formBuilder.group({
            accountId: formData.accountId,
            netPayable: formData.netPayable,
            profit: formData.profit,
            profitTaxAmount: formData.profitTaxAmount,
            destinationAccountId: formData.destinationAccountId,
            destinationAccountType: formData.destinationAccountType
        });

        if(formData.netPayable !== null) {
            let amount = formData.netPayable;
            this.amountInWords = this.amountInWordsService.convertAmountToWords(amount, this.demandDepositAccount.currencyCode || null);

        }
        if (formData.destinationAccountId != null) {
            if (formData.destinationAccountType === "CASA") {
                this.fetchDemandDepositAccount(formData.destinationAccountId);
            }
            if (formData.destinationAccountType === "GL") {
                this.fetchGlAccountDetail(formData.destinationAccountId);
            }
            if (formData.destinationAccountType === "SUBGL") {
                this.fetchSubGlAccountDetail(formData.destinationAccountId);
            }
        }        if(formData.destinationAccountType === "PO"){
            this.accountTitleDisable = true;
        }else{
            this.accountTitleDisable =false;
        }
    }
    transactionAccountNumber: string;
    accountBalance: number;
    transactionAccountTitle: string;
    fetchGlAccountDetail(glAccountId) {
        this.subscribers.fetchDetail = this.glAccountService.fetchGlAccountDetails({ id: glAccountId }).subscribe(
            data => {
                this.selectedAccountForTransaction = data;
                this.transactionAccountNumber = data.code;
                this.transactionAccountTitle = data.name;
            }
        )
    }
    fetchSubGlAccountDetail(subGlAccountId) {
        this.subscribers.fetchDetail = this.glAccountService.fetchSubGlDetails({ subsidiaryLedgerId: subGlAccountId }).subscribe(
            data => {
                this.selectedAccountForTransaction = data;
                this.transactionAccountNumber = data.code;
                this.transactionAccountTitle = data.name;
            }
        )
    }
    cancel() {
        this.navigateAway();
      }
    
      navigateAway() {

          this.router.navigate(['../../', 'approval-flow', 'pendingtasks']);
        }

        showAccountDetail() {
            this.demandDepositDisplay = true;
        }
    
    
        showSignature() {
            this.demandDepositSignatureDisplay = true;
        }
    
  
}