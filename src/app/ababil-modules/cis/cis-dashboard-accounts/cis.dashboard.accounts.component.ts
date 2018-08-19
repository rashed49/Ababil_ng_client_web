import { RecurringDepositAccountService } from './../../../services/recurring-deposit-account/service-api/recurring.deposit.account.service';
import { FixedDepositAccountService } from './../../../services/fixed-deposit-account/service-api/fixed.deposit.account.service';
import { FixedDepositAccount } from './../../../services/fixed-deposit-account/domain/fixed.deposit.account.models';
import { BaseComponent } from '../../../common/components/base.component';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { NotificationService } from '../../../common/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationStrategy, Location } from '@angular/common';
import { CISService } from '../../../services/cis/service-api/cis.service';
import { DemandDepositAccount } from '../../../services/demand-deposit-account/domain/demand.deposit.account.models';
import { DemandDepositAccountService } from '../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { RecurringDepositAccount } from '../../../services/recurring-deposit-account/domain/recurring.deposit.account.model';

@Component({
    selector: 'cis-dashboard-accounts',
    templateUrl: './cis.dashboard.accounts.component.html',
    styleUrls: [ './cis.dashboard.accounts.component.css']
})
export class CISDashboardAccountsComponent extends BaseComponent implements OnInit {

    @Input('customerId') customerId: number;

    demanDepositAccounts: DemandDepositAccount[] = [];
    fixedDepositAccounts: FixedDepositAccount[] = [];
    recurringDepositAccounts: RecurringDepositAccount[] = [];
    financingAccounts: any[] = [];


    pieData: any;

    assetPieChartOptions: any = {
        title: {
            display: true,
            text: 'Asset',
            fontSize: 16
        },
        legend: {
            position: 'bottom'
        }
    };

    liabilityPieChartOptions: any = {
        title: {
            display: true,
            text: 'Liability',
            fontSize: 16
        },
        legend: {
            position: 'bottom'
        }
    };

    //test

    single: any[] = [
        {
            "name": "Germany",
            "value": 8940000
        },
        {
            "name": "USA",
            "value": 5000000
        },
        {
            "name": "France",
            "value": 7200000
        }
    ];
    multi: any[] = [
        {
            "name": "Germany",
            "series": [
                {
                    "name": "2010",
                    "value": 7300000
                },
                {
                    "name": "2011",
                    "value": 8940000
                }
            ]
        },

        {
            "name": "USA",
            "series": [
                {
                    "name": "2010",
                    "value": 7870000
                },
                {
                    "name": "2011",
                    "value": 8270000
                }
            ]
        },

        {
            "name": "France",
            "series": [
                {
                    "name": "2010",
                    "value": 5000002
                },
                {
                    "name": "2011",
                    "value": 5800000
                }
            ]
        }
    ];

    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    onSelect(event) {
        console.log(event);
    }

    //test


    constructor(private cisService: CISService, private url: LocationStrategy,
        private route: ActivatedRoute, private router: Router,
        private notificationService: NotificationService,
        private fixedDepositAccountService: FixedDepositAccountService,
        private depositAccountService: DemandDepositAccountService,
        private recurringDepositAccountService: RecurringDepositAccountService,
        private location: Location) {
        super();

    }

    ngOnInit() {
        this.loadPieChartData();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.customerId && changes.customerId.currentValue) {
            this.customerId = changes.customerId.currentValue;
            this.fetchAccountDetails();
            this.fetchFixedDepositAccount();
            this.fetchRecurringDepositAccount();
        }
    }

    onAccountRowClicked(event, accountType: string) {

        switch (accountType) {
            case 'DD':
                this.router.navigate(['/demand-deposit-account', event.data.id, 'details'], {
                    relativeTo: this.route,
                    queryParams: { cus: this.currentPath(this.location) }
                });
                break;

            case 'FD':
                this.router.navigate(['/fixed-deposit-account', event.data.id, 'details'], {
                    relativeTo: this.route,
                    queryParams: { cus: this.currentPath(this.location) }
                });
                break;

            case 'RD':
                this.router.navigate(['/recurring-deposit-account', event.data.id, 'details'], {
                    relativeTo: this.route,
                    queryParams: { cus: this.currentPath(this.location) }
                })
        }
    }

    fetchAccountDetails() {
        let searchParam = new Map<string, string>();
        searchParam.set('customerId', this.customerId + '');
        this.depositAccountService.fetchDemandDepositAccounts(searchParam)
            .subscribe(data => this.demanDepositAccounts = data.content);
    }

    fetchFixedDepositAccount() {
        let searchParam = new Map<string, string>();
        searchParam.set('customerId', this.customerId + '');
        this.fixedDepositAccountService.fetchFixedDepositAccounts(searchParam)
            .subscribe(data => this.fixedDepositAccounts = data.content);
    }

    fetchRecurringDepositAccount() {
        let searchParam = new Map<string, string>();
        searchParam.set('customerId', this.customerId + '');
        this.subscribers.fetchRecurringDepositAccountSub = this.recurringDepositAccountService
            .fetchRecurringDepositAccounts(searchParam)
            .subscribe(data => this.recurringDepositAccounts = data.content);
    }

    loadPieChartData() {
        this.pieData = {
            labels: ['DD', 'TD', 'FI'],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [
                        "#FFC107",
                        "#03A9F4",
                        "#4CAF50"
                    ],
                    hoverBackgroundColor: [
                        "#FFE082",
                        "#81D4FA",
                        "#A5D6A7"
                    ]
                }]
        };
    }

}