import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BaseService, PathParameters } from '../../base.service';
import { HttpInterceptor } from './../../http.interceptor';
import * as endpoints from '../cis.api.endpoints';

@Injectable()
export class CISMiscellaneousService extends BaseService {

  constructor(private http: HttpInterceptor) {
    super();
  }

  public getCustomerSourceOfFunds(): Observable<any> {
    return this.http.get(endpoints.FETCH_CUSTOMER_SOURCE_OF_FUNDS).pipe(map(this.extractData));
  }

  public getCustomerTypeOfBusiness(): Observable<any> {
    return this.http.get(endpoints.FETCH_CUSTOMER_TYPE_OF_BUSINESS).pipe(map(this.extractData));
  }

  public getCustomerClassificationTypes(): Observable<any> {
    return this.http.get(endpoints.FETCH_CUSTOMER_CLASSIFICATION_TYPES).pipe(map(this.extractData));
  }

  public getConfiguration(pathparams: PathParameters): Observable<any> {
      let url = this.create(endpoints.FETCH_CONFIGURATION, pathparams);
      return this.http.get(url).pipe(map(this.extractData));
  }

  public fetchOtherInformationTopics(): Observable<any> {
    return this.http.get(endpoints.FETCH_OTHER_INFORMATION_TOPICS).pipe(map(this.extractData));
  }

  public fetchFatcaEntityTypes(): Observable<any>{
    return this.http.get(endpoints.FETCH_FATCA_ENTITY_TYPES).pipe(map(this.extractData));
  }

}
