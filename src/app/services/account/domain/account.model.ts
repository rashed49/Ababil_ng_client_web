import { ContactInformation } from './../../cis/domain/contact.information.model';
import { Address } from './../../cis/domain/address.model';
import { CustomerStatus } from './../../cis/domain/customer.model';
export class Account {

    id: number;
    number: string;
    name: string;
    type: string;
    customerId: number;
    branchId: number;
    productId: number;
    status: AccountStatus;
    customerStatus: CustomerStatus;
    openingDate: Date;
    closingDate: Date;
    contactInformation: ContactInformation;
    contactAddress: Address;
    balance: any;
    currencyCode: string;
    freeze: boolean;
    purpose: string;
    accountOpeningChannelId: number;
    relationshipManager: string;

    constructor() {
        this.contactAddress = new Address();
        this.contactInformation = new ContactInformation();
    }

}

export type AccountStatus = 'INACTIVE' | 'OPENED' | 'ACTIVATED' | 'CLOSED' | 'DORMANT' | 'UNCLAIMED' | 'INOPERATIVE' | 'IRREGULAR' | 'MATURED';

export class FreezeAccount {
    id: number;
    action: string;
    object: string;
    constructor() {
    }
}