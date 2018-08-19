import { TimeDepositSlabVatConfig } from "./time.deposit.slab.vat.config.mode";

export class TimeDepositVatCalculationInfo {
    id: number;
    slabBased: boolean;
    fixed: boolean;
    vatAmount: number;
    minVat: number;
    maxVat: number;
    timeDepositSlabVatConfigs: TimeDepositSlabVatConfig[];

    constructor() {
        this.timeDepositSlabVatConfigs = [];
    }
}