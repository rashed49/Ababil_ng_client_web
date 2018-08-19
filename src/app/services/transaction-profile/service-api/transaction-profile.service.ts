import { Injectable } from '@angular/core';
import { BaseService, PathParameters } from './../../base.service';
import { HttpInterceptor } from './../../http.interceptor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DemandDepositAccountTransactionProfile } from './../domain/transaction-profile.models';
import * as transactionProfileEndpoints from '../transaction-profile.api.endpoints';
import * as transactionProfileTypeEndpoints from '../transaction-profile-type.api.endpoints';


@Injectable()
export class TransactionProfileService extends BaseService {

    constructor(private http: HttpInterceptor) {
        super();
    }

    fetchAccountTransactionProfiles(pathParams: PathParameters): Observable<any> {
        const url = this.create(transactionProfileEndpoints.FETCH_ACCOUNT_TRANSACTION_PROFILES, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    createAccountTransactionProfile(accountTransactionProfile: DemandDepositAccountTransactionProfile[], pathParams: PathParameters): Observable<DemandDepositAccountTransactionProfile> {
        const url = this.create(transactionProfileEndpoints.CREATE_ACCOUNT_TRANSACTION_PROFILE, pathParams);
        return this.http.post(url, accountTransactionProfile).pipe(map(this.extractData));
    }

    updateAccountTransactionProfiles(accountTransactionProfile: DemandDepositAccountTransactionProfile[], pathParams: PathParameters): Observable<any> {
        const url = this.create(transactionProfileEndpoints.UPDATE_ACCOUNT_TRANSACTION_PROFILE, pathParams);
        return this.http.put(url, accountTransactionProfile).pipe(map(this.extractData));
    }


    //type
    fetchAccountTransactionProfileTypes(): Observable<any> {
        return this.http.get(transactionProfileTypeEndpoints.FETCH_ACCOUNT_TRANSACTION_PROFILE_LIMIT_TYPES).pipe(map(this.extractData));
    }

}