import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { NotificationService } from './../../../common/notification/notification.service';
import { HttpInterceptor } from './../../http.interceptor';
import { BaseService, PathParameters } from './../../base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as endpoints from '../teller.api.endpoints';
import { CashReceive, CashWithdraw } from '../domain/teller.domain.model';
import { Teller } from '../domain/teller.models';


@Injectable()
export class TellerService extends BaseService {
    constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
        super();
    }

    fetchAllocatedTellers(urlSearchParams: Map<any, any>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_ALLOCATED_TELLERS, options)
            .pipe(map(this.extractData));
    }

    fetchTellerTransaction(urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_TELLER_TRANSACTIONS, options)
            .pipe(map(this.extractData));
    }

    fetchIbtaTxnParticulars(): Observable<any> {
        return this.http.get(endpoints.FETCH_IBTA_TXN_PARTICULARS).pipe(map(this.extractData));
    }

    fetchIbtaTxnParticularsDetails(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_IBTA_TXN_PARTICULARS_BY_ID, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }


    fetchDenominationDetails(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_DENOMINATION_DETAILS, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    // cashRecieve(cashRecieve:CashReceive):Observable<any>{
    //      return this.http.post(endpoints.CASH_RECIEVE, cashRecieve)
    //         .pipe(map(this.extractData));
    // }

    public cashRecieve(cashRecieve: CashReceive, urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(endpoints.CASH_RECIEVE, cashRecieve, options)
            .pipe(map(this.extractData));
    }

    public cashWithdraw(cashWithDraw: CashWithdraw, urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(endpoints.CASH_WITHDRAW, cashWithDraw, options)
            .pipe(map(this.extractData));
    }

    public fetchCashRecieveDetail(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.CASH_RECIEVE_DETAILS, pathParams);
        return this.http.get(url)
            .pipe(map(this.extractData));
    }

    public fetchCashWithdrawDetail(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.CASH_WITHDRAW_DETAILS, pathParams);
        return this.http.get(url)
            .pipe(map(this.extractData));
    }


    public cashTransfer(cashTransfer: any): Observable<any> {
        return this.http.post(endpoints.CASH_TRANSFER, cashTransfer)
            .pipe(map(this.extractData));
    }


    public fetchTellers(urlSearchParams: Map<string, any>): Observable<any> {

        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http
            .get(endpoints.FETCH_TELLERS, options)
            .pipe(map(this.extractData));
    }

    public fetchTellerById(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_TELLER_BY_ID, pathParams);
        return this.http.get(url)
            .pipe(map(this.extractData));
    }


    public createTeller(teller: Teller, urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(endpoints.CREATE_TELLER, teller, options)
            .pipe(map(this.extractData));
    }

    public updateTeller(pathParams: PathParameters, teller: Teller, urlSearchParams: Map<string, string>): Observable<any> {
        let url = this.create(endpoints.UPDATE_TELLER_BY_ID, pathParams);
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.put(url, teller, options).pipe(map(this.extractData));
    }

    // teller balance
    public fetchBalanceByTellerIdAndCurrencyCode(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_TELLER_BALANCES_BY_TELLER_AND_CURRENCY_CODE, pathParams);

        return this.http.get(url).pipe(map(this.extractData));
    }

    public fetchBalanceByTellerId(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_TELLER_BALANCES_BY_TELLER, pathParams);

        return this.http.get(url).pipe(map(this.extractData));
    }

    public fetchPendingTransferTransactions(urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_PENDING_TRANSFER_TRANSACTIONS, options)
            .pipe(map(this.extractData));
    }

    public fetchGlobalTxnNo(urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_GLOBAL_TXN_NUMBER, options)
            .pipe(map(this.extractData));
    }

    public fetchAllowedGlbyActivityId(urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_ALLOWED_GL_BY_ACTIVITY_ID, options)
            .pipe(map(this.extractData));
    }

    public fetchAdviceNumber(urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_ADVICE_NUMBER, options)
            .pipe(map(this.extractData));
    }
    public fetchDetailsByAdviceNumber(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_DETAIL_BY_ADVICE_NUMBER, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public fetchUnPostedTransactions(urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_UN_POSTED_TRANSACTIONS, options)
            .pipe(map(this.extractData));
    }

    public postUnpostedTransactions(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.POST_UN_POSTED_TRANSACTIONS, pathParams);
        return this.http.post(url, {
            "action": "POSTING"
        })
            .pipe(map(this.extractData));
    }

    public fetchTPViolationConfiguration(): Observable<any> {
        return this.http.get(endpoints.FETCH_TP_VIOLATION_CONFIGURATION).pipe(map(this.extractData));
    }

    public fetchUsersToAllocate(urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_USERS_TO_ALLOCATE, options)
            .pipe(map(this.extractData));
    }

    public deleteAllocatedTeller(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.DELETE_ALLOCATED_TELLER, pathParams);
        return this.http.delete(url).pipe(map(this.extractData));
    }
}
