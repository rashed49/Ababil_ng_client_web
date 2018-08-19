import { BaseListResponse } from './../../domain/list.response.model';
import { Injectable } from '@angular/core';
import { BaseService } from '../../base.service';
import { PathParameters } from '../../base.service';
import * as endpoints from '../cheque.api.endpoints';
import { ChequeBook, Cheque } from '../domain/cheque.models';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { HttpInterceptor } from '../../http.interceptor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationService } from '../../../common/notification/notification.service';
@Injectable()
export class ChequeService extends BaseService {
    constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
        super();
    }

    // ChequeBook Services

    // public fetchChequeBookByAccountId(urlSearchParams: Map<string, string>): Observable<BaseListResponse> {
    //     let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams)});
    //     return this.http
    //         .get(endpoints.FETCH_CHEQUEBOOK_BY_ACCOUNT_ID, options)
    //         .pipe(map(this.extractData));
    // }


    public fetchChequeBookByAccountId(pathParams: PathParameters, urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        let url = this.create(endpoints.FETCH_CHEQUEBOOK_BY_ACCOUNT_ID, pathParams);
        return this.http.get(url, options).pipe(map(this.extractData));
    }


    // public fetchChequeBookByAccountId(pathParams: PathParameters): Observable<any> {
    //     let url = this.create(endpoints.FETCH_CHEQUEBOOK_BY_ACCOUNT_ID, pathParams);
    //     return this.http.get(url)
    //                     .pipe(map(this.extractData));
    // }

    public fetchChequeBookByBookId(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_CHEQUEBOOK_BY_BOOK_ID, pathParams);
        return this.http.get(url)
            .pipe(map(this.extractData));
    }
    // public createChequeBook(chequeBook: ChequeBook): Observable<ChequeBook> {
    //     return this.http.post(endpoints.CREATE_CHEQUEBOOK_AND_CHEQUE, chequeBook)
    //         .pipe(map(this.extractData));
    // }

    public createChequeBook(chequeBook: ChequeBook, pathParams: PathParameters, urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        let url = this.create(endpoints.CREATE_CHEQUEBOOK_AND_CHEQUE, pathParams);
        return this.http.post(url, chequeBook, options)
            .pipe(map(this.extractData));
    }


    public correctChequeBookbyBookId(pathParams: PathParameters, urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.delete(this.create(endpoints.CORRECT_CHEQUEBOOK_DELETE_CHEQUE, pathParams), options)
            .pipe(map(this.extractData));
    }



    // Cheque Services


    public fetchChequeByAccountId(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_CHEQUE_BY_ACCOUNT_ID, pathParams);
        return this.http
            .get(url)
            .pipe(map(this.extractData));
    }
    public fetchChequeByBookId(pathParams: PathParameters, urlSearchParams: Map<string, string>): Observable<any> {
        let url = this.create(endpoints.FETCH_CHEQUE_BY_BOOK_ID, pathParams);
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(url, options).pipe(map(this.extractData));
    }


    // Account Detail Service

    public fetchAccountDetailsByAccountId(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_ACC_DETAIL_BY_ACCOUNT_ID, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }


    //Cheque Prefix by Product Id Service
    public fetchChequePrefixesByProdId(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_CHQ_PREFIX_BY_PRODUCT_ID, pathParams);
        return this.http.get(url)
            .pipe(map(this.extractData));
    }

    //cheque number length configuration
    public fetchChequeNumberLength(): Observable<any> {
        return this.http.get(endpoints.FETCH_CHEQUE_LENGTH).pipe(map(this.extractData));
    }

}
