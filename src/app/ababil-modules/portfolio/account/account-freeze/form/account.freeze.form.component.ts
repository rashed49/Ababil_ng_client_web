import { Location } from '@angular/common';
import { NotificationService } from './../../../../../common/notification/notification.service';
import { BaseComponent } from './../../../../../common/components/base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OnInit } from "@angular/core";
import { Observable, of } from 'rxjs';
import { VerifierSelectionEvent } from '../../../../../common/components/verifier-selection/verifier.selection.component';
import * as urlSearchParameterConstants from '../../../../../common/constants/app.search.parameter.constants';
import { ApprovalflowService } from './../../../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from './../../../../../common/components/base.form.component';
import { ProductService } from '../../../../../services/product/service-api/product.service';
import { FreezeAccount, Account } from '../../../../../services/account/domain/account.model';
import { AccountService } from '../../../../../services/account/service-api/account.service';
export let initialAccountFreezeFormData: FreezeAccount = new FreezeAccount();

export const DETAILS_UI: string = "views/account-freeze";

@Component({
    selector: 'account-freeze-form',
    templateUrl: 'account.freeze.form.component.html'
})

export class AccountFreezeFormComponent extends FormBaseComponent implements OnInit {

    constructor(private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private notificationService: NotificationService,
        private formBuilder: FormBuilder,
        protected location: Location,
        protected approvalflowService: ApprovalflowService, ) {
        super(location, approvalflowService);
    }
    command: string = "";
    accountId: number;
    queryParams: any;
    routeBack: any;
    customerUrl: any;
    accountIsFreezable: boolean;
    freezeCommand: string;
    account: Account = new Account();
    accountFreezeForm: FormGroup;
    ngOnInit() {
        this.showVerifierSelectionModal = of(false);

        this.prepareAccountFreezeForm(null);
        this.subscribers.queryParamSub = this.route.queryParams.subscribe(
            queryParams => {
                this.queryParams = queryParams;
                this.accountId = +queryParams['accountId'];
                this.fetchAccount();
                this.routeBack = queryParams['routeBack'];
                this.customerUrl = queryParams['cus'];
                this.commandReference = queryParams['commandReference'];
                this.taskId = this.queryParams['taskId'];
                if (queryParams['taskId']) {
                    this.taskId = queryParams['taskId'];
                    this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                        data => {
                            this.prepareAccountFreezeForm(data);

                        });
                }
            });

    }

    prepareAccountFreezeForm(formData: FreezeAccount) {
        formData = (formData == null ? initialAccountFreezeFormData : formData);
        this.accountFreezeForm = this.formBuilder.group({
            reason: [formData.object, [Validators.required]]
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
            this.command = "ImposeAccountFreezeCommand"
        }
        else if (this.account.freeze) {
            this.accountIsFreezable = false;
            this.freezeCommand = 'WITHDRAW_FREEZE';
            this.command = "WithdrawAccountFreezeCommand"
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
        let label: string = '';
        if (this.accountIsFreezable) {
            label = 'Freeze';
        }
        else if (!this.accountIsFreezable) {
            label = 'Unfreezed';
        }
        return label;
    }

    submit() {
        this.markFormGroupAsTouched(this.accountFreezeForm);
        if (this.formInvalid()) { return }
        this.showVerifierSelectionModal = of(true);

    }

    onVerifierSelect(selectEvent: VerifierSelectionEvent) {
        this.saveAccountFreezeStatus(selectEvent, null);

    }

    formInvalid() {
        return this.accountFreezeForm.invalid;
    }

    saveAccountFreezeStatus(selectEvent: VerifierSelectionEvent, taskId: string) {

        let view_ui = DETAILS_UI.concat("?accountId=").concat(this.accountId.toString()).concat("&");
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, selectEvent.verifier, view_ui, this.location.path().concat("&"));
        let freezAccount: FreezeAccount = new FreezeAccount();
        freezAccount.object = this.accountFreezeForm.controls.reason.value;
        freezAccount.action = this.freezeCommand;
        this.subscribers.freezeAccountSub = this.accountService.freezeAccount({ accountId: this.accountId + "" }, freezAccount, urlSearchParams)
            .subscribe(data => {
                if (selectEvent.approvalFlowRequired) {
                    this.notificationService.sendSuccessMsg("workflow.task.verify.send");
                } else {
                    this.notificationService.sendSuccessMsg("account.freeze.status.changed.success");
                }

                this.navigateAway();
            });
    }

    navigateAway() {
        if (this.taskId) {
            this.router.navigate(['../../', 'approval-flow', 'pendingtasks']);
        } else {
            if (this.queryParams['routeBack'] != undefined) {
                this.router.navigate([this.queryParams.routeBack], {
                    queryParams: {
                        cus: this.queryParams.cus
                    }
                });
            } else {
                this.router.navigate(['../'], { relativeTo: this.route });
            }
        }
    }
    
    cancel() {
        this.navigateAway();
    }
}
