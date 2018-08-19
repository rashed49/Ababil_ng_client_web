import { Injectable } from '@angular/core';
import { BaseService } from '../../base.service';
import * as endpoints from '../image.upload.api.endpoints';
import { Headers, RequestOptions } from '@angular/http';
import { HttpInterceptor } from '../../http.interceptor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class ImageUploadService extends BaseService {

    constructor(private http: HttpInterceptor, private httpClient: HttpClient) {
        super();
    }

    public uploadIndividualPicture(pathParams: any, body: any): Observable<any> {
        let url = this.create(endpoints.UPLOAD_INDIVIDUAL_PICTURE, pathParams);
        let headers = new Headers();
        headers.append('Content-Type', 'application/octet-stream');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(url, body, options).pipe(map(this.extractData));
    }
    
}