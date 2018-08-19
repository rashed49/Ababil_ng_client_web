import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../../../services/product/service-api/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfitRate, DemandDepositRateSlabs, ProfitRateMerged, ProfitCalculationType } from '../../../../services/demand-deposit-product/domain/profit-rate.model';
import { BaseComponent } from '../../../../common/components/base.component';
import { Currency } from '../../../../services/currency/domain/currency.models';
import { CurrencyService } from '../../../../services/currency/service-api/currency.service';
import { Product } from '../../../../services/product/domain/product.models';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { ViewsBaseComponent } from "../../view.base.component";
import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';
import { NotificationService } from './../../../../common/notification/notification.service';
import { Location } from '@angular/common';

@Component({
  selector: 'profit-rates-view',
  templateUrl: './profit.rate.view.component.html'
})
export class ProfitRateViewComponent extends ViewsBaseComponent implements OnInit {

  constructor(private productService: ProductService,
    private currencyService: CurrencyService,
    private route: ActivatedRoute,
    protected notificationService: NotificationService,
    protected router: Router,
    protected location: Location,
    protected workflowService: ApprovalflowService) { super(location,router, workflowService, notificationService); }

  queryParams: any;
  profitRates: ProfitRate[];
  urlSearchParams: Map<string, string>;
  private selectedId: number;
  private currencyId: number;
  private slabApplicable: boolean;
  profitRateMergedFull: ProfitRateMerged[] = [];
  profitRateMergedTotal: ProfitRateMerged[];
  currencyRestriction: string;
  allCurrency: boolean;

  currencyCode: string;
  urlSearchParam: Map<string, string>;
  subscription: any;
  psr: boolean = false;
  apr: boolean = false;
  weightage: boolean = false;
  sortF: any;



  fromDate: Date;
  count?: number = 0;
  len: number;
  array_size: number;
  type: string;
  totalRecords: number;
  totalPages: number;

  currency: Currency;
  productDetails: Product = new Product();

  ngOnInit(): void {
    this.subscribers.routeSub = this.route.params.subscribe(params => {
    //   this.selectedId = +params['productId'];
    //   this.fetchProductDetails();
      // this.fetchProfitRates(this.getSearchMap());
    //   this.fetchProductConfiguration();
    });

    this.subscribers.querySub = this.route.queryParams
      .subscribe(data => {this.queryParams = data;
        this.selectedId = +data['productId'];
        this.fetchProductDetails();
        this.fetchProductConfiguration();
    });
  }


  fetchProfitRates(searchMap: Map<string, any>) {
    if (searchMap == null) searchMap = new Map();
    this.profitRateMergedFull = [];
    this.subscribers.fetchSubs = this.productService.fetchProfitRates({ 'productId': this.selectedId + '' }, searchMap).subscribe(
      data => {
        this.profitRates = data.content;
        this.profitRateMergedFull = this.profitRates.map(profitRate => {
          return profitRate.productProfitRateSlabs.map(slab => {
            return {
              id: profitRate.id,
              currency: profitRate.currencyCode,
              fromDate: profitRate.fromDate,
              profitRateId: slab.id,
              amountRangeFrom: slab.amountRangeFrom,
              amountRangeTo: slab.amountRangeTo,
              annualProvisionalRate: slab.annualProvisionalRate,
              psr: slab.psr,
              weightage: slab.weightage,
              fromTenor: slab.fromTenor,
              toTenor: slab.toTenor
            }
          });
        }).reduce(function (prev, next) {
          return prev.concat(next);
        }, []);
        this.totalRecords = (data.pageSize * data.pageCount);
        this.totalPages = data.pageCount;
        this.len = this.profitRates.length;
        this.profitRateMergedTotal = [...this.profitRateMergedFull];
      }
    );
  }


  fetchProductDetails() {
    this.subscribers.fetchSub = this.productService
      .fetchProductDetails({ id: this.selectedId + '' })
      .subscribe(product => {
        this.productDetails = product;
        this.currencyRestriction = this.productDetails.currencyRestriction;
      });
  }

  fetchProductConfiguration() {
    this.urlSearchParam = new Map([['name', 'profit-calculation']]);
    this.subscription = this.productService.fetchProductConfiguration(this.urlSearchParam).subscribe(
      profiles => {
        this.type = profiles.type;
        if (this.type == 'PSR') {
          this.psr = true;
        }
        else {
          if (this.type == 'RATE') {
            this.apr = true;
          } else {
            this.weightage = true;
          }
        }
      }
    );
  }



  cancel() {
    this.location.back();
  }

  navigateAway() {
    if (this.queryParams.product !== undefined) {
      this.router.navigate([this.queryParams.product]);
    }
  }

  loadProfitRateLazy(event: LazyLoadEvent) {
    const searchMap = this.getSearchMap();
    searchMap.set('page', (event.first / 20));
    console.log(event);
    this.fetchProfitRates(searchMap);
  }
  getSearchMap(): Map<string, any> {
    const searchMap = new Map();
    return searchMap;
  }
}
