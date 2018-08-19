import { HttpInterceptor } from './../../http.interceptor';
import { BaseService, PathParameters } from './../../base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as endpoints from '../report.configuration.api.endpoints';


@Injectable()
export class ReportConfiguartionService extends BaseService {

    constructor(private http: HttpInterceptor) {
        super();
    }

    public fetchReportConfigurations():Observable<any>{
        return this.http.get(endpoints.FETCH_REPORT_CONFIGURATIONS)
            .pipe(map(this.extractData));
    }

    public fetchReportConfiguration(pathParams:PathParameters):Observable<any>{
        const url = this.create(endpoints.FETCH_REPORT_CONFIGURATION, pathParams);
        return this.http.get(url)
            .pipe(map(this.extractData));
    }



}