import { Location } from '@angular/common';
import { NotificationService } from './../../../../../../common/notification/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { VerifierSelectionEvent } from '../../../../../../common/components/verifier-selection/verifier.selection.component';
import { ApprovalflowService } from './../../../../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from './../../../../../../common/components/base.form.component';
import { DemandDepositAccountService } from '../../../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { DemandDepositAccount, DemandDepositAccountCloseRequest } from '../../../../../../services/demand-deposit-account/domain/demand.deposit.account.models';
import { SelectItem } from 'primeng/api';
import { CreditAccountType } from '../../../../../../common/domain/credit.account.type.enum.model';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AccountService } from '../../../../../../services/account/service-api/account.service';
import { DemandDepositChargeInformation, TaxationRequest } from '../../../../../../services/demand-deposit-account/domain/demand.deposit.account.charge.models';
import { AmountInWordsService } from '../../../../../../common/services/amount.in.words.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { GlAccountService } from '../../../../../../services/glaccount/service-api/gl.account.service';


export const DETAILS_UI: string = "views/demand-deposit-account/close?";


@Component({
    selector: 'account-closing-form',
    templateUrl: 'account.closing.form.component.html'
})

export class AccountClosingFormComponent extends FormBaseComponent implements OnInit {
    demandDepositAccount: DemandDepositAccount = new DemandDepositAccount();
    accountId: number;
    accountClosingForm: FormGroup;
    command: string = "DemandDepositAccountCloseCommand";
    charges: DemandDepositChargeInformation[] = [];
    demandDepositDisplay = false;
    demandDepositSignatureDisplay = false;
    activityId: number = 201;
    customerId: number;
    accountNumberChanged: Subject<string> = new Subject<string>();
    transactionAccountDetailsChanged: Subject<any> = new Subject<any>();
    taxationResponse: TaxationRequest = new TaxationRequest();
    taxPercentage: number;
    totalChargeAmount: number = 0;
    accountBalance: number;
    provisionalProfit: number;
    netPayable: number;
    selectedCreditAccountType: string;
    transactionAccountNumber: string;
    transactionAccountTitle: string;
    accountClosingActivityId: number = 201;
    
