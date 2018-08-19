import { Injectable } from '@angular/core';
import { BaseService } from '../../base.service';
import { PathParameters } from '../../base.service';
import * as endpoints from '../account.operator.api.endpoints';
import { HttpInterceptor } from '../../http.interceptor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountOperatorInformation, AccountSignatory } from '../domain/account.operator.models';

@Injectable()
export class AccountOperatorService extends BaseService {
    constructor(private http: HttpInterceptor) { super(); }

    // Account Operation Information
    public addAccountOperatorInfo(accountOperatorInfo: AccountOperatorInformation, pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.CREATE_ACCOUNT_OPERATOR_INFORMATION, pathParams);
        return this.http.post(url, accountOperatorInfo).pipe(map(this.extractData));
    }
    public removeAccountOperatorInfo(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.DELETE_ACCOUNT_OPERATOR_INFORMATION, pathParams);
        return this.http.delete(url).pipe(map(this.extractData));
    }

    public updateAccountOperatorInformation(accountOperatorInfo: AccountOperatorInformation, pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.UPDATE_ACCOUNT_OPERATOR_INFORMATION, pathParams);
        return this.http.put(url, accountOperatorInfo).pipe(map(this.extractData));;
    }
    public fetchAccountOperatorInformationDetail(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_ACCOUNT_OPERATOR_INFORMATION_DETAIL, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }
    public fetchAccountOperatorInformation(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_ACCOUNT_OPERATOR_INFORMATION, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    //Account Signatory
    public addAccountSignatory(pathParams: PathParameters, accountSignatory: AccountSignatory): Observable<any> {
        let url = this.create(endpoints.CREATE_ACCOUNT_OPERATOR_SIGNATORIES, pathParams);
        return this.http.post(url, accountSignatory).pipe(map(this.extractData));
    }

    public removeAccountSignatory(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.DELETE_ACCOUNT_OPERATOR_SIGNATORY, pathParams);
        return this.http.delete(url).pipe(map(this.extractData));
    }

    public updateAccountSignatory(pathParams: PathParameters, accountSignatory: AccountSignatory): Observable<any> {
        let url = this.create(endpoints.UPDATE_ACCOUNT_OPERATOR_SIGNATORY, pathParams);
        return this.http.put(url, accountSignatory).pipe(map(this.extractData));
    }

    public fetchAccountSignatoryDetail(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_ACCOUNT_OPERATOR_SIGNATORY_DETAIL, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public fetchAccountSignatories(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_ACCOUNT_OPERATOR_SIGNATORIES, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

}
