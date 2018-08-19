import { InlandRemittanceChargeInformations } from "../../charge/domain/inland.remittance.charge.models";

export class InlandRemittanceInstrumentIssueInfos {

    inlandRemittanceChargeInformations: InlandRemittanceChargeInformations[];
    remittanceProductId: number;
    instrumentCurrencyCode: string;
    payeeName: string;
    payeeAddress: string;
    payeeMobile: string;
    payeeNid: string;
    purchaserName: string;
    purchaserAddress: string;
    purchaserMobile: string;
    purchaserNid: string;
    purchaseMethod: string;
    purchaserAccountNo: string;
    purchaseAmount: number;
    purchaseRemark: string;
    purchaserChequeNo: string;
    purchaseVerifyDateTime: Date;
    purchaseVerifyUser: string;
    purchaseVoucher: number;
    purchaseUser: string;
    purchaseDateTime: Date;
    txnBatchNo: string;
    txnBranchId: number;
    exchangeRate:number;
    rateType:number;
    chequeDate:Date;


    constructor() {
        this.inlandRemittanceChargeInformations = [];
        this.chequeDate=new Date();
    }
}
