export class Teller {
 id?: number;
 currencyRestriction?:string;
 code?: string;
 title?: string;
 glId?: number;
 branchId?: number;
tellerType?:string;
allowedGlTransaction?: boolean;
allowedClientTransaction?: boolean;
denominationRequired?: boolean;
forceLimit?: boolean;
tellerStatus?:TellerStatus;
tellerLimits?: TellerLimit[];
tellerBalances?: TellerBalance[];

constructor(){
    this.tellerLimits=[];
  this.tellerBalances = [];
} 

}

export class TellerAllocation {
    id: number;
    allocatedTo: string;
    teller: Teller;
    allocationDate:Date;
    autoAllocate: boolean;
    constructor(){
        this.teller = new Teller();
    }
}

export class TellerLimit {
    cashReceiveLimit?: number;
    cashWithdrawLimit?: number;
    balanceLimit?: number;
    tellerId?: number;
    id?: number;
    currencyCode?: string;
}
export enum TellerStatus {
    ACTIVE,
    INACTIVE
}

export class TellerBalance{
    id: number;
    tellerId: number;
    currencyCode: string;
    balance: number;
  }

