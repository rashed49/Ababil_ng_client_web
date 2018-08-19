import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { GlAccount } from '../../services/glaccount/domain/gl.account.model';


@Pipe({ name: 'generalLedgerPipe' })
export class GeneralLedgerListPipe implements PipeTransform {

    public transform(glAccounts: GlAccount[]): SelectItem[] {
        if (!glAccounts) return undefined;
        let transformedResult = [];
        transformedResult.push({ label: "Select a general ledger account", value: null });
        return transformedResult.concat(glAccounts.map(glAccount => ({ label: glAccount.name, value: glAccount.id })));
    }
}