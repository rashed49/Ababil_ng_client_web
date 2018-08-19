import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { NotificationService } from '../../../../common/notification/notification.service';
import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';
import { VerifierSelectionEvent } from '../../../../common/components/verifier-selection/verifier.selection.component';
import { FormBaseComponent } from '../../../../common/components/base.form.component';
import * as commandConstants from '../../../../common/constants/app.command.constants';
import { GlAccount } from "../../../../services/glaccount/domain/gl.account.model";
import { GlAccountService } from '../../../../services/glaccount/service-api/gl.account.service';
import { SubLedger } from '../../../../services/glaccount/domain/sub.ledger.model';
import { SelectItem } from 'primeng/api';


export const DETAILS_UI: string = "views/gl-account/sub-ledger/";

@Component({
    selector: 'sub-ledger-form',
    templateUrl: './sub.ledger.form.component.html',
})

export class SubLedgerFormComponent extends FormBaseComponent implements OnInit {

    constructor(private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private glAccountService: GlAccountService,
        private notificationService: NotificationService,
        protected location: Location,
        protected approvalflowService: ApprovalflowService) {
        super(location, approvalflowService)
    }

    subscription: any;
    type: string;
    subLedgerForm: FormGroup;
    selectedGlAccountId: number;

    glAccount: GlAccount = new GlAccount();
    subLedgerformData: SubLedger;
    taskId: number;
    generalLedgerAccountName: string;
    today: Date;
    local: boolean = false;
    branchAllowed: boolean = false;
    editMode: boolean = false;
    currencyCode: string;

    queryParams: any;
    command: string = "CreateFixedDepositAccountCommand";

    currencies: SelectItem[] = [];

    name: string;

    @Input('generalLedgerAccountId') generalLedgerAccountId: number;

    @Input('subLedgerId') subLedgerId: number;

    @Output('onSave') onSave = new EventEmitter<boolean>();

