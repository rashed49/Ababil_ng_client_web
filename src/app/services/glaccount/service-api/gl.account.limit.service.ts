import { BaseService, PathParameters } from './../../base.service';
import { HttpInterceptor } from './../../http.interceptor';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestOptions } from '@angular/http';
import * as endpoints from '../gl.account.endpoints';
import { GeneralLedgerAccountLimit } from '../domain/gl.account.model';

@Injectable()
export class GlAccountLimitService extends BaseService {

    constructor(private http: HttpInterceptor) {
        super();
    }

    public fetchGlAccountsLimits(pathParam: PathParameters, urlSearchParams: Map<string, string>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        const url = this.create(endpoints.FETCH_GL_ACCOUNT_LIMITS, pathParam);
        return this.http.get(url, options).pipe(map(this.extractData));
    }

    public createGeneralLedgerAccountLimit(pathParam: PathParameters, glAccountLimits: GeneralLedgerAccountLimit[], urlSearchParams: Map<string, string>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        const url = this.create(endpoints.CREATE_GENERAL_LEDGER_ACCOUNT_LIMIT, pathParam);
        return this.http.post(url, glAccountLimits, options).pipe(map(this.extractData));
    }

    public updateGeneralLedgerAccountLimit(pathParam: PathParameters, glAccountLimit: GeneralLedgerAccountLimit, urlSearchParams: Map<string, string>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        const url = this.create(endpoints.UPDATE_GENERAL_LEDGER_ACCOUNT_LIMIT, pathParam);
        return this.http.put(url, glAccountLimit, options).pipe(map(this.extractData));
    }
}