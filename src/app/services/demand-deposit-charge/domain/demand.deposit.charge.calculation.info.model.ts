import { DemandDepositSlabChargeConfig } from "./demand.deposit.slab.charge.config.model";

export class DemandDepositChargeCalculationInfo {
    id: number;
    slabBased: boolean;
    fixed: boolean;
    chargeAmount: number;
    minCharge: number;
    maxCharge: number;
    demandDepositSlabChargeConfigs: DemandDepositSlabChargeConfig[];

    constructor() {
        this.demandDepositSlabChargeConfigs = [];
    }
}