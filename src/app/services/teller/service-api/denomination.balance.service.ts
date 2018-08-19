import { Injectable } from '@angular/core';
import { NotificationService } from './../../../common/notification/notification.service';
import { HttpInterceptor } from './../../http.interceptor';
import { BaseService, PathParameters } from './../../base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as endpoints from '../teller.api.endpoints';

@Injectable()
export class DenominationBalanceService extends BaseService {
    constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
        super();
    }

    public fetchDenominations(): Observable<any> {
        return this.http.get(endpoints.FETCH_DENOMINATIONS).pipe(map(this.extractData));
    }

    public fetchDenominationById(pathParams: PathParameters): Observable<any>{
        let url = this.create(endpoints.FETCH_DENOMINATION_BY_ID, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    //Denomination Balance 

    public fetchDenominationBalanceByTellerId(pathParams: PathParameters): Observable<any>{
        return this.http.get(this.create(endpoints.FETCH_DENOMINATION_BALANCE_BY_TELLER_ID, pathParams)).pipe(map(this.extractData));
    }

    public fetchDenominationBalanceByDenominationId(pathParams: PathParameters): Observable<any>{
        return this.http.get(this.create(endpoints.FETCH_DENOMINATION_BALANCE_BY_DENOMINATION_ID, pathParams)).pipe(map(this.extractData));
    }

    public fetchDenominationBalanceByCurrencyCode(pathParams: PathParameters): Observable<any>{
        return this.http.get(this.create(endpoints.FETCH_DENOMINATION_BALANCE_BY_CURRENCY_CODE, pathParams)).pipe(map(this.extractData));
    }




}