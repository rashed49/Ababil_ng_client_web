import { TimeDepositChargeConfiguration } from "./time.deposit.charge.configuration.model";

export class TimeDepositChargeInfo {
    id: number;
    chargeName: string;
    timeDepositChargeConfigurations?: TimeDepositChargeConfiguration[];

    constructor() {
        this.timeDepositChargeConfigurations = [];
    }
}