import { SourceOfFund } from './../../services/cis/domain/subject.model';
import { Pipe,PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ApplicantType } from '../../services/cis/domain/applicant.type.model';

@Pipe({ name: 'sourceOfFundPipe' })
export class SourceOfFundListPipe implements PipeTransform {

  public transform(sourceOfFunds: SourceOfFund[]): SelectItem[] {
    if (!sourceOfFunds) return undefined;
    let transformedResult=[];    
    return transformedResult.concat(sourceOfFunds.map(sourceOfFund => ({ label: sourceOfFund.description, value: sourceOfFund })));
  }

}