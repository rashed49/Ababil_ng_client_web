import { InlandRemittanceChargeInformations } from "../../charge/domain/inland.remittance.charge.models";

export class InlandRemittanceInstrumentReIssueInfo {

    inlandRemittanceChargeInformations: InlandRemittanceChargeInformations[];
    currencyCode: string;
    previousInstrumentNo: string;
    productId: number;
    reIssueDateTime: Date;
    reIssueRemark: string;
    reIssueUser: string;
    reIssueVerifyDateTime: Date;
    reIssueVoucher:number;
    newInstrumentNo: string;
    purchaseMethod:string;
    purchaserAccountNo:string;
    purchaserChequeNo:string;
    txnBatchNo:string;
    txnBranchId:number;
    chequeDate:Date;
    rateType:number;
    exchangeRate:number;
    
    constructor() {
        this.inlandRemittanceChargeInformations = [];
        this.chequeDate=new Date();
    }
}