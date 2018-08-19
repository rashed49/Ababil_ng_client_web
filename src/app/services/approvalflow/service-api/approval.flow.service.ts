import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { BaseListResponse } from '../../domain/list.response.model';
import {BaseService} from '../../base.service';
import * as endpoints from '../approval.flow.api.endpoints';
import {ApprovalflowProfile, ApprovalflowTask, PendingTask} from '../domain/approval.flow.models';
import {PathParameters} from '../../base.service';
import { map } from 'rxjs/operators';
import {HttpInterceptor} from '../../http.interceptor';
import { NotificationService } from '../../../common/notification/notification.service';
import {Command} from '../../command/domain/command.model';
import {VerificationInfo} from '../domain/approval.flow.models';
import {ApprovalFlowTaskCommand } from '../domain/approval.flow.models';

@Injectable()
export class ApprovalflowService extends BaseService {

    constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
        super();
    }

    public fetchApprovalFlowProfiles(urlSearchParams:Map<string,string>): Observable<any>{
         let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
         return this.http.get(endpoints.FETCH_APPROVALFLOW_PROFILES, options)
               .pipe(map(this.extractData));

    }

    public fetchApprovalflowProfileDetail(pathParams:PathParameters): Observable<ApprovalflowProfile>{
        let url = this.create(endpoints.FETCH_APPROVALFLOW_PROFILE,pathParams);
        return this.http.get(url)
	           .pipe(map(this.extractData));

    }

    public createApprovalflow(workflowProfile:ApprovalflowProfile): Observable<ApprovalflowProfile>{
       return this.http.post(endpoints.CREATE_APPROVALFLOW_PROFILE,workflowProfile)
	           .pipe(map(this.extractData));

    }

    public updateApprovalflow(workflowProfile:ApprovalflowProfile,pathParams:PathParameters): Observable<ApprovalflowProfile>{
       let url = this.create(endpoints.UPDATE_APPROVALFLOW_PROFILE,pathParams);
       return this.http.put(url,workflowProfile)
	           .pipe(map(this.extractData));
    }
    
    public fetchApprovalflowTasks(urlSearchParams:Map<string,string>,pathParams:PathParameters): Observable<any>{
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        let url = this.create(endpoints.FETCH_APPROVALFLOW_TASKS,pathParams);
        return this.http.get(url,options)
               .pipe(map(this.extractData));
               

    }

    public fetchApprovalflowTaskDetail(pathParams:PathParameters): Observable<ApprovalflowTask>{
        let url = this.create(endpoints.FETCH_APPROVALFLOW_TASK,pathParams);
        return this.http.get(url)
	           .pipe(map(this.extractData));

    }

    public createApprovalflowTask(workflowTask:ApprovalflowTask,pathParams:PathParameters): Observable<ApprovalflowTask>{
       let url = this.create(endpoints.CREATE_APPROVALFLOW_TASK,pathParams);
       return this.http.post(url,workflowTask)
	           .pipe(map(this.extractData));

    }

    public updateApprovalflowTask(workflowTask:ApprovalflowTask,pathParams:PathParameters): Observable<ApprovalflowTask>{
       let url = this.create(endpoints.UPDATE_APPROVALFLOW_TASK,pathParams);
       return this.http.put(url,workflowTask)
	           .pipe(map(this.extractData));
    }

    public fetchApprovalflowCommandMappings(pathParams:PathParameters){
       let url = this.create(endpoints.FETCH_APPROVALFLOW_COMMANDS,pathParams);
       return this.http.get(url).pipe(map(this.extractData));
    }

    public updateApprovalflowCommandMappings(commands:Command[],pathParams:PathParameters){
       let url = this.create(endpoints.UPDATE_APPROVALFLOW_COMMAND_MAPPINGS,pathParams);
       return this.http.put(url,commands)
               .pipe(map(this.extractData));
    }
            
    public fetchPendingTasks( urlSearchParams: Map< string, any > ): Observable< any > {
        let options = new RequestOptions({ params: this.getUrlSearchParams( urlSearchParams )});
        return this.http
            .get( endpoints.FETCH_PENDING_TASKS, options )
            .pipe(map(this.extractData)); 
    }
        
    public fetchVerificationInfo( urlSearchParams: Map< string, string > ):Observable<VerificationInfo>{
       let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams)});                
       return this.http
            .get( endpoints.FETCH_VERIFICATION_INFO, options )
            .pipe(map(this.extractData));   
    }

    public fetchVerificationDetails( pathParams:PathParameters ):Observable<any>{
       let url = this.create(endpoints.FETCH_VERIFICATION_DETAILS,pathParams);               
       return this.http
            .get(url)
            .pipe(map(this.extractData));
    }

    public verifyTask(command:ApprovalFlowTaskCommand,pathParams:PathParameters,urlSearchParams: Map< string, string >):Observable<any>{
       let url = this.create(endpoints.VERIFY_TASK,pathParams);               
       let options = new RequestOptions({ params: this.getUrlSearchParams( urlSearchParams )});
       return this.http
            .post(url,command,options)
            .pipe(map(this.extractData));   
    }

    public fetchApprovalFlowTaskInstancePayload(pathParams:PathParameters,urlSearchParams: Map<string,string>=new Map()){
       let url = this.create(endpoints.FETCH_TASK_INSTANCE_PAYLOAD,pathParams);
       let options = new RequestOptions({ params: this.getUrlSearchParams( urlSearchParams )});
       return this.http.get(url,options).pipe(map(this.extractData));
    }

}