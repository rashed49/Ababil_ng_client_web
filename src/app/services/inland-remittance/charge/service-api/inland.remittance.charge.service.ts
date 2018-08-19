import { Injectable } from "@angular/core";
import { BaseService } from "../../../base.service";
import * as endpoints from '../inland.remittance.charge.api.endpoints';
import { RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { InlandRemittanceChargeInfo } from "../domain/inland.remittance.charge.info.model";
import { PathParameters } from './../../../base.service';
import { InlandRemittanceChargeConfiguration, ActivateInlandRemittanceChargeConfigurationCommand } from "../domain/inland.remittance.charge.configuration.model";
import { HttpService } from "../../../core/service-api/http.service";

@Injectable()
export class InlandRemittanceChargeService extends BaseService {

    constructor(private http: HttpService) {
        super();
    }

    public fetchInladRemittanceCharge(queryParams: Map<string, string>): Observable<any> {
        const options = { params: this.getHttpParams(queryParams) };
        return this.http.get(endpoints.FATCH_INLAND_REMITTANCE_CHARGE, options);
    }


    //info----------
    public fetchInlandRemittanceChargeInfos(): Observable<any> {
        return this.http.get(endpoints.FETCH_INLAND_REMITTANCE_CHARGE_INFOS);
    }

    public createInlandRemittanceChargeInfo(inlandRemittanceChargeInfo: InlandRemittanceChargeInfo): Observable<any> {
        return this.http.post(endpoints.CREATE_INLAND_REMITTANCE_CHARGE_INFO, inlandRemittanceChargeInfo);
    }

    public updateInlandRemittanceChargeInfo(inlandRemittanceChargeInfo: InlandRemittanceChargeInfo, pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.UPDATE_INLAND_REMITTANCE_CHARGE_INFO, pathParams)
        return this.http.put(url, inlandRemittanceChargeInfo);
    }

    public deleteInlandRemittanceChargeInfo(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.DELETE_INLAND_PEMITTANCE_CHARGE_INFO, pathParams);
        return this.http.delete(url);
    }


    //configurations-----------
    public fetchInlandRemittanceChargeConfigurations(urlSearchParams: Map<string, any>): Observable<any> {
        const options = { params: this.getHttpParams(urlSearchParams) };
        return this.http.get(endpoints.FETCH_INLAND_REMITTANCE_CHARGE_CONFIGURATIONS, options);
    }

    public fetchInlandRemittanceChargeConfiguration(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.FETCH_INLAND_REMITTANCE_CHARGE_CONFIGURATION, pathParams);
        return this.http.get(url);
    }

    public createInlandRemittanceChargeConfiguration(inlandRemittanceChargeConfiguration: InlandRemittanceChargeConfiguration): Observable<any> {
        return this.http.post(endpoints.CREATE_INLAND_REMITTANCE_CHARGE_CONFIGURATION, inlandRemittanceChargeConfiguration);
    }

    public updateInlandRemittanceChargeConfiguration(updateCharge: ActivateInlandRemittanceChargeConfigurationCommand, urlSearchParams: Map<string, string>): Observable<any> {
        let options = { params: this.getHttpParams(urlSearchParams) };
        return this.http.put(endpoints.UPDATE_INLAND_REMITTANCE_CHARGE_CONFIGURATION, updateCharge, options);
    }

    public activateInlandRemittanceChargeConfiguration(activateCommand: ActivateInlandRemittanceChargeConfigurationCommand, urlSearchParams: Map<string, string>): Observable<any> {
        let options = { params: this.getHttpParams(urlSearchParams) };
        return this.http.post(endpoints.INLAND_REMITTANCE_CHARGE_CONFIGURATION_COMMAND, activateCommand, options);
    }


    //charge calculation---------
    public fetchInlandRemittanceChargeCalculation(pathParams: PathParameters): Observable<any> {
        const url = this.create(endpoints.FETCH_INLAND_REMITTANCE_CHARGE_CALCULATION, pathParams);
        return this.http.get(url);
    }
}