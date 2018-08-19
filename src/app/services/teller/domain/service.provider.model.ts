import { Branch } from "../../bank/domain/bank.models";

export class ServiceProvider {
    id: number;
    providerName: string;
    shortName: string;
    billCollectionAccountType: string;
    accountId: string;
    vatGlAccountId: string;
    isIntegrated: boolean;
    isStampChargeApplicable: boolean;
    branches: Branch[];
    logo: any;

    constructor() {
        // this.branches = [];
    }
}

