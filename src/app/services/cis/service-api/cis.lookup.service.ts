import { RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../base.service';
import { HttpInterceptor } from './../../http.interceptor';
import * as endpoints from '../cis.api.endpoints';
import { map } from 'rxjs/operators';

@Injectable()
export class CISLookupService extends BaseService {

  constructor(private http: HttpInterceptor) {
    super();
  }

  public searchIndividual(urlSearchParams: Map<string, string>): Observable<any> {
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    return this.http.get(endpoints.SEARCH_INDIVIDUAL_INFORMATION, options).pipe(map(this.extractData));
  }

  public searchOrganization(urlSearchParams: Map<string, string>): Observable<any> {
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    return this.http.get(endpoints.SEARCH_ORGANIZATION_INFORMATION, options).pipe(map(this.extractData));
  }
}
