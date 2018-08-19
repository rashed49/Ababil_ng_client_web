import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { RequestOptions } from "@angular/http";
import { BaseService, PathParameters } from "../../../services/base.service";
import { HttpInterceptor } from "../../../services/http.interceptor";
import * as timeDepositLienEndpoints from '../time.deposit.lien.api.endpoints';
import { TimeDepositLien } from "../../time-deposit-lien/domain/time.deposit.lien.model";

@Injectable()
export class TimeDepositLienService extends BaseService {

    constructor(private http: HttpInterceptor) {
        super();
    }

    createTimeDepositLien(timeDepositLien: TimeDepositLien, urlSearchParams: Map<string, any>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(timeDepositLienEndpoints.CREATE_TIME_DEPOSIT_LIEN, timeDepositLien, options)
            .pipe(map(this.extractData));
    }
    updateTimeDepositLien(timeDepositLien: TimeDepositLien, urlSearchParams: Map<string, any>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.put(timeDepositLienEndpoints.UPDATE_TIME_DEPOSIT_LIEN, timeDepositLien, options)
            .pipe(map(this.extractData));
    }
    public fetchTimeDepositLienList(queryParams: Map<string, any>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(queryParams) });
        return this.http.get(timeDepositLienEndpoints.FETCH_TIME_DEPOSIT_LIEN_LIST, options).pipe(map(this.extractData));
    }

    fetchTimeDepositLien(pathParams: PathParameters): Observable<any> {
        const url = this.create(timeDepositLienEndpoints.FETCH_TIME_DEPOSIT_LIEN, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    fetchAccountEligibleLien(pathParams: PathParameters): Observable<any> {
        const url = this.create(timeDepositLienEndpoints.FETCH_ACCOUNT_ELIGIBLE_LIEN, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

}