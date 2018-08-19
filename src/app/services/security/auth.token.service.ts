import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpInterceptor } from './../http.interceptor';
import { Injectable } from '@angular/core';
import { BaseService } from './../base.service';
import * as endpoints from './auth.endpoint';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthTokenService extends BaseService {

    constructor(private http: HttpInterceptor) {
        super();
    }

    public fetchAuthToken(urlSearchParams: Map<string, string>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_TOKEN, options)
            .pipe(map(this.extractData));
    }


}