import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import { RequestOptions } from '@angular/http';
import {BaseService} from '../../base.service';
import * as endpoints from '../groupmenu.api.endpoints';
import {GroupMenuProfile} from '../domain/groupmenu.models';
import {PathParameters} from '../../base.service';
import { map } from 'rxjs/operators';
import {HttpInterceptor} from '../../http.interceptor';
import { NotificationService } from '../../../common/notification/notification.service';

@Injectable()
export class GroupmenuService extends BaseService{

    constructor(private http: HttpInterceptor,private notificationService:NotificationService) {
        super();
    }

    public fetchGroupmenuProfiles(urlSearchParams:Map<string,string>): Observable<any>{
         let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
         return this.http.get(endpoints.FETCH_GROUPMENU_PROFILES, options)
               .pipe(map(this.extractData));

    }

    public fetchGroupmenuProfileDetail(pathParams:PathParameters): Observable<GroupMenuProfile>{
        let url = this.create(endpoints.FETCH_GROUPMENU_PROFILE,pathParams);
        return this.http.get(url)
	           .pipe(map(this.extractData));

    }

    public createGroupmenu(groupmenuProfile:GroupMenuProfile): Observable<GroupMenuProfile>{
       return this.http.post(endpoints.CREATE_GROUPMENU_PROFILE,groupmenuProfile)
	           .pipe(map(this.extractData));

    }

    public updateGroupmenu(groupmenuProfile:GroupMenuProfile,pathParams:PathParameters): Observable<GroupMenuProfile>{
       let url = this.create(endpoints.UPDATE_GROUPMENU_PROFILE,pathParams);
       return this.http.put(url,groupmenuProfile)
	           .pipe(map(this.extractData));
    }
    
    // public fetchGroupmenuTasks(urlSearchParams:Map<string,string>,pathParams:PathParameters): Observable<any>{
    //     let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    //     let url = this.create(endpoints.FETCH_GROUPMENU_TASKS,pathParams);
    //     return this.http.get(url,options)
    //            .pipe(map(this.extractData));
               

    // }

    // public fetchGroupmenuTaskDetail(pathParams:PathParameters): Observable<GroupmenuTask>{
    //     let url = this.create(endpoints.FETCH_GROUPMENU_TASK,pathParams);
    //     return this.http.get(url)
	//            .pipe(map(this.extractData));

    // }

    // public createGroupmenuTask(groupmenuTask:GroupmenuTask,pathParams:PathParameters): Observable<GroupmenuTask>{
    //    let url = this.create(endpoints.CREATE_GROUPMENU_TASK,pathParams);
    //    return this.http.post(url,groupmenuTask)
	//            .pipe(map(this.extractData));

    // }

    // public updateGroupmenuTask(groupmenuTask:GroupmenuTask,pathParams:PathParameters): Observable<GroupmenuTask>{
    //    let url = this.create(endpoints.UPDATE_GROUPMENU_TASK,pathParams);
    //    return this.http.put(url,groupmenuTask)
	//            .pipe(map(this.extractData));
    // }


    

  

}