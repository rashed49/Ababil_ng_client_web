import { InlandRemittanceSlabChargeConfig } from "./inland.remittance.slab.charge.config.model";

export class InlandRemittanceChargeCalculationInfo {
    id: number;
    slabBased: boolean;
    fixed: boolean;
    chargeAmount: number;
    minCharge: number;
    maxCharge: number;
    inlandRemittanceSlabChargeConfigs: InlandRemittanceSlabChargeConfig[];

    constructor() {
        this.inlandRemittanceSlabChargeConfigs = [];
    }
}