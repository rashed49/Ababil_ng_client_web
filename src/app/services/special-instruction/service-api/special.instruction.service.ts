import { Injectable } from '@angular/core';
import { Response, RequestOptions } from '@angular/http';
import * as endpoints from '../special.instruction.api.endpoints';
import { SpecialInstruction, WithdrawInstructionCommand } from "../domain/special.instruction.models";
import { HttpInterceptor } from './../../http.interceptor';
import { BaseService, PathParameters } from './../../base.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable()
export class SpecialInstructionService extends BaseService {

  constructor(private http: HttpInterceptor) {
    super();
  }

  public fetchSpecialInstructions(urlSearchParams: Map<string, string>): Observable<any> {
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    return this.http.get(endpoints.FETCH_SPECIAL_INSTRUCTIONS, options)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  public fetchSpecialInstructionDetail(pathParameters: PathParameters): Observable<SpecialInstruction> {
    let url = this.create(endpoints.FETCH_SPECIAL_INSTRUCTION_DETAIL, pathParameters);
    return this.http.get(url).pipe(map(this.extractData), catchError(this.handleError));
  }

  public imposeSpecialInstruction(specialInstruction: SpecialInstruction, urlSearchParams: Map<string, string>): Observable<SpecialInstruction> {
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    return this.http.post(endpoints.IMPOSE_SPECIAL_INSTRUCTION, specialInstruction, options)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  public withdrawSpecialInstruction(command: WithdrawInstructionCommand, pathParameters: PathParameters, urlSearchParams: Map<string, string>): Observable<SpecialInstruction> {
    let url = this.create(endpoints.WITHDRAW_SPECIAL_INSTRUCTION, pathParameters);
    let options = new RequestOptions({ params: this.getUrlSearchParams(urlSearchParams) });
    return this.http.post(url, command, options)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  private handleError(error: Response) {
    return throwError(error.json().error());
  }

}
