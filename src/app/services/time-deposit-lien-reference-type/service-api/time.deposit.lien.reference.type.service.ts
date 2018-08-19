import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { BaseService, PathParameters } from "../../../services/base.service";
import { HttpInterceptor } from "../../../services/http.interceptor";
import * as timeDepositLienEndpoints from '../time.deposit.lien.reference.type.api.endpoints';

@Injectable()
export class TimeDepositLienReferenceTypeService extends BaseService {

    constructor(private http: HttpInterceptor) {
        super();
    }

    fetchReferenceTypes(): Observable<any> {
        return this.http.get(timeDepositLienEndpoints.FETCH_REFERENCE_TYPES).pipe(map(this.extractData));
    }
    fetchReferencetype(pathParams: PathParameters): Observable<any> {
        const url = this.create(timeDepositLienEndpoints.FETCH_REFERENCE_NUMBER, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }
}
