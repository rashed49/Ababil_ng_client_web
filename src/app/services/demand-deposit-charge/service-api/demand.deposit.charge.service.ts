import { Injectable } from "@angular/core";
import { BaseService } from "../../base.service";
import { HttpInterceptor } from "../../http.interceptor";
import { RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { PathParameters } from './../../base.service';
import * as endpoints from '../demand.deposit.charge.api.endpoints';
import { DemandDepositChargeInfo } from "../domain/demand.deposit.charge.info.model";
import { DemandDepositChargeConfiguration, ActivateDemandDepositChargeConfigurationCommand } from "../domain/demand.deposit.charge.configuration.model";

@Injectable()
export class DemandDepositChargeService extends BaseService {

    constructor(private http: HttpInterceptor) {
        super();
    }

    public fetchDemandDepositCharge(queryParams: Map<string, string>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(queryParams) });
        return this.http.get(endpoints.FETCH_DEMAND_DEPOSIT_CHARGE, options).pipe(map(this.extractData));
    }


    //info----------
    public fetchDemandDepositChargeInfos(): Observable<any> {
        return this.http.get(endpoints.FETCH_DEMAND_DEPOSIT_CHARGE_INFOS).pipe(map(this.extractData));
    }

    public createDemandDepositChargeInfo(demandDepositChargeInfo: DemandDepositChargeInfo): Observable<any> {
        return this.http.post(endpoints.CREATE_DEMAND_DEPOSIT_CHARGE_INFO, demandDepositChargeInfo)
            .pipe(map(this.extractData));
    }

    public updateDemandDepositChargeInfo(demandDepositChargeInfo: DemandDepositChargeInfo, pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.UPDATE_DEMAND_DEPOSIT_CHARGE_INFO, pathParams)
        return this.http.put(url, demandDepositChargeInfo)
            .pipe(map(this.extractData));
    }

    public deleteDemandDepositChargeInfo(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.DELETE_DEMAND_DEPOSIT_CHARGE_INFO, pathParams);
        return this.http.delete(url).pipe(map(this.extractData));
    }


    //configurations-----------
    public fetchDemandDepositChargeConfigurations(urlSearchParams: Map<string, any>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_DEMAND_DEPOSIT_CHARGE_CONFIGURATIONS, options).pipe(map(this.extractData));
    }

    public fetchDemandDepositChargeConfiguration(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.FETCH_DEMAND_DEPOSIT_CHARGE_CONFIGURATION, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public createDemandDepositChargeConfiguration(demandDepositChargeInfo: DemandDepositChargeConfiguration): Observable<any> {
        return this.http.post(endpoints.CREATE_DEMAND_DEPOSIT_CHARGE_CONFIGURATION, demandDepositChargeInfo)
            .pipe(map(this.extractData));
    }

    public updateDemandDepositChargeConfiguration(updateCharge: ActivateDemandDepositChargeConfigurationCommand, urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.put(endpoints.UPDATE_DEMAND_DEPOSIT_CHARGE_CONFIGURATION, updateCharge, options).pipe(map(this.extractData));
    }

    public activateDemandDepositChargeConfiguration(activateCommand: ActivateDemandDepositChargeConfigurationCommand, urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(endpoints.DEMAND_DEPOSIT_CHARGE_CONFIGURATION_COMMAND, activateCommand, options)
            .pipe(map(this.extractData));
    }


    //charge calculation---------
    public fetchDemandDepositChargeCalculation(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.FETCH_DEMAND_DEPOSIT_CHARGE_CALCULATION, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }
}