import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem, ConfirmationService } from 'primeng/api';
import { TellerService } from '../../../services/teller/service-api/teller.service';
import { CurrencyService } from '../../../services/currency/service-api/currency.service';
import { AmountInWordsService } from '../../../common/services/amount.in.words.service';
import { NotificationService } from '../../../common/notification/notification.service';
import { DemandDepositAccountService } from '../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { Subject, Observable, of } from 'rxjs';
import { CashReceive, IbtaInformation, BearerInfo, TellerDenominationTransaction } from '../../../services/teller/domain/teller.domain.model';
import { Currency, ExchangeRate } from '../../../services/currency/domain/currency.models';
import { TransactionParticulars, AccountTypes, SubAccountTypes, TransactionTypes } from '../../../common/domain/teller.enum.model';
import { Teller, TellerBalance, TellerLimit } from '../../../services/teller/domain/teller.models';
import { CommonConfigurationService } from '../../../services/common-configurations/service-api/common.configurations.service';
import { ExchangeRateService } from '../../../services/currency/service-api/exchange.rate.service';
import { GlAccountService } from '../../../services/glaccount/service-api/gl.account.service';
import { GlAccount } from '../../../services/glaccount/domain/gl.account.model';
import { BankService } from '../../../services/bank/service-api/bank.service';
import { Branch } from '../../../services/bank/domain/bank.models';
import { AccountService } from '../../../services/account/service-api/account.service';
import { Location } from '@angular/common';
import { ApprovalflowService } from '../../../services/approvalflow/service-api/approval.flow.service';
import { Account } from '../../../services/account/domain/account.model';
import { FixedDepositAccountService } from '../../../services/fixed-deposit-account/service-api/fixed.deposit.account.service';
import { RecurringDepositAccountService } from '../../../services/recurring-deposit-account/service-api/recurring.deposit.account.service';
import { VerifierSelectionEvent } from '../../../common/components/verifier-selection/verifier.selection.component';
import * as commandConstants from '../../../common/constants/app.command.constants';
import { AuthService } from 'angular-spa';
import { ApplicationContext } from '../../../application.context';
import { environment } from '../../..';
import { NgSsoService } from '../../../services/security/ngoauth/ngsso.service';
import * as ActivityCodes from '../../../common/constants/app.teller.transaction.activity.codes';
import { AccountNumberFormatter } from '../../../common/components/AccountNumberFormatter/account.number.formatter.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


export const DETAILS_UI: string = "views/teller-transaction/cash-deposit";

@Component({
    selector: 'ababil-cash-deposit',
    templateUrl: './cash.deposit.component.html'
})
export class CashDepositComponent extends AccountNumberFormatter implements OnInit {

    tpErrorCode = ActivityCodes.TELLER_TP_VIOLATION_CODE;
    tr_particulars: SelectItem[] = TransactionParticulars;
    selectedTR_Particulars: string;
    selectedCurrency: string;
    selectedGlMapCode: number;
    glAccount: GlAccount = new GlAccount();
    isOriginatingBranch: boolean;
    isRepondingBranch: boolean;
    currencies: Currency[];
    currencyMap: Map<number, string>;
    accountTypes: any[] = AccountTypes;
    accountSubTypes: SelectItem[] = SubAccountTypes;
    selectedAccountType: string = 'ACCOUNT';
    selectedSubAccountType: string = '';
    amountLCYInWords: string;
    amountCCYInWords: string;
    currencyCode: string;
    cashDepositForm: FormGroup;
    amountInWords: string;
    tellerId: number;
    accountId: number;
    accountNumber: string = '';
    accountNumberWithProductCode: string = '';
    selectedCurrencyChange: Subject<string> = new Subject<string>();
    subglCodechanged: Subject<string> = new Subject<string>();
    accountDetails: Account = new Account();
    local_currency: boolean = false;
    formattedAccountNumber: string;
    teller: Teller = new Teller();
    tellerBalance: TellerBalance = new TellerBalance();
    minDate: Date;
    queryParams: any;
    isBaseCurrency: boolean = true;
    exchangeRateTypes: SelectItem[];
    exchangeRate: ExchangeRate = new ExchangeRate;
    baseCurrency: string;
    foreignCurrency: string;
    selectedGlCurrency: string;
    multiCurrencyGl: boolean = false;
    ibta_Required: boolean = false;
    ibtaTxnParticulars: SelectItem[];
    glCurrencies: SelectItem[];
    ibtaInformation: IbtaInformation = new IbtaInformation();

    accountTxn: boolean = true;
    glTxn: boolean = false;
    subglTxn: boolean = false;

    branches: Branch[];
    tellerLimit: TellerLimit = new TellerLimit();
    showExchangeRate: boolean = false;
    currencyOption = { prefix: '', allowNegative: false, align: 'left', precision: 2 };

    demandDepositDisplay = false;
    fixedDepositDisplay = false;
    recurringDepositdisplay = false;


    demandDepositAccountId: number = null;
    fixedDepositAccountId: number;
    recurringDepositAccountId: number;

    amountMaxLength: number = 28;
    currencyDifferenceChecker: boolean = false;

    availableBalance: number;

    bearerdisplay = false;
    bearerInfo = new BearerInfo();
    extractedBearerInfo = new BearerInfo();
    bearerTransactionChecker = true;

    showVerifierSelectionModal: Observable<boolean> = of(false);
    allowedGls: SelectItem[] = [];
    glAccounts: any[];
    originatingChecker = false;
    currency = '';
    accountName = '';
    cashDeposit: CashReceive = new CashReceive();
    tellerDenominationBalances: any[] = [];

    denominationDisplay = false;
    denominationChecker = true;
    extractedDenominations: any[] = [];
    amountVisible = false;

    denominationStatus = '';
    tellerCurrencyCode = '';
    customerId: number;
    glAccountId: number;

    subglCodeWithCode: string;
    subglCode: string;
    subGlAccountId: number;

    tempPreviousTransactionDenominations: TellerDenominationTransaction[] = [];
    previousTransactionDenominations: TellerDenominationTransaction[] = [];

    branchCode: string = '';
    selectedSubAccountTypeChecker = false;
    transactionTypes: any[] = TransactionTypes;
    transactionType = 'own';
    transactionChecker = true;

    voucherNumber: number;
    key_D = 68;

