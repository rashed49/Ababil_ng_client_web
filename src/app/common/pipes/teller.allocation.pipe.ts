import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Pipe({ name: 'tellerAllocation' })
export class TellerAllocationPipe implements PipeTransform {

    public transform(tellerAllocations: any[]): SelectItem[] {
        if (!tellerAllocations) return undefined;
        let transformedResult = [];
        // transformedResult.push({ label: "Select a Teller", value: null });
        return transformedResult.concat(tellerAllocations.map(tellerAllocation => ({ label: tellerAllocation.teller.title, value: tellerAllocation.teller.id })));
    }
}