import { BaseListResponse } from './../../domain/list.response.model';
import { Injectable } from '@angular/core';
import { BaseService } from '../../base.service';
import { PathParameters } from '../../base.service';
import * as endpoints from '../cis.api.endpoints';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { HttpInterceptor } from '../../http.interceptor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrganizationType } from '../domain/organization.model';
@Injectable()
export class OrganizationTypeService extends BaseService {
    constructor(private http: HttpInterceptor) {
        super();
    }

    // Organization Type Services
    public fetchOrganizationTypes(): Observable<any> {
        return this.http.get(endpoints.FETCH_ORGANIZATION_TYPES).pipe(map(this.extractData));
    }

    public createOrganizationType(type: OrganizationType): Observable<any> {
        return this.http.post(endpoints.CREATE_ORGANIZATION_TYPES, type).pipe(map(this.extractData));
    }

    public updateOrganizationType(OrganizationType: OrganizationType, pathParams: PathParameters): Observable<OrganizationType> {
        let url = this.create(endpoints.UPDATE_ORGANIZATION_TYPES, pathParams);
        return this.http.put(url, OrganizationType).pipe(map(this.extractData));
    }

}
