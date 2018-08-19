import { TimeDepositProduct } from './../../time-deposit-product/domain/time.deposit.product.model';

export class FixedDepositProduct extends TimeDepositProduct {
    hasIntroducer: boolean;
    isAutoRenewalAllowed: boolean;
    isAutoRenewalOverridable: boolean;
    isQuardAllowed: boolean;
    quardPercentage: number;
    isWithdrawalAllowed: boolean;
    withdrawalPercentage: number;
    profitCalculationBasedOn: string;

    constructor() {
        super();
    }
}


export class ActivateFixedDepositProductCommand {
    action: string;
    constructor() {
        this.action = "ACTIVATE";
    }
}