    @ViewChild('chargeTable') chargeTable: any;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private demandDepositAccountService: DemandDepositAccountService,
        private accountService: AccountService,
        private notificationService: NotificationService,
        private formBuilder: FormBuilder,
        protected location: Location,
        protected approvalflowService: ApprovalflowService,
        private amountInWordService: AmountInWordsService,
        private glAccountService: GlAccountService) {
        super(location, approvalflowService);

        this.accountNumberChanged
            .pipe(debounceTime(1500), distinctUntilChanged())
            .subscribe(model => {
                if (this.selectedCreditAccountType === "CASA") {
                    this.searchDemandDepositAccountByAccountNumber(model);
                }
                if (this.selectedCreditAccountType === "GL") {
                    this.searchGLAccountForTransaction(model);
                }
                if (this.selectedCreditAccountType === "SUBGL") {
                    this.searchSubGlAccountForTransaction(model);
                }
            });
        this.transactionAccountDetailsChanged
            .pipe(debounceTime(500), distinctUntilChanged())
            .subscribe(model => {
                this.transactionAccountTitle = model.name;
                this.accountClosingForm.get('destinationAccountId').setValue(model.id);
                // this.accountClosingForm.get('destinationAccountId').
                // if (model.currencyCode !== this.demandDepositAccount.currencyCode) {
                //     this.accountClosingForm.get('destinationAccountId').setErrors({ currencyMismatch: true });
                // }
            });
    }

    creditAccountTypes: SelectItem[] = CreditAccountType;
    queryParams: any;
    routeBack: any;
    customerUrl: any;
    accountTitleDisable: boolean = true;
    accountNumber: string;
    chargeAmounts: number[];
    vatAmounts: number[];
    amountInWords: string;
    correctionUi: boolean = false;
    accountCloseRequest: DemandDepositAccountCloseRequest = new DemandDepositAccountCloseRequest();
    ngOnInit() {
        this.showVerifierSelectionModal = of(false);
        this.prepareAccountClosingForm(null);
        this.subscribers.routeParamSub = this.route.params.subscribe(
            params => {
                this.accountId = +params['id'];
                this.fetchDemandDepositAccount(this.accountId);
                this.subscribers.queryParamSub = this.route.queryParams.subscribe(
                    queryParams => {
                        this.queryParams = queryParams;
                        this.routeBack = queryParams['demandDeposit'] ? queryParams['demandDeposit'] : null;
                        this.commandReference = queryParams['commandReference'];
                        this.taskId = queryParams['taskId'];
                        this.customerId = queryParams['customerId'];
                        if (queryParams['taskId']) {
                            this.taskId = queryParams['taskId'];
                            this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                                data => {
                                    this.prepareAccountClosingForm(data);
                                    if (data.charges.length > 0) {
                                        this.charges = data.charges;
                                    }
                                    this.correctionUi = true;
                                });
                        } else {
                            this.correctionUi = false;
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
            accountId: [formData.accountId, [Validators.required]],
            netPayable: [formData.netPayable, [Validators.required]],
            profit: [formData.profit, [Validators.required]],
            profitTaxAmount: [formData.profitTaxAmount, [Validators.required]],
            destinationAccountId: [formData.destinationAccountId, [Validators.required]],
            destinationAccountType: [formData.destinationAccountType, [Validators.required]]
        });



        this.accountClosingForm.get('netPayable').valueChanges.subscribe(val => {
            let amount = this.accountClosingForm.get('netPayable').value;
            this.amountInWords = this.amountInWordService.convertAmountToWords(amount, this.demandDepositAccount.currencyCode || null);
        });

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
        }
        if (formData.destinationAccountType === "PO" && formData.destinationAccountType !== null) {
            this.accountTitleDisable = false;
        } else {
            this.accountTitleDisable = true;
        }
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
                if (!value) {
                    this.accountTitleDisable = true;
                }
                if (value) {
                    this.transactionAccountNumber = '';
                    this.transactionAccountTitle = '';
                    this.selectedCreditAccountType = value;
                    this.accountClosingForm.get('destinationAccountId').reset();
                    this.accountClosingForm.get('destinationAccountId').updateValueAndValidity();

                    if (this.accountClosingForm.get('destinationAccountType').value === "PO") {
                        this.accountTitleDisable = true;
                        this.accountClosingForm.get('destinationAccountId').clearValidators();
                        this.accountClosingForm.get('destinationAccountId').updateValueAndValidity();
                    }
                    else {
                        this.accountTitleDisable = false;

                        if (this.accountClosingForm.get('destinationAccountType').value === "CASA") {
                            this.accountClosingForm.get('destinationAccountId').setValidators([Validators.required]);
                            this.accountClosingForm.get('destinationAccountId').updateValueAndValidity();

                        } else {
                            this.accountClosingForm.get('destinationAccountId').setValidators([Validators.required]);
                            this.accountClosingForm.get('destinationAccountId').updateValueAndValidity();

                        }
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
    selectedAccountForTransaction: any;

    searchDemandDepositAccountByAccountNumber(accountNumber) {
        let accountQueryParams = new Map<string, string>().set('accountNumber', accountNumber);
        this.subscribers.fetchAccountDetailSub = this.demandDepositAccountService.fetchDemandDepositAccounts(accountQueryParams).subscribe(
            data => {
                if (data.content.length != 0) {
                    this.selectedAccountForTransaction = data.content[0];
                    this.accountClosingForm.get('destinationAccountId').setValue(data.content[0].id);
                    this.transactionAccountTitle = data.content[0].name;
                }



                // this.transactionAccountDetailsChanged.next(data.content[0]);
            });
    }
    searchGLAccountForTransaction(GLMapCode) {
        let queryParams = new Map<string, string>().set('code', GLMapCode);
        this.subscribers.fetchGlDetailSub = this.glAccountService.fetchGlAccounts(queryParams).subscribe(
            data => {
                if (data.length != 0) {
                    this.selectedAccountForTransaction = data[0];
                    this.accountClosingForm.get('destinationAccountId').setValue(data[0].id);
                    this.transactionAccountTitle = data[0].name;
                }
                // this.transactionAccountDetailsChanged.next(data[0]);
            });
    }
    searchSubGlAccountForTransaction(subGlCode) {
        let queryParams = new Map<string, string>().set('subGlCode', subGlCode);
        this.subscribers.fetchSubGlDetailSub = this.glAccountService.fetchSubGls(queryParams).subscribe(
            data => {
                if (data.content.length != 0) {
                    this.selectedAccountForTransaction = data.content[0];
                    this.accountClosingForm.get('destinationAccountId').setValue(data.content[0].id);
                    this.transactionAccountTitle = data.content[0].name;
                }

                // this.transactionAccountDetailsChanged.next(data.content[0]);
            });

    }


    onAccountNumberChange(accNumber: string) {
        if (this.selectedCreditAccountType !== null) {
            if (this.selectedCreditAccountType === "CASA" && accNumber.length > 13) {
                this.accountClosingForm.get('destinationAccountId').setErrors({ accountNumberLengthError: true });
            }

            this.accountNumberChanged.next(accNumber);
        }
        this.transactionAccountNumber = accNumber;



    }

    onChargeChange() {
        this.totalPayableAmountCalculation();
    }




    fetchDemandDepositAccount(accountId) {
        this.subscribers.fetchDemandDepositAccountDetailsSub = this.demandDepositAccountService
            .fetchDemandDepositAccountDetails({ id: accountId + "" }).subscribe(
                data => {
                    if (accountId === this.accountId) {
                        this.demandDepositAccount = data;
                        this.provisionalProfit = this.demandDepositAccount.balance.provisionalProfit;
                        this.accountClosingForm.get('accountId').setValue(this.accountId);
                        this.accountBalance = this.demandDepositAccount.balance.currentBalance;
                        if (!this.taskId) {
                            this.accountClosingForm.get('profit').setValue(this.demandDepositAccount.balance.provisionalProfit);
                            this.fetchCharges(this.demandDepositAccount.balance.currentBalance);
                        }
                        this.chargeTable.currencyCode = this.demandDepositAccount.currencyCode;
                        this.fetchTaxationResponse();
                        this.totalPayableAmountCalculation();
                    }
                    else {
                        this.selectedAccountForTransaction = data;
                        this.transactionAccountNumber = data.number;
                        this.transactionAccountTitle = data.name;
                    }
                }
            );
    }

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
    submit() {
        this.showVerifierSelectionModal = of(true);
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        this.markFormGroupAsTouched(this.accountClosingForm);
        if (this.formsInvalid()) { return };
        let accountCloseRequest: DemandDepositAccountCloseRequest = this.accountClosingForm.value;
        accountCloseRequest.charges = this.chargeTable.charges;
        if (this.selectedCreditAccountType !== "PO") {
            accountCloseRequest.destinationAccountId = this.selectedAccountForTransaction.id;

        }
        accountCloseRequest.activityId = this.accountClosingActivityId;;
        console.log(accountCloseRequest);
        let view_ui = DETAILS_UI.concat("accountId=").concat(this.accountId.toString()).concat("&customerId=").concat(this.customerId.toString()).concat("&");
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));
        this.demandDepositAccountService.demandDepositAccountClose(this.accountId, accountCloseRequest, urlSearchParams)
            .subscribe(data => {
                if (!event.approvalFlowRequired) {
                    if (this.selectedCreditAccountType === "PO") {
                        this.notificationService.sendSuccessMsg("demand.deposit.account.close.payorder.issue.success", { payorder: data.content });
                    } else {
                        this.notificationService.sendSuccessMsg("demand.deposit.account.close.success", { voucher: data.content });
                    }
                }
                else if (event.approvalFlowRequired || !!this.taskId) {
                    this.notificationService.sendSuccessMsg("workflow.task.verify.send");
                }

                // this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
                this.navigateAway();
            });
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


    totalPayableAmountCalculation() {
        let chargeAmount = this.chargeTable.totalChargeAmount !== undefined ? this.chargeTable.totalChargeAmount : 0;
        this.netPayable = Number(this.accountBalance) - Number(chargeAmount) + Number(this.accountClosingForm.get('profit').value) - Number(this.accountClosingForm.get('profitTaxAmount').value);
        this.accountClosingForm.get('netPayable').setValue(this.netPayable);
    }

    formsInvalid(): boolean {
        return (this.accountClosingForm.invalid);
    }
    navigateAway() {
        if (this.taskId) {
            this.router.navigate(['../../', 'approval-flow', 'pendingtasks']);
        } else {
            this.router.navigate([this.routeBack ? this.routeBack : "../"], {
                relativeTo: this.route,
                queryParams: {
                    cus: this.queryParams.cus
                }
            });
        }

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

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        if (tabChangeEvent.index === 0) {
            this.totalPayableAmountCalculation();
        }
    }

    fetchCharges(amount) {
        let urlQueryParamMap = new Map();
        urlQueryParamMap.set("activityId", 201);
        urlQueryParamMap.set("accountId", this.accountId);
        urlQueryParamMap.set("amount", amount);
        this.subscribers.fatchChargeSub = this.demandDepositAccountService
            .getDemadDepositAccountChargeInformation(urlQueryParamMap).subscribe(data => {
                this.charges = data;
                this.charges.forEach(charge => {
                    charge.modifiedChargeAmount = charge.chargeAmount;
                    charge.modifiedVatAmount = charge.vatAmount;
                });
            });
    }


    // fetchAllowedGls() {
    //     if (this.allowedGls.length == 0) {

    //         this.subscribers.fetchAllowedGlbyActivityIdSub = this.tellerService.fetchAllowedGlbyActivityId(new Map<string, string>().set('activity-id', '101')).subscribe(
    //             data => {
    //                 this.allowedGls = [];
    //                 this.glAccounts = data;
    //                 this.allowedGls.push({ label: 'Choose a GL', value: null });
    //                 data.map(
    //                     gl => {
    //                         this.allowedGls.push({ label: gl.generalLedgerAccount.name, value: +(this.allowedGls.length - 1) });
    //                     }
    //                 )
    //                 if (this.taskId) {
    //                     this.selectedGlMapCode = data.indexOf(data.filter(account => this.glAccountId == account.generalLedgerAccount.id)[0]);
    //                     if (this.selectedGlMapCode >= 0) {
    //                         this.fetchGlAccount(this.glAccounts[this.selectedGlMapCode].generalLedgerAccount);
    //                     }
    //                 }
    //             }
    //         )
    //     }
    // }


}
