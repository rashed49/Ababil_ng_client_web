import { TypeOfBusiness } from './../../services/cis/domain/type.of.business.model';
import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Pipe({ name: 'typeOfBusinessPipe' })
export class TypeOfBusinessPipe implements PipeTransform {

    public transform(typeOfBusiness: TypeOfBusiness[]): SelectItem[] {
        if (!typeOfBusiness) return undefined;
        let transformedResult = [];        
        return transformedResult.concat(typeOfBusiness.map(type => ({ label: type.name, value: type })));
    }
}