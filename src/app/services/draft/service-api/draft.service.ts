import {Injectable} from '@angular/core';
import {HttpInterceptor} from '../../http.interceptor';
import {NotificationService} from '../../../common/notification/notification.service';
import {BaseService} from '../../base.service';
import * as endpoints from '../draft.endpoints'; 
import { RequestOptions } from '@angular/http';
import {PathParameters} from '../../base.service';
import {Draft} from '../domain/draft.model';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DraftService extends BaseService{


    constructor(private http: HttpInterceptor,private notificationService:NotificationService) {
        super();
    }

    public fetchDrafts(urlSearchParams:Map<string,string>):Observable<any>{
       let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
       return this.http.get(endpoints.FETCH_DRAFTS, options)
               .pipe(map(this.extractData));
    }

    public createDraft(draft:Draft):Observable<any>{
        return this.http.post(endpoints.CREATE_DRAFT,draft)
	           .pipe(map(this.extractData));
    }

    public updateDraft(pathParams:PathParameters,draft:Draft):Observable<any>{
       let url = this.create(endpoints.UPDATE_DRAFT,pathParams);       
       return this.http.put(url,draft).pipe(map(this.extractData));
    }

    public fetchDraft(pathParams:PathParameters):Observable<Draft>{
       let url = this.create(endpoints.FETCH_DRAFT,pathParams);
       return this.http.get(url).pipe(map(this.extractData));
    }

     public deleteDraft(pathParams:PathParameters):Observable<Draft>{
       let url = this.create(endpoints.DELETE_DRAFT,pathParams);
       return this.http.delete(url).pipe(map(this.extractData));
    }

}