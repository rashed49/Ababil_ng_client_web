import { Injectable } from "@angular/core";
import { BaseService, PathParameters } from "../../base.service";
import { HttpInterceptor } from "../../http.interceptor";
import { Observable } from "rxjs";
import { RequestOptions } from "@angular/http";
import * as endpoints from '../teller.api.endpoints';
import { map } from "rxjs/operators";


@Injectable()
export class ServiceProviderService extends BaseService {
    constructor(private http: HttpInterceptor) {
        super();
    }

    public createServiceProvider(provider, urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(endpoints.CREATE_SERVICE_PROVIDER, provider, options)
            .pipe(map(this.extractData));
    }

    public fetchServiceProviders(urlSearchParams: Map<string, any>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_SERVICE_PROVIDERS, options)
            .pipe(map(this.extractData));
    }

    public fetchServiceProviderDetail(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_SERVICE_PROVIDER_DETAIL, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }
}