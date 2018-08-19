import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { NotificationService } from './../../../common/notification/notification.service';
import { HttpInterceptor } from './../../http.interceptor';
import { BaseService, PathParameters } from './../../base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as endpoints from '../common.configurations.api.endpoints'; 


@Injectable()
export class CommonConfigurationService extends BaseService {
    constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
        super();
    }

    public fetchApplicationDate(urlSearchParams:Map<string,string>):Observable<any>{
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_APPLICATION_DATE,options)
               .pipe(map(this.extractData));
    }

    public fetchBaseCurrency(urlSearchParams:Map<string,string>):Observable<any>{
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_BASE_CURRENCY,options)
               .pipe(map(this.extractData));
    }
}