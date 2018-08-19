import { OwnerType } from './../domain/owner.type.model';
import { Injectable } from "@angular/core";
import { HttpInterceptor } from "../../http.interceptor";
import { BaseService, PathParameters } from "../../base.service";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { RequestOptions } from "@angular/http";
import * as endpoints from '../cis.api.endpoints';

@Injectable()
export class OwnerTypeService extends BaseService {

    constructor(private http: HttpInterceptor) {
        super();
    }

    public fetchOwnerTypes(urlSearchParams: Map<string, any>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_OWNER_TYPES, options).pipe(map(this.extractData));
    }

    public createOwnerType(ownerType: OwnerType): Observable<any> {
        return this.http.post(endpoints.CREATE_OWNER_TYPE, ownerType).pipe(map(this.extractData));
    }

    public updateOwnerType(ownerType: OwnerType, pathParams: PathParameters): Observable<OwnerType> {
        let url = this.create(endpoints.UPDATE_OWNER_TYPE, pathParams);
        return this.http.put(url, ownerType).pipe(map(this.extractData));
    }
}