    ngOnInit() {

        this.showVerifierSelectionModal = of(false);
        this.today = new Date();
        this.prepareSubLedgerForm(new SubLedger());

        this.command = commandConstants.CREATE_SUB_LEDGER_COMMAND;


        this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {

            if (queryParams['commandReference']) {
                this.commandReference = queryParams['commandReference'];
            }
            this.queryParams = queryParams;

            if (queryParams['taskId']) {

                this.taskId = queryParams['taskId'];

                this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                    .subscribe(data => {
                        this.subLedgerformData = data;
                        this.name = data.name;
                        this.generalLedgerAccountId = data.generalLedgerAccountId;
                        this.fetchGlAccountDetails();
                        this.prepareSubLedgerForm(this.subLedgerformData);
                    });
            }
            else {

                if (this.subLedgerId) {
                    this.fetchSubLedger();
                    this.editMode = true;

                }
                else {
                    this.name = "Sub-GL";
                    if (this.generalLedgerAccountId) {
                        this.fetchGlAccountDetails();
                    }
                }

            }


        });
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        if (simpleChanges.generalLedgerAccountId) {
            this.generalLedgerAccountId = simpleChanges.generalLedgerAccountId.currentValue;
            if (this.generalLedgerAccountId) {
                this.fetchGlAccountDetails();
            }
        }
    }



    fetchGlAccountDetails() {
        this.subscribers.fetchGlAccountDetailsSub = this.glAccountService
            .fetchGlAccountDetails({ 'id': this.generalLedgerAccountId })
            .subscribe(data => {
                this.generalLedgerAccountName = data.name;
                this.glAccount = data;
                if (data.currencyRestriction == 'LOCAL_CURRENCY') {
                    this.currencyCode = "BDT";
                    this.local = true;
                }
                else {

                    this.local = false;
                    this.currencies = data.currencies;
                    this.currencies = [{ label: 'Choose Currency', value: null }]
                        .concat(this.glAccount.currencies.map(currency => {
                            return {
                                label: currency.toString(), value: currency
                            }
                        }));
                }
            });
    }

    fetchSubLedger() {

        this.subscribers.fetchSubLedgerSub = this.glAccountService.
            fetchSubGlDetails({ 'subsidiaryLedgerId': this.subLedgerId + '' })
            .subscribe(subLedger => {
                this.subLedgerformData = subLedger;
                this.name = subLedger.name;
                this.generalLedgerAccountId = subLedger.generalLedgerAccountId;
                this.prepareSubLedgerForm(this.subLedgerformData);
                this.fetchGlAccountDetails();
            });
    }

    prepareSubLedgerForm(formData: SubLedger) {
        formData = (formData) ? formData : new SubLedger();

        this.subLedgerForm = this.formBuilder.group({
            balance: [formData.balance, [Validators.required]],
            blockAmount: [formData.blockAmount, [Validators.required]],
            branchId: [formData.branchId],
            code: [formData.code, [Validators.required]],
            currencyCode: [formData.currencyCode],
            areAllBranchAllowed: [formData.areAllBranchAllowed],
            isNegativeBalanceAllowed: [formData.isNegativeBalanceAllowed, [Validators.required]],
            isOnlineTxnAllowed: [formData.isOnlineTxnAllowed, [Validators.required]],
            lastTxnDateTime: [formData.lastTxnDateTime],
            name: [this.name, [Validators.required]],
            status: [formData.status, [Validators.required]]


        });

        this.subLedgerForm.get('areAllBranchAllowed').valueChanges.subscribe(
            areAllBranchAllowed => {
                if (areAllBranchAllowed) {
                    this.branchAllowed = true;
                } else {
                    this.branchAllowed = false;
                }
            }
        )
    }




    formInvalid() {
        return (this.subLedgerForm.invalid);
    }

    submit() {

        this.command = this.subLedgerId
            ? commandConstants.UPDATE_SUB_LEDGER_COMMAND
            : commandConstants.CREATE_SUB_LEDGER_COMMAND;

        this.showVerifierSelectionModal = of(true);
    }


    onVerifierSelect(event: VerifierSelectionEvent) {
        this.subLedgerId
            ? this.updateSubLedgerAccount(event)
            : this.createSubLedgerAccount(event);
    }

    createSubLedgerAccount(event: VerifierSelectionEvent) {
        let subLedger = this.subLedgerForm.value;
        subLedger.generalLedgerAccountId = this.generalLedgerAccountId;
        if (this.local) {
            subLedger.currencyCode = "BDT";
        }
        subLedger.name = this.name;

        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, DETAILS_UI.concat(this.generalLedgerAccountId + '?'), this.location.path().concat("?generalLedgerAccountId=").concat(`${this.generalLedgerAccountId}`.toString()).concat("&"));


        this.subscribers.createSubGlSubs = this.glAccountService.createSubGl(subLedger, urlSearchParams).
            subscribe(
                (data) => {

                    this.onSave.emit(true);

                    event.approvalFlowRequired
                        ? this.notificationService.sendSuccessMsg("workflow.task.verify.send")
                        : this.notificationService.sendSuccessMsg("glaccount.profitrate.save.success");


                    this.navigateAway();
                }
            );


    }

    updateSubLedgerAccount(event: VerifierSelectionEvent) {

        let subLedger = this.subLedgerForm.value
        subLedger.id = this.subLedgerId;
        subLedger.generalLedgerAccountId = this.generalLedgerAccountId;
        if (this.local) {
            subLedger.currencyCode = "BDT";
        }
        subLedger.name = this.name;

        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, DETAILS_UI.concat(this.generalLedgerAccountId + '?'), this.location.path().concat("?generalLedgerAccountId=").concat(`${this.generalLedgerAccountId}`.toString()).concat("&"));


        this.subscribers.updateSubGlSubs = this.glAccountService.updateSubGl({ "subsidiaryLedgerId": this.subLedgerId }, subLedger, urlSearchParams).
            subscribe(
                (data) => {
                    this.onSave.emit(true);

                    event.approvalFlowRequired
                        ? this.notificationService.sendSuccessMsg("workflow.task.verify.send")
                        : this.notificationService.sendSuccessMsg("glaccount.profitrate.update.success");
                    this.navigateAway();
                }
            );

    }

    formcancel() {
        this.router.navigate(['/approval-flow/pendingtasks']);
    }
    cancel() {
        this.navigateAway();
        this.router.navigate(['/glaccount/sub-ledger']);
    }

    navigateAway() {
        if (this.taskId) {
            this.router.navigate(['approval-flow/pendingtasks']);
        } else {
            this.router.navigate(['../'], {
                relativeTo: this.route,
            });
        }
    }
}


