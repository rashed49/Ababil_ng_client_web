import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { GeneralLedgerType } from '../../services/demand-deposit-product/domain/general-ledger-type.model';


@Pipe({ name: 'generalLedgerTypePipe' })
export class GeneralLedgerTypeListPipe implements PipeTransform {

    public transform(generalLedgerTypes: GeneralLedgerType[]): SelectItem[] {
        if (!generalLedgerTypes) return undefined;
        let transformedResult = [];
        transformedResult.push({ label: "Choose", value: null });
        return transformedResult.concat(generalLedgerTypes.map(generalLedgerType => ({ label: generalLedgerType.typeName, value: generalLedgerType.id })));
    }
}