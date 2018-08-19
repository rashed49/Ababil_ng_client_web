import { Component, OnInit, HostListener } from '@angular/core';
import { BaseComponent } from '../../../common/components/base.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Message, SelectItem, LazyLoadEvent, MenuItem, DataTable } from 'primeng/primeng';
import { TellerService } from '../../../services/teller/service-api/teller.service';
import { Teller, TellerBalance, TellerLimit } from '../../../services/teller/domain/teller.models';
import { GlAccountService } from '../../../services/glaccount/service-api/gl.account.service';
import { GlAccount } from '../../../services/glaccount/domain/gl.account.model';
import { NotificationService } from '../../../common/notification/notification.service';
import * as _ from "lodash";
import { environment } from '../../..';
import { NgSsoService } from '../../../services/security/ngoauth/ngsso.service';
import { CurrencyService } from '../../../services/currency/service-api/currency.service';
import { ExchangeRateService } from '../../../services/currency/service-api/exchange.rate.service';

@Component({
    selector: 'ababil-teller-dashboard',
    templateUrl: './teller.dashboard.component.html',
    styleUrls: ['./teller.dashboard.component.scss']
})
export class TellerDashboardComponent extends BaseComponent implements OnInit {


    panelMenuItems: MenuItem[];
    currenyWisePieChartData: any;
    currencyWiseLineChartData: any;
    activityLog: any[] = [];
    allocatedTeller: any[];
    allocatedTellerToShow: any[] = [];
    selectedTeller: number;
    teller: Teller = new Teller();
    tellerBalance: TellerBalance[] = [];
    isBaseCurrency: boolean;
    totalRecords: number;
    totalPages: number;
    bdtBalance: number;
    usdBalance: number;
    euroBalance: number;
    inrBalance: number;
    glAccountNameMapping: Map<number, string>;
    multiCurrencyAllowed: boolean = false;
    selectedCurrency: string;
    display: boolean = false;
    cashTransfer: boolean = false;
    cashWithdraw: boolean = false;
    cashDeposit: boolean = false;
    isSourceVault: boolean;
    noTellerAllocation: boolean = true;
    currencySet: any[] = [];
    balanceSet: any[] = [];
    tellerLimits: any[] = [];
    queryParams: any;
    postDisplay = false;
    pendingPosts: any[] = [];
    withdrawVoucherNumber: number;
    depositVoucherNumbwe: number;
    userName$: String;
    userActiveBranch$: number;
    userHomeBranch$: number;
    auth: string = environment.auth;
    data: any;

    currencies: any = null;
    currenciesToShow: any[] = [];
    selectedCurrencyForExRate = null;

    exchangeRateTypes: any[] = [];

    pieChartOptions: any = {
        title: {
            display: true,
            // text: 'Curreny Wise Balance Position',
            fontSize: 14
        },
        legend: {
            position: 'bottom'
        }
    };
    key_D = 68;
    key_T = 84;
    key_W = 87;
    key_P = 80;
    key_L = 76;


    @HostListener('window:keydown', ['$event'])
    keyEvent(event: KeyboardEvent) {
        // console.log(event);

        if (event.shiftKey && event.keyCode === this.key_D) {
            console.log(event);
            this.deposit();
        }

        else if (event.shiftKey && event.keyCode === this.key_T) {
            console.log(event);
            this.transfer();
        }

        else if (event.shiftKey && event.keyCode === this.key_W) {
            console.log(event);
            this.withdraw();
        }

        else if (event.shiftKey && event.keyCode === this.key_P) {
            console.log(event);
            this.goToPendingPosts();
        }

        else if (event.shiftKey && event.keyCode === this.key_L) {
            console.log(event);
            this.goToActivityLog();
        }

    }

