import { BaseService, PathParameters } from "../../base.service";
import { Injectable } from "@angular/core";
import { HttpInterceptor } from "../../http.interceptor";
import { WithdrawalAdvice } from "../domain/fixed.deposit.principal.withdrawal.advice.model";
import { Observable } from "rxjs";
import * as endpoints from '../fixed.deposit.principal.withdrawal.advice.api.endpoints';
import { RequestOptions } from "@angular/http";
import { NotificationService } from "../../../common/notification/notification.service";
import { map } from 'rxjs/operators';

@Injectable()
export class FixedDepositPrincipalWithdrawalAdviceService extends BaseService {

    constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
        super();
    }

    public createFixedDepositWithdrawalAdvice(withdrawalAdvice: WithdrawalAdvice, pathParams: PathParameters,urlSearchParams: Map<string, any>): Observable<any> {
        const url = this.create(endpoints.CREATE_FIXED_DEPOSIT_PRINCIPAL_WITHDRAWAL_ADVICE, pathParams);
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(url, withdrawalAdvice,options).pipe(map(this.extractData));
    }
    public fetchFixedDepositWithdrawalAdvices(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.FETCH_FIXED_DEPOSIT_PRINCIPAL_WITHDRAWAL_ADVICES, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }
    public fetchFixedDepositWithdrawalAdviceNumber(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.FETCH_FIXED_DEPOSIT_WITHDRAWAL_ADVICE_NUMBER, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }
    public fetchFixedDepositWithdrawalAdvice(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.FETCH_FIXED_DEPOSIT_WITHDRAWAL_ADVICE, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }
    public updateFixedDepositWithdrawalAdvice(withdrawalAdvice: WithdrawalAdvice, pathParams: PathParameters,urlSearchParams: Map<string, any>): Observable<any> {
        const url = this.create(endpoints.UPDATE_FIXED_DEPOSIT_PRINCIPAL_WITHDRAWAL_ADVICE, pathParams);
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.put(url, withdrawalAdvice,options).pipe(map(this.extractData));
    }
}