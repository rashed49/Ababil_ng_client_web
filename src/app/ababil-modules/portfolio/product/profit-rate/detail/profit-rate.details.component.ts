import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfitRate } from '../../../../../services/product/domain/profit-rate.model';
import { ProductService } from '../../../../../services/product/service-api/product.service';
import { BaseComponent } from '../../../../../common/components/base.component';
import { Currency } from '../../../../../services/currency/domain/currency.models';
import { Product } from '../../../../../services/product/domain/product.models';
import { map } from 'rxjs/operators';

@Component({
    selector: 'profit-rates-detail',
    templateUrl: './profit-rate.details.component.html'
})
export class ProfitRateDetailComponent extends BaseComponent implements OnInit {

    isSlabApplicable: boolean;
    profitRates: ProfitRate = {};
    private selectedProductId: number;
    private selectedProfitRateId: number;
    profitRateArray: any;
    currency: Currency;
    currencyId: number;
    type: string;
    psr: boolean = false;
    apr: boolean = false;
    weightage: boolean = false;
    urlSearchParam: Map<string, string>;
    subscription: any;
    productDetails: Product = new Product();
    fromDate: Date;
    currentDate: Date;
    editable: boolean;
    psrValue: number;
    aprValue: number;
    weightageValue: number;
    queryParams: any;
    productType: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService) { super(); }

    ngOnInit() {
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.selectedProductId = params['id'];
            this.selectedProfitRateId = params['profitRateId'];
            this.currentDate = new Date();
        });
        this.fetchProfitRate();
        this.fetchProductDetails();
        this.fetchProductConfiguration();

        this.subscribers.querySub = this.route.queryParams
            .subscribe(data => { this.queryParams = data; this.productType = this.queryParams.productType; });

    }


    fetchProfitRate() {
        this.subscribers.fetchBranchSub = this.productService.
            fetchProfitRate({ 'productId': this.selectedProductId + '', 'profitRateId': this.selectedProfitRateId + '' })
            .subscribe(profitRate => {
                if (profitRate.slabApplicable) {
                    this.isSlabApplicable = true;
                    this.profitRates = profitRate;
                    this.currencyId = profitRate.currencyId;
                    this.profitRateArray = profitRate.productProfitRateSlabs;
                    this.fromDate = profitRate.fromDate;


                } else {
                    this.isSlabApplicable = false;
                    this.profitRates = profitRate;
                    this.currencyId = profitRate.currencyId;
                    this.profitRateArray = profitRate.productProfitRateSlabs;
                    this.psrValue = this.profitRateArray[0].psr;
                    this.aprValue = this.profitRateArray[0].annualProvisionalRate;
                    this.weightageValue = this.profitRateArray[0].weightage;
                    this.fromDate = profitRate.fromDate;

                }

                if (new Date(this.fromDate) < this.currentDate) {
                    this.editable = false;
                }
                else {
                    this.editable = true;
                }
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
    fetchProductDetails() {
        this.subscribers.fetchSub = this.productService
            .fetchProductDetails({ id: this.selectedProductId + '' })
            .pipe(map(demandDepositProduct => this.productDetails = demandDepositProduct))
            .subscribe();
    }

    edit() {
        this.router.navigate(['../../form'], {
            relativeTo: this.route,
            queryParams: { profitRateId: this.selectedProfitRateId }
        });
    }

    cancel() {
        this.navigateAway();
    }

    navigateAway(): void {
        this.router.navigate(['../../'], {
            relativeTo: this.route,
            queryParams: { product: this.queryParams.product },
            queryParamsHandling: "merge"
        });
    }

}