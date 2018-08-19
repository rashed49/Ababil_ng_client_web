import { FatcaDescription } from '../domain/fatca.description';
import { HttpInterceptor } from '../../http.interceptor';
import { BaseService } from '../../base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as endpoints from '../cis.api.endpoints';

@Injectable()
export class FatcaDescriptionService extends BaseService {

    constructor(private http: HttpInterceptor) {
        super();
    }

    public fetchFatcaDescriptions(): Observable<FatcaDescription[]> {
        return this.http.get(endpoints.FETCH_FATCA_DESCRIPTIONS).pipe(map(this.extractData));
    }
}