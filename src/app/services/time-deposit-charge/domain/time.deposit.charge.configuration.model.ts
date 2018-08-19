import { TimeDepositVatCalculationInfo } from "./time.deposit.vat.calculation.info.model";
import { TimeDepositChargeInfo } from "./time.deposit.charge.info.model";
import { TimeDepositChargeCalculationInfo } from "./time.charge.calculation.info.model";

export class TimeDepositChargeConfiguration {
    id: number;
    chargeInfoId: number;
    productId: number;
    productName: string;
    currencyCode: string;
    amountSlabApplicable: boolean;
    calculationCurrency: string;
    timeDepositChargeCalculationInfo: TimeDepositChargeCalculationInfo;
    timeDepositVatCalculationInfo: TimeDepositVatCalculationInfo;
    transactionCurrency: string;
    defaultConfiguration: boolean;
    chargeGl: number;
    vatGl: number;
    active: boolean;
    sendToActivate?: boolean; //only for activation purpose

    constructor() {
        this.timeDepositChargeCalculationInfo = new TimeDepositChargeCalculationInfo();
        this.timeDepositVatCalculationInfo = new TimeDepositVatCalculationInfo();
        this.defaultConfiguration = true;
    }
}

export class ActivateTimeDepositChargeConfigurationCommand {
    timeDepositChargeInfo: TimeDepositChargeInfo;
    action: string;

    constructor() {
        this.timeDepositChargeInfo = new TimeDepositChargeInfo();
        this.action = "ACTIVATE";
    }
}

