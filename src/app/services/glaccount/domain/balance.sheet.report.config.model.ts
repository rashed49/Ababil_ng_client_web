export class BalanceSheetReportConfiguration{
    id:number;
    generalLedgerAccountId:number;
    isBaseLevel:boolean;
    isCapital:boolean;
    isShowable:boolean;
    name:string;
    nature:AccountNature;
    parentBalanceSheetMappingId:number;
    status:string;
    type:BalanceSheetMappingType;
    childBalanceSheetMappings:BalanceSheetReportConfiguration[];
}

export type BalanceSheetMappingType = "PROFIT_AND_LOSE" | "BALANCE_SHEET";
export type AccountNature = "ASSET" | "LIABILITY" | "INCOME" | "EXPENDITURE";  