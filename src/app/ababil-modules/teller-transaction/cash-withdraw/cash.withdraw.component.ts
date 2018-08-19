import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { TellerService } from '../../../services/teller/service-api/teller.service';
import { CurrencyService } from '../../../services/currency/service-api/currency.service';
import { AmountInWordsService } from '../../../common/services/amount.in.words.service';
import { Subject, Observable, of } from 'rxjs';
import { DemandDepositAccountService } from '../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { NotificationService } from '../../../common/notification/notification.service';
import { CashWithdraw, IbtaInformation, BearerInfo, TellerDenominationTransaction } from '../../../services/teller/domain/teller.domain.model';
import * as commandConstants from '../../../common/constants/app.command.constants';
import { Currency, ExchangeRate } from '../../../services/currency/domain/currency.models';
import { Teller, TellerBalance, TellerLimit } from '../../../services/teller/domain/teller.models';
import { CommonConfigurationService } from '../../../services/common-configurations/service-api/common.configurations.service';
import { ExchangeRateService } from '../../../services/currency/service-api/exchange.rate.service';
import { GlAccount } from '../../../services/glaccount/domain/gl.account.model';
import { TransactionParticulars, AccountTypes, SubAccountTypes, TransactionTypes } from '../../../common/domain/teller.enum.model';
import { Branch } from '../../../services/bank/domain/bank.models';
import { BankService } from '../../../services/bank/service-api/bank.service';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { AccountService } from '../../../services/account/service-api/account.service';
import { FixedDepositAccountService } from '../../../services/fixed-deposit-account/service-api/fixed.deposit.account.service';
import { RecurringDepositAccountService } from '../../../services/recurring-deposit-account/service-api/recurring.deposit.account.service';
import { Account } from '../../../services/account/domain/account.model';
import { FormBaseComponent } from '../../../common/components/base.form.component';
import { ApprovalflowService } from '../../../services/approvalflow/service-api/approval.flow.service';
import { VerifierSelectionEvent } from '../../../common/components/verifier-selection/verifier.selection.component';
import { GlAccountService } from '../../../services/glaccount/service-api/gl.account.service';
import { AccountNumberFormatter } from '../../../common/components/AccountNumberFormatter/account.number.formatter.component';
import { environment } from '../../..';
import { NgSsoService } from '../../../services/security/ngoauth/ngsso.service';
import { ChequeService } from '../../../services/cheque/service-api/cheque.service';
import * as ActivityCodes from '../../../common/constants/app.teller.transaction.activity.codes';

export const DETAILS_UI: string = "views/teller-transaction/cash-withdraw";


@Component({
    selector: 'ababil-cash-withdraw',
    templateUrl: './cash.withdraw.component.html'
})
export class CashWithdrawComponent extends AccountNumberFormatter implements OnInit {

    selectedCurrency: string;
    tr_particulars: SelectItem[] = TransactionParticulars;
    selectedTR_Particulars: string;
    currencies: Currency[];
    transactionCurrencyCode: string;
    currencyMap: Map<number, string>;
    selectedGlMapCode: number;;
    glAccount: GlAccount = new GlAccount();
    isOriginatingBranch: boolean;
    isRepondingBranch: boolean;
    ibta_Required: boolean = false;
    multiCurrencyGl: boolean = false;
    selectedGlCurrency: string;
    cashWithDrawForm: FormGroup;
    accountTypes: any[] = AccountTypes;
    selectedAccountType: string = 'ACCOUNT';
    amountLCYInWords: string;
    amountCCYInWords: string;
    currencyCode: string;
    tellerId: number;
    accountNumber: string = '';
    accountDetails: Account = new Account();
    local_currency: boolean = false;
    formattedAccountNumber: string;
    teller: Teller = new Teller();
    tellerBalance: TellerBalance = new TellerBalance();
    minDate: Date;
    exchangeRateTypes: SelectItem[];
    exchangeRate: ExchangeRate = new ExchangeRate;
    baseCurrency: string;
    isBaseCurrency: boolean = true;
    queryParams: any;
    foreignCurrency: string;
    tellerLimit: TellerLimit = new TellerLimit();
    ibtaTxnParticulars: SelectItem[];
    glCurrencies: SelectItem[];
    ibtaInformation: IbtaInformation = new IbtaInformation();
    accountTxn: boolean = true;
    glTxn: boolean = false;
    subglTxn: boolean = false;

    branches: Branch[];
    command: string;
    demandDepositDisplay = false;
    fixedDepositDisplay = false;
    recurringDepositdisplay = false;
    cashWithDraw: CashWithdraw;

    demandDepositAccountId: number;
    fixedDepositAccountId: number;
    recurringDepositAccountId: number;

    customerId: number;
    fixedDepositCustomerId: number;
    recurringDepositCustomerId: number;

    signatureAccountId: number;
    signatureCustomerInputId: number;
    demandDepositSignatureDisplay = false;

    signatureFixedDepositAccountId: number;
    fixedDepositSignatureDisplay = false;
    signatureFixedDepositCustomerInputId: number;

    signatureRecurringDepositCustomerInputId: number;
    signatureRecurringDepositAccountId: number;
    recurringDepositSignatureDisplay = false;

    bearerdisplay = false;
    bearerInfo = new BearerInfo();
    extractedBearerInfo = new BearerInfo();
    bearerTransactionChecker = true;
    accountSubTypes: SelectItem[] = SubAccountTypes;
    allowedGls: SelectItem[] = [];
    glAccounts: any[];
    accountName: string;
    showExchangeRate = false;
    selectedSubAccountType: string = 'CASA';
    selectedSubAccountTypeChecker = false;
    availableBalance: number;

    currencyOption = { prefix: '', allowNegative: false, align: 'left', precision: 2 };
    amountMaxLength: number = 28;

    currency = '';
    originatingChecker = false;
    showVerifierSelectionModal: Observable<boolean> = of(false);
    currencyDifferenceChecker = false;

    denominationDisplay = false;
    denominationChecker = true;
    extractedDenominations: any[] = [];
    tellerDenominationBalances: TellerDenominationTransaction[] = [];

    amountVisible = false;
    denominationStatus = '';
    tellerCurrencyCode = '';

    CASAChceker = true;
    glAccountId: number;
    subglCode: string;
    subglCodeWithCode: string;
    subGlAccountId: number;

    accountNumberWithProductCode: string = '';
    branchCode = '007';

    transactionTypes: any[] = TransactionTypes;
    transactionType = 'own';
    transactionChecker = true;
    voucherNumber = null;
    key_W = 87;

    userName$: String;
    userActiveBranch$: number;
    userHomeBranch$: number;
    auth: string = environment.auth;

    branchCodeLength: number = 3;
    accountNumberLengthWithProductCode: number = 10;
    instrumentNumberLength = 7;
    SUBGLCodeLength = 13;

