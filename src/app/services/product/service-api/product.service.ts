import { Injectable } from '@angular/core';
import { BaseService, PathParameters } from '../../base.service';
import { NotificationService } from '../../../common/notification/notification.service';
import { HttpInterceptor } from '../../http.interceptor';
import * as endpoints from '../product.api.endpoints'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestOptions } from '@angular/http';
import { ProfitRate } from '../domain/profit-rate.model';


@Injectable()
export class ProductService extends BaseService {

    constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
        super();
    }

    public fetchProducts(urlSearchParams: Map<string, string>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_PRODUCTS, options)
            .pipe(map(this.extractData));

    }

    public fetchProductDetails(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_PRODUCT_DETAILS, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    //should be in account service
    public createAccountNumber(pathParameters: PathParameters, urlQueryMap: any): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlQueryMap) });
        let url = this.create(endpoints.CREATE_ACCOUNT_NUMBER, pathParameters);
        return this.http.get(url, options).pipe(map(this.extractData));
    }
    public fetchProductConfiguration(urlSearchParams: Map<string, string>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_PRODUCT_CONFIGURATION, options)
            .pipe(map(this.extractData));

    }
    public createProfitRate(profitRate: ProfitRate, pathParams: PathParameters,urlSearchParams:Map<string,string>): Observable<any> {
        let url = this.create(endpoints.CREATE_PRODUCT_PROFIT_RATES, pathParams);
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        
        return this.http
            .post(url, profitRate,options)
            .pipe(map(this.extractData));
    }

    public updateProfitRate(profitRate: ProfitRate, pathParams: PathParameters,urlSearchParams:Map<string,string>): Observable<any> {
        let url = this.create(endpoints.UPDATE_PRODUCT_PROFIT_RATE, pathParams);
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });        
        return this.http
            .put(url, profitRate,options)
            .pipe(map(this.extractData));
    }

    public fetchProfitRates(pathParams: PathParameters,urlSearchParams: Map<string, string>): Observable<any> {
        let url = this.create(endpoints.FETCH_PRODUCT_PROFIT_RATES, pathParams);
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });   
        return this.http
            .get(url,options)
            .pipe(map(this.extractData));
    }

    public fetchProfitRate(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.FETCH_PRODUCT_PROFIT_RATE, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }


    //gl
    public fetchGeneralLedgerType(urlSearchParams: Map<string , string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams)});
        return this.http.get(endpoints.FETCH_GENERAL_LEDGER_TYPE, options).pipe(map(this.extractData));
    }

    public fetchGeneralLedger(): Observable<any> {
        return this.http.get(endpoints.FETCH_GENERAL_LEDGER).pipe(map(this.extractData));
    }
}