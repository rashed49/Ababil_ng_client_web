import { BalanceSheetReportConfiguration } from './../domain/balance.sheet.report.config.model';
import { Injectable } from '@angular/core';
import { HttpInterceptor } from '../../http.interceptor';
import { BaseService } from '../../base.service';
import * as endpoints from '../gl.account.endpoints';
import { RequestOptions } from '@angular/http';
import { PathParameters } from '../../base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BalanceSheetReportMappingCofigurationService extends BaseService {

    constructor(private http: HttpInterceptor) {
        super();
    }

    public fetchBalanceSheetMappings(urlSearchParams:Map<string,string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_BALANCE_SHEET_MAPPINGS, options)
            .pipe(map(this.extractData));
    }

    public saveBalanceSheetMappings(balanceSheetMappings:BalanceSheetReportConfiguration[]): Observable<any>{
        return this.http.post(endpoints.SAVE_BALANCE_SHEET_MAPPINGS, balanceSheetMappings)
            .pipe(map(this.extractData));
    }

    public deleteBalanceSheetMapping(pathParams:PathParameters): Observable<any>{
        let url = this.create(endpoints.DELETE_BALANCE_SHEET_MAPPING, pathParams);
        return this.http.delete(url).pipe(map(this.extractData));
    }

}