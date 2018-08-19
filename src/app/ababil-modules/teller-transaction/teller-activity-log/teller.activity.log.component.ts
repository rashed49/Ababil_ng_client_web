import { Component, OnInit, HostListener } from "@angular/core";
import { BaseComponent } from "../../../common/components/base.component";
import { TellerService } from "../../../services/teller/service-api/teller.service";
import { LazyLoadEvent } from "primeng/primeng";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'teller-activity-log',
    templateUrl: './teller.activity.log.component.html',
})

export class TellerActivityLog extends BaseComponent implements OnInit {

    activityLog: any[] = [];
    totalRecords: number;
    totalPages: number;
    tellerId: number;


    @HostListener('window:keydown', ['$event'])
    keyEvent(event: KeyboardEvent) {
        // console.log(event);

        if (event.shiftKey && event.keyCode === this.key_B) {
            this.cancel();
        }
    }
    
    constructor(private tellerService: TellerService, private route: ActivatedRoute, private router: Router,) {
        super();
    }
    ngOnInit() {

        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.tellerId = +params['tellerId']
        })

        this.loadTellerTransactions(null, null, this.tellerId);
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

    loadTransactionsLazily(event: LazyLoadEvent) {
        this.loadTellerTransactions(event.first / 20, event.filters.voucherNumber ? event.filters.voucherNumber.value : null, this.tellerId);
    }

    cancel(){
        this.router.navigate(['/teller-transaction']);
    }
}

