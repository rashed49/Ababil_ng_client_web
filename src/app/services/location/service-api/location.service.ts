import { Injectable } from '@angular/core';
import * as endpoints from '../location.api.endpoint';
import { HttpInterceptor } from './../../http.interceptor';
import { BaseService, PathParameters } from './../../base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../domain/country.models';
import { Division } from '../domain/division.models';
import { RequestOptions } from '../../../../../node_modules/@angular/http';

@Injectable()
export class AbabilLocationService extends BaseService {
    constructor(private http: HttpInterceptor) {
        super();
    }
    public fetchCountries(): Observable<any> {
        return this.http.get(endpoints.FETCH_COUNTRIES).pipe(map(this.extractData));
    }
    public fetchCountryDetail(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_COUNTRY_DETAIL, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }
    public fetchDivisionsByCountry(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_DIVISIONS_BY_COUNTRY, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }
    public fetchDivisionDetail(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_DIVISION_DETAIL, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }
    public fetchDistrictsByDivision(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_DISTRICTS_BY_DIVISION, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }
    public fetchDistrictsByCountry(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_DISTRICS_BY_COUNTRY, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public fetchDistrictDetail(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_DISTRICT_DETAIL, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }
    public fetchUpazillasByDistrict(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_UPAZILLAS_BY_DISTRICT, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }
    public fetchUpazillaDetail(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_UPAZILLA_DETAIL, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public createCountry(country: Country): Observable<any> {
        return this.http.post(endpoints.CREATE_COUNTRY, country)
            .pipe(map(this.extractData));
    }
    public createdivision(division: Division): Observable<any> {
        return this.http.post(endpoints.CREATE_DIVISION, division)
            .pipe(map(this.extractData));
    }
    public fetchPostCodes(urlSearchParams: Map<string,string>): Observable<any> {
        const options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.get(endpoints.FETCH_POSTCODES,options).pipe(map(this.extractData));
    }
    public fetchPostCodesByUpazilla(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_POSTCODES_BY_UPAZILLA, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    fetchPostCodeDetails(pathParams: PathParameters):Observable<any> {
        let url = this.create(endpoints.FETCH_POST_CODE_DETAILS,pathParams) ;
        return this.http.get(url).pipe(map(this.extractData));
    }
}