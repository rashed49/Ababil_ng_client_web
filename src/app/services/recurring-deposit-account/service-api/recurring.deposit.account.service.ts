import { HttpInterceptor } from './../../http.interceptor';
import { BaseService, PathParameters } from './../../base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestOptions } from '@angular/http';
import * as endpoints from '../recurring.deposit.account.api.endpoints';
import { RecurringDepositAccount, ActivateRecurringDepositAccountCommand } from '../domain/recurring.deposit.account.model';

@Injectable()
export class RecurringDepositAccountService extends BaseService {

    constructor(private http: HttpInterceptor) {
        super();
    }

    public fetchRecurringDepositAccounts(urlSearchParams: Map<string, string>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_RECURRING_DEPOSIT_ACCOUNTS, options)
            .pipe(map(this.extractData));
    }

    public fetchRecurringDepositAccountDetails(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.FETCH_RECURRING_DEPOSIT_PRODUCT_DETAILS, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public createRecurringDepositAccount(recurringDepositAccount: RecurringDepositAccount): Observable<any> {
        return this.http.post(endpoints.CREATE_RECURRING_DEPOSIT_ACCOUNTS, recurringDepositAccount)
            .pipe(map(this.extractData));
    }

    public updateRecurringDepositAccount(pathParams: PathParameters, recurringDepositAccount: RecurringDepositAccount, urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        const url = this.create(endpoints.UPDATE_RECURRING_DEPOSIT_ACCOUNTS, pathParams);
        return this.http.put(url, recurringDepositAccount,options).pipe(map(this.extractData));
    }

    public activateRecurringDepositAccount(recurringDepositAccountId: number, urlSearchParams: Map<string, string>): Observable<any> {
        let url = this.create(endpoints.ACTIVATE_RECURRING_DEPOSIT_ACCOUNTS_COMMAND, { recurringDepositAccountId: recurringDepositAccountId + "" });
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(url, new ActivateRecurringDepositAccountCommand(), options)
            .pipe(map(this.extractData));
    }
}