import { AccountOpeningChannels } from './../../services/account/domain/account.opening.channels';
import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';


@Pipe({ name: 'accountOpeningChannelPipe' })
export class AccountOpeningChannelPipe implements PipeTransform {

    public transform(accountOpeningChannels: AccountOpeningChannels[]): SelectItem[] {
        if (!accountOpeningChannels) return undefined;
        let transformedResult = [];
        transformedResult.push({ label: "Select account opening channel", value: null });
        return transformedResult.concat(accountOpeningChannels.map(accountOpeningChannels => ({ label: accountOpeningChannels.channelName, value: accountOpeningChannels.id })));
    }

}