import { InlandRemittanceProduct } from "../../lot/domain/inland.remittance.lot.models";
import { InlandRemittanceChargeCalculationInfo } from "./inland.remittance.charge.calculation.info.model";
import { InlandRemittanceVatCalculationInfo } from "./inland.remittance.vat.calculation.info.model";
import { InlandRemittanceChargeInfo } from "./inland.remittance.charge.info.model";

export class InlandRemittanceChargeConfiguration {
    id: number;
    chargeInfoId: number;
    inlandRemittanceProduct: InlandRemittanceProduct;
    currencyCode: string;
    amountSlabApplicable: boolean;
    calculationCurrency: string;
    inlandRemittanceChargeCalculationInfo: InlandRemittanceChargeCalculationInfo;
    inlandRemittanceVatCalculationInfo: InlandRemittanceVatCalculationInfo;
    transactionCurrency:string;
    defaultConfiguration:boolean;
    chargeGl: number;
    vatGl: number;
    active: boolean;
    sendToActivate?: boolean; //only for activation purpose

    constructor() {
        this.inlandRemittanceProduct = new InlandRemittanceProduct();
        this.inlandRemittanceChargeCalculationInfo = new InlandRemittanceChargeCalculationInfo();
        this.inlandRemittanceVatCalculationInfo = new InlandRemittanceVatCalculationInfo();
        this.defaultConfiguration = true;
    }
}

export class ActivateInlandRemittanceChargeConfigurationCommand {
    inlandRemittanceChargeInfo: InlandRemittanceChargeInfo;
    action: string;
    
    constructor() {
        this.inlandRemittanceChargeInfo = new InlandRemittanceChargeInfo();
        this.action = "ACTIVATE";
    }
}