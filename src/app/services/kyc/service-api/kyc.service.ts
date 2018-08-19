import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { BaseService, PathParameters } from '../../base.service';
import * as endpoints from '../kyc.api.endpoints';
import { HttpInterceptor } from './../../http.interceptor';
import { map } from 'rxjs/operators';
import { KycIndividual } from './../domain/kyc.individual.mode';
import { KycInstitute } from '../domain/kyc.institute.model';

@Injectable()
export class KycService extends BaseService {

    constructor(private http: HttpInterceptor) {
        super();
    }

    public fetchKyces(urlSearchParams: Map<string, string>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_KYCES, options).pipe(map(this.extractData));
    }

    public createKycIndividual(kycIndividual: KycIndividual): Observable<any> {
        return this.http.post(endpoints.CREATE_KYC, kycIndividual).pipe(map(this.extractData));
    }

    public updateKycIndividual(pathParams: PathParameters, kycIndividual: KycIndividual): Observable<any> {
        const url = this.create(endpoints.UPDATE_KYC, pathParams);
        return this.http.put(url, kycIndividual).pipe(map(this.extractData));
    }

    public createKycInstitute(kycInstitute: KycInstitute): Observable<any> {
        return this.http.post(endpoints.CREATE_KYC, kycInstitute).pipe(map(this.extractData));
    }

    public updateKycInstitute(pathParams: PathParameters, kycInstitute: KycInstitute): Observable<any> {
        const url = this.create(endpoints.UPDATE_KYC, pathParams);
        return this.http.put(url, kycInstitute).pipe(map(this.extractData));
    }
}