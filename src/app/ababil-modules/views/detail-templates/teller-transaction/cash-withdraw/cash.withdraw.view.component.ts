import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { TellerService } from '../../../../../services/teller/service-api/teller.service';
import { AmountInWordsService } from '../../../../../common/services/amount.in.words.service';
import { NotificationService } from '../../../../../common/notification/notification.service';
import { DemandDepositAccountService } from '../../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { Subject, Observable, of } from 'rxjs';
import { CashReceive, IbtaInformation, BearerInfo, TellerDenominationView, CashWithdraw } from '../../../../../services/teller/domain/teller.domain.model';
import { Currency, ExchangeRate } from '../../../../../services/currency/domain/currency.models';
import { TransactionParticulars, AccountTypes, SubAccountTypes } from '../../../../../common/domain/teller.enum.model';
import { Teller, TellerBalance, TellerLimit } from '../../../../../services/teller/domain/teller.models';
import { ExchangeRateService } from '../../../../../services/currency/service-api/exchange.rate.service';
import { GlAccountService } from '../../../../../services/glaccount/service-api/gl.account.service';
import { GlAccount } from '../../../../../services/glaccount/domain/gl.account.model';
import { BankService } from '../../../../../services/bank/service-api/bank.service';
import { Branch } from '../../../../../services/bank/domain/bank.models';
import { AccountService } from '../../../../../services/account/service-api/account.service';
import { Location } from '@angular/common';
import { ApprovalflowService } from '../../../../../services/approvalflow/service-api/approval.flow.service';
import { Account } from '../../../../../services/account/domain/account.model';
import { FixedDepositAccountService } from '../../../../../services/fixed-deposit-account/service-api/fixed.deposit.account.service';
import { RecurringDepositAccountService } from '../../../../../services/recurring-deposit-account/service-api/recurring.deposit.account.service';
import { ViewsBaseComponent } from '../../../view.base.component';

@Component({
    selector: 'cash-withdraw-view',
    templateUrl: './cash.withdraw.view.component.html',
    styleUrls: ['./cash.withdraw.view.component.css']
})

export class CashWithdrawViewComponent extends ViewsBaseComponent implements OnInit {
    // cashReceiveView: CashReceive;

    tr_particulars: SelectItem[] = TransactionParticulars;
    selectedTR_Particulars: string;
    selectedCurrency: string;
    selectedGlMapCode: string;
    glAccount: GlAccount = new GlAccount();
    isOriginatingBranch: boolean;
    isRepondingBranch: boolean;
    currencies: Currency[];
    currencyMap: Map<number, string>;
    accountTypes: SelectItem[] = AccountTypes;
    accountSubTypes: SelectItem[] = SubAccountTypes;
    selectedAccountType: string = '';
    selectedSubAccountType: string = '';
    amountLCYInWords: string;
    amountCCYInWords: string;
    currencyCode: string;
    cashDepositForm: FormGroup;
    amountInWords: string;
    tellerId: number;
    accountId: number;
    accountNumber: string = '';
    accountNumberChanged: Subject<string> = new Subject<string>();
    selectedCurrencyChange: Subject<string> = new Subject<string>();
    accountDetails: Account = new Account();
    local_currency: boolean = false;
    formattedAccountNumber: string;
    teller: Teller = new Teller();
    tellerBalance: TellerBalance = new TellerBalance();
    minDate: Date;
    queryParams: any;
    isBaseCurrency: boolean = true;
    exchangeRateTypes: Map<number, string> = new Map();
    exchangeRate: ExchangeRate = new ExchangeRate;
    baseCurrency: string = "BDT";
    foreignCurrency: string;
    selectedGlCurrency: string;
    multiCurrencyGl: boolean = false;
    ibta_Required: boolean = false;
    ibtaTxnParticulars: Map<string, string> = new Map();
    glCurrencies: any[];
    ibtaInformation: IbtaInformation = new IbtaInformation();
    accountTxn: boolean = false;
    glTxn: boolean = false;
    branches: Branch[];
    tellerLimit: TellerLimit = new TellerLimit();
    showExchangeRate: boolean = false;
    currencyOption = { prefix: '', allowNegative: false, align: 'left', precision: 2 };

