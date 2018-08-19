import { Location } from '@angular/common';
import { NotificationService } from './../../../../../../common/notification/notification.service';
import { BankNoticeService } from './../../../../../../services/bank-notice/service-api/bank.notice.service';
import { Notice } from './../../../../../../services/bank-notice/domain/notice.models';
import { BaseComponent } from './../../../../../../common/components/base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OnInit } from "@angular/core";
import { Observable, of } from 'rxjs';
import { VerifierSelectionEvent } from '../../../../../../common/components/verifier-selection/verifier.selection.component';
import * as urlSearchParameterConstants from '../../../../../../common/constants/app.search.parameter.constants';
import { ApprovalflowService } from './../../../../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from './../../../../../../common/components/base.form.component';
import { ProductService } from '../../../../../../services/product/service-api/product.service';
import { DemandDepositProductService } from '../../../../../../services/demand-deposit-product/service-api/demand-deposit-product.service';
import { DemandDepositProduct } from '../../../../../../services/demand-deposit-product/domain/demand-deposit-product.model';
import { DemandDepositAccountService } from '../../../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { DemandDepositAccount, DemandDepositAccountMinimumBalance, DemandDepositAccountMinimumBalanceLog } from '../../../../../../services/demand-deposit-account/domain/demand.deposit.account.models';
export let initialAccountMinimumBalanceFormData :DemandDepositAccountMinimumBalance = new DemandDepositAccountMinimumBalance();
export const DETAILS_UI: string = "views/demand-deposit-account/minimum-balance?";

@Component({
    selector: 'minimum-balance-form',
    templateUrl: 'minimum.balance.form.component.html'
})

export class AccountMinimumBalanceFormComponent extends FormBaseComponent implements OnInit {

    constructor(private route: ActivatedRoute,
        private router: Router,
        private demandDepositAccountService: DemandDepositAccountService,
        private notificationService: NotificationService,
        private formBuilder: FormBuilder,
        protected location: Location,
        protected approvalflowService: ApprovalflowService, ) {
        super(location, approvalflowService);
    }
    command: string = "UpdateDemandDepositAccountMinimumBalanceCommand";
    accountId: number;
    queryParams: any;
    routeBack: any;
    customerUrl: any;
    isMinimumBalanceOverridable: boolean = true;
    demandDepositAccount: DemandDepositAccount = new DemandDepositAccount();
    accountMinimumBalanceForm: FormGroup;
    previousAccountMinimumBalance: number;
    accountMinimumBalanceId: number;
    accountMinimumBalanceLog: DemandDepositAccountMinimumBalanceLog = new DemandDepositAccountMinimumBalanceLog();
    ngOnInit() {
        this.showVerifierSelectionModal = of(false);

        this.prepareMinimumBalanceForm(null);
        this.subscribers.routeParamSub = this.route.params.subscribe(
            params => {
                this.accountId = +params['id'];
                this.fetchDemandDepositAccount();
                this.subscribers.queryParamSub = this.route.queryParams.subscribe(
                    queryParams => {
                        this.queryParams = queryParams;
                        this.routeBack = queryParams['demandDeposit'] ? queryParams['demandDeposit'] : null;
                        this.customerUrl = queryParams['cus'];
                        this.commandReference = queryParams['commandReference'];
                        this.taskId = this.queryParams['taskId'];
                        this.isMinimumBalanceOverridable = this.queryParams['isMinimumBalanceOverridable'] ? true : false;
                        if (queryParams['taskId']) {
                            this.taskId = queryParams['taskId'];
                            this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                                data => {
                                    this.prepareMinimumBalanceForm(data);
                                });
                        }
                    });
            });

    }


    prepareMinimumBalanceForm(formData: DemandDepositAccountMinimumBalance) {
        formData = (formData == null ? initialAccountMinimumBalanceFormData : formData);
        this.accountMinimumBalanceForm = this.formBuilder.group({
            comment: [formData.comment],
            minimumBalance: [formData.minimumBalance]
        });

    }


    submit() {
        this.showVerifierSelectionModal = of(true);

    }


    onVerifierSelect(selectEvent: VerifierSelectionEvent) {
        this.saveAccountMinimumBalance(selectEvent, null);
    }



    formInvalid() {
        return this.accountMinimumBalanceForm.invalid
    }

    
    saveAccountMinimumBalance(selectEvent: VerifierSelectionEvent, taskId: string) {
        let demandDepositAccountMinimumBalance: DemandDepositAccountMinimumBalance = this.accountMinimumBalanceForm.value;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, selectEvent.verifier, DETAILS_UI.concat("accountId=" + this.accountId + "&"), this.location.path().concat("&"));
        this.demandDepositAccountService.updateDemandDepositAccountMinimumBalance({ accountId: this.accountId }, demandDepositAccountMinimumBalance, urlSearchParams)
            .subscribe(data => {
                if(selectEvent.approvalFlowRequired){
                    this.notificationService.sendSuccessMsg("workflow.task.verify.send");
                  }else{
                    this.notificationService.sendSuccessMsg("account.minimum.balance.update.success");
                  }
                      
                this.navigateAway();
            });
    }

    fetchAccountMinimumBalanceDetail() {
        this.subscribers.fetchDemandDepositAccountDetailsSub = this.demandDepositAccountService.getDemandDepositAccountMinimumBalanceLog({ accountId: this.accountId }).subscribe(
            data => {
                this.accountMinimumBalanceLog = data;
                this.previousAccountMinimumBalance = data.previousBalance;
            }
        )
    }
    accountMinimumBalance: number;
    fetchDemandDepositAccount() {
        this.subscribers.fetchDemandDepositAccountDetailsSub = this.demandDepositAccountService
            .fetchDemandDepositAccountDetails({ id: this.accountId + "" }).subscribe(
                data => {
                    this.demandDepositAccount = data;
                    this.accountMinimumBalance = data.balance.minimumBalance;
                }
            );
    }

    navigateAway() {
        this.router.navigate([this.routeBack ? this.routeBack : "../"], {
            relativeTo: this.route,
            queryParams: {
                cus: this.customerUrl
            }
        });
    }

    cancel() {
        this.navigateAway();
    }
}
