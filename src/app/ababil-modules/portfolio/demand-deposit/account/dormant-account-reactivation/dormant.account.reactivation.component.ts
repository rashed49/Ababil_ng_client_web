import { Location } from '@angular/common';
import { NotificationService } from './../../../../../common/notification/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OnInit } from "@angular/core";
import { Observable, of } from 'rxjs';
import { VerifierSelectionEvent } from '../../../../../common/components/verifier-selection/verifier.selection.component';
import * as urlSearchParameterConstants from '../../../../../common/constants/app.search.parameter.constants';
import { ApprovalflowService } from './../../../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from './../../../../../common/components/base.form.component';
import { DemandDepositAccountService } from '../../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { SelectItem } from 'primeng/api';
import { SelectButton } from 'primeng/primeng';
import { Subject } from 'rxjs';
import { DemandDepositAccount, ReactivateDemandDepositAccountCommandDetails } from '../../../../../services/demand-deposit-account/domain/demand.deposit.account.models';


export const DETAILS_UI: string = "views/demand-deposit-account/dorment-account-reactivation?";
export const SUCCESS_MSG: string[] = ["demand.deposit.account.reactivation.success", "workflow.task.verify.send"];


@Component({
    selector: 'dormant-account-reactivation-form',
    templateUrl: 'dormant.account.reactivation.component.html'
})

export class DormantAccountReactivationFormComponent extends FormBaseComponent implements OnInit {
    demandDepositAccount: DemandDepositAccount = new DemandDepositAccount();
    command: string = "ReactivateDemandDepositAccountCommand";
    accountId: number;
    queryParams: any;
    routeBack: string;
    customerId: number;
    dormantAccountReactivationForm: FormGroup;
    charges: any;
    reactivateDemandDepositAccountCommand: ReactivateDemandDepositAccountCommandDetails = new ReactivateDemandDepositAccountCommandDetails();
    demandDepositDisplay: boolean = false;
    demandDepositSignatureDisplay: boolean = false;
    @ViewChild('chargeTable') chargeTable: any;
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private demandDepositAccountService: DemandDepositAccountService,
        private notificationService: NotificationService,
        private formBuilder: FormBuilder,
        protected location: Location,
        protected approvalflowService: ApprovalflowService) {
        super(location, approvalflowService);
    }

    ngOnInit() {
        this.showVerifierSelectionModal = of(false);
        this.charges = [
            {
                chargeId: 5,
                chargeName: "Charge 3",
                chargeGlAccountId: 2100726,
                chargeAmount: 20,
                vatGlAccountId: 2201735,
                vatAmount: 2
            }, {
                chargeId: 6,
                chargeName: "Charge 4",
                chargeGlAccountId: 2100726,
                chargeAmount: 30,
                vatGlAccountId: 2201735,
                vatAmount: 3
            }
        ];
        this.prepareDormantAccountReactivationForm(null);
        this.subscribers.routeParamSub = this.route.params.subscribe(
            params => {
                this.accountId = +params['id'];
                this.fetchDemandDepositAccount(this.accountId);
                this.subscribers.queryParamSub = this.route.queryParams.subscribe(
                    queryParams => {
                        this.queryParams = queryParams;
                        this.routeBack = queryParams['demandDeposit'] ? queryParams['demandDeposit'] : null;
                        this.commandReference = queryParams['commandReference'];
                        this.customerId = queryParams['customerId'];
                        if (queryParams['taskId']) {
                            this.taskId = queryParams['taskId'];
                            this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                                data => {
                                    this.prepareDormantAccountReactivationForm(data);
                                });
                        }
                    });
            });
        this.fetchDemandDepositAccount(this.accountId);

    }

    prepareDormantAccountReactivationForm(formData: ReactivateDemandDepositAccountCommandDetails) {
        formData = formData === null ? new ReactivateDemandDepositAccountCommandDetails() : formData;
        if (formData.charges && formData.charges.length > 0) {
            this.charges = formData.charges;
        }
        this.dormantAccountReactivationForm = this.formBuilder.group({
            comment: formData.comment
        });
    }
    
    fetchDemandDepositAccount(accountId) {
        this.subscribers.fetchDemandDepositAccountDetailsSub = this.demandDepositAccountService
            .fetchDemandDepositAccountDetails({ id: accountId + "" }).subscribe(
                data => {
                    this.demandDepositAccount = data;
                    this.chargeTable.currencyCode = data.currencyCode;
                    this.fetchCharges();
                });
    }

    submit() {
        this.showVerifierSelectionModal = of(true);
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let reactivateDemandDepositAccountCommand: ReactivateDemandDepositAccountCommandDetails = new ReactivateDemandDepositAccountCommandDetails();
        reactivateDemandDepositAccountCommand.comment = this.dormantAccountReactivationForm.get('comment').value;
        reactivateDemandDepositAccountCommand.charges = this.charges;
        let view_ui = DETAILS_UI.concat("accountId=").concat(this.accountId.toString()).concat("&");
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));
        this.demandDepositAccountService.reactivateAccount(this.accountId, reactivateDemandDepositAccountCommand, urlSearchParams)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
                this.navigateAway();
            });

    }
    
    formInvalid() {
        return true;
    }
    
    navigateAway() {
        if (this.taskId) {
            this.router.navigate(['../../', 'approval-flow', 'pendingtasks']);
        }
        this.router.navigate([this.routeBack ? this.routeBack : "../"], {
            relativeTo: this.route,
            queryParams: {
                cus: this.queryParams.cus
            }
        });
    }

    cancel() {
        this.navigateAway();
    }
    
    showAccountDetail() {
        this.demandDepositDisplay = true;
    }


    showSignature() {
        this.demandDepositSignatureDisplay = true;
    }

    fetchCharges() {
        let urlQueryParamMap = new Map();
        urlQueryParamMap.set("activityId", 202);
        urlQueryParamMap.set("accountId", this.accountId);
        urlQueryParamMap.set("amount", 0);
        this.subscribers.fatchChargeSub = this.demandDepositAccountService
            .getDemadDepositAccountChargeInformation(urlQueryParamMap).subscribe(data => {
                this.charges = data;
                this.charges.forEach(charge => {
                    charge.modifiedChargeAmount = charge.chargeAmount;
                    charge.modifiedVatAmount = charge.vatAmount;
                });
            });
    }
}