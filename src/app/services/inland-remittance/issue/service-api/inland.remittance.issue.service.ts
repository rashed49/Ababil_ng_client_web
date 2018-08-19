import { Injectable } from "@angular/core";
import { BaseService, PathParameters } from "../../../base.service";
import { RequestOptions } from "@angular/http";
import { HttpInterceptor } from "../../../http.interceptor";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import * as endpoints from '../inland.remittance.issue.api.endpoints'
import { InlandRemittanceInstrument } from "../../instrument/domain/inland.remittance.instrument.models";
import { InlandRemittanceInstrumentPaymentInfo } from "../domain/inland.remittance.issue.payment.models";
import { InlandRemittanceInstrumentLostInfo } from "../domain/inland.remittance.issue.lost.models";
import { InlandRemittanceInstrumentReIssueInfo } from "../domain/inland.remittance.reissue.models";

@Injectable()
export class InlandRemittanceIssueService extends BaseService {

    constructor(private http: HttpInterceptor) {
        super();
    }

    public fetchInlandRemittanceIssues(urlSearchParams: Map<string, any>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FATCH_INLAND_REMITTANCE_ISSUES, options).pipe(map(this.extractData));
    }
    public InlandRemittanceLostIssue(inlandRemittanceInstrumentLostInfo: InlandRemittanceInstrumentLostInfo): Observable<any> {
        return this.http.post(endpoints.INLAND_REMITTANCE_LOST_ISSUE, inlandRemittanceInstrumentLostInfo).pipe(map(this.extractData));
    }
    public saveInlandRemittanceRefundIssue(inlandRemittanceInstrument: InlandRemittanceInstrument, pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.SAVE_INLAND_REMITTANCE_REFUND_ISSUE, pathParams);
        return this.http.put(url, inlandRemittanceInstrument).pipe(map(this.extractData));
    }



    public saveInlandRemittancePaymentIssue(inlandRemittanceInstrumentPaymentInfo: InlandRemittanceInstrumentPaymentInfo, urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(endpoints.SAVE_INLAND_REMITTANCE_PAYMENT_ISSUE, inlandRemittanceInstrumentPaymentInfo, options).pipe(map(this.extractData));
    }
    public saveInlandRemittanceReissue(inlandRemittanceInstrumentReIssueInfo: InlandRemittanceInstrumentReIssueInfo, urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(endpoints.Save_INLAND_REMITTANCE_REISSUE, inlandRemittanceInstrumentReIssueInfo, options).pipe(map(this.extractData));
    }
    public searchInlandRemittanceIssue(urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.SEARCH_INLAND_REMITTANCE_ISSUE, options).pipe(map(this.extractData));
    }
}
