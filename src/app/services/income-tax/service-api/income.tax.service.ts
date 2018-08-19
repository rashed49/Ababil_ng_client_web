import { Injectable } from '@angular/core';
import { HttpInterceptor } from '../../http.interceptor';
import { NotificationService } from '../../../common/notification/notification.service';
import { BaseService } from '../../base.service';
import * as endpoints from '../income.tax.endpoints';
import { RequestOptions } from '@angular/http';
import { PathParameters } from '../../base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SpecialTaxRate } from '../domain/income.tax.model';

@Injectable()
export class IncomeTaxConfigurationService extends BaseService {

    constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
        super();
    }

    public fetchTaxSlabConfigurations(): Observable<any> {
        return this.http.get(endpoints.FETCH_TAX_SLAB_CONFIGURATION)
            .pipe(map(this.extractData));
    }

    public fetchTaxWaiverRules(): Observable<any> {
        return this.http.get(endpoints.FETCH_TAX_WAIVER_RULES)
            .pipe(map(this.extractData));
    }
    public fetchSpecialTaxRate(urlSearchParams: Map<string,any>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_SPECIAL_TAX_RATES, options)
            .pipe(map(this.extractData));
    }

    public createSpecialTaxRate(specialTaxRate: SpecialTaxRate): Observable<any> {
        return this.http.post(endpoints.CREATE_SPECIAL_TAX_RATE, specialTaxRate)
            .pipe(map(this.extractData));
    }
    public deleteSpecialTaxRate(pathParams :PathParameters): Observable<any> {
        let url = this.create(endpoints.DELETE_SPECIAL_TAX_RATE,pathParams) ;
        return this.http.delete(url)
            .pipe(map(this.extractData));
    }


}