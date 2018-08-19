import { Injectable } from '@angular/core';
import { BaseService, PathParameters } from './../../base.service';
import { HttpInterceptor } from './../../http.interceptor';
import * as endpoints from '../product-general-ledger-assignment.api.endpoints';
import { Observable } from 'rxjs';
import { ProductGeneralLedgerMapping } from '../domain/product-general-ledger-assignment.model';
import { map } from 'rxjs/operators';

@Injectable()
export class ProductGeneralLedgerAssignmentService extends BaseService {

  constructor(private http: HttpInterceptor) {
    super();
  }

  public fetchProductGeneralLedgerMapping(pathParams: PathParameters): Observable<any> {
    const url = this.create(endpoints.FETCH_PRODUCT_GENERAL_LEDGER_MAPPING, pathParams);
    return this.http.get(url).pipe(map(this.extractData));
  }

  public createProductGeneralLedgerMapping(productGeneralLedgerMapping: ProductGeneralLedgerMapping, pathParams: PathParameters): Observable<any> {
    const url = this.create(endpoints.CREATE_PRODUCT_GENERAL_LEDGER_MAPPING, pathParams);
    return this.http.post(url, productGeneralLedgerMapping).pipe(map(this.extractData));
  }

  public updateProductGeneralLedgerMapping(productGeneralLedgerMapping: ProductGeneralLedgerMapping, pathParams: PathParameters): Observable<any> {
    const url = this.create(endpoints.UPDATE_PRODUCT_GENERAL_LEDGER_MAPPING, pathParams);
    return this.http.put(url, productGeneralLedgerMapping);
  }

  public deleteProductGeneralLedgerMapping(pathParams: PathParameters): Observable<any> {
    const url = this.create(endpoints.DELETE_PRODUCT_GENERAL_LEDGER_MAPPING, pathParams);
    return this.http.delete(url).pipe(map(this.extractData));
  }

}
