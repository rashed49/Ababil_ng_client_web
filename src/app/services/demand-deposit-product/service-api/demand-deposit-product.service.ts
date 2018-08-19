import { Injectable } from '@angular/core';
import { BaseService, PathParameters } from '../../base.service';
import { RequestOptions } from '@angular/http';
import { HttpInterceptor } from '../../http.interceptor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as endpoints from '../demand-deposit-product.endpoints';
import { ProductChequePrefix } from '../domain/product-cheque-prefix.model';
import { ProductChequeBookSize } from '../domain/product-chequebook-size.model';
import { ProfitRate } from '../domain/profit-rate.model';
import { DemandDepositProduct, ActivateDemandDepositProductCommand } from '../domain/demand-deposit-product.model';


@Injectable()
export class DemandDepositProductService extends BaseService {

    constructor(private http: HttpInterceptor) {
        super();
    }

    public fetchDemandDepositProducts(urlSearchParams: Map<string, string>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_DEMAND_DEPOSIT_PRODUCTS, options)
            .pipe(map(this.extractData));

    }
    public fetchDemandDepositProductConfiguration(urlSearchParams: Map<string, string>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_DEMAND_DEPOSIT_PRODUCT_CONFIGURATION, options)
            .pipe(map(this.extractData));

    }

    public createDemandDepositProduct(demandDepositProduct: DemandDepositProduct, urlSearchParams: Map<string, string>): Observable<any> {
       // let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(endpoints.CREATE_DEMAND_DEPOSIT_PRODUCTS, demandDepositProduct)
            .pipe(map(this.extractData));
    }

    public updateDemandDepositProduct(demandDepositProduct: DemandDepositProduct, pathParams: PathParameters, urlSearchParams: Map<string, string>): Observable<any> {
        const url = this.create(endpoints.UPDATE_DEMAND_DEPOSIT_PRODUCTS, pathParams);
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.put(url, demandDepositProduct, options).pipe(map(this.extractData));
    }

    public fetchDemandDepositProductDetails(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.FETCH_DEMAND_DEPOSIT_PRODUCT_DETAILS, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public activateDemandDepositProduct(productId: number, urlSearchParams: Map<string,string>): Observable<any> {
        let url = this.create(endpoints.ACTIVATE_DEMAND_DEPOSIT_PRODUCT, { productId: productId + "" });
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(url, new ActivateDemandDepositProductCommand(), options)
            .pipe(map(this.extractData));
    }

    //profit rate
    public createProfitRate(profitRate: ProfitRate, pathParams: PathParameters,urlSearchParams:Map<string,string>): Observable<any> {
        let url = this.create(endpoints.CREATE_DEMAND_DEPOSIT_PRODUCT_PROFIT_RATES, pathParams);
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        
        return this.http
            .post(url, profitRate,options)
            .pipe(map(this.extractData));
    }

    public updateProfitRate(profitRate: ProfitRate, pathParams: PathParameters,urlSearchParams:Map<string,string>): Observable<any> {
        let url = this.create(endpoints.UPDATE_DEMAND_DEPOSIT_PRODUCT_PROFIT_RATE, pathParams);
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });        
        return this.http
            .put(url, profitRate,options)
            .pipe(map(this.extractData));
    }

    public fetchProfitRates(pathParams: PathParameters,urlSearchParams: Map<string, string>): Observable<any> {
        let url = this.create(endpoints.FETCH_DEMAND_DEPOSIT_PRODUCT_PROFIT_RATES, pathParams);
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });   
        return this.http
            .get(url,options)
            .pipe(map(this.extractData));
    }

    public fetchProfitRate(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.FETCH_DEMAND_DEPOSIT_PRODUCT_PROFIT_RATE, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }


    public fetchDemandDepositProductChequePrefixes(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.FETCH_DEMAND_DEPOSIT_PRODUCT_CHEQUE_PREFIXES, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public fetchDemandDepositProductChequeBookSizes(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.FETCH_DEMAND_DEPOSIT_PRODUCT_CHEQUE_BOOK_SIZES, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public addDemandDepositProductChequeBookSizes(productChequeBookSize: ProductChequeBookSize, pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.CREATE_DEMAND_DEPOSIT_PRODUCT_CHEQUE_BOOK_SIZES, pathParams);
        return this.http.post(url, productChequeBookSize).pipe(map(this.extractData));
    }

    public addDemandDepositProductChequePrefixes(productChequePrefix: ProductChequePrefix, pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.CREATE_DEMAND_DEPOSIT_PRODUCT_CHEQUE_PREFIXES, pathParams);
        return this.http.post(url, productChequePrefix).pipe(map(this.extractData));
    }


    public deleteDemandDepositProductChequeBookSizes(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.DELETE_DEMAND_DEPOSIT_PRODUCT_CHEQUE_BOOK_SIZES, pathParams);
        return this.http.delete(url).pipe(map(this.extractData));
    }

    public deleteDemandDepositProductChequePrefixes(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.DELETE_DEMAND_DEPOSIT_PRODUCT_CHEQUE_PREFIXES, pathParams);
        return this.http.delete(url).pipe(map(this.extractData));
    }

}
