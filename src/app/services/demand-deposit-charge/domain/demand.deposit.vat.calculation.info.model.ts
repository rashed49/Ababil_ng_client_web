import { DemandDepositSlabVatConfig } from "./demand.deposit.slab.vat.config.mode";

export class DemandDepositVatCalculationInfo {
    id: number;
    slabBased: boolean;
    fixed: boolean;
    vatAmount: number;
    minVat: number;
    maxVat: number;
    demandDepositSlabVatConfigs: DemandDepositSlabVatConfig[];

    constructor() {
        this.demandDepositSlabVatConfigs = [];
    }
}