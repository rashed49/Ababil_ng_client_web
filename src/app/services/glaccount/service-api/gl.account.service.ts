import { Injectable } from '@angular/core';
import { HttpInterceptor } from '../../http.interceptor';
import { NotificationService } from '../../../common/notification/notification.service';
import { BaseService } from '../../base.service';
import * as endpoints from '../gl.account.endpoints';
import { RequestOptions } from '@angular/http';
import { PathParameters } from '../../base.service';
import { GlAccount } from '../domain/gl.account.model';
import { SubLedger } from '../domain/sub.ledger.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeneralLedgerAccountProfitRate } from '../domain/gl.account.model';

@Injectable()
export class GlAccountService extends BaseService {


    constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
        super();
    }

    public fetchGLCategories(): Observable<any> {
        return this.http.get(endpoints.FETCH_GL_CATEGORIES)
            .pipe(map(this.extractData));
    }

    public fetchGlAccounts(urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_GL_ACCOUNTS, options)
            .pipe(map(this.extractData));
    }

    public postGlAccounts(glAccounts: GlAccount[], urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(endpoints.CREATE_GL_ACCOUNT, glAccounts, options)
            .pipe(map(this.extractData));
    }

    public createGlAccount(glAccount: GlAccount, urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(endpoints.CREATE_GL_ACCOUNT, glAccount, options)
            .pipe(map(this.extractData));
    }

    public updateGlAccount(pathParams: PathParameters, glAccount: GlAccount, urlSearchParams: Map<string, string>): Observable<any> {
        let url = this.create(endpoints.UPDATE_GL_ACCOUNT, pathParams);
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.put(url, glAccount, options).pipe(map(this.extractData));
    }

    public fetchGlAccountDetails(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_GL_ACCOUNT_DETAILS, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }



    public fetchProfitRates(pathParams: PathParameters, urlSearchParams: Map<string, string>): Observable<any> {
        let url = this.create(endpoints.FETCH_GL_ACCOUNT_PROFIT_RATES, pathParams);
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http
            .get(url, options)
            .pipe(map(this.extractData));
    }
    public fetchGeneralLedger(): Observable<any> {
        return this.http.get(endpoints.FETCH_GENERAL_LEDGER_ACCOUNTS).pipe(map(this.extractData));
    }

    public fetchGeneralLedgerAccountPath(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_GL_ACCOUNT_PATH, pathParams);
        return this.http.get(url).pipe(map(this.extractData));

    }
    // Here will be the service for fetchSubLedgerAccountPath
    // public fetchGeneralLedgerAccountPath(pathParams: PathParameters): Observable<any> {
    //     let url = this.create(endpoints.FETCH_GL_ACCOUNT_PATH, pathParams);
    //     return this.http.get(url).pipe(map(this.extractData));

    // }


    public createProfitRate(profitRate: GeneralLedgerAccountProfitRate, pathParams: PathParameters, urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        let url = this.create(endpoints.CREATE_GL_ACCOUNT_PROFIT_RATES, pathParams);
        return this.http
            .post(url, profitRate, options)
            .pipe(map(this.extractData));
    }

    public updateProfitRate(profitRate: GeneralLedgerAccountProfitRate, pathParams: PathParameters, urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        let url = this.create(endpoints.UPDATE_GENERAL_LEDGER_PROFIT_RATE, pathParams);
        return this.http
            .put(url, profitRate, options)
            .pipe(map(this.extractData));
    }

    public fetchProfitRate(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.FETCH_GENERAL_LEDGER_PROFIT_RATE, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public fetchGeneralLedgerAccountsWithType(urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_GL_ACCOUNTS, options)
            .pipe(map(this.extractData));
    }

    public fetchGeneralLedgerConfigurations(urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_GENERAL_LEDGER_CONFIGURATIONS, options)
            .pipe(map(this.extractData));
    }

    //subsidiary ledger

    public fetchSubGls(urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_SUB_GL, options)
            .pipe(map(this.extractData));
    }

    // public fetchsubGls(urlSearchParams: Map<string, string>): Observable<any> {
    //     let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    //     return this.http.get(endpoints.FETCH_SUB_GL, options)
    //         .pipe(map(this.extractData));
    // }

    public fetchSubGlDetails(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_SUB_GL_DETAILS, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public fetchSUBGLdetailsByCode(urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_SUB_GL, options)
            .pipe(map(this.extractData));
    }


    public createSubGl(subLedger: SubLedger, urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(endpoints.CREATE_SUB_GL, subLedger, options)

    }

    public updateSubGl(pathParams: PathParameters, subLedger: SubLedger, urlSearchParams: Map<string, string>): Observable<any> {
        let url = this.create(endpoints.UPDATE_SUB_GL, pathParams);
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.put(url, subLedger, options).pipe(map(this.extractData));
    }

    public fetchSUBGlCodeLength(urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_SUB_GL_CODE_LNGTH, options).pipe(map(this.extractData));
    }


}

