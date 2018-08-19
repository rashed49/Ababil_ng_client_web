
export class GlAccount {
    id?: number;
    code?: string;
    name?: string;
    parent?: boolean;
    categoryId?: number;
    type?: string;
    subType?: string;
    accountNature?: string;
    reconciliationType?: string;
    parentGeneralLedgerAccountId?: number;
    status?: string;
    isBackPeriodTransactionAllowed?: boolean;
    isIbtaRequired?:boolean;
    closingDateTime?: Date;
    revaluationFrequency?: string;
    currencyRestriction?: string;
    currencies?: string[];
    isTemporary?: boolean;
    isNegativeBalanceAllowed?:boolean;
    isLimitRequired?:boolean;
    isProfitCalculationAllowed?:boolean;
    branchRestriction?:string;
    branches?:number[];

    isDirectPostingAllowed?:boolean;
    isDirectPostingDebitAllowed?:boolean;
    isDirectPostingCreditAllowed?:boolean;

    //report related
    sortOrder?:number;
    isShowable?:boolean;
    isBalanceShowable?:boolean;
    isBold?:boolean;
    switchableGeneralLedgerAccountId?:number;
    isCleanCash?:boolean;
    isSupplementary?:boolean;
    sbsCode?:string;

    isModified?:boolean;
    children?:GlAccount[];   

    constructor(){
        this.isBackPeriodTransactionAllowed=false;
        this.isNegativeBalanceAllowed=false;
        this.isLimitRequired=false;
        this.isTemporary=false;
        this.isIbtaRequired=false;
        this.parent = false;
        this.isProfitCalculationAllowed=false;
        this.isDirectPostingAllowed = false;
        this.isDirectPostingCreditAllowed = false;
        this.isDirectPostingDebitAllowed = false;           
    }

}

///GL_ACCOUNT PROFIT RATE MODELS///

export class GeneralLedgerAccountProfitRate {
 id?:number;
 incomeGeneralLedgerAccountId?:number;
 expenseGeneralLedgerAccountId?:number;
 generalLedgerAccountId?:number;
 effectiveDate?:Date;
 isSlabApplicable?:boolean;
 landingRate?:number;
 borrowingRate?:number;
 productProfitRateSlabs?: GeneralLedgerAccountProfitRateSlab[];


 constructor() {
    this.isSlabApplicable = false;
    this.productProfitRateSlabs = [];
}
}

//slab model
export class  GeneralLedgerAccountProfitRateSlab {
    id:number;
    profitRateId:number;
    amountRangeFrom:number;
    amountRangeTo:number;
    landingRate:number;
    borrowingRate:number;

    constructor() {
    }
}

///merged model to show relevant datas in datatable
export class  GLAccountProfitRateMerged {
    id:number;
    effectiveDate:Date;
    amountRangeFrom:number;
    amountRangeTo:number;
    landingRate:number;
    borrowingRate:number;
}


export class GeneralLedgerAccountLimit {
    id?: number;
    branchId?: number;
    // branchName?: string;
    generalLedgerAccountId?: number;
    currencyCode?: string;
    balanceLimit?: number;
    isMonthlyLimitAllowed?: boolean;
    monthlyLimit?: number;

    constructor(){}
}

