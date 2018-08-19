import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OnInit } from "@angular/core";
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { FormBaseComponent } from '../../../../../../common/components/base.form.component';
import { RecurringDepositAccount } from '../../../../../../services/recurring-deposit-account/domain/recurring.deposit.account.model';
import { CreditAccountType } from '../../../../../../common/domain/credit.account.type.enum.model';
import { RecurringDepositAccountService } from '../../../../../../services/recurring-deposit-account/service-api/recurring.deposit.account.service';
import { ApprovalflowService } from '../../../../../../services/approvalflow/service-api/approval.flow.service';
import { VerifierSelectionEvent } from '../../../../../../common/components/verifier-selection/verifier.selection.component';
import { DemandDepositAccountCloseRequest } from '../../../../../../services/demand-deposit-account/domain/demand.deposit.account.models';
import { NotificationService } from '../../../../../../common/notification/notification.service';
import { TaxationRequest, DemandDepositChargeInformation } from '../../../../../../services/demand-deposit-account/domain/demand.deposit.account.charge.models';
import { AccountService } from '../../../../../../services/account/service-api/account.service';
import { MatTabChangeEvent } from '../../../../../../../../node_modules/@angular/material/tabs';
import { AmountInWordsService } from '../../../../../../common/services/amount.in.words.service';
import { TimeDepositChargeService } from '../../../../../../services/time-deposit-charge/service-api/time.deposit.charge.service';


export const DETAILS_UI: string = "views/recurring-deposit-account/close?";
export const SUCCESS_MSG: string[] = ["recurring.deposit.account.close.success", "workflow.task.verify.send"];


@Component({
    selector: 'recurring-deposit-account-closing-form',
    templateUrl: 'recurring.deposit.account.closing.form.component.html'
})

export class RecurringDepositAccountClosingFormComponent extends FormBaseComponent implements OnInit {
    recurringDepositAccount: RecurringDepositAccount = new RecurringDepositAccount();
    accountId: number;
    accountClosingForm: FormGroup;
    command: string = "RecurringDepositAccountCloseCommand";
    charges: DemandDepositChargeInformation[] = [];
    recurringDepositDisplay = false;
    recurringDepositSignatureDisplay = false;
    activityId: number = 201;
    customerId: number;
    accountNumberChanged: Subject<string> = new Subject<string>();
    taxationResponse: TaxationRequest = new TaxationRequest();
    taxPercentage: number;
    totalChargeAmount: number = 0;
    accountBalance: number;
    provisionalProfit: number;
    netPayable: number;

