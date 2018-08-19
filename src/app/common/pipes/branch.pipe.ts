import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Pipe({ name: 'branchList' })
export class BranchPipe implements PipeTransform {

    public transform(branchList: any[]): SelectItem[] {
        if (!branchList) return undefined;
        let transformedResult = [];
        transformedResult.push({ label: "Choose", value: null });

        return transformedResult.concat(branchList.map(branch =>
            ({ label: branch.name + " " +  "(" + branch.code + ")", value: branch.id })
        ));
    }
}