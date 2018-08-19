import { HttpInterceptor } from './../../http.interceptor';
import { BaseService, PathParameters } from './../../base.service';
import { Injectable } from '@angular/core';
import * as endpoints from '../account.api.endpoints';
import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FreezeAccount } from '../domain/account.model';

@Injectable()
export class AccountService extends BaseService {
    constructor(private http: HttpInterceptor) {
        super();
    }

    public fetchAccountOpeningChannels(): Observable<any> {
        return this.http.get(endpoints.ACCOUNT_OPENING_CHANNELS).pipe(map(this.extractData));
    }
    public fetchAccountOpeningChannelDetail(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_ACCOUNT_OPENING_CHANNEL_DETAIL, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public fetchAccounts(urlQueryMap: any): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlQueryMap) });
        return this.http.get(endpoints.FETCH_ACCOUNTS, options).pipe(map(this.extractData));
    }

    public fetchAccountDetails(pathParam: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_ACCOUNT_DETAILS, pathParam)
        return this.http.get(url).pipe(map(this.extractData));
    }

    public generateAccountNumber(pathParameters: PathParameters, urlQueryMap: any): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlQueryMap) });
        let url = this.create(endpoints.GENERATE_ACCOUNT_NUMBER, pathParameters);
        return this.http.get(url, options).pipe(map(this.extractData));
    }

    public fetchTaxation(queryParams: Map<string, string>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(queryParams) });
        return this.http.get(endpoints.ACCOUNT_TAXATION, options).pipe(map(this.extractData));
    }

    public freezeAccount(pathParameters: PathParameters, command: FreezeAccount, urlSearchParams: Map<string, string>): Observable<any> {
        let url = this.create(endpoints.FREEZE_ACCOUNT_COMMAND, pathParameters);
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(url, command, options).pipe(map(this.extractData));
    }

    public fetchAccountLengthConfiguration(): Observable<any> {
        return this.http.get(endpoints.ACCOUNT_LENGTH_CONFIGURATION).pipe(map(this.extractData));
    }

    public fetchProductCodeLengthConfiguration(): Observable<any> {
        return this.http.get(endpoints.PRODUCT_CODE_LENGTH_CONFIGURATION).pipe(map(this.extractData));
    }
    
    public fetchBranchCodeLength(): Observable<any> {
        return this.http.get(endpoints.BRANCH_CODE_LENGTH_CONFIGURATION).pipe(map(this.extractData));
    }

    
}