    demandDepositDisplay = false;
    fixedDepositDisplay = false;
    recurringDepositdisplay = false;


    demandDepositAccountId: number;
    fixedDepositAccountId: number;
    recurringDepositAccountId: number;

    amountMaxLength: number = 28;
    currencyDifferenceChecker: boolean = false;

    availableBalance: number;

    bearerdisplay = false;
    bearerInfo = new BearerInfo();
    extractedBearerInfo = new BearerInfo();
    bearerTransactionChecker = true;

    showVerifierSelectionModal: Observable<boolean>;

    cashWithdrawView: CashWithdraw = new CashWithdraw();
    verifierSelectionModalVisible: Observable<boolean>;
    ibTrParticular = '';
    customerId: number;

    originatingBranch = '';
    respondingBranch = '';

    signatureAccountId: number;
    signatureCustomerInputId: number;
    demandDepositSignatureDisplay = false;

    signatureFixedDepositAccountId: number;
    fixedDepositSignatureDisplay = false;
    signatureFixedDepositCustomerInputId: number;

    signatureRecurringDepositCustomerInputId: number;
    signatureRecurringDepositAccountId: number;
    recurringDepositSignatureDisplay = false;


    denominations: TellerDenominationView[] = [];
    denominationNotes: TellerDenominationView[] = [];
    denominationCoins: TellerDenominationView[] = [];
    denominationDisplay = false;
    denominationChecker = true;
    noteTotal: number = 0;
    coinTotal: number = 0;
    voucherNumber: number;
    subglTxn: boolean = false;
    subglAccount: any;
    @ViewChild('bearerComponent') bearerComponent: any;

    constructor(private bankService: BankService,
        private demandDepositAccountService: DemandDepositAccountService,
        private fixedDepositAccountService: FixedDepositAccountService,
        private recurringDepositAccountService: RecurringDepositAccountService,
        private exchangeRateService: ExchangeRateService,
        private glAccountService: GlAccountService,
        private notficationService: NotificationService,
        private amountInWordService: AmountInWordsService,
        private tellerService: TellerService,
        private route: ActivatedRoute,
        protected router: Router,
        private accountService: AccountService,
        protected location: Location,
        protected approvalFlowService: ApprovalflowService) {
        super(location, router, approvalFlowService, notficationService);
    }

