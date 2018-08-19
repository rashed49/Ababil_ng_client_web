import { Pipe,PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Pipe({ name: 'organizationTypePipe' })
export class OrganizationTypePipe implements PipeTransform {

  public transform(organizationTypes: any[]): SelectItem[] {
    if (!organizationTypes) return undefined;
    let transformedResult=[];
    transformedResult.push({label:"Select Organization",value:null});
    return transformedResult.concat(organizationTypes.map(orgType => ({ label: orgType.typeName, value:orgType.id})));
  }

}