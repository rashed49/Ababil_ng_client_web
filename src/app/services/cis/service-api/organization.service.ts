import { PathParameters } from './../../base.service';
import { Injectable } from '@angular/core';
import { BaseService } from '../../base.service';
import * as endpoints from '../cis.api.endpoints';
import { RequestOptions } from '@angular/http';
import { HttpInterceptor } from '../../http.interceptor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationService } from '../../../common/notification/notification.service';
import { Owner } from '../../../ababil-modules/cis/organization/domain/organization.owner';

@Injectable()
export class OrganizationService extends BaseService {

    constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
        super();
    }

    public addOwner(owner: Owner, pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.CREATE_ORG_OWNER, pathParams);
        return this.http.post(url, owner).pipe(map(this.extractData));
    }
    public fetchOrgOwners(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_ORG_OWNERS, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public fetchOwnerDetails(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_ORG_OWNER_DETAILS, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public updateOwner(owner: Owner, pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.UPDATE_ORG_OWNER, pathParams);
        return this.http.put(url, owner).pipe(map(this.extractData));
    }

    public fetchAssignableShare(pathParams: PathParameters, urlSearchParams: Map<string, string>) {
        let url = this.create(endpoints.FETCH_ASSIGNABLE_SHARE, pathParams);
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(url, options).pipe(map(this.extractData));
    }

    public fetchOrganizationDetails(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_ORGANIZATION_DETAILS, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public removeOrganizationOwner(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.REMOVE_ORGANIZATION_OWNER, pathParams);
        return this.http.delete(url).pipe(map(this.extractData));
    }
}
