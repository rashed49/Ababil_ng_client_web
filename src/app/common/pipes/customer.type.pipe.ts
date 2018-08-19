import { Pipe,PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ApplicantType } from '../../services/cis/domain/applicant.type.model';

@Pipe({ name: 'customerTypePipe' })
export class CustomerTypePipe implements PipeTransform {

  public transform(customerType: string): String {
    if (!customerType) return "";
    switch(customerType){
        case 'INDIVIDUAL_SINGLE':
           return "SINGLE";
        case 'INDIVIDUAL_JOINT':
           return "JOINT";
        case 'ORGANIZATION':
           return "ORGANIZATION";      
    }
  }

}