import { Pipe,PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { GlAccount } from '../../services/glaccount/domain/gl.account.model';

@Pipe({ name: 'glaccountPipe' })
export class GlAccountPipe implements PipeTransform {

  public transform(glaccounts: GlAccount[]): SelectItem[] {
    if (!glaccounts) return undefined;
    let transformedResult=[];
     transformedResult.push({label:"Select GL Account",value:null});
 return transformedResult.concat(glaccounts.map(glaccount => ({ label: glaccount.name, value:glaccount.id  })));
}

}