    constructor(private tellerService: TellerService,
        private notificationService: NotificationService,
        private glAccountService: GlAccountService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private ngSsoService: NgSsoService,
        private currencyService: CurrencyService,
        private exchangeRateService: ExchangeRateService) {
        super();
        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: '#42A5F5',
                    borderColor: '#1E88E5',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: '#9CCC65',
                    borderColor: '#7CB342',
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        }

    }

    ngOnInit() {

        if (environment.auth === 'NGSSO') {
            this.ngSsoService.account().subscribe(account => {
                this.userName$ = account.username;
                this.userActiveBranch$ = account.activeBranch;
                this.userHomeBranch$ = account.homeBranch;
                this.fetchAllocatedTellers();

            });
        }

        this.fetchCurrencies();
        // this.fetchExchangeRateTypes('USD');
        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            if (params["tellerId"]) {
                this.selectedTeller = params["tellerId"];
            }
        })
        this.panelMenuItems = [
            {
                label: 'Cash Withdraw',
                icon: 'ui-icon-call-made',
                command: (event) => {
                    this.withdraw();
                }
            },
            {
                label: 'Cash Deposit',
                icon: 'ui-icon-call-received',
                command: (event) => {
                    this.deposit();
                }
            },
            {
                label: 'Cash Transfer',
                icon: 'ui-icon-swap-horiz',
                command: (event) => {
                    this.transfer();
                }
            },
            {
                label: 'Currency Buy/Sell',
                icon: 'ui-icon-autorenew',
                command: (event) => {
                    console.log("Currency Buy/Sell");
                }
            },
            {
                label: 'Pending posts',
                icon: 'ui-icon-warning',
                command: (event) => {
                    this.goToPendingPosts();
                }
            },
            {
                label: 'Activity log',
                icon: 'ui-icon-work',
                command: (event) => {
                    this.goToActivityLog();
                }
            },
        ];
        this.loadCurrencyWisePieChart();

    }

    fetchCurrencies() {
        this.subscribers.fetchCurrencySub = this.currencyService.fetchCurrencies(new Map()).subscribe(
            data => {
                this.currencies = data.content;
                let currenciesWithBaseCurrency = this.currencies.map(currencyValue => ({ label: currencyValue.name, value: currencyValue.code }));
                this.subscribers.baseCurrencySub = this.currencyService.fetchBaseCurrency(new Map().set('name', 'base-currency')).subscribe(
                    baseCurrencyData => {
                        this.currenciesToShow = currenciesWithBaseCurrency.filter(base => base.value != baseCurrencyData)
                        this.fetchExchangeRateTypes(this.currenciesToShow[0].value);
                        this.selectedCurrencyForExRate = this.currenciesToShow[0].value;
                    }
                )
            }
        )
    }

    private fetchExchangeRateTypes(currencyCode) {
        this.exchangeRateTypes = [];
        this.subscribers.fetchExchangeRateTypesSub = this.exchangeRateService.fetchExchangeRateTypes().subscribe(
            data => {
                (data.content).map(element => {
                    this.subscribers.fetcExchangeRatesByCurrencyCodeSub =
                        this.exchangeRateService.fetcExchangeRatesByCurrencyCode({ rateTypeId: element.id, currencyCode: currencyCode })
                            .subscribe(
                                exchangeRate => {
                                    if (exchangeRate) {
                                        this.exchangeRateTypes.push({ label: element.typeName, value: exchangeRate.rate, barValue: (exchangeRate.rate * .86) + 'px' });
                                    }
                                }
                            );
                });
            }
        )
    }


    onCurrencyChange() {
        this.fetchExchangeRateTypes(this.selectedCurrencyForExRate);
    }

    deposit() {
        if (!this.noTellerAllocation) {
            if (!this.multiCurrencyAllowed) {
                this.router.navigate(['cash-deposit', { tellerId: this.selectedTeller }], { relativeTo: this.route, queryParams: { isBaseCurrency: this.isBaseCurrency, }, });
            }
            else {
                this.router.navigate(['cash-deposit', { tellerId: this.selectedTeller }], { relativeTo: this.route, queryParams: { isBaseCurrency: this.isBaseCurrency }, });
            }
        } else {
            this.notificationService.sendErrorMsg("teller.allocation.not.found");

        }
    }

    transfer() {
        if (!this.noTellerAllocation) {
            if (!this.multiCurrencyAllowed) {
                this.router.navigate(['cash-transfer', { tellerId: this.selectedTeller }], { relativeTo: this.route, queryParams: { isBaseCurrency: this.isBaseCurrency }, });
            }
            else {
                this.display = true;
                this.cashTransfer = true;
            }
        } else {
            this.notificationService.sendErrorMsg("teller.allocation.not.found");
        }
    }

    withdraw() {
        if (!this.noTellerAllocation) {
            if (this.multiCurrencyAllowed === false) {
                this.router.navigate(['cash-withdraw', { tellerId: this.selectedTeller }], { relativeTo: this.route, queryParams: { isBaseCurrency: this.isBaseCurrency, }, });
            }
            else {
                this.display = true;
                this.cashWithdraw = true;
            }
        } else {
            this.notificationService.sendErrorMsg("teller.allocation.not.found");
        }
    }

    goToPendingPosts() {
        if (!this.noTellerAllocation) {
            let queryParams = new Map<string, string>().set('tellerId', this.selectedTeller.toString());
            this.subscribers.fetchUnPostedTransactionsSub = this.tellerService.fetchUnPostedTransactions(queryParams).subscribe(
                data => {
                    this.pendingPosts = data;
                    this.pendingPosts.sort(function (a, b) { return (a.voucherNumber < b.voucherNumber) ? 1 : ((b.voucherNumber < a.voucherNumber) ? -1 : 0); });
                    this.postDisplay = true;
                })

        } else {
            this.notificationService.sendErrorMsg("teller.allocation.not.found");
        }
    }

    goToActivityLog() {
        if (!this.noTellerAllocation) {
            this.router.navigate([this.selectedTeller, 'activityLog'], { relativeTo: this.route, queryParams: { isBaseCurrency: this.isBaseCurrency }, });
        } else {
            this.notificationService.sendErrorMsg("teller.allocation.not.found");
        }
    }


    // refresh(dt: DataTable) {
    //     dt.reset();
    //     this.loadCurrencyWisePieChart();
    // }

    loadCurrencyWisePieChart() {
        this.currenyWisePieChartData = {
            labels: this.currencySet,
            datasets: [
                {
                    data: this.balanceSet,
                    backgroundColor: [
                        "#CDDD47",
                        "#36A2EB",
                        "#FFCE56",
                        "#50C878"
                    ],
                    hoverBackgroundColor: [
                        "#299788",
                        "#36A2EB",
                        "#FFCE56",
                        "#50C878"
                    ]
                }]
        };
    }

    loadTellerTransactions(page: number, voucherNumber: string, tellerId: number) {
        let urlSearchMap = new Map();
        if (page != null) urlSearchMap.set("page", page);
        if (voucherNumber != null) urlSearchMap.set('voucherNumber', voucherNumber);
        urlSearchMap.set('tellerId', tellerId);
        this.subscribers.fetchTellerTransactionSub = this.tellerService.fetchTellerTransaction(
            urlSearchMap
        ).subscribe(data => {

            this.activityLog = data.content;
            this.totalRecords = (data.pageSize * data.pageCount);
            this.totalPages = data.pageCount;

        });
    }

    onTellerChange() {
        // console.log(this.selectedTeller);
        this.balanceSet = [];
        this.currencySet = [];
        if (!this.selectedTeller) {
            this.activityLog = [];
            this.tellerBalance = [];
            this.tellerLimits = [];
            this.balanceSet = [];
            this.currencySet = [];
            this.loadCurrencyWisePieChart();
        }
        if (this.selectedTeller) {
            this.loadTellerTransactions(null, null, this.selectedTeller);
            this.fetchTellerDetail(this.selectedTeller);
        }
        this.noTellerAllocation = this.selectedTeller === null ? true : false;
    }
    fetchAllocatedTellers() {
        let urlSearchMap = new Map();
        urlSearchMap.set('branchId', this.userActiveBranch$);
        urlSearchMap.set('userId', this.userName$);
        this.subscribers.fetchAllocatedTellersSub = this.tellerService.fetchAllocatedTellers(urlSearchMap)
            .subscribe(data => {
                this.allocatedTeller = data.content;
                this.allocatedTellerToShow = this.allocatedTeller.map(tellerAllocation => ({ label: tellerAllocation.teller.title, value: tellerAllocation.teller.id }));
                if (this.allocatedTeller.length < 1) {
                    this.noTellerAllocation = true;
                }
                // if (this.allocatedTeller.length > 0) {
                //     this.selectedTeller = data.content[0].teller.id;
                //     this.noTellerAllocation = false;
                // };
                if (!this.queryParams.tellerId && this.allocatedTeller.length > 0) {
                    this.selectedTeller = data.content[0].teller.id;
                    this.noTellerAllocation = false;
                }

                if (this.selectedTeller !== undefined) {
                    this.noTellerAllocation = false;
                    this.loadTellerTransactions(null, null, this.selectedTeller);
                    this.fetchTellerDetail(this.selectedTeller);
                }

            });
    }
    fetchTellerDetail(tellerId: number) {
        this.subscribers.fetchSub = this.tellerService.fetchTellerById({ id: tellerId }).subscribe(
            tellerDetail => {
                this.teller = tellerDetail;
                this.tellerLimits = this.teller.tellerLimits;
                this.fetchTellerBalance(tellerDetail.id);
                this.isSourceVault = (this.teller.tellerType === "VAULT") ? true : false;
                if (this.teller.currencyRestriction === "LOCAL_CURRENCY") {
                    this.selectedCurrency = "BDT";
                    this.isBaseCurrency = true;
                    this.multiCurrencyAllowed = false;
                }
                else {
                    this.multiCurrencyAllowed = true;
                    this.isBaseCurrency = false;
                }
            });
    }


    fetchTellerBalance(tellerId: number) {
        this.subscribers.fetchBal = this.tellerService.fetchBalanceByTellerId({ tellerId: tellerId }).subscribe(
            data => {
                this.tellerBalance = data;
                this.currencyWiseBalance(data);
                this.loadCurrencyWisePieChart();
                this.mergeData();
            });
    }

    mergeData() {
        _.merge(this.tellerLimits, (this.tellerBalance.map(balance => {
            return {
                currencyCode: balance.currencyCode,
                balance: balance.balance
            }

        }))).forEach(limit => {
            this.currencySet.push(limit.currencyCode);
            this.balanceSet.push(limit.balance);
        });
        let crossBalance = this.tellerLimits.filter(data => data.balance > data.balanceLimit);
        if (crossBalance.length > 0) {
            document.getElementById("alertBox").style.display = "block";
        }
        else {
            document.getElementById("alertBox").style.display = "none";

        }

    }
    currencyWiseBalance(tellerBalance: TellerBalance[]) {
        this.usdBalance = 0;
        this.bdtBalance = 0;
        this.euroBalance = 0;
        this.inrBalance = 0;
        tellerBalance.forEach(element => {
            if (element.currencyCode === "BDT") {
                this.bdtBalance = element.balance;
            }
            else if (element.currencyCode === "USD") {
                this.usdBalance = element.balance;
            } else if (element.currencyCode === "EUR") {
                this.euroBalance = element.balance;
            } else if (element.currencyCode === "INR") {
                this.inrBalance = element.balance;
            }
        });

    }

    loadTransactionsLazily(event: LazyLoadEvent) {
        this.loadTellerTransactions(event.first / 20, event.filters.voucherNumber ? event.filters.voucherNumber.value : null, this.selectedTeller);
    }

    showDialog() {
        this.display = true;
    }
    handleRowSelect(event) {
        this.selectedCurrency = event.data.currencyCode;
        if (event.data.currencyCode === "BDT") {
            this.isBaseCurrency = true;
        }
        else {
            this.isBaseCurrency = false;
        }
        this.display = false;
        if (this.cashTransfer) {
            this.router.navigate(['cash-transfer', { tellerId: this.selectedTeller }], { relativeTo: this.route, queryParams: { currencyCode: this.selectedCurrency, isBaseCurrency: this.isBaseCurrency, isSourceVault: this.isSourceVault }, });
        }
        if (this.cashWithdraw) {
            this.router.navigate(['cash-withdraw', { tellerId: this.selectedTeller }], { relativeTo: this.route, queryParams: { currencyCode: this.selectedCurrency, isBaseCurrency: this.isBaseCurrency, }, });
        }
        if (this.cashDeposit) {
            this.router.navigate(['cash-deposit', { tellerId: this.selectedTeller }], { relativeTo: this.route, queryParams: { currencyCode: this.selectedCurrency, isBaseCurrency: this.isBaseCurrency, }, });

        }

    }

    postTransaction(voucherNumber, dt: DataTable) {
        this.tellerService.postUnpostedTransactions({ voucherNumber: voucherNumber }).subscribe({
            // error: ()=>{console.log('hello')},
            complete: () => {
                console.log('jello'); this.notificationService.sendSuccessMsg('unposted.transaction.posted.success');
                let queryParams = new Map<string, string>().set('tellerId', this.selectedTeller.toString());
                this.subscribers.fetchUnPostedTransactionsSub = this.tellerService.fetchUnPostedTransactions(queryParams).subscribe(
                    data => {
                        this.pendingPosts = data;
                        this.pendingPosts.sort(function (a, b) { return (a.voucherNumber < b.voucherNumber) ? 1 : ((b.voucherNumber < a.voucherNumber) ? -1 : 0); });
                        // this.postDisplay = true;
                        dt.reset();
                    })
            }
        }
        );
    }

    viewPostingDetail(voucherNumber, transactionType) {
        if (transactionType == 'CASH_WITHDRAW') {
            this.router.navigate(['/views/teller-transaction', this.selectedTeller, 'cash-withdraw', voucherNumber]);
        }
        else if (transactionType == 'CASH_RECEIVE') {
            this.router.navigate(['/views/teller-transaction', this.selectedTeller, 'cash-deposit', voucherNumber]);
        }

    }
}