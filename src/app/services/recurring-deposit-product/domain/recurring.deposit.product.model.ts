import { TimeDepositProduct } from './../../time-deposit-product/domain/time.deposit.product.model';

export class RecurringDepositProduct extends TimeDepositProduct {
    isPensionScheme:boolean;
    isAdvanceInstallAllowed:boolean;
    isCalculateProfitOnAdvance:boolean;
    noOfOverDueAllowed:number;
    noOfOverDueAllowedBetweenSlab:number;
    isInitialDepositAllowed: boolean;
    initialDeposit: number;
    isInstallmentFixed: boolean;
    installmentSizes: number[];

    constructor() {
        super();
        this.installmentSizes = [];
    }
}

export class ActivateRecurringDepositProductCommand {
    action: string;
    constructor() {
        this.action = "ACTIVATE";
    }
}