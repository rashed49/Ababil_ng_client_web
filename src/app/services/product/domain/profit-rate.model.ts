import {Currency} from '../../currency/domain/currency.models';

export class ProfitRate {
    id?: number;
    productId?: number;
    description?: string;
    fromDate?: Date;
    endDate?: Date;
    currencyId?: number;
    currencyCode?: string;
    slabApplicable?: boolean;
    productProfitRateSlabs ?:DemandDepositRateSlabs[];



    constructor() {
        this.slabApplicable=false;
        this.productProfitRateSlabs=[];  
           }

}

export class DemandDepositRateSlabs {
    id?: number;
    amountRangeFrom?: number;
    amountRangeTo?: number;
    fromTenor?: string;
    toTenor?: string;
    tenorType?: string;
    annualProvisionalRate?: number;
    psr?: number;
    weightage?: number;


    constructor(){
        this.id=null;
        this.amountRangeFrom=null;
        this.amountRangeTo=null;
        this.annualProvisionalRate=null;
        this.fromTenor =null;
        this.toTenor = null;
        this.tenorType = null;
        this.psr=null;
        this.weightage=null;
    }
}


export class ProfitRateMerged {
    id?: number;
    currency?:string;
    fromDate?: Date;
    profitRateId?: number;
    amountRangeFrom?: number;
    amountRangeTo?: number;
    fromTenor?: string;
    toTenor?: string;
    tenorType?: string;
    annualProvisionalRate?: number;
    psr?: number;
    weightage?: number;
    
  }

  export enum ProfitCalculationType{
    PSR,
    WEIGHTAGE,
    RATE
   }