    userName$: String;
    userActiveBranch$: number;
    userHomeBranch$: number;
    auth: string = environment.auth;
    branchCodeLength: number = 3;
    accountNumberLengthWithProductCode: number = 10;
    SUBGLCodeLength = 13;
    TPViolationConfiguration: string = '';

    activityId = ActivityCodes.TELLER_CASH_RECEIVE_ACTIVITY_CODE;

    @HostListener('window:keydown', ['$event'])
    keyEvent(event: KeyboardEvent) {
        // console.log(event);

        if (event.shiftKey && event.keyCode === this.key_D) {
            console.log(event);
            this.deposit();
        }
        else if (event.shiftKey && event.keyCode === this.key_B) {
            this.cancel();
        }

    }

    @ViewChild('bearerComponent') bearerComponent: any;
    @ViewChild('denominatorComponent') denominatorComponent: any;
    constructor(private bankService: BankService,
        private demandDepositAccountService: DemandDepositAccountService,
        private fixedDepositAccountService: FixedDepositAccountService,
        private recurringDepositAccountService: RecurringDepositAccountService,
        private exchangeRateService: ExchangeRateService,
        private glAccountService: GlAccountService,
        private commonConfigurationService: CommonConfigurationService,
        private notficationService: NotificationService,
        private amountInWordService: AmountInWordsService,
        private currencyService: CurrencyService,
        private tellerService: TellerService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        protected accountService: AccountService,
        protected location: Location,
        protected approvalFlowService: ApprovalflowService,
        protected authService: AuthService,
        protected applicationContext: ApplicationContext,
        private ngSsoService: NgSsoService,
        private confirmationService: ConfirmationService) {
        super(accountService, location, approvalFlowService);
    }

