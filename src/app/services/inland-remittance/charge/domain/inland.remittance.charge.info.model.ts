import { InlandRemittanceChargeConfiguration } from "./inland.remittance.charge.configuration.model";

export class InlandRemittanceChargeInfo {
    id: number;
    chargeName: string;
    inlandRemittanceChargeConfigurations?: InlandRemittanceChargeConfiguration[];

    constructor() {
        this.inlandRemittanceChargeConfigurations = [];
    }
}