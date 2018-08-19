import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import * as endpoints from '../demand.deposit.account.api.endpoints';
import { DemandDepositAccount, ActivateDepositAccountCommand, DemandDepositAccountMinimumBalance, DeactivateDepositAccountCommand, DemandDepositAccountCloseRequest, ReactivateDepositAccountCommand, DepositAccountCloseCommand, ReactivateDepositDormantAccountCommand, ActionCommand, DemandDepositAccountAction, ReactivateDemandDepositAccountCommandDetails } from "../domain/demand.deposit.account.models";
import { NotificationService } from './../../../common/notification/notification.service';
import { HttpInterceptor } from './../../http.interceptor';
import { BaseService, PathParameters } from './../../base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DemandDepositAccountService extends BaseService {

  constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
    super();
  }

  public fetchDemandDepositAccounts(urlSearchParams: Map<string, string>): Observable<any> {
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    return this.http
      .get(endpoints.FETCH_DEMAND_DEPOSIT_ACCOUNTS, options)
      .pipe(map(this.extractData));
  }

  public fetchDemandDepositAccountDetails(pathParameters: PathParameters): Observable<any> {
    let url = this.create(endpoints.FETCH_DEMAND_DEPOSIT_ACCOUNT_DETAIL, pathParameters);
    return this.http
      .get(url)
      .pipe(map(this.extractData));
  }

  public fetchDemandDepositAccountTransactions(urlSearchParams: Map<string, string>, accountId: number): Observable<any> {
    let url = this.create(endpoints.FETCH_DEMAND_DEPOSIT_ACCOUNT_TRANSACTION, { id: accountId + "" });
    const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    return this.http.get(url, options).pipe(map(this.extractData));
  }

  public createDemandDepositAccount(demandDepositAccount: DemandDepositAccount): Observable<any> {
    return this.http.post(endpoints.CREATE_DEMAND_DEPOSIT_ACCOUNT, demandDepositAccount)
      .pipe(map(this.extractData));
  }

  public updateDemandDepositAccount(demandDepositAccount: DemandDepositAccount, pathParameters: PathParameters, urlSearchParams: Map<any, any>): Observable<any> {
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    let url = this.create(endpoints.UPDATE_DEMAND_DEPOSIT_ACCOUNT, pathParameters);
    return this.http.put(url, demandDepositAccount, options).pipe(map(this.extractData));
  }

  public activateAccount(accountId: number, urlSearchParams: Map<string, string>): Observable<any> {
    let url = this.create(endpoints.DEMAND_DEPOSIT_ACCOUNT_COMMAND, { id: accountId + "" });
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    return this.http.post(url, new ActivateDepositAccountCommand(accountId), options).pipe(map(this.extractData));
  }

  public reactivateDormantAccount(accountId: number, reactivateDemandDepositAccountCommandDetail: ReactivateDemandDepositAccountCommandDetails, urlSearchParams: Map<string, string>): Observable<any> {
    let url = this.create(endpoints.DEMAND_DEPOSIT_ACCOUNT_COMMAND, { id: accountId + "" });
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    let command = new ActionCommand();
    command.action = "ACTIVATE"
    command.object = null;
    return this.http.post(url,command, options).pipe(map(this.extractData));
  }

  // public reactivateDormantAccount(accountId: number, reactivateDemandDepositAccountCommandDetail: ReactivateDemandDepositAccountCommandDetails, urlSearchParams: Map<string, string>): Observable<any> {
  //   let url = this.create(endpoints.DEMAND_DEPOSIT_ACCOUNT_COMMAND, { id: accountId + "" });
  //   let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
  //   let command = new ActionCommand();
  //   command.action = "REACTIVATE"
  //   command.object = reactivateDemandDepositAccountCommandDetail;
  //   return this.http.post(url, command, options).map(this.extractData);
  // }

  public reactivateAccount(accountId: number, reactivateDemandDepositAccountCommandDetail, urlSearchParams: Map<string, string>): Observable<any> {
    let url = this.create(endpoints.DEMAND_DEPOSIT_ACCOUNT_COMMAND, { id: accountId + "" });
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    let command = new ActionCommand();
    command.action = "REACTIVATE"
    command.object = reactivateDemandDepositAccountCommandDetail;
    return this.http.post(url, command, options).pipe(map(this.extractData));
  }

  public demandDepositAccountClose(accountId: number, accountCloseRequest: DemandDepositAccountCloseRequest, urlSearchParams: Map<string, string>): Observable<any> {
    let url = this.create(endpoints.DEMAND_DEPOSIT_ACCOUNT_COMMAND, { id: accountId + "" });
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    let command = new ActionCommand();
    command.action = "CLOSE"
    command.object = accountCloseRequest;
    return this.http.post(url, command, options).pipe(map(this.extractData));
  }

  public updateDemandDepositAccountMinimumBalance(pathParameters: PathParameters, minimumBalance: DemandDepositAccountMinimumBalance, urlSearchParams: Map<string, string>): Observable<any> {
    let url = this.create(endpoints.UPDATE_DEMAND_DEPOSIT_ACCOUNT_MINIMUM_BALANCE, pathParameters);
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    return this.http.put(url, minimumBalance, options).pipe(map(this.extractData));
  }

  public getDemandDepositAccountMinimumBalanceLog(pathParameters: PathParameters): Observable<any> {
    let url = this.create(endpoints.DEMAND_DEPOSIT_ACCOUNT_MINIMUM_BALANCE_LOG, pathParameters);
    return this.http.get(url).pipe(map(this.extractData));
  }

  public getDemadDepositAccountChargeInformation(queryParams: Map<string, string>): Observable<any> {
    const options = new RequestOptions({ params: this.getUrlSearchParams(queryParams) });
    return this.http.get(endpoints.DEMAND_DEPOSIT_ACCOUNT_CHARGE, options).pipe(map(this.extractData));
}


}
