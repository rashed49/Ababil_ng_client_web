export class InlandRemittanceChargeInformations {

    chargeId: number;
    chargeName: string;
    chargeGl: number;
    chargeAmount: number=1;
    vatAmount: number=1;
    vatGl: number;
    modifiedChargeAmount: number;
    modifiedVatAmount: number;

    totalAmount:number;
    totalAmountLCY:number;
    commissionLCY:number;
    vatLCY:number;
} 
