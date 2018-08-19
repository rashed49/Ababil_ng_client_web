import { Injectable } from '@angular/core';
import * as endpoints from '../special.instruction.api.endpoints';
import { SpecialInstructionType } from "../domain/special.instruction.models";
import { HttpInterceptor } from './../../http.interceptor';
import { BaseService, PathParameters } from './../../base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SpecialInstructionTypeService extends BaseService {

  constructor(private http: HttpInterceptor) {
    super();
  }


  public fetchSpecialInstructionTypes(): Observable<any> {
    return this.http
      .get(endpoints.FETCH_SPECIAL_INSTRUCTION_TYPES)
      .pipe(map(this.extractData));
  }

  public fetchSpecialInstructionTypeDetails(pathParameters: PathParameters): Observable<SpecialInstructionType> {
    let url = this.create(endpoints.FETCH_SPECIAL_INSTRUCTION_TYPE_DETAIL, pathParameters);
    return this.http
      .get(url)
      .pipe(map(this.extractData));
  }

}