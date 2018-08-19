import { ActivateRecurringDepositProductCommand } from './../domain/recurring.deposit.product.model';
import { HttpInterceptor } from './../../http.interceptor';
import { BaseService, PathParameters } from './../../base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as endpoints from '../recurring.deposit.product.api.endpoints';
import { RequestOptions } from '@angular/http';
import { RecurringDepositProduct } from '../domain/recurring.deposit.product.model';

@Injectable()
export class RecurringDepositProductService extends BaseService {

    constructor(private http: HttpInterceptor) {
        super();
    }

    public fetchRecurringDepositProducts(urlSearchParams: Map<string, string>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_RECURRING_DEPOSIT_PRODUCTS, options)
            .pipe(map(this.extractData));
    }

    public fetchRecurringDepositProductDetails(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.FETCH_RECURRING_DEPOSIT_PRODUCT_DETAILS, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public createRecurringDepositProduct(recurringDepositProduct: RecurringDepositProduct): Observable<any> {
        return this.http.post(endpoints.CREATE_RECURRING_DEPOSIT_PRODUCTS, recurringDepositProduct)
            .pipe(map(this.extractData));
    }

    public updateRecurringDepositProduct(pathParams: PathParameters, recurringDepositProduct: RecurringDepositProduct, urlSearchParams: Map<string, string>): Observable<any> {
        const url = this.create(endpoints.UPDATE_RECURRING_DEPOSIT_PRODUCTS, pathParams);
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.put(url, recurringDepositProduct,options).pipe(map(this.extractData));
    }

    public activateRecurringDepositProduct(recurringDepositProductId: number, urlSearchParams: Map<string,string>): Observable<any> {
        let url = this.create(endpoints.ACTIVATE_RECURRING_DEPOSIT_PRODUCTS_COMMAND, { recurringDepositProductId: recurringDepositProductId + "" });
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(url, new ActivateRecurringDepositProductCommand(), options)
            .pipe(map(this.extractData));
    }
}