    @ViewChild('chargeTable') chargeTable: any;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private recurringDepositAccountService: RecurringDepositAccountService,
        private notificationService: NotificationService,
        private formBuilder: FormBuilder,
        protected location: Location,
        protected approvalflowService: ApprovalflowService,
        private accountService: AccountService,
        private amountInWordsService: AmountInWordsService,
        private timeDepositChargeService: TimeDepositChargeService) {

        super(location, approvalflowService);
        this.accountNumberChanged
            .pipe(debounceTime(1500), distinctUntilChanged())
            .subscribe(model => {
                this.searchRecurringDepositAccountByAccountNumber(model);
            });
    }
    creditAccountTypes: SelectItem[] = CreditAccountType;
    queryParams: any;
    routeBack: any;
    customerUrl: any;
    accountTitleDisable: boolean = true;
    accountNumber: string;
    selectedAccountForTransaction: RecurringDepositAccount = new RecurringDepositAccount();
    amountInWords: string;
    accountCloseRequest: any;
    ngOnInit() {
        this.showVerifierSelectionModal = of(false);
        this.prepareAccountClosingForm(null);
        this.subscribers.routeParamSub = this.route.params.subscribe(
            params => {
                this.accountId = +params['id'];
                this.fetchRecurringDepositAccount(this.accountId);
                this.subscribers.queryParamSub = this.route.queryParams.subscribe(
                    queryParams => {
                        this.queryParams = queryParams;
                        this.routeBack = queryParams['recurringDeposit'] ? queryParams['recurringDeposit'] : null;
                        this.commandReference = queryParams['commandReference'];
                        this.taskId = queryParams['taskId'];
                        this.customerId = queryParams['customerId'];
                        if (queryParams['taskId']) {
                            this.taskId = queryParams['taskId'];
                            this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                                data => {
                                    if (data.charges.length > 0) {
                                        this.charges = data.charges;
                                    }
                                });
                        }
                    });
                this.totalPayableAmountCalculation();

            });

    }

    prepareAccountClosingForm(formData: DemandDepositAccountCloseRequest) {
        formData = (formData == null ? new DemandDepositAccountCloseRequest : formData);
        if (formData.charges.length > 0) {
            this.charges = formData.charges;
        }
        this.accountClosingForm = this.formBuilder.group({
            accountId: formData.accountId,
            netPayable: formData.netPayable,
            profitDebit: '',
            profitCredit: '',
            taxDebit: '',
            taxCredit: '',
            exciseDutyDebit: '',
            exciseDutyCredit: '',
            profitTaxAmount: formData.profitTaxAmount,
            profit: formData.profit,
            destinationAccountId: formData.destinationAccountId,
            destinationAccountType: formData.destinationAccountType
        });
        if (formData.destinationAccountId != null) this.fetchRecurringDepositAccount(formData.destinationAccountId);
        if (formData.destinationAccountType === "PO") {
            this.accountTitleDisable = true;
        } else {
            this.accountTitleDisable = false;
        }
        this.accountClosingForm.get('netPayable').valueChanges.subscribe(val => {
            let amount = this.accountClosingForm.get('netPayable').value;
            this.amountInWords = this.amountInWordsService.convertAmountToWords(amount, this.recurringDepositAccount.currencyCode || null);
        });
        this.accountClosingForm.get('profit').valueChanges.subscribe(
            value => {
                if (value !== this.provisionalProfit && value < this.provisionalProfit) {
                    if (this.taxPercentage) {
                        this.accountClosingForm.get('profitTaxAmount').setValue(this.accountClosingForm.get('profit').value * this.taxPercentage);
                    }
                }
                if (value !== this.provisionalProfit && value > this.provisionalProfit) {
                    this.accountClosingForm.get('profit').setErrors({ 'moreThanProvisionedProfitError': true });
                }
            }
        )
        this.accountClosingForm.get('accountId').setValue(this.accountId);
        this.accountClosingForm.get('destinationAccountType').valueChanges.subscribe(
            value => {
                if (value) {
                    this.accountNumber = '';
                    this.selectedAccountForTransaction = new RecurringDepositAccount();
                    if (this.accountClosingForm.get('destinationAccountType').value === "PO") {
                        this.accountTitleDisable = true;
                    }
                    else {
                        this.accountTitleDisable = false;
                    }
                }
            }
        );


        this.accountClosingForm.get('profitTaxAmount').valueChanges.subscribe(
            value => {
                this.netPayable = 0;
                this.totalPayableAmountCalculation();
            }
        )
    }
    searchRecurringDepositAccountByAccountNumber(accountNumber) {
        let accountQueryParams = new Map<string, string>().set('accountNumber', accountNumber);
        this.subscribers.fetchAccountDetailSub = this.recurringDepositAccountService.fetchRecurringDepositAccounts(accountQueryParams).subscribe(
            account => {
                this.selectedAccountForTransaction = account.content[0];
                this.accountClosingForm.get('destinationAccountId').setValue(this.selectedAccountForTransaction.id);


            });
    }

    onAccountNumberChange(accNumber: string) {
        this.accountNumberChanged.next(accNumber);
        this.accountNumber = accNumber;
    }
    onChargeChange() {
        this.totalPayableAmountCalculation();
    }
    fetchRecurringDepositAccount(accountId) {
        this.subscribers.fetchRecurringDepositAccountDetailsSub = this.recurringDepositAccountService
            .fetchRecurringDepositAccountDetails({ recurringDepositAccountId: accountId + "" }).subscribe(
                data => {
                    if (accountId === this.accountId) {
                        this.recurringDepositAccount = data;
                        this.chargeTable.currencyCode = data.currencyCode;
                        this.provisionalProfit = 0;
                        this.accountBalance = (this.recurringDepositAccount.recurringDepositAccountBalance !== null) ? (this.recurringDepositAccount.recurringDepositAccountBalance.balance) : 0;
                        if (!this.taskId) {
                            this.accountClosingForm.get('profit').setValue(0); //this.recurringDepositAccount.recurringDepositAccountBalance.provisionalProfit
                            this.fetchCharges(0); //this.recurringDepositAccount.recurringDepositAccountBalance.balance
                        }
                        this.fetchTaxationResponse();
                        this.totalPayableAmountCalculation();
                    }
                    else {
                        this.selectedAccountForTransaction = data;
                        this.accountNumber = data.number;
                    }

                }


            );
    }
    submit() {
        this.showVerifierSelectionModal = of(true);
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let accountCloseRequest = this.accountClosingForm.value;
        accountCloseRequest.charges = this.charges;
        accountCloseRequest.accountId = this.accountId;
        let view_ui = DETAILS_UI.concat("accountId=").concat(this.accountId.toString()).concat("&customerId=").concat(this.customerId.toString()).concat("&");
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));
        // this.recurringDepositAccountService.demandDepositAccountClose(this.accountId, accountCloseRequest, urlSearchParams)
        //     .subscribe(data => {
        //         this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
        //         this.navigateAway();
        //     });
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
        this.recurringDepositDisplay = true;
    }


    showSignature() {
        this.recurringDepositSignatureDisplay = true;
    }

    fetchCharges(amount) {
        let urlQueryParamMap = new Map();
        urlQueryParamMap.set("activityId", 301);
        urlQueryParamMap.set("accountId", this.accountId);
        urlQueryParamMap.set("amount", amount);
        this.subscribers.fatchChargeSub = this.timeDepositChargeService
            .fetchTimeDepositCharge(urlQueryParamMap).subscribe(data => {
                this.charges = data;
                this.charges.forEach(charge => {
                    charge.modifiedChargeAmount = charge.chargeAmount;
                    charge.modifiedVatAmount = charge.vatAmount;
                });
            });
    }
    totalPayableAmountCalculation() {
        let chargeAmount = this.chargeTable.totalChargeAmount !== undefined ? this.chargeTable.totalChargeAmount : 0;
        this.netPayable = Number(this.accountBalance) - Number(chargeAmount) + Number(this.accountClosingForm.get('profit').value) - Number(this.accountClosingForm.get('profitTaxAmount').value);
        this.accountClosingForm.get('netPayable').setValue(this.netPayable);
    }

    fetchTaxationResponse() {
        let urlQueryParamMap = new Map();
        urlQueryParamMap.set("accountId", this.accountId);
        urlQueryParamMap.set("balanceAmount", this.accountBalance);
        urlQueryParamMap.set("profitAmount", this.provisionalProfit);
        this.subscribers.getTaxationRequestSub = this.accountService.fetchTaxation(urlQueryParamMap).subscribe(
            data => {
                this.taxationResponse = data;
                if (!this.taskId) {
                    this.accountClosingForm.get('profitTaxAmount').setValue(data.taxAmount);
                }
                this.taxPercentage = data.taxPercent / 100;
                this.totalPayableAmountCalculation();
            });
    }


    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        if (tabChangeEvent.index === 0) {
            this.totalPayableAmountCalculation();
        }
    }
}
