export class SubLedger {
    id?: number;
    balance?: number;
    blockAmount?: number;
    branchId?: number;
    code?: string;
    currencyCode?: string;
    generalLedgerAccountId?: number;
    areAllBranchAllowed?: boolean;
    isNegativeBalanceAllowed?: boolean;
    isOnlineTxnAllowed?: boolean;
    lastTxnDateTime?: string;
    name?: number;
    status?: string;

    constructor(){
        this.isNegativeBalanceAllowed = false;
        this.isOnlineTxnAllowed = false;           
    }

}