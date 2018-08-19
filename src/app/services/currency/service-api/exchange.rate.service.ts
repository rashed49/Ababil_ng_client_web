import { Injectable } from '@angular/core';
import { BaseService, PathParameters } from './../../base.service';
import { HttpInterceptor } from './../../http.interceptor';
import { NotificationService } from '../../../common/notification/notification.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as endpoints from '../currency.api.endpoints';

@Injectable()
export class ExchangeRateService extends BaseService {

    constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
        super();
    }

    public fetchExchangeRateTypes(): Observable<any> {
        return this.http.get(endpoints.FETCH_EXCHANGE_RATE_TYPES).pipe(map(this.extractData));
    }

    public fetcExchangeRatesByCurrencyCode(pathParameters: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_EXCHANGE_RATE_BY_CURRENCY_CODE, pathParameters);
        return this.http.get(url).pipe(map(this.extractData));
    }


}