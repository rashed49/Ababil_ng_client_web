import { Injectable } from '@angular/core';
import { BaseService } from '../../base.service';
import { PathParameters } from '../../base.service';
import * as endpoints from '../cis.api.endpoints';
import { RequestOptions } from '@angular/http';
import { HttpInterceptor } from '../../http.interceptor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationService } from '../../../common/notification/notification.service';
import { Customer } from '../domain/cis.models';
import { IndividualInformation } from './../domain/individual.model';
import { Subject } from '../domain/subject.model';
import { ActivateCustomerCommand } from '../domain/command.models';
import * as urlSearchParameterConstants from '../../../common/constants/app.search.parameter.constants';

@Injectable()
export class CISService extends BaseService {

    constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
        super();
    }

    public searchCustomers(urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http
            .get(endpoints.SEARCH_CUSTOMER, options)
            .pipe(map(this.extractData));
    }

    public createCustomer(customer: Customer, urlSearchParams: Map<string, string>): Observable<any> {
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(endpoints.CREATE_CUSTOMER, customer, options).pipe(map(this.extractData));
    }

    public updateCustomer(customer: Customer, pathParams: PathParameters, urlSearchParams: Map<string, string>): Observable<any> {
        let url = this.create(endpoints.FETCH_CUSTOMER, pathParams);
        return this.http.put(url, customer);
    }

    public fetchCustomer(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_CUSTOMER, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }
    public fetchSubjects(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_SUBJECTS, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public addSubject(subject: Subject, pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_SUBJECTS, pathParams);
        return this.http.post(url, subject).pipe(map(this.extractData));
    }

    public removeSubject(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.DELETE_SUBJECT, pathParams);
        return this.http.delete(url).pipe(map(this.extractData));
    }

    public addExistingSubject(subject: Subject, pathParams:PathParameters) : Observable<any> {
        let url = this.create(endpoints.ADD_EXISTING_SUBJECT, pathParams);
        return this.http.post(url, subject).pipe(map(this.extractData)); 
    }

    public fetchSubjectDetails(pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.FETCH_SUBJECT_DETAILS, pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public updateSubject(subject:Subject,pathParams: PathParameters): Observable<any> {
        let url = this.create(endpoints.UPDATE_SUBJECT, pathParams);
        return this.http.put(url,subject).pipe(map(this.extractData));
    }

    public fetchApplicationType(){
      return this.http
            .get(endpoints.FETCH_APPLICANT_TYPES)
            .pipe(map(this.extractData));
    }

    public fetchApplicationTypeByCusId(pathParams: PathParameters,urlSearchParam:Map<string,string>){
       let url = this.create(endpoints.FETCH_APPLICANT_TYPES_BY_CUSID, pathParams);
       let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParam) });
       return this.http
            .get(url,options)
            .pipe(map(this.extractData));
    }

    public activateCustomr(customerId : number, verifier: string) : Observable<any> {
        let url = this.create(endpoints.ACTION_COMMAND,{id:customerId+""});
        let urlSearchParams = new Map<string,string>();
        if(verifier!=null) urlSearchParams.set(urlSearchParameterConstants.VERIFIER,verifier);
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(url, new ActivateCustomerCommand(customerId),options).pipe(map(this.extractData));
    }

    public activateCustomer(customerId : number, urlSearchParams: Map<string,string>) : Observable<any> {
        let url = this.create(endpoints.ACTION_COMMAND,{id:customerId+""});        
        let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
        return this.http.post(url, new ActivateCustomerCommand(customerId),options).pipe(map(this.extractData));
    }

    public createIndividualInformation(individualInformation:IndividualInformation):Observable<any>{
        return this.http.post(endpoints.CREATE_INDIVIDUAL_INFORMATION,individualInformation)
        .pipe(map(this.extractData));
    }

    public updateIndividualInformation(individualInformation:IndividualInformation,pathParams:PathParameters):Observable<IndividualInformation>{
        let url=this.create(endpoints.UPDATE_INDIVIDUAL_INFORMATION,pathParams);
        return this.http.put(url,individualInformation)
        .pipe(map(this.extractData));
    }

    public fetchIindividualInformationDetails(pathParams:PathParameters):Observable<any>{
        let url=this.create(endpoints.FETCH_INDIVIDUAL_INFORMATION_DETAILS,pathParams);
        return this.http.get(url).pipe(map(this.extractData));
    }

    public fetchIindividualInformations(params: any):Observable<any>{
        return this.http.get(endpoints.FETCH_INDIVIDUAL_INFORMATION,{params:{id:params.id}}).pipe(map(this.extractData));
    }

    public fetchOccupations():Observable<any>{
        return this.http.get(endpoints.FETCH_OCCUPATIONS).pipe(map(this.extractData));
    }

    public fetchOrganizationTypes():Observable<any>{
        return this.http.get(endpoints.FETCH_ORG_TYPES).pipe(map(this.extractData));
    }

    //relationship officer
    public fetchRelationshipOfficers():Observable<any>{
        return this.http.get(endpoints.FETCH_RELATIONSHIP_OFFICERS).pipe(map(this.extractData));
    }

}
