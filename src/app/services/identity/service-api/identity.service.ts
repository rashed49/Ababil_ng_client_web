import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import * as endpoints from '../identity.api.endpoints';
import { HttpInterceptor } from './../../http.interceptor';
import { BaseService, PathParameters } from './../../base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IdentityType } from '../domain/identity.type.models';

@Injectable()
export class IdentityService extends BaseService {
    constructor(private http: HttpInterceptor) {
        super();
    }

    public fetchIdentityTypes(urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http
            .get(endpoints.FETCH_IDENTITY_TYPES, options)
            .pipe(map(this.extractData));
    }

    public fetchIdentityTypeDetail(pathParams: PathParameters): Observable<IdentityType> {
        let url = this.create(endpoints.FETCH_IDENTITY_TYPE_DETAILS, pathParams);
        return this.http.get(url)
            .pipe(map(this.extractData));
    }

    public createIdentityType(identityType: IdentityType): Observable<IdentityType> {
        return this.http.post(endpoints.CREATE_IDENTITY_TYPE, identityType)
            .pipe(map(this.extractData));
    }

    public updateIdentityType(identityType: IdentityType, pathParams: PathParameters): Observable<IdentityType> {
        let url = this.create(endpoints.UPDATE_IDENTITY_TYPE, pathParams);
        return this.http.put(url, identityType)
            .pipe(map(this.extractData));
    }

    public deleteIdentityType(pathParams: PathParameters): Observable<IdentityType> {
        let url = this.create(endpoints.DELETE_IDENTITY_TYPE, pathParams);
        return this.http.delete(url)
            .pipe(map(this.extractData));
    }
}