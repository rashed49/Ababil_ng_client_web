import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from './../../../../../common/notification/notification.service';
import { BaseComponent } from './../../../../../common/components/base.component';
import { Component, OnInit } from '@angular/core';
import { RecurringDepositProductService } from '../../../../../services/recurring-deposit-product/service-api/recurring.deposit.product.service';
import { RecurringDepositProduct } from '../../../../../services/recurring-deposit-product/domain/recurring.deposit.product.model';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';

@Component({
    selector: 'recurring-deposit-product',
    templateUrl: './recurring.deposit.product.component.html'
})
export class RecurringDepositProductComponent extends BaseComponent implements OnInit {

    recurringDepositProducts: RecurringDepositProduct[];
    totalRecords: number;
    totalPages: number;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private recurringDepositProductService: RecurringDepositProductService) {
        super();
    }

    ngOnInit(): void {
        this.fetchRecurringDepositProducts(this.getSearchMap());
    }

    fetchRecurringDepositProducts(searchMap: Map<string, any>) {
        if (searchMap == null) searchMap = new Map();
        this.subscribers.fetchRecurringDepositProductsSub = this.recurringDepositProductService
            .fetchRecurringDepositProducts(searchMap)
            .subscribe(data => {
                this.recurringDepositProducts = data.content;
                this.totalRecords = (data.pageSize * data.pageCount);
                this.totalPages = data.pageCount;
            });
    }

    create() {
        this.router.navigate(['create'], { relativeTo: this.route });
    }

    onRowSelect(event: any) {
        this.router.navigate(['detail', event.data.id], { relativeTo: this.route });
    }

    loadLazily(event: LazyLoadEvent) {
        const searchMap = this.getSearchMap();
        searchMap.set('page', (event.first / 20));
        this.fetchRecurringDepositProducts(searchMap);
    }

    getSearchMap(): Map<string, any> {
        const searchMap = new Map();
        return searchMap;
    }

    cancel(){
        this.router.navigate(['../'], { relativeTo: this.route });
      }
}