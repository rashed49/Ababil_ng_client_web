import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { BaseService } from './../../base.service';
import { HttpInterceptor } from './../../http.interceptor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as pensionSchedulerEndpoints from '../pension.scheduler.api.endpoints';

@Injectable()
export class PensionSchedulerService extends BaseService {
    constructor(private http: HttpInterceptor) {
        super();
    }


    public fetchPensionScheduler(urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
         return this.http.get(pensionSchedulerEndpoints.FETCH_PENSION_SCHEDULE,options)
         .pipe(map(this.extractData));
    }

}