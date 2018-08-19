import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { NotificationService } from './../../../common/notification/notification.service';
import { HttpInterceptor } from './../../http.interceptor';
import { BaseService, PathParameters } from './../../base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TellerAllocation } from '../domain/teller.models';
import * as endpoints from '../teller.api.endpoints';

@Injectable()
export class TellerAllocationService extends BaseService {

  constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
    super();
  }


  public fetchTellerAllocations(urlSearchParams: Map<string, any>): Observable<any> {

    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    return this.http
      .get(endpoints.FETCH_ALLOCATED_TELLERS, options)
      .pipe(map(this.extractData));
  }
  public fetchTellers(urlSearchParams: Map<string, any>): Observable<any> {
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    return this.http
      .get(endpoints.FETCH_TELLERS, options)
      .pipe(map(this.extractData));
  }

  public fetchTellerAllocationDetail(pathParameters: PathParameters): Observable<any> {
    let url = this.create(endpoints.FETCH_TELLER_ALLOCATION_DETAIL, pathParameters);
    return this.http
      .get(url)
      .pipe(map(this.extractData));
  }

  public createTellerAllocation(tellerAllocation: TellerAllocation, urlSearchParams: Map<string, string>): Observable<TellerAllocation> {
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    return this.http
      .post(endpoints.CREATE_TELLER_ALLOCATION, tellerAllocation, options)
      .pipe(map(this.extractData));
  }

  public updateTellerAllocation(tellerAllocation: TellerAllocation, pathParams: PathParameters, urlSearchParams: Map<string, string>): Observable<TellerAllocation> {
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    let url = this.create(endpoints.UPDATE_TELLER_ALLOCATION, pathParams);
    return this.http.put(url, tellerAllocation, options)
      .pipe(map(this.extractData));
  }

  public deleteTellerAllocation(pathParams: PathParameters, urlSearchParams: Map<string, string>): Observable<TellerAllocation> {
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    let url = this.create(endpoints.DELETE_TELLER_ALLOCATION, pathParams);
    return this.http.delete(url, options)
      .pipe(map(this.extractData));
  }



}
