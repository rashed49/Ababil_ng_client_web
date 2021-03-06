import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Pipe({ name: 'tellerPipe' })
export class TellerPipe implements PipeTransform {

    public transform(tellerList: any[]): SelectItem[] {
        if (!tellerList) return undefined;
        let transformedResult = [];
        transformedResult.push({ label: "Select a destination teller", value: null });
        return transformedResult.concat(tellerList.map(teller => ({ label: teller.title, value: teller })));
    }
}