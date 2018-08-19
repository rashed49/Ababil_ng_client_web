import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BaseComponent } from '../../../../common/components/base.component';
import { ActivatedRoute,Router } from '@angular/router';
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
import { initialAccountMinimumBalanceFormData } from '../../../portfolio/demand-deposit/account/mimimum-balance/form/minimum.balance.form.component';
import { DemandDepositAccount } from '../../../../services/demand-deposit-account/domain/demand.deposit.account.models';
import { DemandDepositAccountService } from '../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';

@Component({
    selector: 'minimum-balance-view',
    templateUrl: './minimum.balance.view.component.html'
})

export class MinimumBalanceViewComponent extends ViewsBaseComponent implements OnInit {

    constructor(protected location:Location,
        protected notificationService: NotificationService,      
        protected approvalflowService: ApprovalflowService,
        private demandDepositAccountService: DemandDepositAccountService,
        private route: ActivatedRoute,
        protected router: Router,
        private formBuilder: FormBuilder) {
            super(location,router, approvalflowService, notificationService);
    }
    demandDepositAccount: DemandDepositAccount = new DemandDepositAccount();
    accountId: number;
    accountMinimumBalance: number ;
    accountMinimumBalanceForm: FormGroup;
    ngOnInit(){
        this.showVerifierSelectionModal=of(false);   
        this.prepareMinimumBalanceOverrideForm(null);
        this.subscribers.queryParamSub = this.route.queryParams.subscribe(
            queryParams => {
        this.command = queryParams['command'];
            this.processId = queryParams['taskId'];
            this.taskId = queryParams['taskId'];
            this.commandReference = queryParams['commandReference'];
            this.accountId = queryParams['accountId'];
                this.subscribers.fetchApprovalFlowTaskInstancePayloadSub=this.fetchApprovalFlowTaskInstancePayload()
                .subscribe(data=>{
                   this.prepareMinimumBalanceOverrideForm(data);
              
                });
    
            });
         this.fetchDemandDepositAccount();
       
}
prepareMinimumBalanceOverrideForm(formData: any){
    formData = (formData == null ?  initialAccountMinimumBalanceFormData: formData);
    this.accountMinimumBalanceForm = this.formBuilder.group({
        comment: [formData.comment],
        minimumBalance: [formData.minimumBalance]
    });

}

fetchDemandDepositAccount() {
    this.subscribers.fetchDemandDepositAccountDetailsSub = this.demandDepositAccountService
        .fetchDemandDepositAccountDetails({ id: this.accountId + "" }).subscribe(
            data => {
                this.demandDepositAccount = data;
                this.accountMinimumBalance = data.balance.minimumBalance;
           }
        );
}

cancel() {
    this.location.back();
}


}