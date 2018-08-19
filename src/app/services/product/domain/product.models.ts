import { CustomerType } from '../../cis/domain/customer.type.model';
export class Product {
    id: number;
    name?: string;
    code?: string;
    description?: string;
    currencyRestriction?: string;
    currencies?: string[];
    status?: string;
    type?: string;
    eligibleCustomerType?: CustomerType[];

    constructor() {
        this.currencies = [];
    }
}
