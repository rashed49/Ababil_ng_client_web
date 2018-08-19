import { InlandRemittanceProduct } from "../../lot/domain/inland.remittance.lot.models";

export class InlandRemittanceInstrument {
    id: number;
    inlandRemittanceProduct: InlandRemittanceProduct;
    instrumentNo: string;
    receiveDateTime: Date;
    status: string;
    receiveUser: string;
    purchaserName: string;
    purchaserAddress: string;
    purchaserMobile: string;
    purchaserNid: string;
    purchaseMethod: string;
    purchaserAccountNo: string;
    purchaseAmount: number;
    purchaseRemark: string;
    payeeName: string;
    payeeAddress: string;
    payeeMobile: string;
    payeeNid: string;
    payeeAccountNo: string;
    purchaseDateTime: Date;
    lostRemark: string;
    refundRemark: string;
    paymentMethod:string;
    purchaserChequeNo:string;
    currencyCode:string;
    remittanceProductId:number;


    constructor() {
        this.inlandRemittanceProduct=new InlandRemittanceProduct();
    }
}
