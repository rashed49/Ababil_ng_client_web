import { Injectable } from "@angular/core";
import { HttpInterceptor } from "../../../http.interceptor";
import { Observable } from "rxjs";
import * as endpoints from '../inland.remittance.lot.api.endpoints';
import { InlandRemittanceLot } from "../domain/inland.remittance.lot.models";
import { BaseService, PathParameters } from "../../../base.service";
import { RequestOptions } from "@angular/http";
import { map } from 'rxjs/operators';

@Injectable()
export class InlandRemittanceLotService extends BaseService {

    constructor(private http: HttpInterceptor) {
        super();
    }

    public fetchInlandRemittanceProduct(): Observable<any> {
        return this.http.get(endpoints.FETCH_INLAND_REMITTANCE_PRODUCTS).pipe(map(this.extractData));
    }
    public createInlandRemittanceLot(lot: InlandRemittanceLot, urlSearchParams: Map<string, any>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(endpoints.CREATE_INLANDREMITTANCELOT,lot,options).pipe(map(this.extractData));
    }
    public fetchInlandRemittanceLot(urlSearchParams: Map<string, any>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FATCH_INLANDREMITTANCELOT, options).pipe(map(this.extractData));
    }
    public deleteInlandRemittanceLot(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.DELETE_INLANDREMITTANCELOT, pathParams);
        // const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.delete(url).pipe(map(this.extractData));
    }
    public updateInlandRemittanceLot(lot,urlSearchParams: Map<string, any>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.put(endpoints.UPDATE_INLANDREMITTANCELOT, lot,options).pipe(map(this.extractData));
    }
    public fetchInlandRemittanceCurrency(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.FETCH_INLAND_REMITTANC_CURRENCY, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

}