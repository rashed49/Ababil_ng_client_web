import { BaseListResponse } from './../../domain/list.response.model';
import { Injectable } from '@angular/core';
import { BaseService } from '../../base.service';
import { PathParameters } from '../../base.service';
import * as endpoints from '../bank.api.endpoints';
import { Bank, Branch } from '../domain/bank.models';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { HttpInterceptor } from '../../http.interceptor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationService } from '../../../common/notification/notification.service';
@Injectable()
export class BankService extends BaseService {
    constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
        super();
    }

    // Bank Services
    public fetchBanks(): Observable<any> {
        return this.http
            .get(endpoints.FETCH_BANK_PROFILES)
            .pipe(map(this.extractData));
    }

    public fetchBankDetail(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_BANK_PROFILE, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public createBank(Bank: Bank, urlSearchParams: Map<any, any>): Observable<Bank> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(endpoints.CREATE_BANK_PROFILE, Bank, options)
            .pipe(map(this.extractData));
    }

    public updateBank(Bank: Bank, pathParams: PathParameters, urlSearchParams: Map<any, any>): Observable<Bank> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        let url = this.create(endpoints.UPDATE_BANK_PROFILE, pathParams);
        return this.http.put(url, Bank, options).pipe(map(this.extractData));
    }

    public deleteBank(pathParams: PathParameters, urlSearchParams: Map<any, any>): Observable<Bank> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        let url = this.create(endpoints.DELETE_BANK_PROFILE, pathParams);
        return this.http.delete(url, options).pipe(map(this.extractData));

    }

    // Branch Services
    public fetchBranchProfiles(pathParams: PathParameters, urlSearchParams: Map<any, any>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        let url = this.create(endpoints.FETCH_BRANCH_PROFILES, pathParams);
        return this.http
            .get(url, options)
            .pipe(map(this.extractData));
    }
    public fetchBranches(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_BRANCH_PROFILES, pathParams);
        return this.http
            .get(url)
            .pipe(map(this.extractData));
    }

    public fetchOwnBranches(urlSearchParams: Map<any, any>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_OWN_BRANCHES, options)
            .pipe(map(this.extractData));
    }
    public fetchOwnBranchDetails(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_OWN_BRANCHES_DETAIL, pathParams);
        return this.http
            .get(url)
            .pipe(map(this.extractData));
    }


    public fetchBranchDetails(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_BRANCH_PROFILE, pathParams);
        return this.http
            .get(url)
            .pipe(map(this.extractData));
    }

    public createBranchProfile(branch: any, pathParams: PathParameters, urlSearchParams: Map<any, any>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        let url = this.create(endpoints.CREATE_BRANCH_PROFILE, pathParams);
        return this.http
            .post(url, branch, options)
            .pipe(map(this.extractData));
    }

    public updateBranchProfile(branch: any, pathParams: PathParameters, urlSearchParams: Map<any, any>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        let url = this.create(endpoints.UPDATE_BRANCH_PROFILE, pathParams);
        return this.http
            .put(url, branch, options)
            .pipe(map(this.extractData));
    }

    public deleteBranch(pathParams: PathParameters, urlSearchParams: Map<any, any>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        let url = this.create(endpoints.DELETE_BRANCH_PROFILE, pathParams);
        return this.http
            .delete(url, options)
            .pipe(map(this.extractData));
    }
}
