import { Injectable } from '@angular/core';
import { BaseService, PathParameters } from '../../base.service';
import { RequestOptions } from '@angular/http';
import { HttpInterceptor } from '../../http.interceptor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as endpoints from '../fixed.deposit.product.api.endpoints';
import { FixedDepositProduct, ActivateFixedDepositProductCommand } from '../domain/fixed.deposit.product.model';

@Injectable()
export class FixedDepositProductService extends BaseService {

  constructor(private http: HttpInterceptor) {
    super();
  }

  public createFixedDepositProduct(fixedDepositProduct: FixedDepositProduct): Observable<any> {
    return this.http.post(endpoints.CREATE_FIXED_DEPOSIT_PRODUCTS, fixedDepositProduct)
      .pipe(map(this.extractData));
  }
  public fetchFixedDepositProducts(urlSearchParams: Map<string, string>): Observable<any> {
    const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    return this.http.get(endpoints.FETCH_FIXED_DEPOSIT_PRODUCTS, options)
      .pipe(map(this.extractData));

  }

  public fetchFixedDepositProductDetails(pathParams: PathParameters): Observable<any> {
    const url = this.create(endpoints.FETCH_FIXED_DEPOSIT_PRODUCT_DETAILS, pathParams);
    return this.http.get(url).pipe(map(this.extractData));
  }

  public updateFixedDepositProduct(fixedDepositProduct: FixedDepositProduct, pathParams: PathParameters,urlSearchParams: Map<string,string>): Observable<any> {
    const url = this.create(endpoints.UPDATE_FIXED_DEPOSIT_PRODUCTS, pathParams);
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    return this.http.put(url, fixedDepositProduct,options).pipe(map(this.extractData));
  }

  public activateFixedDepositProduct(fixedDepositProductId: number, urlSearchParams: Map<string, string>): Observable<any> {
    let url = this.create(endpoints.ACTIVATE_FIXED_DEPOSIT_PRODUCTS_COMMAND, { fixedDepositProductId: fixedDepositProductId + "" });
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    return this.http.post(url, new ActivateFixedDepositProductCommand(), options)
      .pipe(map(this.extractData));
  }

}
