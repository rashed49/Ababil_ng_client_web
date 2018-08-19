import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { BankNoticeService } from './../../../../../services/bank-notice/service-api/bank.notice.service';
import { BaseComponent } from './../../../../../common/components/base.component';
import { Notice } from './../../../../../services/bank-notice/domain/notice.models';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { DemandDepositAccountService } from '../../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { DemandDepositAccount } from '../../../../../services/demand-deposit-account/domain/demand.deposit.account.models';

@Component({
    selector: 'bank-notice',
    templateUrl: './bank.notice.component.html'
})
export class BankNoticeComponent extends BaseComponent implements OnInit {

    accountId: number;
    notices: Notice[] = [];
    selectedNotice: Notice;
    routeBack: string;
    totalRecords: number;
    totalPages: number;

    demandDepositAccount: DemandDepositAccount = new DemandDepositAccount();

    constructor(
        private locationService: BankNoticeService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private demandDepositAccountService: DemandDepositAccountService
    ) {
        super();
    }
    ngOnInit(): void {
        this.subscribers.routerSub = this.route.params
            .subscribe(params => {
                this.accountId = +params['id'];
                this.fetchDemandDepositAccountDetails();
                this.fetchAccountNotices(null);
            });
        this.subscribers.queryParamSub = this.route.queryParams.subscribe(
            queryParams => {
                this.routeBack = queryParams['demandDeposit'];
            });
    }


    createNotice() {
        this.router.navigate(['form'], {
            relativeTo: this.route,
            queryParams: {
                bankNotice: this.currentPath(this.location)
            },
            queryParamsHandling: "merge"
        });
    }

    fetchAccountNotices(urlSearchMap: Map<string, string>) {
        if (urlSearchMap == null) urlSearchMap = new Map();
        this.subscribers.fetchnoticeSub = this.locationService
            .fetchBankNoticesByAccount({ id: this.accountId }, urlSearchMap)
            .subscribe(data => {
                this.notices = data.content;
                this.totalRecords = (data.pageSize * data.pageCount);
                this.totalPages = data.pageCount;
            });
    }

    onPageChange(event: LazyLoadEvent) {
        let urlSearchMap = new Map();
        urlSearchMap.set("page", (event.first / 20));
        this.fetchAccountNotices(urlSearchMap);
    }

    onRowSelect(event) {
        this.router.navigate(['details', event.data.id], {
            relativeTo: this.route,
            queryParams: {
                bankNotice: this.currentPath(this.location)
            },
            queryParamsHandling: "merge"
        });
        console.log(event.data.id);
    }

    close() {
        this.router.navigate([this.routeBack], {
            relativeTo: this.route,
            queryParamsHandling: "merge"
        });
    }

    //Account Title And Account No
    fetchDemandDepositAccountDetails() {
        this.subscribers.fatchDemandDepositAccountSub = this.demandDepositAccountService
            .fetchDemandDepositAccountDetails({ id: this.accountId })
            .subscribe(data => {
                this.demandDepositAccount = data;
            });
    }
}