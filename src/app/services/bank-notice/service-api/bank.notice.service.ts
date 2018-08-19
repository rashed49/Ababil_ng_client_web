import { RequestOptions, URLSearchParams } from '@angular/http';
import { Notice } from './../domain/notice.models';
import { Injectable } from "@angular/core";
import { BaseService, PathParameters } from "../../base.service";
import { HttpInterceptor } from "../../http.interceptor";
import * as endpoints from '../notice.api.endpoint';
import { NotificationService } from "../../../common/notification/notification.service";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable()
export class BankNoticeService extends BaseService {

    constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
        super();
    }

    public fetchBankNoticesByAccount(pathParams: PathParameters,urlSearchParams:Map<string,string>): Observable<any> {
        let url = this.create(endpoints.FETCH_NOTICES_BY_ACCOUNT, pathParams);
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(url,options).pipe(map(this.extractData));
    }

    public createBankNotice(bankNotice:Notice,pathParams:PathParameters,urlSearchParams:Map<string,string>):Observable<any>{
        let url = this.create(endpoints.CREATE_BANK_NOTICE, pathParams);
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(url,bankNotice,options)
	           .pipe(map(this.extractData));
    }

    public fetchNoticeDetail(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_NOTICE_DETAIL, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public updateBankNotice(pathParams: PathParameters, notice:Notice,urlSearchParams:Map<string,string>): Observable<any> {
       let url = this.create(endpoints.UPDATE_BANK_NOTICE, pathParams);
       let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
       return this.http.put(url,notice,options).pipe(map(this.extractData));
    }

    public deleteBankNotice(pathParams: PathParameters): Observable<any>{
       let url = this.create(endpoints.DELETE_BANK_NOTICE, pathParams);
       return this.http.delete(url).pipe(map(this.extractData));

    }
}
