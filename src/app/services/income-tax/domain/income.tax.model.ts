import { Account } from "../../account/domain/account.model";

export class TaxSlabConfiguration {
    id: number;
    fromAmount: number;
    toAmount: number;
    ratePercent: number;
    constructor() {

    }
}

export class TaxWaiverRule {
    id: number;
    name: string;
    description: string;
    evaluatorFunction: string;
    ratePercent: number;
    priority: number;
    applicableCustomerType: string;
    constructor() {

    }
}

export class SpecialTaxRate {
    id: number;
    accountId: number;
    accountName: string;
    accountNumber: string;
    taxRate: number;
    constructor() {
    }

}