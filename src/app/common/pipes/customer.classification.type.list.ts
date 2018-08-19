import { CustomerClassificationType } from './../../services/cis/domain/type.of.business.model';

import { Pipe,PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Currency } from '../../services/currency/domain/currency.models';

@Pipe({ name: 'customerClassificationTypePipe' })
export class CustomerClassificationTypePipe implements PipeTransform {

  public transform(customerClassificationTypes: CustomerClassificationType[]): SelectItem[] {
    if (!customerClassificationTypes) return undefined;
    let transformedResult=[]; 
    transformedResult.push({ label: 'Select Customer Classification Type', value:null  })   
 return transformedResult.concat(customerClassificationTypes.map(type => ({ label: type.description, value:type.id  })));
}

}