import { Pipe,PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ApplicantType } from '../../services/cis/domain/applicant.type.model';

@Pipe({ name: 'applicantTypePipe' })
export class ApplicantTypeListPipe implements PipeTransform {

  public transform(applicantTypes: ApplicantType[]): SelectItem[] {
    if (!applicantTypes) return undefined;
    let transformedResult=[];
    transformedResult.push({label:"Select Applicant Type",value:null});
    return transformedResult.concat(applicantTypes.map(applicantType => ({ label: applicantType.description, value: applicantType.id })));
  }

}