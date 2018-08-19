import { Product } from '../../product/domain/product.models';
import { ProductChequePrefix } from './product-cheque-prefix.model';
import { ProductChequeBookSize } from './product-chequebook-size.model';

export class DemandDepositProduct extends Product {
    initialDeposit?: number;
    isMinimumRequiredBalanceEnforced?: boolean; 
    minimumBalance?: number;
    isMinimumBalanceOverridable?: boolean;
    hasMinimumRequiredOpeningBalance?: boolean;
    minimumBalanceForProfitCalculation?: number;
    savingsProductCalculationType?: string;
    savingsDailyProductCalculationBasedOn?: string;
    savingsMonthlyProductCalculationBasedOn?: string;
    savingsProfitApplyFrequency?: string;
    minimumProfitToApply?: number;
    canTransactionRuleOverridableByNotice?: boolean;
    canTransactionRuleOverride?: boolean;
    maximumNumberOfTransactionPerWeek?: number;
    maximumNumberOfTransactionPerMonth?: number;
    maximumTransactionRatioOfBalance?: number;
    maximumTransactionAmount?: number;
    individualMaxProfitableBalance?: number;
    jointMaxProfitableBalance?: number;
    orgMaxProfitableBalance?: number;
    isDormancyTrackingActive?: boolean;
    daysToInactive?: number;
    daysToDormancy?: number;
    daysToEscheat?: number;
    isSweepInAllowed?: boolean;
    isSweepOutAllowed?: boolean;
    isChequePrefixRequired?: boolean;
    isProfitBearing?: boolean;
    isTransactionRuleEnforced?: boolean;
    hasIntroducer?: boolean;
    hasCheque: boolean;
    daysInYear: string;
    demandDepositProductChequePrefixes?: ProductChequePrefix[];
    demandDepositProductChequeBookSizes?: ProductChequeBookSize[];

    constructor() {
        super();
    }
}

export class ActivateDemandDepositProductCommand {
    action: string;
    constructor() {
        this.action = "ACTIVATE";
    }
}
