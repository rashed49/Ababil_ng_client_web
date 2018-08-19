import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import * as endpoints from '../fixed.deposit.account.api.endpoints';
import { FixedDepositAccount, ActivateFixedDepositAccountCommand } from "../domain/fixed.deposit.account.models";
import { NotificationService } from './../../../common/notification/notification.service';
import { HttpInterceptor } from './../../http.interceptor';
import { BaseService, PathParameters } from './../../base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class FixedDepositAccountService extends BaseService {

  constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
    super();
  }

  public fetchFixedDepositAccounts(urlSearchParams: Map<string, string>): Observable<any> {
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    return this.http
      .get(endpoints.FETCH_FIXED_DEPOSIT_ACCOUNTS, options)
      .pipe(map(this.extractData));
  }

  public fetchFixedDepositAccountDetails(pathParameters: PathParameters): Observable<any> {
    let url = this.create(endpoints.FETCH_FIXED_DEPOSIT_ACCOUNT_DETAIL, pathParameters);
    return this.http
      .get(url)
      .pipe(map(this.extractData));
  }

  public createFixedDepositAccount(fixedDepositAccount: FixedDepositAccount): Observable<any> {
    return this.http.post(endpoints.CREATE_FIXED_DEPOSIT_ACCOUNT, fixedDepositAccount)
      .pipe(map(this.extractData));
  }

  public updateFixedDepositAccount(fixedDepositAccount: FixedDepositAccount, pathParameters: PathParameters,urlSearchParams: Map<string, string>): Observable<any> {
    let url = this.create(endpoints.UPDATE_FIXED_DEPOSIT_ACCOUNT, pathParameters);
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    return this.http.put(url, fixedDepositAccount,options).pipe(map(this.extractData));
  }

  public activateAccount(accountId: number, urlSearchParams: Map<string, string>): Observable<any> {
    let url = this.create(endpoints.FIXED_DEPOSIT_ACCOUNT_COMMAND, { fixedDepositAccountId: accountId + "" });
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    return this.http.post(url, new ActivateFixedDepositAccountCommand(accountId), options).pipe(map(this.extractData));
  }

  public fetchFixedDepositProducts(urlSearchParams: Map<string, string>): Observable<any> {
    const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    return this.http.get(endpoints.FETCH_FIXED_DEPOSIT_PRODUCTS, options)
        .pipe(map(this.extractData));

}

public fetchFixedDepositProductDetails(pathParams: PathParameters): Observable<any> {
  const url = this.create(endpoints.FETCH_FIXED_DEPOSIT_PRODUCT_DETAILS, pathParams);
  return this.http.get(url).pipe(map(this.extractData));
}



}