    ngOnInit() {

        if (environment.auth === 'NGSSO') {
            this.ngSsoService.account().subscribe(account => {
                this.userName$ = account.username;
                this.userActiveBranch$ = account.activeBranch;
                this.formatBranchCode(this.userActiveBranch$.toString(), (code) => this.branchCode = code);
                this.userHomeBranch$ = account.homeBranch;
            });
        }

        this.subscribers.fetchBranchCodeLengthSub = this.accountService.fetchBranchCodeLength().subscribe(
            data => {
                this.branchCodeLength = +data;
                this.subscribers.fetchAcoountNumberLength = this.accountService.fetchAccountLengthConfiguration().subscribe(
                    accountLength => {
                        this.accountNumberLengthWithProductCode = (+accountLength) - (+this.branchCodeLength);
                    }
                )
                this.subscribers.fetchSUBGLCodeLengthSub = this.glAccountService.fetchSUBGlCodeLength(SUBGlCodeQueryParam).subscribe(
                    data => this.SUBGLCodeLength = +data.value
                )
            }
        )

        let SUBGlCodeQueryParam = new Map<string, string>();
        SUBGlCodeQueryParam.set('name', 'SUBSIDIARY_LEDGER_CODE_LENGTH');



        this.subscribers.fetchTPViolationConfigurationSub = this.tellerService.fetchTPViolationConfiguration().subscribe(
            data => this.TPViolationConfiguration = data
        );


        this.fetchBaseCurrency();
        this.fetchApplicationDate();
        this.exchangeRateTypes = [];
        this.ibtaTxnParticulars = [];
        this.glCurrencies = [];
        this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
            this.queryParams = queryParams;
            this.isBaseCurrency = this.queryParams['isBaseCurrency'] === "true" ? true : false;
            if (queryParams['taskId']) {
                this.taskId = queryParams['taskId'];
            }
            if (queryParams['commandReference']) {
                this.commandReference = queryParams['commandReference'];
            }

            if (this.isBaseCurrency !== undefined) {
                if (this.taskId && this.commandReference) {
                    this.subscribers.fetchCashDepositSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                        data => {
                            if (data) {
                                // this.fetchExchangeRateTypes();
                                this.cashDeposit = data;
                                this.prepareForm(this.cashDeposit);
                                this.bearerInfo = this.cashDeposit.bearerInfo ? this.cashDeposit.bearerInfo : new BearerInfo();
                            }
                        })
                }

            }
        });


        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.tellerId = +params['tellerId'];
            if (!this.isBaseCurrency) {
                this.fetchTellerDetail(this.tellerId);
            }
        });



        this.selectedCurrencyChange
            .pipe(
                debounceTime(1000),
                distinctUntilChanged()
            )
            .subscribe(model => {
                if (this.teller) {
                    this.tellerLimit = this.teller.tellerLimits.filter(limit => limit.currencyCode === model)[0] ? this.teller.tellerLimits.filter(limit => limit.currencyCode === model)[0] : new TellerLimit();
                    if (!this.isEmpty(this.tellerLimit)) {
                        this.fetchTellerBalance(this.tellerId, model);
                        this.currencyDifferenceChecker = false;
                    }
                    else {
                        this.notficationService.sendErrorMsg("teller.customer.currency.difference.error");
                        this.currencyDifferenceChecker = true;
                    }
                }
            });
        this.fetchExchangeRateTypes();
        this.prepareForm(new CashReceive());
    }

    fetchBaseCurrency() {
        this.subscribers.baseCurrencySub = this.currencyService.fetchBaseCurrency(new Map().set('name', 'base-currency')).subscribe(
            data => {
                this.baseCurrency = data;
                if (this.isBaseCurrency) {
                    this.selectedCurrency = this.baseCurrency;
                    this.fetchTellerDetail(this.tellerId);
                }
            }
        )
    }


    fetchAccountDetails() {
        let urlSearchMap = new Map();
        urlSearchMap.set('accountNumber', this.accountNumber);

        if (this.selectedSubAccountType == "CASA") {
            this.subscribers.fetchDemandDepositAccountSub =
                this.demandDepositAccountService.fetchDemandDepositAccounts(urlSearchMap).subscribe(
                    data => {
                        if (data.content.length == 1) {
                            this.fetchAccountDetailsByType(data.content);

                            if (data.content[0].balance) {
                                this.availableBalance = data.content[0].balance.availableBalance;
                            }
                        }
                        else {
                            this.notficationService.sendErrorMsg('no.deposit.account.found.error');
                        }
                    }
                )
        }
        else if (this.selectedSubAccountType == "MTDR") {
            this.subscribers.fetchFixedDepositAccountSub =
                this.fixedDepositAccountService.fetchFixedDepositAccounts(urlSearchMap).subscribe(
                    data => {
                        if (data.content.length == 1) {
                            this.fetchAccountDetailsByType(data.content);
                            if (data.content[0].fixedDepositAccountBalance) {
                                this.availableBalance = data.content[0].fixedDepositAccountBalance.balance;
                            }
                        }
                        else {
                            this.notficationService.sendErrorMsg('no.fixed.account.found.error');
                        }
                    }
                )
        }
        else if (this.selectedSubAccountType == "SSP") {
            this.subscribers.fetchRecurringDepositAccountSub =
                this.recurringDepositAccountService.fetchRecurringDepositAccounts(urlSearchMap).subscribe(
                    data => {
                        if (data.content.length == 1) {
                            this.fetchAccountDetailsByType(data.content);
                            if (data.content[0].recurringDepositAccountBalance) {
                                this.availableBalance = data.content[0].recurringDepositAccountBalance.balance;
                            }
                        }
                        else {
                            this.notficationService.sendErrorMsg('no.recurring.account.found.error');
                        }
                    }
                )
        }
    }
    fetchAccountDetailsByType(data) {
        if (data.length > 0) {
            this.accountDetails = data[0];
            this.accountName = this.accountDetails.name;
            // this.customerId = this.accountDetails.customerId;
            this.selectedCurrency = this.accountDetails.currencyCode;
            this.currency = this.selectedCurrency;
            if (this.selectedCurrency !== this.baseCurrency) {
                this.showExchangeRate = true;
                if (!this.taskId) {
                    this.cashDepositForm.get('exchangeRateTypeId').setValue(null);
                    this.cashDepositForm.get('exchangeRate').setValue(null);
                }
            }
            else {
                this.showExchangeRate = false;
            }
            this.selectedCurrencyChange.next(this.selectedCurrency);
            this.cashDepositForm.get('transactionCurrencyCode').setValue(this.accountDetails.currencyCode);
        } else {
            this.accountDetails = new Account();
        }
        this.currencyOption.precision = this.selectedCurrency == "BDT" ? 2 : 4;
        this.amountMaxLength = this.selectedCurrency == "BDT" ? 28 : 27;
        if (!this.taskId) {
            this.cashDepositForm.controls.amountCcy.reset();
            this.amountCCYInWords = '';
            this.cashDepositForm.controls.amountLcy.reset();
            this.amountLCYInWords = '';
        }

        if (this.ibta_Required) {
            this.cashDepositForm.removeControl('adviceNumber');
            this.cashDepositForm.removeControl('ibtaTrCode');
            this.cashDepositForm.removeControl('originatingBranchId');
            this.cashDepositForm.removeControl('respondingBranchId');
            this.cashDepositForm.removeControl('originatingDate');
            this.cashDepositForm.updateValueAndValidity();
        }
    }






    fetchGlAccount(data) {
        // this.subscribers.glAccountFetchSub = this.glAccountService.
        //     fetchGlAccounts(new Map([["roots", "false"], ["code", this.selectedGlMapCode], ["aspage", "false"]]))
        //     .subscribe(data => {
        this.glAccount = data;
        this.accountName = this.glAccount.name;
        if (this.glAccount.currencyRestriction === "LOCAL_CURRENCY") {
            this.selectedCurrency = this.baseCurrency;
            this.currency = this.selectedCurrency;
            this.cashDepositForm.get('transactionCurrencyCode').setValue(this.baseCurrency);
            this.multiCurrencyGl = false;
            this.showExchangeRate = false;
        }
        if (this.glAccount.currencyRestriction !== "LOCAL_CURRENCY") {
            this.multiCurrencyGl = true;
            if (this.glAccount.currencies.length < 2) {
                this.cashDepositForm.get('transactionCurrencyCode').setValue(this.glAccount.currencies[0]);
                this.selectedCurrency = this.glAccount.currencies[0];
                this.currency = this.selectedCurrency;
                if (this.selectedCurrency !== this.baseCurrency) {
                    this.showExchangeRate = true;
                    if (!this.taskId) {
                        this.cashDepositForm.get('exchangeRateTypeId').setValue(null);
                        this.cashDepositForm.get('exchangeRate').setValue(null);
                    }
                }
            }
            this.glCurrencies.push({ label: "Choose", value: null });
            this.glAccount.currencies.forEach(currency => this.glCurrencies.push({ label: currency, value: currency }));
        }
        this.selectedCurrencyChange.next(this.selectedCurrency);
        if (this.glAccount.isIbtaRequired) {
            this.ibta_Required = true;
            this.fetchIbtaTxnParticulars();
            this.fetchBranches();

            this.cashDepositForm.addControl('adviceNumber', new FormControl('', Validators.required));

            this.cashDepositForm.addControl('ibtaTrCode', new FormControl('', Validators.required));
            if (!this.taskId) {
                this.cashDepositForm.addControl('originatingBranchId', new FormControl('', Validators.required));
            }
            this.cashDepositForm.addControl('respondingBranchId', new FormControl('', Validators.required));
            this.cashDepositForm.addControl('originatingDate', new FormControl('', Validators.required));
            this.cashDepositForm.updateValueAndValidity();
        }

        else {
            if (!this.taskId) {
                this.ibta_Required = false;
                this.cashDepositForm.removeControl('adviceNumber');
                this.cashDepositForm.removeControl('ibtaTrCode');
                this.cashDepositForm.removeControl('originatingBranchId');
                this.cashDepositForm.removeControl('respondingBranchId');
                this.cashDepositForm.removeControl('originatingDate');
                this.cashDepositForm.updateValueAndValidity();
            }
        }
        //         });
        // }
    }


    prepareForm(formData: CashReceive) {
        if (!formData) formData = new CashReceive();
        if (!formData.ibtaInformation) formData.ibtaInformation = new IbtaInformation();
        if (formData.globalTxnNumber) {
            this.voucherNumber = formData.globalTxnNumber;
        }
        if (formData.tellerDenominationTransactions) {
            this.extractedDenominations = formData.tellerDenominationTransactions;
        }
        if (formData.transactionCreditAccountType && (formData.transactionCreditAccountType == 'CASA' || formData.transactionCreditAccountType == 'SSP' || formData.transactionCreditAccountType == 'MTDR')) {
            this.accountTxn = true;
            this.glTxn = false;
            this.subglTxn = false;
            this.selectedSubAccountType = formData.transactionCreditAccountType;
            this.selectedAccountType = 'ACCOUNT';
            this.subscribers.fetchAccountDetailsSub = this.accountService.fetchAccountDetails({ accountId: formData.accountId }).subscribe(
                data => {
                    this.accountNumber = data.number;
                    this.accountNumberWithProductCode = this.accountNumber.substring(3, this.accountNumber.length);
                    if (this.accountNumber.substring(0, this.branchCodeLength) == this.userActiveBranch$.toString()) {
                        this.transactionType = 'own';
                        this.formatBranchCode(this.userActiveBranch$.toString(), (code) => this.branchCode = code);
                    }
                    else {
                        this.transactionType = 'inter';
                        this.formatBranchCode(this.accountNumber.substring(0, this.branchCodeLength), (code) => this.branchCode = code);
                    }
                    this.fetchAccountDetails();
                }
            )
        }
        else if (formData.transactionCreditAccountType && formData.transactionCreditAccountType == 'GL') {
            this.accountTxn = false;
            this.glTxn = true;
            this.subglTxn = false;
            // this.selectedGlMapCode = formData. ;
            this.selectedAccountType = 'GL';
            this.glAccountId = formData.accountId;
            this.fetchAllowedGls();
        }
        else if (formData.transactionCreditAccountType && formData.transactionCreditAccountType == 'SUBGL') {
            this.accountTxn = false;
            this.subglTxn = true;
            this.glTxn = false;
            this.selectedAccountType = 'SUBGL';

            this.glAccountService.fetchSubGlDetails({ subsidiaryLedgerId: formData.accountId }).subscribe(
                data => {
                    this.subGlAccountId = data.id;
                    this.accountName = data.name;
                    this.currency = data.currencyCode;
                    this.availableBalance = data.balance;
                    this.selectedCurrency = data.currencyCode;
                    this.selectedCurrencyChange.next(this.selectedCurrency);
                    this.subglCode = data.code;
                    this.subglCodeWithCode = this.subglCode.substring(this.branchCodeLength, this.subglCode.length);
                    this.cashDepositForm.controls.transactionCurrencyCode.setValue(this.selectedCurrency);
                    if (this.selectedCurrency != this.baseCurrency) {
                        this.showExchangeRate = true;
                    }
                    else {
                        this.showExchangeRate = false;
                    }
                }
            )

        }
        if (this.teller.denominationRequired && formData.tellerDenominationTransactions.length > 0) {
            this.tempPreviousTransactionDenominations = formData.tellerDenominationTransactions;
        }
        this.cashDepositForm = this.formBuilder.group({
            exchangeRate: [formData.exchangeRate],
            exchangeRateTypeId: [formData.exchangeRateTypeId],
            amountLcy: [formData.amountLcy],
            amountCcy: [formData.amountCcy, [Validators.required]],
            narration: [formData.narration, [Validators.required]],
            transactionCreditAccountType: [formData.transactionCreditAccountType],
            transactionDebitAccountType: [formData.transactionDebitAccountType],
            transactionCurrencyCode: [formData.transactionCurrencyCode],
            valueDate: [formData.valueDate, [Validators.required]],
            transactionDate: [formData.transactionDate],
            originatingBranchId: [formData.ibtaInformation.originatingBranchId],
            respondingBranchId: [formData.ibtaInformation.respondingBranchId],
            originating: [formData.ibtaInformation.originating],
            ibtaTrCode: [formData.ibtaInformation.ibtaTrCode],
            adviceNumber: [formData.ibtaInformation.adviceNumber],
            originatingDate: [formData.ibtaInformation.originatingDate == null ? null : new Date(formData.ibtaInformation.originatingDate)],
            bearerTransaction: [formData.bearerTransaction],
            sourceOfFund: [formData.sourceOfFund],
            ignoreTpViolationCheck: [''],

        });



        if (this.glAccount.isIbtaRequired && formData.ibtaInformation) {
            if (formData.ibtaInformation.originating) {
                this.fetchAdviceNumber();
                this.originatingChecker = true;
                this.cashDepositForm.removeControl('originatingBranchId');
                this.cashDepositForm.updateValueAndValidity();
            }
            else {
                this.originatingChecker = false;
                this.cashDepositForm.controls.adviceNumber.reset();
                // this.cashDepositForm.get('originatingBranchId').setValidators([Validators.required]);
                this.cashDepositForm.addControl('originatingBranchId', new FormControl('', [Validators.required]));
                this.cashDepositForm.updateValueAndValidity();
            }
        }


        this.cashDepositForm.controls.originating.valueChanges.subscribe(
            data => {
                if (data == true) {
                    this.fetchAdviceNumber();
                    this.originatingChecker = true;
                    this.cashDepositForm.removeControl('originatingBranchId');
                    this.cashDepositForm.updateValueAndValidity();
                }
                else if (data == false) {
                    this.originatingChecker = false;
                    if (this.cashDepositForm.controls.adviceNumber) {
                        this.cashDepositForm.controls.adviceNumber.setValue(null);
                    }
                    this.cashDepositForm.addControl('originatingBranchId', new FormControl('', [Validators.required]));
                    this.cashDepositForm.updateValueAndValidity();
                }
            }
        )

        if (this.cashDepositForm.controls.amountCcy.value) {
            let amount = this.cashDepositForm.get('amountCcy').value;
            this.amountCCYInWords = this.amountInWordService.convertAmountToWords(amount, this.selectedCurrency || null);
        }

        if (this.cashDepositForm.controls.amountLcy.value) {
            let amount = this.cashDepositForm.get('amountLcy').value;
            this.amountLCYInWords = this.amountInWordService.convertAmountToWords(amount, this.selectedCurrency || null);
        }



        this.cashDepositForm.get('amountCcy').valueChanges.subscribe(val => {
            let amount = this.cashDepositForm.get('amountCcy').value;
            this.amountCCYInWords = this.amountInWordService.convertAmountToWords(amount, this.selectedCurrency || null);
            this.cashDepositForm.get('amountLcy').setValue(amount * this.cashDepositForm.get('exchangeRate').value);
        });

        this.cashDepositForm.get('amountLcy').valueChanges.subscribe(value => {
            let amount = this.cashDepositForm.get('amountLcy').value;
            this.amountLCYInWords = this.amountInWordService.convertAmountToWords(amount, null);
        });

        // if (this.cashDepositForm.controls.exchangeRateTypeId.value) {
        if ((this.cashDepositForm.get('transactionCurrencyCode').value !== null) && (this.cashDepositForm.get('transactionCurrencyCode').value !== this.baseCurrency) && (this.cashDepositForm.get('exchangeRateTypeId').value)) {
            this.fetchExchangeRateByCurrencyCode(this.cashDepositForm.get('exchangeRateTypeId').value, this.cashDepositForm.get('transactionCurrencyCode').value);
        }
        // }

        this.cashDepositForm.get('exchangeRateTypeId').valueChanges.subscribe(
            value => {
                if ((this.cashDepositForm.get('transactionCurrencyCode').value !== null) && (this.cashDepositForm.get('transactionCurrencyCode').value !== this.baseCurrency) && (this.cashDepositForm.get('exchangeRateTypeId').value)) {
                    this.fetchExchangeRateByCurrencyCode(this.cashDepositForm.get('exchangeRateTypeId').value, this.cashDepositForm.get('transactionCurrencyCode').value);
                }
            }
        );
        this.cashDepositForm.get('exchangeRate').valueChanges.subscribe(
            value => {
                this.cashDepositForm.get('amountLcy').setValue(this.cashDepositForm.get('amountCcy').value * this.cashDepositForm.get('exchangeRate').value);
            });

        this.cashDepositForm.get('transactionCurrencyCode').valueChanges.subscribe(
            value => {

                if (value) {
                    let currency = this.cashDepositForm.get('transactionCurrencyCode').value;
                    if (currency === this.baseCurrency) {
                        this.cashDepositForm.get('exchangeRateTypeId').setValue(1);
                        this.cashDepositForm.get('exchangeRate').setValue(1);
                    }
                    if (currency !== this.baseCurrency) {
                        if (this.cashDepositForm.get('exchangeRateTypeId').value) {
                            this.fetchExchangeRateByCurrencyCode(this.cashDepositForm.get('exchangeRateTypeId').value, currency);
                        }
                    }
                }
            }


        );


        this.cashDepositForm.get('valueDate').valueChanges.subscribe(
            value => {
                if (!value) {
                    this.cashDepositForm.get('valueDate').setValue(new Date());
                    this.cashDepositForm.get('valueDate').updateValueAndValidity();
                }
            });

        if (this.cashDepositForm.controls.bearerTransaction.value) {
            this.bearerTransactionChecker = false;
        }
        else {
            this.bearerTransactionChecker = true;
        }

        this.cashDepositForm.controls.bearerTransaction.valueChanges.subscribe(
            data => {
                if (this.cashDepositForm.controls.bearerTransaction.value) {
                    this.bearerTransactionChecker = false;
                }
                else {
                    this.bearerTransactionChecker = true;
                }
            }
        )
    }

    ngDoCheck() {
        if ((this.selectedAccountType === "ACCOUNT")) {
            this.cashDepositForm.get('transactionDebitAccountType').setValue("TELLER");
            this.cashDepositForm.get('transactionCreditAccountType').setValue(this.selectedSubAccountType);
        }
        if ((this.selectedAccountType === "GL")) {
            this.cashDepositForm.get('transactionDebitAccountType').setValue("TELLER");
            this.cashDepositForm.get('transactionCreditAccountType').setValue("GL");
        }
        if ((this.selectedAccountType === "SUBGL")) {
            this.cashDepositForm.get('transactionDebitAccountType').setValue("TELLER");
            this.cashDepositForm.get('transactionCreditAccountType').setValue("SUBGL");
        }
        if ((this.selectedAccountType === "GL")) {
            this.glTxn = true;
            this.accountTxn = false;
            this.subglTxn = false;
            this.selectedSubAccountType = '';
        }
        if ((this.selectedAccountType === "ACCOUNT")) {
            this.glTxn = false;
            this.accountTxn = true;
            this.subglTxn = false;
            this.selectedGlMapCode = -1;
        }
        if ((this.selectedAccountType === "SUBGL")) {
            this.glTxn = false;
            this.accountTxn = false;
            this.subglTxn = true;
            this.selectedGlMapCode = -1;
        }

    }

    fetchSUBGLAccountfeDetails() {
        let queryParam = new Map<string, string>();
        queryParam.set('subGlCode', this.subglCode);
        this.glAccountService.fetchSUBGLdetailsByCode(queryParam).subscribe(
            data => {
                this.subGlAccountId = data.content[0].id;
                this.accountName = data.content[0].name;
                this.currency = data.content[0].currencyCode;
                this.selectedCurrency = data.content[0].currencyCode;
                this.selectedCurrencyChange.next(this.selectedCurrency);
                this.availableBalance = data.content[0].balance;
                // if (this.currency != this.tellerLimit.currencyCode) {
                //     this.currencyDifferenceChecker = true;
                //     this.notficationService.sendErrorMsg("teller.customer.currency.difference.error");
                // }
                this.cashDepositForm.controls.transactionCurrencyCode.setValue(this.selectedCurrency);
                if (this.selectedCurrency != this.baseCurrency) {
                    this.showExchangeRate = true;
                }
                else {
                    this.showExchangeRate = false;
                }
            }
        )
    }


    fetchAllowedGls() {
        if (this.allowedGls.length == 0) {

            this.subscribers.fetchAllowedGlbyActivityIdSub = this.tellerService.fetchAllowedGlbyActivityId(new Map<string, string>().set('activity-id', this.activityId.toString())).subscribe(
                data => {
                    this.allowedGls = [];
                    this.glAccounts = data;
                    this.allowedGls.push({ label: 'Choose a GL', value: null });
                    data.map(
                        gl => {
                            this.allowedGls.push({ label: gl.generalLedgerAccount.name, value: +(this.allowedGls.length - 1) });
                        }
                    )
                    if (this.taskId) {
                        this.selectedGlMapCode = data.indexOf(data.filter(account => this.glAccountId == account.generalLedgerAccount.id)[0]);
                        if (this.selectedGlMapCode >= 0) {
                            this.fetchGlAccount(this.glAccounts[this.selectedGlMapCode].generalLedgerAccount);
                        }
                    }
                }
            )
        }
    }


    onAccountTypeChange() {
        this.accountName = '';
        this.currency = '';
        this.availableBalance = null;
        this.ibta_Required = false;
        this.cashDepositForm.removeControl('adviceNumber');
        this.cashDepositForm.removeControl('ibtaTrCode');
        this.cashDepositForm.removeControl('originatingBranchId');
        this.cashDepositForm.removeControl('respondingBranchId');
        this.cashDepositForm.removeControl('originatingDate');



        if (this.selectedAccountType == "ACCOUNT") {
            this.selectedGlMapCode = null;
            this.subglCodeWithCode = null;
        }
        else if (this.selectedAccountType == "GL") {
            this.selectedSubAccountType = '';
            this.subglCodeWithCode = null;
            this.fetchAllowedGls();
        }
        else if (this.selectedAccountType == "SUBGL") {
            this.selectedSubAccountType = '';
            this.selectedGlMapCode = null;
        }


    }


    // onAccountNumberChange(accNumber: string) {
    //     if (this.accountNumber != '') {
    //         if (this.branchCode != '') {
    //             this.formatAccountNumberWithBranchCode(this.branchCode, accNumber)
    //             this.accountNumberChanged.next(this.formatAccountNumberWithBranchCode(this.branchCode, accNumber));
    //         }
    //     }
    //     // if (this.selectedGlMapCode != '') {
    //     //     this.accountNumberChanged.next(accNumber);
    //     // }
    // }

    formatAccountNumberToShow() {
        if (!this.selectedSubAccountType) {
            this.selectedSubAccountTypeChecker = true;
        }
        else {
            if (this.accountNumberWithProductCode && this.accountNumberWithProductCode != '') {
                if (this.branchCode != '') {
                    // this.formatAccountNumberWithBranchCode(this.branchCode, this.accountNumberWithProductCode)
                    // this.accountNumberChanged.next();
                    this.formatAccountNumberWithBranchCode(this.branchCode, this.accountNumberWithProductCode, this.accountNumberLengthWithProductCode, (formattedAccountNumber) => {
                        this.accountNumber = formattedAccountNumber;
                        this.availableBalance = null;
                        this.currency = '';
                        this.accountName = '';
                        this.fetchAccountDetails();
                    });
                }
                this.formattedAccountNumberWithProductCode(this.accountNumberWithProductCode, this.accountNumberLengthWithProductCode, (code) => this.accountNumberWithProductCode = code);
            }
        }
    }
    formatBranchCodeToShow() {
        if (this.branchCode != '' && this.transactionType == 'inter') {
            this.formatBranchCode(this.branchCode, (code) => this.branchCode = code);
            if (this.accountNumberWithProductCode != '') {
                this.formatAccountNumberToShow();
            }
        }
    }

    //SUBGL CODE FORMATTING
    formatSUBGLCodeToShow() {

        if (this.subglCodeWithCode && this.subglCodeWithCode != '') {
            if (this.branchCode != '') {
                this.subglCode = this.formatSUBGLCodeWithBranchCode(this.branchCode, this.subglCodeWithCode, (+this.SUBGLCodeLength - (+this.branchCodeLength)))
                this.availableBalance = null;
                this.currency = '';
                this.accountName = '';
                this.fetchSUBGLAccountfeDetails();
                ;
            }
            this.subglCodeWithCode = this.formattedSUBGLCodeWithProductCode(this.subglCodeWithCode, (+this.SUBGLCodeLength - (+this.branchCodeLength)));
        }


        this.subglCodeWithCode = this.formattedSUBGLCodeWithProductCode(this.subglCodeWithCode, (+this.SUBGLCodeLength - (+this.branchCodeLength)));

    }


    onGLCodeChange() {

        if (this.selectedGlMapCode >= 0) {
            this.fetchGlAccount(this.glAccounts[this.selectedGlMapCode].generalLedgerAccount);
        }
    }

    // onSubGLChange(subglNumber: string) {
    //     this.subglCode = subglNumber;
    //     this.availableBalance = null;
    //     this.currency = '';
    //     this.accountName = '';
    //     this.fetchSUBGLAccountfeDetails();
    // }


    onSelectedCurrencyChange(selectedCurrency: string) {
        this.cashDepositForm.get('transactionCurrencyCode').setValue(selectedCurrency);
        this.selectedCurrencyChange.next(selectedCurrency);
    }

    fetchTellerDetail(tellerId: number) {
        this.subscribers.fetchSub = this.tellerService.fetchTellerById({ id: tellerId }).subscribe(
            tellerDetail => {
                this.teller = tellerDetail;

                // if (this.teller.allowedClientTransaction == false) {
                //     this.accountTypes.splice(0, 1);
                //     this.selectedAccountType = 'GL';
                //     this.glTxn = true;
                //     this.accountTxn = false;
                //     this.subglTxn = false; 
                //     this.fetchAllowedGls();
                // }
                if (this.teller.denominationRequired) { this.amountVisible = true; this.denominationChecker = false; } else { this.amountVisible = false; this.denominationChecker = true; }
                if (this.isBaseCurrency) {
                    this.fetchTellerBalance(tellerId, this.selectedCurrency);
                }
            });
    }

    fetchTellerBalance(tellerId: number, currencyCode: string) {
        this.subscribers.fetchBal = this.tellerService.fetchBalanceByTellerIdAndCurrencyCode({
            tellerId: tellerId, currencyCode: currencyCode
        }).subscribe(
            tellerBalance => {
                this.tellerBalance = tellerBalance;
                if (tellerBalance.tellerDenominationBalances) {
                    this.tellerDenominationBalances = [];
                    this.tellerDenominationBalances = tellerBalance.tellerDenominationBalances;
                    if (this.taskId) {
                        this.previousTransactionDenominations = this.tempPreviousTransactionDenominations;
                    }
                    this.denominationStatus = 'DEBIT';
                    this.tellerCurrencyCode = tellerBalance.currencyCode;

                }
            }
        );
    }

    private fetchExchangeRateTypes() {
        this.exchangeRateTypes.push({ label: "Select exchange type", value: null });
        this.subscribers.fetchExchangeRateTypesSub = this.exchangeRateService.fetchExchangeRateTypes().subscribe(
            data => {
                (data.content).forEach(element => {
                    this.exchangeRateTypes.push({ label: element.typeName, value: element.id });
                });
            }
        )
    }

    private fetchExchangeRateByCurrencyCode(rateTypeId: number, currencyCode: string) {
        this.subscribers.fetcExchangeRatesByCurrencyCodeSub = this.exchangeRateService.fetcExchangeRatesByCurrencyCode({ rateTypeId: rateTypeId, currencyCode: currencyCode }).subscribe(
            exchangeRate => {
                this.exchangeRate.rate = exchangeRate.rate;
                this.cashDepositForm.get('exchangeRate').setValue(exchangeRate.rate);
            }
        );
    }

    fetchApplicationDate() {
        let urlSearchParam = new Map();
        urlSearchParam.set("name", "application-date");
        this.subscribers.fetchApplicationDateSub = this.commonConfigurationService.fetchApplicationDate(urlSearchParam).subscribe(
            data => {
                this.minDate = new Date(data);
                this.cashDepositForm.get('valueDate').setValue(new Date(data));
                this.cashDepositForm.get('transactionDate').setValue(new Date(data));
                this.cashDepositForm.get('originatingDate').setValue(new Date(data));
            }
        );
    }

    fetchIbtaTxnParticulars() {
        this.ibtaTxnParticulars.push({ label: "Choose", value: null });
        this.subscribers.fetchIbtaTxnParticularsSub = this.tellerService.fetchIbtaTxnParticulars().subscribe(
            data => {
                (data.content).forEach(element => {
                    this.ibtaTxnParticulars.push({ label: element.particulars, value: element.code });
                });
            }
        );
    }

    fetchAdviceNumber() {
        let adviceNumberUrl = new Map<string, string>();
        adviceNumberUrl.set('branchId', this.branchCode);
        adviceNumberUrl.set('userId', this.userName$.toString());
        this.subscribers.fetchAdviceNumberSub = this.tellerService.fetchAdviceNumber(adviceNumberUrl).subscribe(
            data => {
                this.cashDepositForm.controls.adviceNumber.setValue(data);
            }
        )
    }

    onAdviceNumberChange(data) {
        this.subscribers.fetchDEtailbyAdviceNumberSub =
            this.tellerService.fetchDetailsByAdviceNumber({ 'advice-number': data }).subscribe(
                data => {
                    this.cashDepositForm.controls.originatingBranchId = data.originatingBranchId;
                    this.cashDepositForm.controls.respondingBranchId = data.respondingBranchId;
                    this.cashDepositForm.controls.ibtaTrCode = data.ibtaTrCode;
                }
            )
    }


    markAsTouched(cashDepositForm: FormGroup) {
        this.markFormGroupAsTouched(cashDepositForm);
    }

    formInvalid() {
        if (!this.cashDepositForm) return true;
        return (
            this.cashDepositForm.invalid || this.selectedAccountType == '' ||
            (this.selectedAccountType == "ACCOUNT" && this.selectedSubAccountType == '') ||
            (this.selectedAccountType == "ACCOUNT" && this.selectedSubAccountType != '' && this.accountNumberWithProductCode == '') ||
            isNaN(this.cashDepositForm.get('amountCcy').value) || this.currencyDifferenceChecker ||
            (this.cashDepositForm.controls.bearerTransaction.value == true && this.bearerComponent.formInvalid()));
    }

    loadAllCurrencies() {
        this.subscribers.fetchCurrenciesSub = this.currencyService.fetchCurrencies(new Map()).subscribe(
            data => {
                this.currencies = data.content;
                this.currencyMap = new Map();
                this.currencies.forEach(element => {
                    this.currencyMap.set(element.id, element.name);
                });
            }
        );
    }

    fetchBranches() {
        this.subscribers.fetchOwnBranchesSub = this.bankService.fetchOwnBranches(new Map()).subscribe(
            data => {
                this.branches = data.content;
            });
    }

    showAccountDetail() {
        if (this.accountNumber) {
            let accountQueryParams = new Map<string, string>().set('accountNumber', this.accountNumber);
            this.subscribers.fetchAccountDetailSub = this.accountService.fetchAccounts(accountQueryParams).subscribe(
                account => {
                    if (account.content.length == 1) {
                        if (account.content[0].type) {
                            if (account.content[0].type == "DEMAND_DEPOSIT") {
                                this.demandDepositAccountId = account.content[0].id;
                                this.customerId = account.content[0].customerId;
                                if (this.demandDepositAccountId) {
                                    this.demandDepositDisplay = true;
                                }
                            }

                            else if (account.content[0].type == "FIXED_DEPOSIT") {
                                this.fixedDepositAccountId = account.content[0].id;
                                if (this.fixedDepositAccountId) {
                                    this.fixedDepositDisplay = true;
                                }
                            }

                            else if (account.content[0].type == "RECURRING_DEPOSIT") {
                                this.recurringDepositAccountId = account.content[0].id;
                                if (this.recurringDepositAccountId) {
                                    this.recurringDepositdisplay = true;
                                }
                            }
                        }
                    }
                }
            )
        }
    }

    onAccountSubTypeChange() {
        this.selectedSubAccountTypeChecker = false;
        this.accountNumberWithProductCode = '';
        if (this.accountNumberWithProductCode != '') {
            this.fetchAccountDetails();
        }
    }

    onTransactionTypeChange() {
        if (this.transactionType == 'own') {
            this.transactionChecker = true;
            this.formatBranchCode(this.userActiveBranch$.toString(), (code) => this.branchCode = code);
        }
        else if (this.transactionType == 'inter') {
            this.transactionChecker = false;
            // this.branchCode = '';
        }
        this.accountName = '';
        this.accountNumberWithProductCode = '';
        this.currency = '';
        this.availableBalance = null;
        this.subglCodeWithCode = '';
    }

    showDenomination() {
        this.denominationDisplay = true;
        this.denominatorComponent.clearBalance();
    }

    saveDenomination() {
        this.extractedDenominations = this.denominatorComponent.extractData();
        let amountCCYfromDenomination = this.denominatorComponent.extractTotal();
        this.cashDepositForm.controls.amountCcy.setValue(amountCCYfromDenomination);
        this.closeDenomination();
    }

    closeDenomination() {
        this.denominationDisplay = false;;
    }


    showBearerInfo() {
        this.bearerdisplay = true;
    }

    saveBearer() {
        this.extractedBearerInfo = this.bearerComponent.extractData();
        if (!this.bearerComponent.formInvalid()) this.bearerdisplay = false;
    }

    cancelBearer() {
        this.bearerdisplay = false;
    }

    onVerifierSelect(event: VerifierSelectionEvent) {


        let view_ui = DETAILS_UI + `;tellerId=${this.tellerId}?isBaseCurrency=${this.isBaseCurrency}&`
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));

        let cashRecieve: CashReceive = this.cashDepositForm.value;
        if (this.teller.denominationRequired && this.extractedDenominations.length > 0) {
            cashRecieve.tellerDenominationTransactions = this.extractedDenominations;
        }
        if (this.ibta_Required) {
            cashRecieve.ibtaInformation = this.ibtaInformation;
        }
        cashRecieve.tellerId = this.tellerId;
        cashRecieve.accountId = this.accountDetails.id || this.glAccount.id || this.subGlAccountId;
        cashRecieve.activityId = this.activityId;
        if (this.selectedAccountType == "GL" && this.ibta_Required) {
            if (cashRecieve.ibtaInformation) {
                cashRecieve.ibtaInformation.adviceNumber = this.cashDepositForm.controls.adviceNumber.value;
                cashRecieve.ibtaInformation.ibtaTrCode = this.cashDepositForm.controls.ibtaTrCode.value;
                cashRecieve.ibtaInformation.originating = this.cashDepositForm.controls.originating.value;
                if (!this.cashDepositForm.controls.originating.value) {
                    cashRecieve.ibtaInformation.originatingBranchId = this.cashDepositForm.controls.originatingBranchId.value;
                }
                cashRecieve.ibtaInformation.respondingBranchId = this.cashDepositForm.controls.respondingBranchId.value;
                cashRecieve.ibtaInformation.originatingDate = this.cashDepositForm.controls.originatingDate.value;
            }
        }
        if (this.cashDepositForm.controls.bearerTransaction.value == true) {
            cashRecieve.bearerInfo = this.extractedBearerInfo;
        }
        let globalTxnQueryParam = new Map<string, string>();


        if (this.taskId) {
            cashRecieve.globalTxnNumber = this.voucherNumber;
            this.subscribers.createProfitRateSubs = this.tellerService.cashRecieve(cashRecieve, urlSearchParams)
                .subscribe(
                    data => {
                        if (!event.approvalFlowRequired) {
                            this.notficationService.sendSuccessMsg("teller.cash.receive.success", { voucher: cashRecieve.globalTxnNumber });
                        }
                        else if (event.approvalFlowRequired && ((+this.cashDepositForm.controls.amountCcy.value) < (this.tellerLimit.cashReceiveLimit)))
                            this.notficationService.sendSuccessMsg("teller.cash.receive.success", { voucher: cashRecieve.globalTxnNumber });
                        else if (event.approvalFlowRequired && ((+this.cashDepositForm.controls.amountCcy.value) > (this.tellerLimit.cashReceiveLimit))) {
                            this.notficationService.sendSuccessMsg("workflow.task.verify.send");
                        }

                        if (this.taskId) {
                            this.router.navigate(['/approval-flow/pendingtasks']);
                        }
                        else {
                            this.cashDepositForm.reset();
                            this.accountName = '';
                            this.currency = '';
                            this.availableBalance = null;
                            this.selectedSubAccountType = '';
                            this.selectedGlMapCode = -1;
                            this.subglCodeWithCode = '';
                            this.accountNumberWithProductCode = '';
                            this.denominatorComponent.clearBalance();
                            this.fetchTellerDetail(this.tellerId);
                            // this.fetchTellerBalance(this.tellerId, this.selectedCurrency);
                            this.previousTransactionDenominations = [];
                        }
                    },
                    error => {
                        if (this.TPViolationConfiguration == 'DECISION' && JSON.parse(error._body)['code'] == this.tpErrorCode) {
                            this.confirmationService.confirm({
                                message: 'Are you sure that you want to perform this action?',
                                accept: () => {
                                    this.cashDepositForm.controls.ignoreTpViolationCheck.setValue(true);
                                    this.deposit();
                                }
                            });
                        }
                    });
        }

        else {
            globalTxnQueryParam.set('userId', this.userName$.toString());
            globalTxnQueryParam.set('activityId', this.activityId.toString());
            this.subscribers.fetchGlobalTxnNoSub = this.tellerService.fetchGlobalTxnNo(globalTxnQueryParam).subscribe(
                data => {
                    cashRecieve.globalTxnNumber = data;
                    this.subscribers.createProfitRateSubs = this.tellerService.cashRecieve(cashRecieve, urlSearchParams)
                        .subscribe(
                            data => {
                                if (!event.approvalFlowRequired) {
                                    this.notficationService.sendSuccessMsg("teller.cash.receive.success", { voucher: cashRecieve.globalTxnNumber });
                                }
                                else if (event.approvalFlowRequired && ((+this.cashDepositForm.controls.amountCcy.value) < (this.tellerLimit.cashReceiveLimit)))
                                    this.notficationService.sendSuccessMsg("teller.cash.receive.success", { voucher: cashRecieve.globalTxnNumber });
                                else if (event.approvalFlowRequired && ((+this.cashDepositForm.controls.amountCcy.value) > (this.tellerLimit.cashReceiveLimit))) {
                                    this.notficationService.sendSuccessMsg("workflow.task.verify.send");
                                }

                                if (this.taskId) {
                                    this.router.navigate(['/approval-flow/pendingtasks']);
                                }
                                else {
                                    this.cashDepositForm.reset();
                                    this.accountName = '';
                                    this.currency = '';
                                    this.availableBalance = null;
                                    this.selectedSubAccountType = '';
                                    this.selectedGlMapCode = -1;
                                    this.subglCodeWithCode = '';
                                    this.accountNumberWithProductCode = '';
                                    this.denominatorComponent.clearBalance();
                                    this.fetchTellerDetail(this.tellerId);
                                    // this.fetchTellerBalance(this.tellerId, this.selectedCurrency);
                                    this.previousTransactionDenominations = [];
                                }
                            },
                            error => {
                                if (this.TPViolationConfiguration == 'DECISION' && JSON.parse(error._body)['code'] == this.tpErrorCode) {
                                    this.confirmationService.confirm({
                                        message: 'Are you sure that you want to perform this transaction?',
                                        accept: () => {
                                            this.cashDepositForm.controls.ignoreTpViolationCheck.setValue(true);
                                            this.deposit();
                                        }
                                    });
                                }
                            });
                }
            );
        }
        // }
    }



    deposit() {
        this.markAsTouched(this.cashDepositForm);
        if (this.currencyDifferenceChecker) { this.notficationService.sendErrorMsg("teller.customer.currency.difference.error"); }
        if (this.formInvalid()) return;
        if (!this.formInvalid()) {
            this.command = commandConstants.TELLER_TRANSACTION_CASH_RECEIVE_COMMAND;
            this.showVerifierSelectionModal = of(true);
        }

    }

    cancel() {
        this.navigateAway();
    }

    navigateAway() {
        this.router.navigate(['../'], { relativeTo: this.route, queryParams: { tellerId: this.tellerId } });
    }

}
