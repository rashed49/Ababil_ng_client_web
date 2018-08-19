import { Injectable } from '@angular/core';
import { BaseService, PathParameters } from './../../base.service';
import { HttpInterceptor } from './../../http.interceptor';
import { NotificationService } from '../../../common/notification/notification.service';
import { Observable } from 'rxjs';
import { RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import * as endpoints from '../currency.api.endpoints';

@Injectable()
export class CurrencyService extends BaseService {

    constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
        super();
    }

    public fetchCurrencyDetails(pathParameters: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_CURRENCY_DETAIL, pathParameters);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public fetchCurrencies(urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_CURRENCIES, options).pipe(map(this.extractData));
    }

    public fetchBaseCurrency(queryParams: Map<string, string>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(queryParams) });
        return this.http.get(endpoints.FETCH_BASE_CURRENCY, options).pipe(map(this.extractData));
    }
}