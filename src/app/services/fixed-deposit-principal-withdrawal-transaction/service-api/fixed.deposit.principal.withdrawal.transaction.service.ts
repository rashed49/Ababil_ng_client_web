import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { BaseService, PathParameters } from "../../base.service";
import { HttpInterceptor } from "../../http.interceptor";
import * as endpoints from '../fixed.deposit.principal.withdrawal.transaction.api.endpoints';
import { NotificationService } from "../../../common/notification/notification.service";
import { FixedDepositTransaction } from "../domain/fixed.deposit.principal.withdrawal.transaction.model";
import { Observable } from "rxjs";
import { RequestOptions } from "@angular/http";

@Injectable()
export class FixedDepositPrincipalWithdrawalTransactionService extends BaseService {

    constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
        super();
    }

    public updateFixedDepositWithdrawalTransactionCredit(fixedDepositTransaction: FixedDepositTransaction, pathParams: PathParameters, urlSearchParams: Map<string, any>): Observable<any> {
        const url = this.create(endpoints.UPDATE_FIXED_DEPOSIT_WITHDRAWAL_TRANSACTION_CREDIT, pathParams);
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.put(url, fixedDepositTransaction, options).pipe(map(this.extractData));
    }
    public updateFixedDepositWithdrawalTransactionDebit(fixedDepositTransaction: FixedDepositTransaction, pathParams: PathParameters, urlSearchParams: Map<string, any>): Observable<any> {
        const url = this.create(endpoints.UPDATE_FIXED_DEPOSIT_WITHDRAWAL_TRANSACTION_DEBIT, pathParams);
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.put(url, fixedDepositTransaction, options).pipe(map(this.extractData));
    }
    // public fetchGlobalTransactionNumber(pathParams: PathParameters): Observable<any> {
    //     const url = this.create(endpoints.FETCH_GLOBAL_TRANSACTION_NUMBER, pathParams);
    //     return this.http.get(url).pipe(map(this.extractData));
    // }
}