import { Component, OnInit, SimpleChange, SimpleChanges, OnChanges, ViewChild, HostListener } from "@angular/core";
import { BaseComponent } from "../../../common/components/base.component";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TellerService } from '../../../services/teller/service-api/teller.service';
import { TransactionAccountType } from '../../../common/domain/transaction.account.type.enum.model';
import { CurrencyService } from '../../../services/currency/service-api/currency.service';
import { AmountInWordsService } from '../../../common/services/amount.in.words.service';
import { NotificationService } from '../../../common/notification/notification.service';
import { Teller, TellerBalance, TellerLimit } from "../../../services/teller/domain/teller.models";
import { Subject, Observable } from "rxjs";
import { TellerDenominationTransaction, Denomination, CashTransfer } from "../../../services/teller/domain/teller.domain.model";
import { DenominationBalanceService } from "../../../services/teller/service-api/denomination.balance.service";
import * as _ from "lodash";
import { SelectItem, DataTable } from "primeng/primeng";
import { CurrencyRestriction } from '../../../common/domain/currency.enum.model';
import { Currency, ExchangeRateType, ExchangeRate } from "../../../services/currency/domain/currency.models";
import { ExchangeRateService } from "../../../services/currency/service-api/exchange.rate.service";
import { CommonConfigurationService } from "../../../services/common-configurations/service-api/common.configurations.service";
import { isNullOrUndefined } from "util";
import { element } from "protractor";
import { TransferTypes } from "../../../common/domain/teller.enum.model";
import { environment } from "../../..";
import { NgSsoService } from "../../../services/security/ngoauth/ngsso.service";




let Currency_Short_List = [
    { label: 'Select currency', value: null },
    { label: 'Taka', value: 'BDT' },
    { label: 'U.S Dollar', value: 'USD' },
    { label: 'Euro', value: 'EUR' }
];

@Component({
    selector: 'ababil-cash-transfer',
    templateUrl: './cash.transfer.component.html',
    styleUrls: ['./cash.transfer.component.scss']
})
export class CashTransferComponent extends BaseComponent implements OnInit {

    currencyShortList: SelectItem[] = Currency_Short_List;
    selectedCurrency: string;
    currencies: Currency[];
    currencyMap: Map<number, string>;
    tellers: Teller[];
    tellerDenominationTransactionList: any[] = [];
    vault_denomination_balance_list: any[];
    denominationList: any;
    cashTransferForm: FormGroup;
    vault_denomination_balance_changed: Subject<any[]> = new Subject<any[]>();
    tellerId: number;
    total_denomination_amount: number;
    sourceTeller: Teller = new Teller();
    tellerBalance: TellerBalance = new TellerBalance();
    amountLCYInWords: string;
    amountCCYInWords: string;
    destinationTellerDetail: Teller = new Teller();
    isSourceVault: boolean;
    isDestinationVault: boolean;
    denominationAmountMatches: boolean;;
    sourceTellerBalance: TellerBalance = new TellerBalance();
    queryParams: any;
    isBaseCurrency: boolean;
    minDate: Date = new Date();
    exchangeRateTypes: SelectItem[];
    exchangeRate: ExchangeRate = new ExchangeRate;
    baseCurrency: string;
    total_balance_amount: number;
    foreignCurrency: string;
    tellerLimit: TellerLimit = new TellerLimit();
    transferTypes: SelectItem[] = TransferTypes;
    selectedType: string = 'receive';
    receiveChecker: boolean = true;
    sendChecker: boolean = false;
    previousTransactionDenominations = [];
    tellerDenominationBalances = [];
    denominationStatus = 'RECEIVE';
    denominationDisplay = false;
    extractedDenominations: any[] = [];
    denominationChecker = true;
    pendingTransactions: CashTransfer[] = [];
    voucherNumber: number;
    cashTransferId: number;
    tellerCurrencyCode: string;
    amountVisible = false;

    userName$: String;
    userActiveBranch$: number;
    userHomeBranch$: number;
    auth: string = environment.auth;
    key_T = 84;

    @HostListener('window:keydown', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (event.shiftKey && event.keyCode === this.key_T) {
            console.log(event);
            this.transfer();
        }
        else if (event.shiftKey && event.keyCode === this.key_B) {
            this.cancel();
        }

    }

