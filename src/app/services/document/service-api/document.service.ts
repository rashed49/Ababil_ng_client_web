import { HttpInterceptor } from './../../http.interceptor';
import { PathParameters } from './../../base.service';
import { Injectable } from "@angular/core";
import { BaseService } from "../../base.service";
import { Observable } from "rxjs";
import { RequestOptions, Headers } from "@angular/http";
import * as endpoints from '../document.api.endpoint';
import { map } from 'rxjs/operators';
@Injectable()
export class DocumentService extends BaseService {

    constructor(private http: HttpInterceptor) {
        super();
    }

    public fetchDocument(queryParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(queryParams) });
        return this.http.get(endpoints.FETCH_DOCUMENT_TYPES, options).pipe(map(this.extractData));
    }

    public saveDocument(pathParams: PathParameters, document: Document, queryParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(queryParams) });
        let url = this.create(endpoints.SAVE_DOCUMENT, pathParams);
        return this.http.post(url, document, options).pipe(map(this.extractData));
    }

    public uploadDocumentFile(body: any,  queryParams: Map<string, any>): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/octet-stream');       
        let options = new RequestOptions({ headers: headers, params: this.getUrlSearchParams(queryParams), });
        return this.http.post(endpoints.UPLOAD_DOCUMENT_FILE,body, options).pipe(map(this.extractData));
    }

    // public fetchDocumentFileUrls(queryParams: Map<string, string>): Observable<any> {
    //     let options = new RequestOptions({ params: this.getUrlSearchParams(queryParams) });
    //     return this.http.get(endpoints.FETCH_DOCUMENT_FILES,options).pipe(map(this.extractData));
    // }

    // public fatchDocumentFileUrl(queryParams: Map<string, string>): Observable<any> {
    //     let options = new RequestOptions({ params: this.getUrlSearchParams(queryParams) });
    //     return this.http.get(endpoints.FETCH_DOCUMENT_FILE, options).pipe(map(this.extractData));
    // }

    // public deleteDocumentFileUrl(queryParams: Map<string, string>): Observable<any> {
    //     let options = new RequestOptions({ params: this.getUrlSearchParams(queryParams) });
    //     return this.http.delete(endpoints.DELETE_DOCUMENT_FILE, options).pipe(map(this.extractData));
    // }


}