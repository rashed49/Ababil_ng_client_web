import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { BaseService, PathParameters } from './../../base.service';
import { HttpInterceptor } from './../../http.interceptor';
import { Observable } from 'rxjs';
import * as specialProfitRateEndpoints from '../special.profit.rate.api.endpoints';
import { AccountSpecialProfitRate } from '../domain/special.profit.rate.model';
import { map } from 'rxjs/operators';

@Injectable()
export class SpecialProfitRateService extends BaseService {
    constructor(private http: HttpInterceptor) {
        super();
    }

    fetchAccountSpecialProfitRate(pathParams: PathParameters): Observable<any> {
        const url = this.create(specialProfitRateEndpoints.FETCH_ACCOUNT_SPECIAL_PROFIT_RATE, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    createAccountSpecialProfitRate(accountSpecialProfitRate: AccountSpecialProfitRate, pathParams: PathParameters, urlSearchParams: Map<any, any>): Observable<AccountSpecialProfitRate> {
        const url = this.create(specialProfitRateEndpoints.CREATE_ACCOUNT_SPECIAL_PROFIT_RATE, pathParams);
        let options = new RequestOptions({params: this.getUrlSearchParams(urlSearchParams)});

        return this.http.post(url, accountSpecialProfitRate, options).pipe(map(this.extractData));
    }

    updateAccountSpecialProfitRate(accountSpecialProfitRate: AccountSpecialProfitRate, pathParams: PathParameters, urlSearchParams: Map<any, any>): Observable<any> {
        const url = this.create(specialProfitRateEndpoints.UPDATE_ACCOUNT_SPECIAL_PROFIT_RATE, pathParams);
        let options = new RequestOptions({params: this.getUrlSearchParams(urlSearchParams)});

        return this.http.put(url, accountSpecialProfitRate, options).pipe(map(this.extractData));
    }

    deleteAccountSpecialProfitRate(pathParams: PathParameters): Observable<any> {
        const url = this.create(specialProfitRateEndpoints.DELETE_ACCOUNT_SPECIAL_PROFIT_RATE, pathParams);
        return this.http.delete(url).pipe(map(this.extractData));
    }


}