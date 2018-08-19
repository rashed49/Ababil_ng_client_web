import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../../../services/product/service-api/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfitRate, DemandDepositRateSlabs, ProfitRateMerged, ProfitCalculationType } from '../../../../services/demand-deposit-product/domain/profit-rate.model';
import { BaseComponent } from '../../../../common/components/base.component';
import { Currency } from '../../../../services/currency/domain/currency.models';
import { CurrencyService } from '../../../../services/currency/service-api/currency.service';
import { Product } from '../../../../services/product/domain/product.models';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { map } from 'rxjs/operators';

@Component({
  selector: 'profit-rates',
  templateUrl: './profit-rate.component.html'
})
export class ProfitRateComponent extends BaseComponent implements OnInit {

  constructor(private productService: ProductService,
    private currencyService: CurrencyService,
    private route: ActivatedRoute,
    private router: Router) { super(); }

  queryParams: any;
  profitRates: ProfitRate[];
  urlSearchParams: Map<string, string>;
  private selectedId: number;
  private currencyId: number;
  private slabApplicable: boolean;
  profitRateMergedFull: ProfitRate[] = [];
  profitRateMergedTotal: ProfitRateMerged[];
  currencyRestriction: string;
  allCurrency: boolean;

  currencyCode: string;
  urlSearchParam: Map<string, string>;
  sortF: any;

  fromDate: Date;
  count?: number = 0;
  len: number;
  array_size: number;
  type: string = '';
  totalRecords: number;
  totalPages: number;
  showTenor: boolean = true;
  currency: Currency;
  productDetails: Product = new Product();

  ngOnInit(): void {
    this.subscribers.routeSub = this.route.params.subscribe(params => {
      this.selectedId = +params['id'];
      this.fetchProductDetails();
      // this.fetchProfitRates(this.getSearchMap());
      this.fetchProductConfiguration();
    });

    this.subscribers.querySub = this.route.queryParams
      .subscribe(data => {
        this.queryParams = data;
        this.showTenor = (this.queryParams.productType != null && this.queryParams.productType === "DEMAND_DEPOSIT") ? false : true;
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
      .pipe(map(product => {
        this.productDetails = product;
        this.currencyRestriction = this.productDetails.currencyRestriction;
      })).subscribe();
  }

  fetchProductConfiguration() {
    this.urlSearchParam = new Map([['name', 'profit-calculation']]);
    this.subscribers.fetchProductConfigurationSub = this.productService
      .fetchProductConfiguration(this.urlSearchParam)
      .subscribe(profiles => this.type = profiles.type);
  }

  createProfitRate() {
    this.router.navigate(['form'], {
      relativeTo: this.route,
      queryParams: { product: this.queryParams.product },
      queryParamsHandling: "merge"
    });
  }

  onProfitRateSelect(event) {
    this.router.navigate(['detail', event.data.id], {
      relativeTo: this.route,
      queryParams: { product: this.queryParams.product },
      queryParamsHandling: "merge"
    });
  }

  cancel() {
    this.navigateAway();
  }

  navigateAway() {
    if (this.queryParams.product !== undefined) {
      this.router.navigate([this.queryParams.product],{
        relativeTo: this.route,
        queryParams: {
            taskId: this.queryParams.taskId,
            command: this.queryParams.command,
            commandReference: this.queryParams.commandReference
        }
    });
    }
  }

  loadProfitRateLazy(event: LazyLoadEvent) {
    const searchMap = this.getSearchMap();
    searchMap.set('page', (event.first / 20));
    this.fetchProfitRates(searchMap);
  }

  getSearchMap(): Map<string, any> {
    const searchMap = new Map();
    return searchMap;
  }
}
