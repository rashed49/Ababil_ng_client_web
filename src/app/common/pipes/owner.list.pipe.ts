import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Pipe({ name: 'ownerList' })
export class OwnerListPipe implements PipeTransform {

    public transform(owners: any[]): SelectItem[] {
        if (!owners) return undefined;
        let transformedResult = [];
       transformedResult.push({ label: "Select an owner as signatory", value: null });
        return transformedResult.concat(owners.map(owner => ({ label: owner.name,value: owner.id})));
    }

}

