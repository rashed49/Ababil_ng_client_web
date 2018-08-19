import { Product } from '../../product/domain/product.models';

export class TimeDepositProduct extends Product {
    isCompoundingBeforeMaturityAllowed: boolean;
    daysInYear: string;
    depositAmountMultiplier: number;
    isLienAllowed: boolean;
    lienPercentage: number;
    isLinkAccountRequired: boolean;
    maximumDepositAmount: number;
    minimumDepositAmount: number;
    isWithdrawProfitBeforeMaturityAllowed: boolean;
    isProfitAppliedBeforeMaturity: boolean;
    profitPostingPeriod: string;
    profitPostingPeriodType: string;
    isTenorRequired: boolean;
    tenorType: string;
    preMatureCalculationConfiguration: PreMatureCalculationConfiguration;
    tenors: number[];
    hasIntroducer:boolean;

    constructor() {
        super();
        this.tenors = [];
    }
}


export class PreMatureCalculationConfiguration {
    noProfitDays: number;
    isSlabApplicable: boolean;
    isMultiSlabApplicable: boolean;
}
