import { of } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from "@angular/router";
import { Account } from "../../../../services/account/domain/account.model";
import { ViewsBaseComponent } from "../../../../ababil-modules/views/view.base.component";
import { NotificationService } from "../../../../common/notification/notification.service";
import { ApprovalflowService } from "../../../../services/approvalflow/service-api/approval.flow.service";
import { TimeDepositLien } from "../../../../services/time-deposit-lien/domain/time.deposit.lien.model";
import { TimeDepositLienDetail } from "../../../../services/time-deposit-lien/domain/time.deposit.lien.detail.model";
import { TimeDepositLienReferenceTypeService } from "../../../../services/time-deposit-lien-reference-type/service-api/time.deposit.lien.reference.type.service";
import { ReferenceType } from "../../../../services/time-deposit-lien-reference-type/domain/time.deposit.lien.reference.type.model";
import { AccountService } from "../../../../services/account/service-api/account.service";

@Component({
    selector: 'time-deposit-view',
    templateUrl: './time.deposit.lien.view.component.html'
})
export class TimeDepositLienViewComponent extends ViewsBaseComponent implements OnInit {

    referenceTypeId: number;
    queryParams: any = {};
    timeDepositLien: TimeDepositLien = new TimeDepositLien();
    referenceType: ReferenceType = new ReferenceType();
    timeDepositLienDetails: TimeDepositLienDetail[] = [];
    accountDetails: Account = new Account();
    accountTypeMap: Map<number, string> = new Map();

    constructor(private route: ActivatedRoute,
        protected workflowService: ApprovalflowService
        , protected router: Router,
        protected notificationService: NotificationService,
        protected location: Location,
        private accountService: AccountService,
        private timeDepositLienReferenceTypeService: TimeDepositLienReferenceTypeService) {

        super(location, router, workflowService, notificationService);
    }
    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);
        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.command = this.queryParams.command;
            this.taskId = this.queryParams.taskId;
            this.processId = this.queryParams.taskId;
            this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                .subscribe(data => {
                    this.timeDepositLien = data;
                    this.referenceTypeId = this.timeDepositLien.referenceTypeId;
                    this.timeDepositLienDetails = this.timeDepositLien.timeDepositLienDetails;

                    this.timeDepositLienDetails.map(accountDetail => accountDetail.accountId)
                        .map(accountId => {
                            this.fetchAccountDetail(accountId);
                        });
                    this.fetchReferencetype();
                });
        });
    }

    fetchReferencetype() {
        this.subscribers.referenceTypeSub = this.timeDepositLienReferenceTypeService.fetchReferencetype({ referenceTypeId: this.referenceTypeId })
            .subscribe(data => {
                this.referenceType = data.referenceType;
            });
    }

    fetchAccountDetail(accountId) {
        this.subscribers.AccountDetailSub = this.accountService.fetchAccountDetails({ accountId: accountId })
            .subscribe(data => {
                this.accountDetails = data;
                this.accountTypeMap.set(this.accountDetails.id, this.accountDetails.number);
            });
    }
}