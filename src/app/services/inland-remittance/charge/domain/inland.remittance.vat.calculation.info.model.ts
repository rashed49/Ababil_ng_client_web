import { InlandRemittanceSlabVatConfig } from "./inland.remittance.slab.vat.config.mode";

export class InlandRemittanceVatCalculationInfo {
    id: number;
    slabBased: boolean;
    fixed: boolean;
    vatAmount: number;
    minVat: number;
    maxVat: number;
    inlandRemittanceSlabVatConfigs: InlandRemittanceSlabVatConfig[];

    constructor() {
        this.inlandRemittanceSlabVatConfigs = [];
    }
}