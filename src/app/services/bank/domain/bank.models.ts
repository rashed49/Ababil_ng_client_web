import { Address } from "../../cis/domain/address.model";

export class Bank {
    id?: number;
    name?: string;
    code?: string;
    address?: Address;
    centralBankCode?: string;
    swiftCode?: string;
    ownBank?: boolean;
}


export class Branch {
    id?: number;
    code?: string;
    name?: string;
    address?: Address;
    adCode?: string;
    phoneNumber?: string;
    mobileNumber?: string;
    email?: string;
    routingNumber?: string;
    bankId?: number;
    jsonType?: string;

}

export class OwnBranch extends Branch {
    branchType?: string;
    swiftCode?: string;
    managerName?: string;
    managerDesignation?: string;
    online?: boolean;
    numberOfConcurrentUser?: number;
    headOffice?: boolean;
}

export class OtherBranch extends Branch {
}



