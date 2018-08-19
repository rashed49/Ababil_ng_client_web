import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { BaseService, PathParameters } from '../../base.service';
import * as endpoints from '../nominee.api.endpoints';
import { AccountNominee, AvailablePercentage } from '../domain/nominee.model';
import { HttpInterceptor } from './../../http.interceptor';


@Injectable()
export class NomineeService extends BaseService {

    constructor(private http: HttpInterceptor) {
        super();
    }

    public createAccountNominee(accountNominee: AccountNominee) {
        return this.http.post(endpoints.CREATE_ACCOUNT_NOMINEE, accountNominee)
            .pipe(map(this.extractData));
    }

    public fetchAccountNominees(urlSearchParams:Map<string,string>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_ACCOUNT_NOMINEES,options).pipe(map(this.extractData));
    }

    public fetchAccountNomineeDetails(pathParameters: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_ACCOUNT_NOMINEE_DETAILS, pathParameters);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public updateAccountNominee(nominee: AccountNominee, pathParameters: PathParameters): Observable<any> {
        let url = this.create(endpoints.UPDATE_ACCOUNT_NOMINEE, pathParameters);
        return this.http.put(url, nominee).pipe(map(this.extractData));
    }

    public deleteAccountNominee(pathParameters: PathParameters): Observable<any> {
        let url = this.create(endpoints.DELETE_ACCOUNT_NOMINEE, pathParameters);
        return this.http.delete(url).pipe(map(this.extractData));
    }

    public fetchAvailablePercentage(urlQueryMap: any): Observable<AvailablePercentage> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlQueryMap) });        
        return this.http.get(endpoints.FETCH_NOMINEE_AVAILABLE_PERCENTAGE, options).pipe(map(this.extractData));
    }

    public isMinor(urlQueryParams:Map<string,any>):Observable<any>{
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlQueryParams) });
        return this.http.get(endpoints.ISMINOR, options).pipe(map(this.extractData));
    }

}