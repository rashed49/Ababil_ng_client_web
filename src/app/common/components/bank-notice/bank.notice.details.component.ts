// import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { BankNoticeService } from '../../../services/bank-notice/service-api/bank.notice.service'
import { BaseComponent } from './../../components/base.component';
import { Notice } from '../../../services/bank-notice/domain/notice.models';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from "@angular/core";
import { DemandDepositAccountService } from '../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { DemandDepositAccount } from '../../../services/demand-deposit-account/domain/demand.deposit.account.models';

@Component({
    selector: 'bank-notice-details',
    templateUrl: './bank.notice.details.component.html'
})


export class CommonBankNoticeDetailsComponent extends BaseComponent implements OnInit, OnChanges {

    notices: Notice[] = [];
    selectedNotice: Notice;
    routeBack: string;
    totalRecords: number;
    totalPages: number;
    demandDepositAccount: DemandDepositAccount = new DemandDepositAccount();

    @Input('accountId') accountId: number;

    constructor(
        private locationService: BankNoticeService,
        private demandDepositAccountService: DemandDepositAccountService
    ) {
        super();
    }
    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.accountId.currentValue) {
            this.accountId = changes.accountId.currentValue;
            this.fetchDemandDepositAccountDetails();
            this.fetchAccountNotices(null);
        }
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

    // onPageChange(event: LazyLoadEvent) {
    //     let urlSearchMap = new Map();
    //     urlSearchMap.set("page", (event.first / 20));
    //     this.fetchAccountNotices(urlSearchMap);
    // }


    //Account Title And Account No
    fetchDemandDepositAccountDetails() {
        this.subscribers.fatchDemandDepositAccountSub = this.demandDepositAccountService
            .fetchDemandDepositAccountDetails({ id: this.accountId })
            .subscribe(data => {
                this.demandDepositAccount = data;
            });
    }
}