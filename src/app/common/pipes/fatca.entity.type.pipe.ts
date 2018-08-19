import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Pipe({ name: 'fatcaEntityTypePipe' })
export class FatcaEntityTypePipe implements PipeTransform {

    public transform(entityTypes: any[]): SelectItem[] {
        if (!entityTypes) return undefined;
        let transformedResult = [];
        transformedResult.push({ label: "Select entity type", value: 0 });
        return transformedResult.concat(entityTypes.map(entityType => ({ label: entityType.description, value: entityType.id })));
    }
}