    TPViolationConfiguration: string = '';
    activityId = ActivityCodes.TELLER_CASH_RECEIVE_ACTIVITY_CODE;
    tpErrorCode = ActivityCodes.TELLER_TP_VIOLATION_CODE;
    
    @HostListener('window:keydown', ['$event'])
    keyEvent(event: KeyboardEvent) {

        if (event.shiftKey && event.keyCode === this.key_W) {
            console.log(event);
            this.cashWithdraw();
        }
        else if (event.shiftKey && event.keyCode === this.key_B) {
            this.cancel();
        }

    }



    @ViewChild('bearerComponent') bearerComponent: any;
    @ViewChild('denominatorComponent') denominatorComponent: any;

    tempPreviousTransactionDenominations: TellerDenominationTransaction[] = [];
    previousTransactionDenominations: TellerDenominationTransaction[] = [];

    constructor(
        private demandDepositAccountService: DemandDepositAccountService,
        private fixedDepositAccountService: FixedDepositAccountService,
        private recurringDepositAccountService: RecurringDepositAccountService,
        protected location: Location,
        private bankService: BankService,
        protected approvalFlowService: ApprovalflowService,
        protected accountService: AccountService,
        private exchangeRateService: ExchangeRateService,
        private commonConfigurationService: CommonConfigurationService,
        private notficationService: NotificationService,
        private amountInWordService: AmountInWordsService,
        private currencyService: CurrencyService,
        private tellerService: TellerService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private glAccountService: GlAccountService,
        private ngSsoService: NgSsoService,
        private chequeService: ChequeService,
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
        this.fetchApplicationDate();
        this.exchangeRateTypes = [];
        this.ibtaTxnParticulars = [];
        this.glCurrencies = [];


        this.subscribers.fetchBranchCodeLengthSub = this.accountService.fetchBranchCodeLength().subscribe(
            data => {
                this.branchCodeLength = +data;
                this.subscribers.fetchAcoountNumberLength = this.accountService.fetchAccountLengthConfiguration().subscribe(
                    accountLength => {
                        this.accountNumberLengthWithProductCode = (+accountLength) - (+this.branchCodeLength);
                    }
                )
            }
        )

        this.subscribers.fetchInstrumentNumberLengthSub = this.chequeService.fetchChequeNumberLength().subscribe(
            data => this.instrumentNumberLength = data
        )

        this.subscribers.fetchTPViolationConfigurationSub = this.tellerService.fetchTPViolationConfiguration().subscribe(
            data => this.TPViolationConfiguration = data
        )

        let SUBGlCodeQueryParam = new Map<string, string>();
        SUBGlCodeQueryParam.set('name', 'SUBSIDIARY_LEDGER_CODE_LENGTH');

        this.subscribers.fetchSUBGLCodeLengthSub = this.glAccountService.fetchSUBGlCodeLength(SUBGlCodeQueryParam).subscribe(
            data => this.SUBGLCodeLength = +data.value
        )

        this.route.queryParams.subscribe(queryParams => {
            this.queryParams = queryParams;
            this.isBaseCurrency = this.queryParams['isBaseCurrency'] === "true" ? true : false;
            if (!this.isBaseCurrency) {
                this.selectedCurrency = this.queryParams['currencyCode'];
            }
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
                                this.cashWithDraw = data;
                                this.subGlAccountId = this.cashWithDraw.accountId;
                                this.subscribers.baseCurrencySub = this.currencyService.fetchBaseCurrency(new Map().set('name', 'base-currency')).subscribe(
                                    data => {
                                        this.baseCurrency = data;
                                        if (this.isBaseCurrency) {
                                            this.selectedCurrency = this.baseCurrency;
                                        }
                                        this.subscribers.fetchBal = this.tellerService.fetchBalanceByTellerIdAndCurrencyCode({ tellerId: this.tellerId, currencyCode: this.selectedCurrency }).subscribe(
                                            tellerBalance => {
                                                this.tellerBalance = tellerBalance;
                                                if (tellerBalance.tellerDenominationBalances) {
                                                    this.denominationChecker = false;
                                                    this.tellerDenominationBalances = tellerBalance.tellerDenominationBalances;
                                                    this.denominationStatus = 'CREDIT';
                                                    this.tellerCurrencyCode = tellerBalance.currencyCode;
                                                    if (this.teller.denominationRequired && this.tellerDenominationBalances.length > 0 && this.cashWithDraw.tellerDenominationTransactions.length > 0) {
                                                        this.previousTransactionDenominations = this.cashWithDraw.tellerDenominationTransactions;
                                                    }
                                                }
                                            }
                                        );

                                    }
                                )
                                this.prepareForm(this.cashWithDraw);
                                this.bearerInfo = this.cashWithDraw.bearerInfo ? this.cashWithDraw.bearerInfo : new BearerInfo();
                            }
                        })
                }
                else {
                    this.prepareForm(new CashWithdraw());
                }
            }
        });
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.tellerId = +params['tellerId'];
            if (this.isBaseCurrency) {
                this.subscribers.baseCurrencySub = this.currencyService.fetchBaseCurrency(new Map().set('name', 'base-currency')).subscribe(
                    data => {
                        this.baseCurrency = data;
                        this.selectedCurrency = this.baseCurrency;
                        this.fetchTellerDetail(this.tellerId);
                    }
                )

            }
            else {
                this.fetchTellerDetail(this.tellerId);
            }
        });

        this.fetchExchangeRateTypes();
        this.prepareForm(new CashWithdraw());
    }

    fetchBaseCurrency() {
        this.subscribers.baseCurrencySub = this.currencyService.fetchBaseCurrency(new Map().set('name', 'base-currency')).subscribe(
            data => {
                this.baseCurrency = data;
            }
        )
    }

    prepareForm(formData: CashWithdraw) {
        if (!formData) formData = new CashWithdraw();
        if (!formData.ibtaInformation) formData.ibtaInformation = new IbtaInformation();
        if (formData.globalTxnNumber) {
            this.voucherNumber = formData.globalTxnNumber;
        }
        if (formData.tellerDenominationTransactions) {
            this.extractedDenominations = formData.tellerDenominationTransactions;
        }
        // || formData.transactionDebitAccountType == 'SSP' || formData.transactionDebitAccountType == 'MTDR'
        if (formData.transactionDebitAccountType && (formData.transactionDebitAccountType == 'CASA')) {
            this.accountTxn = true;
            this.glTxn = false;
            this.subglTxn = false;
            this.selectedSubAccountType = formData.transactionDebitAccountType;
            this.selectedAccountType = 'ACCOUNT';
            this.accountService.fetchAccountDetails({ accountId: formData.accountId }).subscribe(
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
        else if (formData.transactionDebitAccountType && formData.transactionDebitAccountType == 'GL') {
            this.accountTxn = false;
            this.subglTxn = false;
            this.glTxn = true;
            this.selectedAccountType = 'GL';
            this.glAccountId = formData.accountId;
            this.fetchAllowedGls();
        }
        else if (formData.transactionDebitAccountType && formData.transactionDebitAccountType == 'SUBGL') {
            this.accountTxn = false;
            this.subglTxn = true;
            this.glTxn = false;
            this.selectedAccountType = 'SUBGL';

            this.glAccountService.fetchSubGlDetails({ subsidiaryLedgerId: formData.accountId }).subscribe(
                data => {
                    this.accountName = data.name;
                    this.currency = data.currencyCode;
                    this.selectedCurrency = data.currencyCode;
                    this.subglCode = data.code;
                    this.subglCodeWithCode = this.subglCode.substring(this.branchCodeLength, this.subglCode.length);
                    this.cashWithDrawForm.controls.transactionCurrencyCode.setValue(this.selectedCurrency);
                    if (this.selectedCurrency != this.baseCurrency) {
                        this.showExchangeRate = true;
                    }
                    else {
                        this.showExchangeRate = false;
                    }
                }
            )

        }


        this.cashWithDrawForm = this.formBuilder.group({
            amountLcy: [formData.amountLcy],
            amountCcy: [formData.amountCcy, [Validators.required]],
            narration: [formData.narration, [Validators.required]],
            instrumentType: [{ value: formData.instrumentType, disabled: true }],
            instrumentNumber: [formData.instrumentNumber],
            instrumentDate: [formData.instrumentDate == null ? null : new Date(formData.instrumentDate)],
            transactionCurrencyCode: [formData.transactionCurrencyCode],
            transactionCreditAccountType: [formData.transactionCreditAccountType],
            transactionDebitAccountType: [formData.transactionDebitAccountType],
            exchangeRate: [formData.exchangeRate],
            exchangeRateTypeId: [formData.exchangeRateTypeId],
            valueDate: [formData.valueDate, [Validators.required]],
            transactionDate: [formData.transactionDate],
            originatingBranchId: [formData.ibtaInformation.originatingBranchId],
            respondingBranchId: [formData.ibtaInformation.respondingBranchId],
            originating: [formData.ibtaInformation.originating],
            ibtaTrCode: [formData.ibtaInformation.ibtaTrCode],
            adviceNumber: [formData.ibtaInformation.adviceNumber],
            originatingDate: [formData.ibtaInformation.originatingDate == null ? null : new Date(formData.ibtaInformation.originatingDate)],
            bearerTransaction: [formData.bearerTransaction],
            ignoreTpViolationCheck: [''],

        });

        if (this.cashWithDrawForm.controls.amountCcy.value) {
            let amount = this.cashWithDrawForm.get('amountCcy').value;
            this.amountCCYInWords = this.amountInWordService.convertAmountToWords(amount, this.selectedCurrency || null);
        }

        if (this.cashWithDrawForm.controls.amountLcy.value) {
            let amount = this.cashWithDrawForm.get('amountLcy').value;
            this.amountLCYInWords = this.amountInWordService.convertAmountToWords(amount, this.selectedCurrency || null);
        }

        if (!this.taskId) {
            this.selectedSubAccountType = 'CASA';
            this.cashWithDrawForm.get('transactionDebitAccountType').setValue(this.selectedSubAccountType);
            this.cashWithDrawForm.controls.instrumentType.setValue('CHEQUE');
            this.cashWithDrawForm.controls.instrumentNumber.setValue(null);
            this.CASAChceker = false;
            this.cashWithDrawForm.controls.instrumentNumber.setValidators(Validators.required);
            this.cashWithDrawForm.controls.instrumentNumber.updateValueAndValidity();
            this.cashWithDrawForm.controls.instrumentDate.setValidators(Validators.required);
            this.cashWithDrawForm.controls.instrumentDate.updateValueAndValidity();
            this.fetchApplicationDate();

        }


        this.cashWithDrawForm.get('amountCcy').valueChanges.subscribe(val => {
            let amount = this.cashWithDrawForm.get('amountCcy').value;
            this.amountCCYInWords = this.amountInWordService.convertAmountToWords(amount, this.selectedCurrency || null);
            this.cashWithDrawForm.get('amountLcy').setValue(amount * this.cashWithDrawForm.get('exchangeRate').value);
        });

        this.cashWithDrawForm.get('amountLcy').valueChanges.subscribe(value => {
            let amount = this.cashWithDrawForm.get('amountLcy').value;
            this.amountLCYInWords = this.amountInWordService.convertAmountToWords(amount, null);
        });

        if (this.cashWithDrawForm.controls.exchangeRateTypeId.value) {
            if ((this.cashWithDrawForm.get('transactionCurrencyCode').value !== null) && (this.cashWithDrawForm.get('transactionCurrencyCode').value !== this.baseCurrency) && (this.cashWithDrawForm.get('exchangeRateTypeId').value)) {
                this.fetchExchangeRateByCurrencyCode(this.cashWithDrawForm.get('exchangeRateTypeId').value, this.cashWithDrawForm.get('transactionCurrencyCode').value);
            }
        }

        if (this.cashWithDrawForm.controls.bearerTransaction.value) {
            this.bearerTransactionChecker = false;
        }
        else {
            this.bearerTransactionChecker = true;
        }

        if (formData.ibtaInformation.originating) {
            this.fetchAdviceNumber();
            this.originatingChecker = true;
            this.cashWithDrawForm.removeControl('originatingBranchId');
            this.cashWithDrawForm.updateValueAndValidity();
        }
        else {
            this.originatingChecker = false;
            this.cashWithDrawForm.controls.adviceNumber.reset();
            this.cashWithDrawForm.addControl('originatingBranchId', new FormControl('', [Validators.required]));
            this.cashWithDrawForm.updateValueAndValidity();
        }



        this.cashWithDrawForm.controls.originating.valueChanges.subscribe(
            data => {
                if (data) {
                    this.fetchAdviceNumber();
                    this.originatingChecker = true;
                    this.cashWithDrawForm.removeControl('originatingBranchId');
                    this.cashWithDrawForm.updateValueAndValidity();
                }
                else {
                    this.originatingChecker = false;
                    if (this.cashWithDrawForm.controls.adviceNumber) {
                        this.cashWithDrawForm.controls.adviceNumber.reset();
                    }
                    this.cashWithDrawForm.addControl('originatingBranchId', new FormControl('', [Validators.required]));
                    this.cashWithDrawForm.updateValueAndValidity();
                }
            }
        )

        this.cashWithDrawForm.controls.bearerTransaction.valueChanges.subscribe(
            data => {
                if (this.cashWithDrawForm.controls.bearerTransaction.value) {
                    this.bearerTransactionChecker = false;
                }
                else {
                    this.bearerTransactionChecker = true;
                }
            }
        )

        this.cashWithDrawForm.get('amountCcy').valueChanges.subscribe(val => {
            let amount = this.cashWithDrawForm.get('amountCcy').value;
            if ((amount + "").length > 20) {
                this.amountCCYInWords = "";
            } else {
                this.amountCCYInWords = this.amountInWordService.convertAmountToWords(amount, this.selectedCurrency || null);
            }
            this.cashWithDrawForm.get('amountLcy').setValue(amount * this.cashWithDrawForm.get('exchangeRate').value);
        });

        this.cashWithDrawForm.get('amountLcy').valueChanges.subscribe(value => {
            let amount = this.cashWithDrawForm.get('amountLcy').value;
            if ((amount + "").length > 20) {
                this.amountLCYInWords = "";
            } else {
                this.amountLCYInWords = this.amountInWordService.convertAmountToWords(amount, null);
            }
        });

        this.cashWithDrawForm.get('valueDate').valueChanges.subscribe(
            value => {
                if (!value) {
                    this.cashWithDrawForm.get('valueDate').setValue(new Date());
                    this.cashWithDrawForm.get('valueDate').updateValueAndValidity();
                }
            });
        if (!this.cashWithDrawForm.get('valueDate').value) {
            this.cashWithDrawForm.get('valueDate').setValue(this.minDate);
            this.cashWithDrawForm.get('valueDate').updateValueAndValidity();
        }

        this.cashWithDrawForm.get('exchangeRateTypeId').valueChanges.subscribe(
            value => {
                if (value) {
                    if (!this.isBaseCurrency) {
                        this.fetchExchangeRateByCurrencyCode(this.cashWithDrawForm.get('exchangeRateTypeId').value, this.selectedCurrency);
                    }

                    if ((this.cashWithDrawForm.get('transactionCurrencyCode').value !== null) && (this.cashWithDrawForm.get('transactionCurrencyCode').value !== this.baseCurrency)) {
                        this.fetchExchangeRateByCurrencyCode(this.cashWithDrawForm.get('exchangeRateTypeId').value, this.cashWithDrawForm.get('transactionCurrencyCode').value);
                    }
                }
            }
        );

        this.cashWithDrawForm.get('transactionCurrencyCode').valueChanges.subscribe(
            value => {

                if (value) {
                    let currency = this.cashWithDrawForm.get('transactionCurrencyCode').value;
                    if (currency === this.baseCurrency) {
                        this.cashWithDrawForm.get('exchangeRateTypeId').setValue(1);
                        this.cashWithDrawForm.get('exchangeRate').setValue(1);
                    }
                    if (currency !== this.baseCurrency) {
                        if (this.cashWithDrawForm.get('exchangeRateTypeId').value) {
                            this.fetchExchangeRateByCurrencyCode(this.cashWithDrawForm.get('exchangeRateTypeId').value, currency);
                        }
                    }
                }
            }
        );

        this.cashWithDrawForm.get('exchangeRate').valueChanges.subscribe(
            value => {
                if (!value && this.isBaseCurrency) {
                    this.cashWithDrawForm.get('exchangeRate').setValue(1);
                }
                this.cashWithDrawForm.get('amountLcy').setValue(this.cashWithDrawForm.get('amountCcy').value * this.cashWithDrawForm.get('exchangeRate').value);
            });


    }
    fetchAdviceNumber() {
        let adviceNumberUrl = new Map<string, string>();
        adviceNumberUrl.set('branchId', '7');
        adviceNumberUrl.set('userId', 'asd');
        this.subscribers.fetchAdviceNumberSub = this.tellerService.fetchAdviceNumber(adviceNumberUrl).subscribe(
            data => {
                this.cashWithDrawForm.controls.adviceNumber.setValue(data);
            }
        )
    }

    markAsTouched(cashWithDrawForm: FormGroup) {
        this.markFormGroupAsTouched(cashWithDrawForm);
    }


    onVerifierSelect(event: VerifierSelectionEvent) {


        let view_ui = DETAILS_UI + `;tellerId=${this.tellerId}?isBaseCurrency=${this.isBaseCurrency}&`
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));

        let cashWithdraw: CashWithdraw = this.cashWithDrawForm.value;
        cashWithdraw.transactionCreditAccountType = "TELLER";
        if (this.ibta_Required) {
            cashWithdraw.ibtaInformation = this.ibtaInformation;
        }

        if (this.cashWithDrawForm.controls.bearerTransaction.value == true) {
            cashWithdraw.bearerInfo = this.extractedBearerInfo;
        }

        if (this.teller.denominationRequired && this.extractedDenominations.length > 0) {
            cashWithdraw.tellerDenominationTransactions = this.extractedDenominations;
        }

        cashWithdraw.tellerId = this.tellerId;
        cashWithdraw.accountId = this.accountDetails.id || this.glAccount.id || this.subGlAccountId;
        cashWithdraw.activityId = 102;

        let globalTxnQueryParam = new Map<string, string>();
        globalTxnQueryParam.set('userId', 'as');
        globalTxnQueryParam.set('activityId', '102');

        if (this.selectedAccountType == "GL" && this.ibta_Required) {
            if (cashWithdraw.ibtaInformation) {
                cashWithdraw.ibtaInformation.adviceNumber = this.cashWithDrawForm.controls.adviceNumber.value;
                cashWithdraw.ibtaInformation.ibtaTrCode = this.cashWithDrawForm.controls.ibtaTrCode.value;
                cashWithdraw.ibtaInformation.originating = this.cashWithDrawForm.controls.originating.value;
                if (!this.cashWithDrawForm.controls.originating.value) {
                    cashWithdraw.ibtaInformation.originatingBranchId = this.cashWithDrawForm.controls.originatingBranchId.value;
                }
                cashWithdraw.ibtaInformation.respondingBranchId = this.cashWithDrawForm.controls.respondingBranchId.value;
                cashWithdraw.ibtaInformation.originatingDate = this.cashWithDrawForm.controls.originatingDate.value;
            }
        }

        if (this.taskId) {
            cashWithdraw.globalTxnNumber = this.voucherNumber;
            this.subscribers.cashWithdrawSub = this.tellerService.cashWithdraw(cashWithdraw, urlSearchParams).subscribe(
                data => {
                    if (!event.approvalFlowRequired) {
                        this.notficationService.sendSuccessMsg("teller.cash.withdraw.success", { voucher: cashWithdraw.globalTxnNumber });
                    }
                    else if (event.approvalFlowRequired && ((+this.cashWithDrawForm.controls.amountCcy.value) < (this.tellerLimit.cashWithdrawLimit)))
                        this.notficationService.sendSuccessMsg("teller.cash.withdraw.success", { voucher: cashWithdraw.globalTxnNumber });
                    else if (event.approvalFlowRequired && ((+this.cashWithDrawForm.controls.amountCcy.value) > (this.tellerLimit.cashWithdrawLimit))) {
                        this.notficationService.sendSuccessMsg("workflow.task.verify.send");
                    }
                    if (this.taskId) {
                        this.router.navigate(['/approval-flow/pendingtasks']);
                    }
                    else {
                        this.cashWithDrawForm.reset();
                        if (this.selectedAccountType == 'ACCOUNT') {
                            this.cashWithDrawForm.get('transactionDebitAccountType').setValue(this.selectedSubAccountType);
                            this.cashWithDrawForm.controls.instrumentType.setValue('CHEQUE');
                            this.cashWithDrawForm.controls.instrumentNumber.setValue(null);
                            this.CASAChceker = false;
                            this.cashWithDrawForm.controls.instrumentNumber.setValidators(Validators.required);
                            this.cashWithDrawForm.controls.instrumentNumber.updateValueAndValidity();
                            this.cashWithDrawForm.controls.instrumentDate.setValidators(Validators.required);
                            this.cashWithDrawForm.controls.instrumentDate.updateValueAndValidity();
                            this.fetchApplicationDate();

                        }
                        else {
                            this.cashWithDrawForm.controls.instrumentNumber.setValue('-V');
                            if (this.selectedAccountType == 'GL') {
                                this.cashWithDrawForm.get('transactionDebitAccountType').setValue('GL');
                            }
                            else if (this.selectedAccountType == 'SUBGL') {
                                this.cashWithDrawForm.get('transactionDebitAccountType').setValue('SUBGL');
                            }
                        }
                        this.accountName = '';
                        this.currency = '';
                        this.selectedGlMapCode = -1;
                        this.subglCodeWithCode = '';
                        this.availableBalance = null;
                        this.accountNumberWithProductCode = '';
                        this.denominatorComponent.clearBalance();
                        this.fetchTellerDetail(this.tellerId);
                        // this.fetchTellerBalance(this.tellerId);
                        this.previousTransactionDenominations = [];

                    }
                },
                error => {
                    if (this.TPViolationConfiguration == 'DECISION' && JSON.parse(error._body)['code'] == this.tpErrorCode) {
                        this.confirmationService.confirm({
                            message: 'Are you sure that you want to perform this action?',
                            accept: () => {
                                this.cashWithDrawForm.controls.ignoreTpViolationCheck.setValue(true);
                                this.cashWithdraw();
                            }
                        });
                    }
                });
        }


        else {
            this.tellerService.fetchGlobalTxnNo(globalTxnQueryParam).subscribe(
                data => {
                    cashWithdraw.globalTxnNumber = data;

                    this.subscribers.cashWithdrawSub = this.tellerService.cashWithdraw(cashWithdraw, urlSearchParams).subscribe(
                        fata => {
                            if (!event.approvalFlowRequired) {
                                this.notficationService.sendSuccessMsg("teller.cash.withdraw.success", { voucher: cashWithdraw.globalTxnNumber });
                            }
                            else if (event.approvalFlowRequired && ((+this.cashWithDrawForm.controls.amountCcy.value) < (this.tellerLimit.cashWithdrawLimit)))
                                this.notficationService.sendSuccessMsg("teller.cash.withdraw.success", { voucher: cashWithdraw.globalTxnNumber });
                            else if (event.approvalFlowRequired && ((+this.cashWithDrawForm.controls.amountCcy.value) > (this.tellerLimit.cashWithdrawLimit))) {
                                this.notficationService.sendSuccessMsg("workflow.task.verify.send");
                            }
                            if (this.taskId) {
                                this.router.navigate(['/approval-flow/pendingtasks']);
                            }
                            else {
                                this.cashWithDrawForm.reset();
                                if (this.selectedAccountType == 'ACCOUNT') {
                                    this.cashWithDrawForm.get('transactionDebitAccountType').setValue(this.selectedSubAccountType);
                                    this.cashWithDrawForm.controls.instrumentType.setValue('CHEQUE');
                                    this.cashWithDrawForm.controls.instrumentNumber.setValue(null);
                                    this.CASAChceker = false;
                                    this.cashWithDrawForm.controls.instrumentNumber.setValidators(Validators.required);
                                    this.cashWithDrawForm.controls.instrumentNumber.updateValueAndValidity();
                                    this.cashWithDrawForm.controls.instrumentDate.setValidators(Validators.required);
                                    this.cashWithDrawForm.controls.instrumentDate.updateValueAndValidity();
                                    this.fetchApplicationDate();

                                }
                                else {
                                    this.cashWithDrawForm.controls.instrumentNumber.setValue('-V');
                                    if (this.selectedAccountType == 'GL') {
                                        this.cashWithDrawForm.get('transactionDebitAccountType').setValue('GL');
                                    }
                                    else if (this.selectedAccountType == 'SUBGL') {
                                        this.cashWithDrawForm.get('transactionDebitAccountType').setValue('SUBGL');
                                    }

                                }
                                this.accountName = '';
                                this.currency = '';
                                this.selectedGlMapCode = -1;
                                this.subglCodeWithCode = '';
                                this.availableBalance = null;
                                this.accountNumberWithProductCode = '';
                                this.denominatorComponent.clearBalance();
                                this.fetchTellerDetail(this.tellerId);
                                // this.fetchTellerBalance(this.tellerId);
                                this.previousTransactionDenominations = [];
                            }
                        },
                        error => {
                            if (this.TPViolationConfiguration == 'DECISION' && JSON.parse(error._body)['code'] == this.tpErrorCode) {
                                this.confirmationService.confirm({
                                    message: 'Are you sure that you want to perform this action?',
                                    accept: () => {
                                        this.cashWithDrawForm.controls.ignoreTpViolationCheck.setValue(true);
                                        this.cashWithdraw();
                                    }
                                });
                            }
                        }

                    );
                })
        }

    }


    cashWithdraw() {
        this.markAsTouched(this.cashWithDrawForm);
        if (this.currencyDifferenceChecker) {
            this.notficationService.sendErrorMsg("teller.customer.currency.difference.error");
        }
        // if (this.isEmpty(this.tellerLimit)) { this.notficationService.sendErrorMsg("teller.customer.currency.difference.error"); }
        // if (this.formInvalid()) return;
        if (!this.formInvalid()) {
            this.command = commandConstants.TELLER_TRANSACTION_CASH_WITHDRAW_COMMAND;
            this.showVerifierSelectionModal = of(true);
        }


    }


    onSelectedCurrencyChange(selectedCurrency: string) {
        this.cashWithDrawForm.get('transactionCurrencyCode').setValue(selectedCurrency);
        this.tellerLimit = this.teller.tellerLimits.filter(tellerLimit => tellerLimit.currencyCode === selectedCurrency)[0];
        this.fetchTellerBalance(this.tellerId);
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
            if (this.taskId) {
                this.cashWithDrawForm.controls.instrumentType.setValue('CHEQUE');
                this.CASAChceker = false;
            }
        }
        // else if (this.selectedSubAccountType == "MTDR") {
        //     this.subscribers.fetchFixedDepositAccountSub =
        //         this.fixedDepositAccountService.fetchFixedDepositAccounts(urlSearchMap).subscribe(
        //             data => {
        //                 if (data.content.length == 1) {
        //                     this.fetchAccountDetailsByType(data.content);
        //                     if (data.content[0].fixedDepositAccountBalance) {
        //                         this.availableBalance = data.content[0].fixedDepositAccountBalance.balance;
        //                     }
        //                 }
        //                 else {
        //                     this.notficationService.sendErrorMsg('no.fixed.account.found.error');
        //                 }
        //             }
        //         )
        // }
        // else if (this.selectedSubAccountType == "SSP") {
        //     this.subscribers.fetchRecurringDepositAccountSub =
        //         this.recurringDepositAccountService.fetchRecurringDepositAccounts(urlSearchMap).subscribe(
        //             data => {
        //                 if (data.content.length == 1) {
        //                     this.fetchAccountDetailsByType(data.content);
        //                     if (data.content[0].recurringDepositAccountBalance) {
        //                         this.availableBalance = data.content[0].recurringDepositAccountBalance.balance;
        //                     }
        //                 }
        //                 else {
        //                     this.notficationService.sendErrorMsg('no.recurring.account.found.error');
        //                 }
        //             }
        //         )
        // }
    }


    fetchAccountDetailsByType(data) {
        if (data.length > 0) {
            this.accountDetails = data[0];
            this.accountName = this.accountDetails.name;
            this.selectedCurrency = this.accountDetails.currencyCode;
            this.currency = this.accountDetails.currencyCode;

            if (this.currency != this.tellerLimit.currencyCode) {
                this.currencyDifferenceChecker = true;
                this.notficationService.sendErrorMsg("teller.customer.currency.difference.error");
            }

            if (data[0].balance) {
                this.availableBalance = data[0].balance.availableBalance;
            }
            if (this.selectedCurrency !== this.baseCurrency) {
                this.showExchangeRate = true;
            }
            else {
                this.showExchangeRate = false;
            }
            this.cashWithDrawForm.get('transactionCurrencyCode').setValue(this.accountDetails.currencyCode);
        } else {
            this.accountDetails = new Account();
        }
        this.currencyOption.precision = this.selectedCurrency == "BDT" ? 2 : 4;
        this.amountMaxLength = this.selectedCurrency == "BDT" ? 28 : 27;
        if (!this.taskId) {
            this.cashWithDrawForm.controls.amountCcy.reset();
            this.amountCCYInWords = '';
            this.cashWithDrawForm.controls.amountLcy.reset();
            this.amountLCYInWords = '';
        }
    }


    fetchGlAccount(data) {

        this.glAccount = data;
        this.accountName = this.glAccount.name;
        if (this.glAccount.currencyRestriction === "LOCAL_CURRENCY") {
            this.selectedCurrency = this.baseCurrency;
            this.currency = this.selectedCurrency;
            this.cashWithDrawForm.get('transactionCurrencyCode').setValue(this.baseCurrency);
            this.multiCurrencyGl = false;
            this.showExchangeRate = false;
        }
        if (this.glAccount.currencyRestriction !== "LOCAL_CURRENCY") {
            this.multiCurrencyGl = true;
            if (this.glAccount.currencies.length < 2) {
                this.cashWithDrawForm.get('transactionCurrencyCode').setValue(this.glAccount.currencies[0]);
                this.selectedCurrency = this.glAccount.currencies[0];
                this.currency = this.glAccount.currencies[0];
                if (this.selectedCurrency !== this.baseCurrency) {
                    this.showExchangeRate = true;
                    this.cashWithDrawForm.get('exchangeRateTypeId').setValue(null);
                    this.cashWithDrawForm.get('exchangeRate').setValue(null);
                }
            }
            this.glCurrencies.push({ label: "Choose", value: null });
            this.glAccount.currencies.forEach(currency => this.glCurrencies.push({ label: currency, value: currency }));
        }
        if (this.glAccount.isIbtaRequired) {
            this.ibta_Required = true;
            this.fetchIbtaTxnParticulars();
            this.fetchBranches();

            this.cashWithDrawForm.addControl('adviceNumber', new FormControl('', Validators.required));
            this.cashWithDrawForm.addControl('ibtaTrCode', new FormControl('', Validators.required));
            if (!this.taskId) {
                this.cashWithDrawForm.addControl('originatingBranchId', new FormControl('', Validators.required));
            }
            this.cashWithDrawForm.addControl('respondingBranchId', new FormControl('', Validators.required));
            this.cashWithDrawForm.addControl('originatingDate', new FormControl('', Validators.required));
            this.cashWithDrawForm.updateValueAndValidity();
        }

        else {
            this.ibta_Required = false;
            this.cashWithDrawForm.removeControl('adviceNumber');
            this.cashWithDrawForm.removeControl('ibtaTrCode');
            this.cashWithDrawForm.removeControl('originatingBranchId');
            this.cashWithDrawForm.removeControl('respondingBranchId');
            this.cashWithDrawForm.removeControl('originatingDate');
            this.cashWithDrawForm.updateValueAndValidity();
        }

        if (this.currency != this.tellerLimit.currencyCode) {
            this.currencyDifferenceChecker = true;
            this.notficationService.sendErrorMsg("teller.customer.currency.difference.error");
        }
    }

    fetchSUBGLAccountfeDetails() {
        let queryParam = new Map<string, string>();
        queryParam.set('subGlCode', this.subglCode);
        this.glAccountService.fetchSUBGLdetailsByCode(queryParam).subscribe(
            data => {
                if (data) {
                    this.availableBalance = data.content[0].balance;
                    this.subGlAccountId = data.content[0].id;
                    this.accountName = data.content[0].name;
                    this.currency = data.content[0].currencyCode;
                    this.selectedCurrency = data.content[0].currencyCode;
                    if (this.currency != this.tellerLimit.currencyCode) {
                        this.currencyDifferenceChecker = true;
                        this.notficationService.sendErrorMsg("teller.customer.currency.difference.error");
                    }
                    this.cashWithDrawForm.controls.transactionCurrencyCode.setValue(this.selectedCurrency);
                    if (this.selectedCurrency != this.baseCurrency) {
                        this.showExchangeRate = true;
                    }
                    else {
                        this.showExchangeRate = false;
                    }
                }
                else this.notficationService.sendErrorMsg("no.subgl.found");
            }
        )
    }

    private fetchExchangeRateTypes() {

        this.exchangeRateTypes.push({ label: "Select exchange type", value: null });
        this.exchangeRateService.fetchExchangeRateTypes().subscribe(
            data => {
                (data.content).forEach(element => {
                    this.exchangeRateTypes.push({ label: element.typeName, value: element.id });
                });
            }
        )

    }

    private fetchExchangeRateByCurrencyCode(rateTypeId: number, currencyCode: string) {
        if (this.selectedCurrency != this.baseCurrency) {
            this.exchangeRateService.fetcExchangeRatesByCurrencyCode({ rateTypeId: rateTypeId, currencyCode: currencyCode }).subscribe(

                exchangeRate => {
                    this.exchangeRate.rate = exchangeRate.rate;
                    this.cashWithDrawForm.get('exchangeRate').setValue(exchangeRate.rate);
                }
            );
        }
    }

    fetchTellerDetail(tellerId: number) {
        this.subscribers.fetchSub = this.tellerService.fetchTellerById({ id: tellerId }).subscribe(
            tellerDetail => {
                this.teller = tellerDetail;
                if (this.teller.denominationRequired) {
                    this.amountVisible = true;
                    this.denominationChecker = false;
                }
                else {
                    this.amountVisible = false;
                    this.denominationChecker = true;
                }
                this.tellerLimit = this.teller.tellerLimits.filter(tellerLimit => tellerLimit.currencyCode === this.selectedCurrency)[0];
                this.fetchTellerBalance(tellerId);
            });
    }

    fetchTellerBalance(tellerId: number) {
        this.subscribers.fetchBal = this.tellerService.fetchBalanceByTellerIdAndCurrencyCode({ tellerId: tellerId, currencyCode: this.selectedCurrency }).subscribe(
            tellerBalance => {
                this.tellerBalance = tellerBalance;
                if (tellerBalance.tellerDenominationBalances) {
                    this.tellerDenominationBalances = tellerBalance.tellerDenominationBalances;
                    this.denominationStatus = 'CREDIT';
                    this.tellerCurrencyCode = tellerBalance.currencyCode;
                }
            }
        );
    }
    instrumentMinDate: Date;
    fetchApplicationDate() {
        let urlSearchParam = new Map();
        urlSearchParam.set("name", "application-date");
        this.commonConfigurationService.fetchApplicationDate(urlSearchParam).subscribe(
            data => {
                this.minDate = new Date(data);

                this.instrumentMinDate = new Date(moment(this.minDate).subtract(6, 'months').calendar());
                this.cashWithDrawForm.get('valueDate').setValue(new Date(data));
                this.cashWithDrawForm.get('transactionDate').setValue(new Date(data));
                if (this.selectedAccountType == 'ACCOUNT') {
                    this.cashWithDrawForm.get('instrumentDate').setValue(new Date(data));
                }
                if (this.selectedAccountType == 'GL' && this.glAccount.isIbtaRequired) {
                    this.cashWithDrawForm.get('originatingDate').setValue(new Date(data));
                }
            }
        )
    }
    loadAllCurrencies() {
        this.currencyService.fetchCurrencies(new Map()).subscribe(
            data => {
                this.currencies = data.content;
                this.currencyMap = new Map();
                this.currencies.forEach(element => {
                    this.currencyMap.set(element.id, element.code);
                });
            }
        );
    }


    fetchIbtaTxnParticulars() {
        this.ibtaTxnParticulars.push({ label: "Choose", value: null });
        this.tellerService.fetchIbtaTxnParticulars().subscribe(
            data => {
                (data.content).forEach(element => {
                    this.ibtaTxnParticulars.push({ label: element.particulars, value: element.code });
                });
            }
        );
    }
    fetchBranches() {
        this.bankService.fetchOwnBranches(new Map()).subscribe(
            data => {
                this.branches = data.content;
            });
    }


    showAccountDetail() {
        if (this.accountNumber) {
            let accountQueryParams = new Map<string, string>().set('accountNumber', this.accountNumber);
            this.subscribers.fetchAccountDetailSub = this.accountService.fetchAccounts(accountQueryParams).subscribe(
                account => {
                    if (account) {
                        if (account.content[0].type) {
                            if (account.content[0].type == "DEMAND_DEPOSIT") {
                                this.demandDepositAccountId = account.content[0].id;
                                this.customerId = account.content[0].customerId;
                                if (this.demandDepositAccountId && this.customerId) {
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

    showSignature() {
        if (this.accountNumber) {
            let accountQueryParams = new Map<string, string>().set('accountNumber', this.accountNumber);
            this.subscribers.fetchAccountDetailSub = this.accountService.fetchAccounts(accountQueryParams).subscribe(
                account => {
                    if (account.content[0].type == "DEMAND_DEPOSIT") {
                        this.signatureAccountId = account.content[0].id;
                        this.signatureCustomerInputId = account.content[0].customerId;
                        if (this.signatureAccountId && this.signatureCustomerInputId) {
                            this.demandDepositSignatureDisplay = true;
                        }
                    }

                    else if (account.content[0].type == "FIXED_DEPOSIT") {
                        this.signatureFixedDepositAccountId = account.content[0].id;
                        this.signatureFixedDepositCustomerInputId = account.content[0].customerId;
                        if (this.signatureFixedDepositAccountId && this.signatureFixedDepositCustomerInputId) {
                            this.fixedDepositSignatureDisplay = true;
                        }
                    }

                    else if (account.content[0].type == "RECURRING_DEPOSIT") {
                        this.signatureRecurringDepositAccountId = account.content[0].id;
                        this.signatureRecurringDepositCustomerInputId = account.content[0].customerId;
                        if (this.signatureRecurringDepositAccountId && this.signatureRecurringDepositCustomerInputId) {
                            this.recurringDepositSignatureDisplay = true;
                        }
                    }

                }
            )
        }
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


    showDenomination() {
        this.denominationDisplay = true;
        this.denominatorComponent.clearBalance();
    }

    saveDenomination() {
        this.extractedDenominations = this.denominatorComponent.extractData();
        let amountCCYfromDenomination = this.denominatorComponent.extractTotal();
        this.cashWithDrawForm.controls.amountCcy.setValue(amountCCYfromDenomination);
        this.closeDenomination();
    }

    closeDenomination() {
        this.denominationDisplay = false;;
    }

    fetchAllowedGls() {
        if (this.selectedAccountType == "GL" && this.allowedGls.length == 0) {
            this.tellerService.fetchAllowedGlbyActivityId(new Map<string, string>().set('activity-id', this.activityId.toString())).subscribe(
                data => {
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

    formatInstrumentNumber() {
        this.cashWithDrawForm.controls.instrumentNumber.setValue(this.cashWithDrawForm.controls.instrumentNumber.value.padStart(this.instrumentNumberLength, 0));
    }

    //ACCOUNT NUMBER FORMATTING
    formatAccountNumberToShow() {

        if (this.accountNumberWithProductCode && this.accountNumberWithProductCode!='') {
            if (this.branchCode != '') {
                this.formatAccountNumberWithBranchCode(this.branchCode, this.accountNumberWithProductCode, this.accountNumberLengthWithProductCode, (formattedNumber) => {
                    this.accountNumber = formattedNumber;
                    this.availableBalance = null;
                    this.currency = '';
                    this.accountName = '';
                    this.fetchAccountDetails();
                });
            }
            this.formattedAccountNumberWithProductCode(this.accountNumberWithProductCode, this.accountNumberLengthWithProductCode, (code) => this.accountNumberWithProductCode = code);
        }
    }

    formatBranchCodeToShow() {
        if (this.branchCode != '' && this.transactionType == 'inter') {
            this.formatBranchCode(this.branchCode, (code) => {
                this.branchCode = code;
                if (this.accountNumberWithProductCode != '') {
                    this.formatAccountNumberToShow();
                }
            });

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
    }


    onAccountTypeChange() {

        this.cashWithDrawForm.controls.instrumentNumber.clearValidators();
        this.cashWithDrawForm.controls.instrumentNumber.updateValueAndValidity();
        this.cashWithDrawForm.controls.instrumentDate.clearValidators();
        this.cashWithDrawForm.controls.instrumentDate.updateValueAndValidity();
        this.cashWithDrawForm.removeControl('adviceNumber');
        this.cashWithDrawForm.removeControl('ibtaTrCode');
        this.cashWithDrawForm.removeControl('originatingBranchId');
        this.cashWithDrawForm.removeControl('respondingBranchId');
        this.cashWithDrawForm.removeControl('originatingDate');
        this.ibta_Required = false;
        if (this.selectedAccountType == "ACCOUNT") {
            this.glTxn = false;
            this.subglTxn = false;
            this.accountTxn = true;
            this.selectedGlMapCode = -1;
            this.subglCodeWithCode = null;
            this.selectedSubAccountType = 'CASA';
            this.cashWithDrawForm.get('transactionDebitAccountType').setValue(this.selectedSubAccountType);
            this.cashWithDrawForm.controls.instrumentType.setValue('CHEQUE');
            this.cashWithDrawForm.controls.instrumentNumber.setValue(null);
            this.CASAChceker = false;
            this.cashWithDrawForm.controls.instrumentNumber.setValidators(Validators.required);
            this.cashWithDrawForm.controls.instrumentNumber.updateValueAndValidity();
            this.cashWithDrawForm.controls.instrumentDate.setValidators(Validators.required);
            this.cashWithDrawForm.controls.instrumentDate.updateValueAndValidity();
            this.fetchApplicationDate();
        }
        else if (this.selectedAccountType == "GL") {
            this.selectedSubAccountType = '';
            this.subglCodeWithCode = null;
            this.cashWithDrawForm.get('transactionDebitAccountType').setValue("GL");
            this.glTxn = true;
            this.accountTxn = false;
            this.subglTxn = false;
            this.cashWithDrawForm.controls.instrumentNumber.setValue('-V');
            this.cashWithDrawForm.controls.instrumentType.setValue(null);
            this.cashWithDrawForm.controls.instrumentDate.setValue(null);
            this.CASAChceker = true;
            this.fetchAllowedGls();
        }
        else if (this.selectedAccountType == "SUBGL") {
            this.selectedSubAccountType = '';
            this.selectedGlMapCode = -1;
            this.cashWithDrawForm.get('transactionDebitAccountType').setValue("SUBGL");
            this.glTxn = false;
            this.accountTxn = false;
            this.subglTxn = true;
            this.cashWithDrawForm.controls.instrumentNumber.setValue('-V');
            this.cashWithDrawForm.controls.instrumentType.setValue(null);
            this.cashWithDrawForm.controls.instrumentDate.setValue(null);
            this.CASAChceker = true;
        }
        this.accountName = '';
        this.currency = '';
        this.availableBalance = null;
    }

    onAdviceNumberChange(data) {
        this.subscribers.fetchDEtailbyAdviceNumberSub =
            this.tellerService.fetchDetailsByAdviceNumber({ 'advice-number': data }).subscribe(
                data => {
                    this.cashWithDrawForm.controls.originatingBranchId = data.originatingBranchId;
                    this.cashWithDrawForm.controls.respondingBranchId = data.respondingBranchId;
                    this.cashWithDrawForm.controls.ibtaTrCode = data.ibtaTrCode;
                }
            )
    }

    onAccountSubTypeChange() {
        this.selectedSubAccountTypeChecker = false;
        this.accountNumberWithProductCode = '';

        this.cashWithDrawForm.controls.instrumentNumber.clearValidators();
        this.cashWithDrawForm.controls.instrumentNumber.updateValueAndValidity();
        this.cashWithDrawForm.controls.instrumentDate.clearValidators();
        this.cashWithDrawForm.controls.instrumentDate.updateValueAndValidity();

        if (this.accountNumberWithProductCode != '') {
            this.fetchAccountDetails();
        }
        if (this.selectedSubAccountType != 'CASA' && this.selectedSubAccountType != '') {
            this.cashWithDrawForm.controls.instrumentNumber.setValue('-V');
            this.cashWithDrawForm.controls.instrumentType.setValue(null);
            this.cashWithDrawForm.controls.instrumentDate.setValue(null);
            this.CASAChceker = true;
        }
        else {
            this.cashWithDrawForm.controls.instrumentType.setValue('CHEQUE');
            this.cashWithDrawForm.controls.instrumentNumber.setValue(null);
            this.CASAChceker = false;
            this.cashWithDrawForm.controls.instrumentNumber.setValidators(Validators.required);
            this.cashWithDrawForm.controls.instrumentNumber.updateValueAndValidity();
            this.cashWithDrawForm.controls.instrumentDate.setValidators(Validators.required);
            this.cashWithDrawForm.controls.instrumentDate.updateValueAndValidity();
            this.fetchApplicationDate();
        }
    }

    onGLCodeChange() {
        if (this.selectedGlMapCode >= 0) {
            this.fetchGlAccount(this.glAccounts[this.selectedGlMapCode].generalLedgerAccount);
        }
    }



    onTransactionTypeChange() {
        if (this.transactionType == 'own') {
            this.transactionChecker = true;
            this.formatBranchCode(this.userActiveBranch$.toString(), (code) => this.branchCode = code);
        }
        else if (this.transactionType == 'inter') {
            this.transactionChecker = false;
        }
        this.accountName = '';
        this.accountNumberWithProductCode = '';
        this.currency = '';
        this.availableBalance = null;
        this.subglCodeWithCode = '';
    }


    cancel() {
        this.navigateAway();
    }

    navigateAway() {
        this.router.navigate(['../'], { relativeTo: this.route, queryParams: { tellerId: this.tellerId } });
    }


    formInvalid() {
        if (!this.cashWithDrawForm) return true;
        return (
            this.cashWithDrawForm.invalid || this.selectedAccountType == '' ||
            (this.selectedAccountType == "ACCOUNT" && this.selectedSubAccountType == '') ||
            (this.selectedAccountType == "ACCOUNT" && this.selectedSubAccountType != '' && this.accountNumberWithProductCode == '') ||
            isNaN(this.cashWithDrawForm.get('amountCcy').value) || this.currencyDifferenceChecker ||
            (this.cashWithDrawForm.controls.bearerTransaction.value == true && this.bearerComponent.formInvalid()));
    }


}