import { Injectable } from "@angular/core";
import { BaseService } from "../../../base.service";
import * as endpoints from '../inland.remittance.instrument.api.endpoints';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { HttpInterceptor } from "../../../http.interceptor";
import { RequestOptions } from "@angular/http";
import { InlandRemittanceInstrument } from "../domain/inland.remittance.instrument.models";
import { InlandRemittanceInstrumentDestroyInfo } from "../domain/inland.remittance.instrument.destroy.models";


@Injectable()
export class InlandRemittanceInstrumentService extends BaseService {

    constructor(private http: HttpInterceptor) {
        super();
    }

    public fetchInlandRemittanceInstruments(urlSearchParams: Map<string, any>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FATCH_INLAND_REMITTANCE_INSTRUMENTS, options).pipe(map(this.extractData));
    }
    public deleteInlandRemittanceInstrument(inlandRemittanceInstrumentDestroyInfo:InlandRemittanceInstrumentDestroyInfo): Observable<any> {
        return this.http.post(endpoints.DELETE_INLAND_REMITTANCE_INSTRUMENT,inlandRemittanceInstrumentDestroyInfo).pipe(map(this.extractData));
    }
    public saveInlandRemittanceInstrumentIssue(inlandRemittanceInstrument: InlandRemittanceInstrument,urlSearchParams: Map<string, any>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(endpoints.SAVE_INLAND_REMITTANCE_INSTRUMENT_ISSUE, inlandRemittanceInstrument,options).pipe(map(this.extractData));
    }
}