    ngOnInit() {
        this.showVerifierSelectionModal = of(false);
        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.command = this.queryParams.command;
            this.taskId = this.queryParams.taskId;
            this.processId = this.queryParams.taskId;
            this.isBaseCurrency = this.queryParams['isBaseCurrency'] === "true" ? true : false;
        });

        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.tellerId = +params['tellerId'];
            this.voucherNumber = +params['voucherNumber'];
        });

        if (this.voucherNumber) {
            this.subscribers.fetchCashDepositSub = this.tellerService.fetchCashWithdrawDetail({ 'voucherNumber': this.voucherNumber }).subscribe(
                data => {
                    this.cashWithdrawView = data;
                    this.selectedCurrency = this.cashWithdrawView.transactionCurrencyCode;
                    this.amountCCYInWords = this.amountInWordService.convertAmountToWords(this.cashWithdrawView.amountCcy, this.selectedCurrency || null);
                    this.amountLCYInWords = this.amountInWordService.convertAmountToWords(this.cashWithdrawView.amountLcy, this.baseCurrency || null);

                    if (this.cashWithdrawView.transactionDebitAccountType === 'CASA' || this.cashWithdrawView.transactionDebitAccountType === 'SSP' || this.cashWithdrawView.transactionDebitAccountType === 'MTDR') {
                        this.cashWithdrawView.ibtaInformation = new IbtaInformation();
                        this.selectedAccountType = "ACCOUNT";
                        this.glTxn = false;
                        this.accountTxn = true;
                        this.selectedSubAccountType = this.cashWithdrawView.transactionDebitAccountType;
                        this.accountService.fetchAccountDetails({ 'accountId': this.cashWithdrawView.accountId }).subscribe(
                            data => {
                                this.accountNumber = data.number;
                                this.fetchAccountDetails();
                            }
                        )
                    }
                    else if (this.cashWithdrawView.transactionDebitAccountType == 'GL') {
                        this.selectedAccountType = "GL"
                        this.glTxn = true;
                        this.accountTxn = false;
                        this.glAccountService.fetchGlAccountDetails({ 'id': this.cashWithdrawView.accountId }).subscribe(
                            data => {
                                this.selectedGlMapCode = data.code;

                                this.fetchGlAccount();
                            }
                        )
                    }

                    else if (this.cashWithdrawView.transactionDebitAccountType == 'SUBGL') {
                        this.glAccountService.fetchSubGlDetails({ subsidiaryLedgerId: this.cashWithdrawView.accountId }).subscribe(
                            data => {
                                this.glTxn = false;
                                this.accountTxn = false;
                                this.subglTxn = true;
                                this.subglAccount = data;
                                this.selectedCurrency = this.subglAccount.currencyCode;
                                // this.fetchGlAccount();
                            }
                        )
                    }
                    this.subscribers.fetchSub = this.tellerService.fetchTellerById({ id: this.tellerId }).subscribe(
                        tellerDetail => {
                            this.teller = tellerDetail;
                            this.tellerLimit = this.teller.tellerLimits.filter(limit => limit.currencyCode === this.cashWithdrawView.transactionCurrencyCode)[0] ? this.teller.tellerLimits.filter(limit => limit.currencyCode === this.cashWithdrawView.transactionCurrencyCode)[0] : new TellerLimit();
                            if (this.cashWithdrawView.transactionCurrencyCode) {
                            }
                            if (this.teller.denominationRequired) {
                                this.denominationChecker = false;
                                this.cashWithdrawView.tellerDenominationTransactions.map(
                                    data => {
                                        if (data) {
                                            let newDenomination: TellerDenominationView = new TellerDenominationView();
                                            newDenomination.quantity = data.quantity;
                                            this.tellerService.fetchDenominationDetails({ id: data.denominationId }).subscribe(
                                                denomination => {
                                                    newDenomination.denominationType = denomination.denominationType;
                                                    newDenomination.denominationValue = denomination.denominationValue;
                                                    newDenomination.netBalance = (+newDenomination.denominationValue) * (+newDenomination.quantity);
                                                    if (newDenomination.denominationType == 'NOTE') {
                                                        this.denominationNotes = [...this.denominationNotes, newDenomination];
                                                        this.noteTotal = this.noteTotal + newDenomination.netBalance;
                                                    }
                                                    else if (newDenomination.denominationType == 'COIN') {
                                                        this.denominationCoins = [...this.denominationCoins, newDenomination];
                                                        this.coinTotal = this.coinTotal + newDenomination.netBalance;
                                                    }
                                                }
                                            )

                                        }
                                    }
                                )

                            }
                        });

                    this.subscribers.fetchBal = this.tellerService.fetchBalanceByTellerIdAndCurrencyCode({
                        tellerId: this.tellerId, currencyCode: this.cashWithdrawView.transactionCurrencyCode
                    }).subscribe(
                        tellerBalance => {
                            this.tellerBalance = tellerBalance;
                        }
                    );

                }
            )
        }

        else {


            this.subscribers.fetchCashDepositSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                data => {
                    this.cashWithdrawView = data;
                    this.selectedCurrency = this.cashWithdrawView.transactionCurrencyCode;
                    this.amountCCYInWords = this.amountInWordService.convertAmountToWords(this.cashWithdrawView.amountCcy, this.selectedCurrency || null);
                    this.amountLCYInWords = this.amountInWordService.convertAmountToWords(this.cashWithdrawView.amountLcy, this.baseCurrency || null);

                    if (this.cashWithdrawView.transactionDebitAccountType === 'CASA' || this.cashWithdrawView.transactionDebitAccountType === 'SSP' || this.cashWithdrawView.transactionDebitAccountType === 'MTDR') {
                        this.cashWithdrawView.ibtaInformation = new IbtaInformation();
                        this.selectedAccountType = "ACCOUNT";
                        this.glTxn = false;
                        this.accountTxn = true;
                        this.selectedSubAccountType = this.cashWithdrawView.transactionDebitAccountType;
                        this.accountService.fetchAccountDetails({ 'accountId': this.cashWithdrawView.accountId }).subscribe(
                            data => {
                                this.accountNumber = data.number;
                                this.fetchAccountDetails();
                            }
                        )
                    }
                    else if (this.cashWithdrawView.transactionDebitAccountType == 'GL') {
                        this.selectedAccountType = "GL"
                        this.glTxn = true;
                        this.accountTxn = false;
                        this.glAccountService.fetchGlAccountDetails({ 'id': this.cashWithdrawView.accountId }).subscribe(
                            data => {
                                this.selectedGlMapCode = data.code;

                                this.fetchGlAccount();
                            }
                        )
                    }
                    else if (this.cashWithdrawView.transactionDebitAccountType == 'SUBGL') {
                        this.glAccountService.fetchSubGlDetails({ subsidiaryLedgerId: this.cashWithdrawView.accountId }).subscribe(
                            data => {
                                this.glTxn = false;
                                this.accountTxn = false;
                                this.subglTxn = true;
                                this.subglAccount = data;
                                this.selectedCurrency = this.subglAccount.currencyCode;
                                // this.fetchGlAccount();
                            }
                        )
                    }
                    this.subscribers.fetchSub = this.tellerService.fetchTellerById({ id: this.tellerId }).subscribe(
                        tellerDetail => {
                            this.teller = tellerDetail;
                            this.tellerLimit = this.teller.tellerLimits.filter(limit => limit.currencyCode === this.cashWithdrawView.transactionCurrencyCode)[0] ? this.teller.tellerLimits.filter(limit => limit.currencyCode === this.cashWithdrawView.transactionCurrencyCode)[0] : new TellerLimit();
                            if (this.cashWithdrawView.transactionCurrencyCode) {
                            }
                            if (this.teller.denominationRequired) {
                                this.denominationChecker = false;
                                this.cashWithdrawView.tellerDenominationTransactions.map(
                                    data => {
                                        if (data) {
                                            let newDenomination: TellerDenominationView = new TellerDenominationView();
                                            newDenomination.quantity = data.quantity;
                                            this.tellerService.fetchDenominationDetails({ id: data.denominationId }).subscribe(
                                                denomination => {
                                                    newDenomination.denominationType = denomination.denominationType;
                                                    newDenomination.denominationValue = denomination.denominationValue;
                                                    newDenomination.netBalance = (+newDenomination.denominationValue) * (+newDenomination.quantity);
                                                    if (newDenomination.denominationType == 'NOTE') {
                                                        this.denominationNotes = [...this.denominationNotes, newDenomination];
                                                        this.noteTotal = this.noteTotal + newDenomination.netBalance;
                                                    }
                                                    else if (newDenomination.denominationType == 'COIN') {
                                                        this.denominationCoins = [...this.denominationCoins, newDenomination];
                                                        this.coinTotal = this.coinTotal + newDenomination.netBalance;
                                                    }
                                                }
                                            )

                                        }
                                    }
                                )

                            }
                        });

                    this.subscribers.fetchBal = this.tellerService.fetchBalanceByTellerIdAndCurrencyCode({
                        tellerId: this.tellerId, currencyCode: this.cashWithdrawView.transactionCurrencyCode
                    }).subscribe(
                        tellerBalance => {
                            this.tellerBalance = tellerBalance;
                        }
                    );

                }
            )
        }
        this.fetchExchangeRateTypes();
    }


    showDenomination() {
        this.denominationDisplay = true;
    }

    fetchAccountDetails() {
        let urlSearchMap = new Map();
        urlSearchMap.set('accountNumber', this.accountNumber);

        if (this.selectedSubAccountType == "CASA") {
            this.subscribers.fetchDemandDepositAccountSub =
                this.demandDepositAccountService.fetchDemandDepositAccounts(urlSearchMap).subscribe(
                    data => {
                        if (data.content.length == 1) {
                            this.fetchAccountDetailsByType(data.content)
                            this.demandDepositAccountId = data.content[0].id;
                            this.customerId = data.content[0].custimerId;
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
                            this.fixedDepositAccountId = data.content[0].id;
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
                            this.recurringDepositAccountId = data.content[0].id;
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

            if (data[0].balance) {
                this.availableBalance = data[0].balance.availableBalance;
            }
            if (this.selectedCurrency !== this.baseCurrency) {
                this.showExchangeRate = true;
            }
            else {
                this.showExchangeRate = false;
            }

        } else {
            this.accountDetails = new Account();
        }
        this.currencyOption.precision = this.selectedCurrency == "BDT" ? 2 : 4;
        this.amountMaxLength = this.selectedCurrency == "BDT" ? 28 : 27;
    }


    fetchGlAccount() {
        this.subscribers.glAccountFetchSub = this.glAccountService.
            fetchGlAccounts(new Map([["roots", "false"], ["code", this.selectedGlMapCode], ["aspage", "false"]]))
            .subscribe(data => {
                this.glAccount = data[0];
                if (this.glAccount.currencyRestriction === "LOCAL_CURRENCY") {
                    this.selectedCurrency = this.baseCurrency;
                    this.multiCurrencyGl = false;
                    this.showExchangeRate = false;
                }
                if (this.glAccount.currencyRestriction !== "LOCAL_CURRENCY") {
                    this.multiCurrencyGl = true;
                    if (this.glAccount.currencies.length < 2) {
                        this.selectedCurrency = this.glAccount.currencies[0];
                        if (this.selectedCurrency !== this.baseCurrency) {
                            this.showExchangeRate = true;
                        }
                    }
                    this.glCurrencies.push({ label: "Choose", value: null });
                    this.glAccount.currencies.forEach(currency => this.glCurrencies.push({ label: currency, value: currency }));
                }
                if (this.glAccount.isIbtaRequired) {
                    this.ibta_Required = true;
                    this.fetchIbtaTxnParticulars();
                    if (this.cashWithdrawView.ibtaInformation.originatingBranchId) {
                        this.fetchBranches(this.cashWithdrawView.ibtaInformation.originatingBranchId, (name) => this.originatingBranch = name);
                    }
                    if (this.cashWithdrawView.ibtaInformation.respondingBranchId) {
                        this.fetchBranches(this.cashWithdrawView.ibtaInformation.respondingBranchId, (name) => this.respondingBranch = name);
                    }
                }
                else {
                    this.ibta_Required = false;
                }
            });
    }


    // onAccountNumberChange(accNumber: string) {
    //     if (this.accountNumber != '') {
    //         this.accountNumberChanged.next(accNumber);
    //     }
    //     if (this.selectedGlMapCode != '') {
    //         this.accountNumberChanged.next(accNumber);
    //     }
    // }

    fetchTellerDetail(tellerId: number) {
        this.subscribers.fetchSub = this.tellerService.fetchTellerById({ id: tellerId }).subscribe(
            tellerDetail => {
                this.teller = tellerDetail;
                this.fetchTellerBalance(tellerId, this.cashWithdrawView.transactionCurrencyCode);
                this.tellerLimit = this.teller.tellerLimits.filter(limit => limit.currencyCode === this.cashWithdrawView.transactionCurrencyCode)[0] ? this.teller.tellerLimits.filter(limit => limit.currencyCode === this.cashWithdrawView.transactionCurrencyCode)[0] : new TellerLimit();
            });
    }

    fetchTellerBalance(tellerId: number, currencyCode: string) {
        this.subscribers.fetchBal = this.tellerService.fetchBalanceByTellerIdAndCurrencyCode({
            tellerId: tellerId, currencyCode: currencyCode
        }).subscribe(
            tellerBalance => {
                this.tellerBalance = tellerBalance;
            }
        );
    }

    private fetchExchangeRateTypes() {
        this.exchangeRateService.fetchExchangeRateTypes().subscribe(
            data => {
                (data.content).forEach(element => {
                    this.exchangeRateTypes.set(element.id, element.typeName, );
                });
                if (this.exchangeRateTypes) {
                    console.log(this.exchangeRateTypes.get(1));
                }
            }
        )

    }

    postTransaction() {
        this.tellerService.postUnpostedTransactions({ voucherNumber: this.voucherNumber }).subscribe({
            complete: () => {
                this.notificationService.sendSuccessMsg('unposted.transaction.posted.success'); this.router.navigate(['/teller-transaction']);
                this.router.navigate(['/teller-transaction']);
            }
        }
        );
    }
    // private fetchExchangeRateByCurrencyCode(rateTypeId: number, currencyCode: string) {
    //     this.exchangeRateService.fetcExchangeRatesByCurrencyCode({ rateTypeId: rateTypeId, currencyCode: currencyCode }).subscribe(
    //         exchangeRate => {
    //             this.exchangeRate.rate = exchangeRate.rate;
    //             this.cashDepositForm.get('exchangeRate').setValue(exchangeRate.rate);
    //         }
    //     );
    // }

    // accountNumberFormat(accountNumber: string) {

    //     if (accountNumber.length !== 13) {
    //         let arr = accountNumber.split("-");
    //         let branchcode = arr[0].padStart(3, "0");
    //         let productcode = arr[1].padStart(3, "0");
    //         let accountId = arr[2].padStart(7, "0");
    //         this.accountNumber = branchcode + "-" + productcode + "-" + accountId;
    //         this.formattedAccountNumber = branchcode + productcode + accountId;
    //     }
    // }

    // fetchApplicationDate() {
    //     let urlSearchParam = new Map();
    //     urlSearchParam.set("name", "application-date");
    //     this.commonConfigurationService.fetchApplicationDate(urlSearchParam).subscribe(
    //         data => {
    //             this.minDate = new Date(data);
    //             this.cashDepositForm.get('valueDate').setValue(new Date(data));
    //             this.cashDepositForm.get('transactionDate').setValue(new Date(data));
    //             this.cashDepositForm.get('originatingDate').setValue(new Date(data));
    //         }
    //     );
    // }

    fetchIbtaTxnParticulars() {
        this.tellerService.fetchIbtaTxnParticularsDetails({ 'id': this.cashWithdrawView.ibtaInformation.ibtaTrCode }).subscribe(
            data => {
                this.ibTrParticular = data.particulars;
            }
        );
    }
    // loadAllCurrencies() {
    //     this.currencyService.fetchCurrencies(new Map()).subscribe(
    //         data => {
    //             this.currencies = data.content;
    //             this.currencyMap = new Map();
    //             this.currencies.forEach(element => {
    //                 this.currencyMap.set(element.id, element.name);
    //             });
    //         }
    //     );
    // }

    fetchBranches(bracnhId: number, fn: Function) {
        this.bankService.fetchOwnBranchDetails({ 'branchId': bracnhId }).subscribe(
            data => {
                if (this.isFunction(fn)) {
                    fn(data.name);
                }
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

    backToTeller() {
        this.router.navigate(['/teller-transaction']);
    }
}
