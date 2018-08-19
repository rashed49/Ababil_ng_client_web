import { DemandDepositAccount } from "./demand.deposit.account.models";

export class DemandDepositChargeInquiryInfo {
    activityId: number;
    accountId: string;
    amount: number;
    constructor(){
    }
 }
 
 
export class DemandDepositChargeInformation {
    chargeId: number;
    chargeName: string;
    chargeGlAccountId: number;
    chargeAmount: number;
    modifiedChargeAmount: number;
    vatGlAccountId: number;
    vatAmount: number;
    modifiedVatAmount: number;
    constructor(){

    }
 }

export class TaxationRequest {
    accountId: number;
    balanceAmount: number;
    profitAmount: number;
    taxAmount: number;
    taxPercent: number;
    constructor() {

    }
}
