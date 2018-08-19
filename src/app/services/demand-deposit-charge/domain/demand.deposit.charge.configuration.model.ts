import { DemandDepositChargeCalculationInfo } from "./demand.deposit.charge.calculation.info.model";
import { DemandDepositVatCalculationInfo } from "./demand.deposit.vat.calculation.info.model";
import { DemandDepositChargeInfo } from "./demand.deposit.charge.info.model";

export class DemandDepositChargeConfiguration {
    id: number;
    chargeInfoId: number;
    productId: number;
    productName: string;
    currencyCode: string;
    amountSlabApplicable: boolean;
    calculationCurrency: string;
    demandDepositChargeCalculationInfo: DemandDepositChargeCalculationInfo;
    demandDepositVatCalculationInfo: DemandDepositVatCalculationInfo;
    transactionCurrency: string;
    defaultConfiguration: boolean;
    chargeGl: number;
    vatGl: number;
    active: boolean;
    sendToActivate?: boolean; //only for activation purpose

    constructor() {
        this.demandDepositChargeCalculationInfo = new DemandDepositChargeCalculationInfo();
        this.demandDepositVatCalculationInfo = new DemandDepositVatCalculationInfo();
        this.defaultConfiguration = true;
    }
}

export class ActivateDemandDepositChargeConfigurationCommand {
    demandDepositChargeInfo: DemandDepositChargeInfo;
    action: string;

    constructor() {
        this.demandDepositChargeInfo = new DemandDepositChargeInfo();
        this.action = "ACTIVATE";
    }
}

