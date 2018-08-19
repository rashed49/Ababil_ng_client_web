import { Injectable } from "@angular/core";
import { BaseService } from "../../base.service";
import { HttpInterceptor } from "../../http.interceptor";
import { RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { PathParameters } from './../../base.service';
import * as endpoints from '../time.deposit.charge.api.endpoints';
import { TimeDepositChargeInfo } from "../domain/time.deposit.charge.info.model";
import { TimeDepositChargeConfiguration, ActivateTimeDepositChargeConfigurationCommand } from "../domain/time.deposit.charge.configuration.model";

@Injectable()
export class TimeDepositChargeService extends BaseService {

    constructor(private http: HttpInterceptor) {
        super();
    }

    public fetchTimeDepositCharge(queryParams: Map<string, string>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(queryParams) });
        return this.http.get(endpoints.FETCH_TIME_DEPOSIT_CHARGE, options).pipe(map(this.extractData));
    }


    //info----------
    public fetchTimeDepositChargeInfos(): Observable<any> {
        return this.http.get(endpoints.FETCH_TIME_DEPOSIT_CHARGE_INFOS).pipe(map(this.extractData));
    }

    public createTimeDepositChargeInfo(timeDepositChargeInfo: TimeDepositChargeInfo): Observable<any> {
        return this.http.post(endpoints.CREATE_TIME_DEPOSIT_CHARGE_INFO, timeDepositChargeInfo)
            .pipe(map(this.extractData));
    }

    public updateTimeDepositChargeInfo(timeDepositChargeInfo: TimeDepositChargeInfo, pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.UPDATE_TIME_DEPOSIT_CHARGE_INFO, pathParams)
        return this.http.put(url, timeDepositChargeInfo)
            .pipe(map(this.extractData));
    }

    public deleteTimeDepositChargeInfo(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.DELETE_TIME_DEPOSIT_CHARGE_INFO, pathParams);
        return this.http.delete(url).pipe(map(this.extractData));
    }


    //configurations-----------
    public fetchTimeDepositChargeConfigurations(urlSearchParams: Map<string, any>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_TIME_DEPOSIT_CHARGE_CONFIGURATIONS, options).pipe(map(this.extractData));
    }

    public fetchTimeDepositChargeConfiguration(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.FETCH_TIME_DEPOSIT_CHARGE_CONFIGURATION, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public createTimeDepositChargeConfiguration(timeDepositChargeInfo: TimeDepositChargeConfiguration): Observable<any> {
        return this.http.post(endpoints.CREATE_TIME_DEPOSIT_CHARGE_CONFIGURATION, timeDepositChargeInfo)
            .pipe(map(this.extractData));
    }

    public updateTimeDepositChargeConfiguration(updateCharge: ActivateTimeDepositChargeConfigurationCommand, urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.put(endpoints.UPDATE_TIME_DEPOSIT_CHARGE_CONFIGURATION, updateCharge, options).pipe(map(this.extractData));
    }

    public activateTimeDepositChargeConfiguration(activateCommand: ActivateTimeDepositChargeConfigurationCommand, urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(endpoints.TIME_DEPOSIT_CHARGE_CONFIGURATION_COMMAND, activateCommand, options)
            .pipe(map(this.extractData));
    }


    //charge calculation---------
    public fetchTimeDepositChargeCalculation(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.FETCH_TIME_DEPOSIT_CHARGE_CALCULATION, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }
}