    @ViewChild('denominatorComponent') denominatorComponent: any;

    constructor(
        private notificationService: NotificationService,
        private amountInWordService: AmountInWordsService,
        private tellerService: TellerService,
        private currencyService: CurrencyService,
        private exchangeRateService: ExchangeRateService,
        private commonConfigurationService: CommonConfigurationService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private ngSsoService: NgSsoService, ) {
        super();
        // this.vault_denomination_balance_changed
        //     .pipe(debounceTime(1500), distinctUntilChanged())
        //     .subscribe(model => {
        //         if (this.isSourceVault) {
        //             _.merge(this.tellerDenominationTransactionList, (model.map(denominationDetailsofVault => {
        //                 return {
        //                     denominationId: denominationDetailsofVault.denominationId,
        //                     debit_quantity: denominationDetailsofVault.quantity
        //                 }
        //             })));

        //             this.tellerDenominationTransactionList.forEach(element => {
        //                 if (element.balance_amount >= 0) {
        //                     this.total_balance_amount += (element.debit_quantity * element.denominationValue);
        //                 }
        //             });

        //         }
        //     });
    }
    ngOnInit() {

        if (environment.auth === 'NGSSO') {
            this.ngSsoService.account().subscribe(account => {
                this.userName$ = account.username;
                this.userActiveBranch$ = account.activeBranch;
                this.userHomeBranch$ = account.homeBranch;
                this.getTellers();
            });
        }

        this.total_balance_amount = 0;
        this.exchangeRateTypes = [];
        this.route.queryParams.subscribe(queryParams => {
            this.queryParams = queryParams;
            this.isBaseCurrency = this.queryParams['isBaseCurrency'] === "true" ? true : false;
        });
        this.total_denomination_amount = 0;
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.tellerId = +params['tellerId'];
        });
        if (!this.isBaseCurrency) {
            this.selectedCurrency = this.queryParams['currencyCode'];
        }
        else {
            this.selectedCurrency = "BDT";
        }
        this.fetchSourceTellerDetail(this.tellerId);

        if (!this.isBaseCurrency) {
            this.fetchExchangeRateTypes();
        }
        this.fetchApplicationDate();
        if (this.isBaseCurrency !== undefined) {
            this.prepareForm();
        }

        this.fetchBaseCurrency();
        this.fetchPendingTransactions();
    }

    ngDoCheck() {
        this.tellerDenominationTransactionList.forEach(tellerDenominationTransactionDetail => {
            if (tellerDenominationTransactionDetail.quantity >= 0) {
                tellerDenominationTransactionDetail.transaction_amount = tellerDenominationTransactionDetail.quantity * tellerDenominationTransactionDetail.denominationValue;
            }
            if (isNullOrUndefined(tellerDenominationTransactionDetail.debit_quantity)) {
                tellerDenominationTransactionDetail.debit_quantity = 0;
            }
            if (!tellerDenominationTransactionDetail.quantity) {
                tellerDenominationTransactionDetail.quantity = 0;
            }
            if (tellerDenominationTransactionDetail.debit_quantity) {
                tellerDenominationTransactionDetail.balance_amount = tellerDenominationTransactionDetail.debit_quantity * tellerDenominationTransactionDetail.denominationValue;
            }


        });
    }

    prepareForm() {
        this.cashTransferForm = this.formBuilder.group({
            exchangeRate: [''],
            exchangeRateTypeId: [''],
            destinationTellerId: ['', [Validators.required]],
            transactionCurrencyCode: [''],
            amountCcy: ['', [Validators.required]],
            amountLcy: [''],
            narration: ['', [Validators.required]],
            valueDate: [null, [Validators.required]],
            transactionDate: [null]
        });

        this.cashTransferForm.get('amountCcy').valueChanges.subscribe(val => {
            let amount = this.cashTransferForm.get('amountCcy').value;
            if ((amount + "").length > 20) {
                this.amountCCYInWords = "";
            } else {
                this.amountCCYInWords = this.amountInWordService.convertAmountToWords(amount, this.selectedCurrency || null);
            }
            this.cashTransferForm.get('amountLcy').setValue(amount * this.cashTransferForm.get('exchangeRate').value);
        });

        this.cashTransferForm.get('amountLcy').valueChanges.subscribe(value => {
            let amount = this.cashTransferForm.get('amountLcy').value;
            if ((amount + "").length > 20) {
                this.amountLCYInWords = "";
            } else {
                this.amountLCYInWords = this.amountInWordService.convertAmountToWords(amount, null);
            }
        });

        this.cashTransferForm.get('destinationTellerId').valueChanges.subscribe(
            value => {
                if (this.sendChecker) {
                    if (!value) {
                        this.cashTransferForm.get('destinationTellerId').setValue(null);
                    }
                    this.destinationTellerDetail = this.tellers.filter(teller => teller.id === value)[0];

                    if (this.destinationTellerDetail.denominationRequired) {
                        this.denominationChecker = false;
                        this.amountVisible = true;
                    }
                }
            });

        if (this.isBaseCurrency) {
            this.cashTransferForm.get('exchangeRate').setValue(1);
            this.cashTransferForm.get('exchangeRateTypeId').setValue(1);
        }



        this.cashTransferForm.get('valueDate').valueChanges.subscribe(
            value => {
                if (!value) {
                    this.cashTransferForm.get('valueDate').setValue(new Date());
                }


            });

        if (!this.cashTransferForm.get('valueDate').value) {
            this.cashTransferForm.get('valueDate').setValue(this.minDate);
        }

        this.cashTransferForm.get('exchangeRateTypeId').valueChanges.subscribe(
            value => {
                if (value && !this.isBaseCurrency) {
                    this.fetchExchangeRateByCurrencyCode(this.cashTransferForm.get('exchangeRateTypeId').value, this.selectedCurrency);
                }
            }
        );
        this.cashTransferForm.get('exchangeRate').valueChanges.subscribe(
            value => {
                if (!value && this.isBaseCurrency) {
                    this.cashTransferForm.get('exchangeRate').setValue(1);
                }
                this.cashTransferForm.get('amountLcy').setValue(this.cashTransferForm.get('amountCcy').value * this.cashTransferForm.get('exchangeRate').value);

            }
        );
    }

    fetchPendingTransactions() {
        let queryParams = new Map<string, string>();
        queryParams.set('tellerId', this.tellerId.toString());
        this.tellerService.fetchPendingTransferTransactions(queryParams).subscribe(
            data => this.pendingTransactions = data
        )
    }


    fetchApplicationDate() {
        let urlSearchParam = new Map();
        urlSearchParam.set("name", "application-date");
        this.commonConfigurationService.fetchApplicationDate(urlSearchParam).subscribe(
            data => {
                this.minDate = new Date(data);
                this.cashTransferForm.get('valueDate').setValue(new Date(data));
                this.cashTransferForm.get('transactionDate').setValue(new Date(data));
            }
        );
    }

    fetchBaseCurrency() {
        let urlSearchParam = new Map();
        urlSearchParam.set("name", "base-currency");
        this.commonConfigurationService.fetchBaseCurrency(urlSearchParam).subscribe(
            data => {
                this.baseCurrency = data;
            }
        );
    }
    getTellers() {
        let urlSearchMap = new Map<any, any>();
        urlSearchMap.set("branchId", this.userActiveBranch$);
        this.subscribers.fetchTellers = this.tellerService.fetchTellers(urlSearchMap).subscribe(
            tellers => {
                this.tellers = (tellers.content).filter(
                    teller => teller.id !== this.tellerId
                );
            });
    }
    fetchSourceTellerDetail(tellerId: number) {
        this.subscribers.fetchSub = this.tellerService.fetchTellerById({ id: tellerId }).subscribe(
            sourceTellerDetail => {
                this.sourceTeller = sourceTellerDetail;
                if (this.sourceTeller.denominationRequired) {
                    this.denominationChecker = false;
                    this.amountVisible = true;
                }
                else {
                    this.denominatorComponent.changeDenominationRequiredStatus();
                }
                this.tellerLimit = this.sourceTeller.tellerLimits.filter(tellerLimit => tellerLimit.currencyCode === this.selectedCurrency)[0];

                this.isSourceVault = (sourceTellerDetail.tellerType === "VAULT") ? true : false;
                this.fetchTellerBalance();
                // if (this.isSourceVault) {
                //     this.fetchDenominationList();
                //     this.getDenominationBalanceByTellerId(this.tellerId);
                // }

            });

    }

    fetchTellerBalance() {
        this.subscribers.fetchBal = this.tellerService.fetchBalanceByTellerIdAndCurrencyCode({ tellerId: this.tellerId, currencyCode: this.selectedCurrency }).subscribe(
            tellerBalance => {
                this.tellerBalance = tellerBalance;
                if (tellerBalance.tellerDenominationBalances) {
                    this.tellerDenominationBalances = [];
                    this.tellerDenominationBalances = tellerBalance.tellerDenominationBalances;
                    this.tellerCurrencyCode = this.selectedCurrency;
                }
            }
        );
    }

    // fetchDenominationList() {
    //     this.subscribers.fetchDenoms = this.denominationBalanceService.fetchDenominations().subscribe(
    //         denominations => {
    //             this.denominationList = denominations.content;
    //             this.makeDenominationTransactionList();
    //         });
    // }

    // makeDenominationTransactionList() {
    //     let tellerDenominationTransactionList: any = (this.denominationList).map(denomination => {
    //         return {
    //             denominationId: denomination.id,
    //             denominationValue: denomination.denominationValue,
    //             denominationType: denomination.denominationType,
    //             quantity: 0,
    //             balance_amount: 0,
    //             transaction_amount: 0
    //         }
    //     });
    //     this.tellerDenominationTransactionList = [...tellerDenominationTransactionList];
    //     this.resetTellerDominationTransactionListSummary();
    // }

    // onTellerDominationTransactionListEdit(event) {
    //     this.resetTellerDominationTransactionListSummary();
    // }

    // resetTellerDominationTransactionListSummary() {
    //     this.total_denomination_amount = 0;
    //     this.tellerDenominationTransactionList.forEach(entry => {
    //         this.total_denomination_amount += (+entry.transaction_amount);
    //     });
    //     this.denominationAmountMatches = (this.total_denomination_amount === this.cashTransferForm.get('amountLcy').value) ? true : false;
    // }

    // getDenominationBalanceByTellerId(vaultId: number) {
    //     this.subscribers.fechDenomBal = this.denominationBalanceService.fetchDenominationBalanceByTellerId({ tellerId: vaultId }).subscribe(
    //         paged_denom_Balance => {
    //             this.vault_denomination_balance_list = (paged_denom_Balance.content).sort(function (obj1, obj2) {
    //                 return obj1.denominationId - obj2.denominationId;
    //             });
    //             this.vault_denomination_balance_changed.next(paged_denom_Balance.content);
    //         });
    // }

    transfer() {
        if (this.formsInvalid()) return;
        else {

            let cashTransfer: CashTransfer = this.cashTransferForm.value;
            cashTransfer.tellerId = this.tellerId;
            cashTransfer.transactionCurrencyCode = this.selectedCurrency;
            cashTransfer.activityId = 101;
            if (this.sourceTeller.denominationRequired || this.destinationTellerDetail.denominationRequired) {
                cashTransfer.tellerDenominationTransactions = this.extractedDenominations;
            }
            if (this.selectedType == 'send') {
                cashTransfer.cashTransferTransactionType = 'SEND_MONEY';
                let globalTxnQueryParam = new Map<string, string>();
                globalTxnQueryParam.set('userId', 'as');
                globalTxnQueryParam.set('activityId', '101');
                this.subscribers.fetchGlobalTxnNoSub = this.tellerService.fetchGlobalTxnNo(globalTxnQueryParam).subscribe(
                    data => {
                        cashTransfer.globalTxnNumber = data;
                        this.subscribers.cashTellerSub = this.tellerService.cashTransfer(cashTransfer).subscribe(
                            data => {
                                this.notificationService.sendSuccessMsg("teller.cash.transfer.success", { voucher: cashTransfer.globalTxnNumber });
                                this.clearForm();
                                this.fetchSourceTellerDetail(this.tellerId);

                            }
                        )
                    })
            }
            else if (this.selectedType == 'receive') {
                cashTransfer.cashTransferTransactionType = 'RECEIVE_MONEY';
                cashTransfer.globalTxnNumber = this.voucherNumber;
                cashTransfer.id = this.cashTransferId;
                this.subscribers.cashTellerSub = this.tellerService.cashTransfer(cashTransfer).subscribe(
                    data => {
                        this.notificationService.sendSuccessMsg("teller.cash.transfer.success", { voucher: this.voucherNumber })
                        this.clearForm();

                        this.fetchPendingTransactions();
                        this.fetchSourceTellerDetail(this.tellerId);
                    });

            }
        }
    }

    clearForm() {
        this.cashTransferForm.controls.amountCcy.reset();
        this.amountCCYInWords = '';
        this.cashTransferForm.controls.narration.reset();
        if (!this.isBaseCurrency) {
            this.cashTransferForm.controls.amountLcy.reset();
            this.amountLCYInWords = '';
        }
    }

    formsInvalid() {
        return this.cashTransferForm.invalid || isNaN(this.cashTransferForm.get('amountCcy').value);
    }

    private fetchCurrencies() {
        this.currencyService.fetchCurrencies(new Map())
            .subscribe(data => {
                this.currencies = data.content;
                this.currencyMap = new Map();
                for (let currency of this.currencies) {
                    this.currencyMap.set(currency.id, currency.name);
                }
            });
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
        this.exchangeRateService.fetcExchangeRatesByCurrencyCode({ rateTypeId: rateTypeId, currencyCode: this.selectedCurrency }).subscribe(
            exchangeRate => {
                this.exchangeRate.rate = exchangeRate.rate;
                this.cashTransferForm.get('exchangeRate').setValue(exchangeRate.rate);
            }
        );
    }

    onTransferTypeChange() {
        this.clearForm();

        if (this.selectedType == 'receive') {
            this.receiveChecker = true;
            this.sendChecker = false;
            this.previousTransactionDenominations = [];
            this.denominationStatus = 'RECEIVE';
        }
        else if (this.selectedType == 'send') {
            this.receiveChecker = false;
            this.sendChecker = true;
            this.denominationStatus = 'SEND';
            if (this.sourceTeller.denominationRequired) {
                this.denominationChecker = false;
                this.amountVisible = true;
            }
            else {
                this.denominationChecker = true;
                this.amountVisible = false;
            }
        }

    }

    showDenomination() {
        this.denominationDisplay = true;
        this.denominatorComponent.clearBalance();
    }

    saveDenomination() {
        this.extractedDenominations = this.denominatorComponent.extractData();
        let amountCCYfromDenomination = this.denominatorComponent.extractTotal();
        this.cashTransferForm.controls.amountCcy.setValue(amountCCYfromDenomination);
        this.closeDenomination();
    }

    closeDenomination() {
        this.denominationDisplay = false;;
    }

    onRowSelect(event) {
        this.cashTransferForm.controls.destinationTellerId.setValue(event.data.tellerId);
        this.cashTransferForm.controls.amountCcy.setValue(event.data.amountCcy);
        this.cashTransferForm.controls.narration.setValue(event.data.narration);
        this.amountCCYInWords = this.amountInWordService.convertAmountToWords(event.data.amountCcy, event.data.transactionCurrencyCode || null);

        if (event.data.transactionCurrencyCode != this.baseCurrency) {
            this.cashTransferForm.controls.exchangeRate.setValue(event.data.exchangeRate);
            this.cashTransferForm.controls.exchangeRateTypeId.setValue(event.data.exchangeRateTypeId);
        }
        this.cashTransferForm.controls.transactionCurrencyCode.setValue(event.data.transactionCurrencyCode);
        this.cashTransferForm.controls.amountLcy.setValue(event.data.amountLcy);
        this.voucherNumber = event.data.globalTxnNumber;
        this.cashTransferId = event.data.id;
        if (event.data.tellerDenominationTransactions.length > 0) {
            this.denominationChecker = false;
            this.extractedDenominations = event.data.tellerDenominationTransactions;
            this.previousTransactionDenominations = event.data.tellerDenominationTransactions;
        }
    }



    cancel() {
        this.navigateAway();
    }
    navigateAway() {
        this.router.navigate(['../'], { relativeTo: this.route, queryParams: { tellerId: this.tellerId } });
    }

}    