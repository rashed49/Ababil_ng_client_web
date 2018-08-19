import { DemandDepositChargeConfiguration } from "./demand.deposit.charge.configuration.model";

export class DemandDepositChargeInfo {
    id: number;
    chargeName: string;
    demandDepositChargeConfigurations?: DemandDepositChargeConfiguration[];

    constructor() {
        this.demandDepositChargeConfigurations = [];
    }
}