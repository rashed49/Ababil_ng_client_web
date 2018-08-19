import { TimeDepositSlabChargeConfig } from "./time.deposit.slab.charge.config.model";

export class TimeDepositChargeCalculationInfo {
    id: number;
    slabBased: boolean;
    fixed: boolean;
    chargeAmount: number;
    minCharge: number;
    maxCharge: number;
    timeDepositSlabChargeConfigs: TimeDepositSlabChargeConfig[];

    constructor() {
        this.timeDepositSlabChargeConfigs = [];
    }
}