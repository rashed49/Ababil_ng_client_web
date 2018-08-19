import { RecurringDepositAccountService } from './../../../../../../../services/recurring-deposit-account/service-api/recurring.deposit.account.service';
import { RecurringDepositAccount } from './../../../../../../../services/recurring-deposit-account/domain/recurring.deposit.account.model';
import { BaseComponent } from "../../../../../../../common/components/base.component";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../../../../../common/notification/notification.service';
import { FormBaseComponent } from '../../../../../../../common/components/base.form.component';
import { Location } from '@angular/common';
import { ApprovalflowService } from '../../../../../../../services/approvalflow/service-api/approval.flow.service';
import { Observable, of } from 'rxjs';
import { RecurringDepositAccountSaveEvent } from '../recurring.deposit.account.form.component';

export const SUCCESS_MSG: string[] = ["recurring.deposit.account.update.success", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/recurring-deposit-account";

@Component({
    selector: 'recurring-deposit-account-form-edit',
    templateUrl: './recurring.deposit.account.form.edit.component.html'
})
export class RecurringDepositAccountFormEditComponent extends FormBaseComponent implements OnInit {

    recurringDepositAccountFormData: RecurringDepositAccount = new RecurringDepositAccount();
    recurringDepositAccountId: number;
    queryParams: any;
    command: string = "UpdateRecurringDepositAccountCommand";
    status: string;
    constructor(private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private recurringDepositAccountService: RecurringDepositAccountService, protected location: Location, protected approvalFlowService: ApprovalflowService
    ) {
        super(location, approvalFlowService);
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);

        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.recurringDepositAccountId = +params['id'];
            this.fetchRecurringDepositAccountDetails(this.recurringDepositAccountId);
            this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {

                this.queryParams = queryParams;
                if (queryParams['taskId']) {
                    this.taskId = queryParams['taskId'];
                    this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                        data => {
                            if (queryParams['accountStatus']) {
                                this.status = queryParams['accountStatus'];
                            }
                            if (queryParams['command'] === "ActivateRecurringDepositAccountCommand") {
                                this.fetchRecurringDepositAccountDetails(data);
                                this.command = this.queryParams.command;
                            } else {
                                this.recurringDepositAccountFormData = data;
                            }
                        }
                    );
                } else {
                    this.fetchRecurringDepositAccountDetails(this.recurringDepositAccountId);
                }
            });
        });


    }

    onSave(event: RecurringDepositAccountSaveEvent) {
        let tempRecurringDepositAccount = event.recurringDepositAccountForm;
        tempRecurringDepositAccount.id = this.recurringDepositAccountId;
        if (!tempRecurringDepositAccount.number) {
            tempRecurringDepositAccount.number = this.recurringDepositAccountFormData.number;
        }
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, DETAILS_UI.concat("?recurringDepositAccountId=").concat(this.recurringDepositAccountId.toString()).concat("&"), this.location.path().concat("&"));

        this.subscribers.saveRecurringDepositAccountSub = this.recurringDepositAccountService.updateRecurringDepositAccount({ recurringDepositAccountId: this.recurringDepositAccountId }, tempRecurringDepositAccount, urlSearchParams).subscribe(
            (data) => {

                if ((this.status === "ACTIVATED") || (this.status === "OPENED")) {
                    this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
                } else {
                    this.notificationService.sendSuccessMsg(SUCCESS_MSG[0]);
                }
                this.navigateAway();
            }
        );
    }

    fetchRecurringDepositAccountDetails(recurringDepositAccountId: number) {
        this.subscribers.fetchRecurringDepositAccountDetailsSub = this.recurringDepositAccountService
            .fetchRecurringDepositAccountDetails({ recurringDepositAccountId: recurringDepositAccountId })
            .subscribe(data => {
                this.recurringDepositAccountFormData = data;
                this.status = data.status;
            });
    }

    navigateAway(): void {
        if (this.taskId && this.queryParams.command == "UpdateRecurringDepositAccountCommand") {

            this.router.navigate(['../../', 'approval-flow', 'pendingtasks']);


        } else if (this.taskId && this.queryParams.command == "ActivateRecurringDepositAccountCommand") {

            this.router.navigate(['/recurring-deposit-account', this.recurringDepositAccountId, 'details'], {
                relativeTo: this.route,
                queryParams: {
                    cus: this.queryParams.cus,
                    taskId: this.queryParams.taskId,
                    command: this.queryParams.command,
                    commandReference: this.queryParams.commandReference
                },
                queryParamsHandling: "merge"
            });

        }
        else {

            this.router.navigate(['/recurring-deposit-account', this.recurringDepositAccountId, 'details'], {
                relativeTo: this.route,
                queryParams: {
                    cus: this.queryParams.cus
                },
                queryParamsHandling: "merge"
            });
        }
    }
    onCancel() {
        this.navigateAway();
    }

}

