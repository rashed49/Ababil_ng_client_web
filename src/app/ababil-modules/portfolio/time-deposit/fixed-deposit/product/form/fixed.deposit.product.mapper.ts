import { FixedDepositProductSaveEvent } from "./fixed.deposit.product.form.component";
import { FixedDepositProduct } from "../../../../../../services/fixed-deposit-product/domain/fixed.deposit.product.model";

export function mapProduct(fixedDepositProductSaveEvent: FixedDepositProductSaveEvent): FixedDepositProduct {
    let fixedDepositProduct: FixedDepositProduct = {
        id: fixedDepositProductSaveEvent.fixedDepositProductForm.id,
        code: fixedDepositProductSaveEvent.fixedDepositProductForm.code,
        name: fixedDepositProductSaveEvent.fixedDepositProductForm.name,
        currencies: fixedDepositProductSaveEvent.fixedDepositProductForm.currencies,
        currencyRestriction: fixedDepositProductSaveEvent.fixedDepositProductForm.currencyRestriction,
        isCompoundingBeforeMaturityAllowed: fixedDepositProductSaveEvent.fixedDepositProductForm.isCompoundingBeforeMaturityAllowed,
        isAutoRenewalAllowed: fixedDepositProductSaveEvent.fixedDepositProductForm.isAutoRenewalAllowed,
        isLienAllowed: fixedDepositProductSaveEvent.fixedDepositProductForm.isLienAllowed,
        isAutoRenewalOverridable: fixedDepositProductSaveEvent.fixedDepositProductForm.isAutoRenewalOverridable,
        isLinkAccountRequired: fixedDepositProductSaveEvent.fixedDepositProductForm.isLinkAccountRequired,
        isProfitAppliedBeforeMaturity: fixedDepositProductSaveEvent.fixedDepositProductForm.isProfitAppliedBeforeMaturity,
        isQuardAllowed: fixedDepositProductSaveEvent.fixedDepositProductForm.isQuardAllowed,
        quardPercentage: fixedDepositProductSaveEvent.fixedDepositProductForm.quardPercentage,
        isTenorRequired: fixedDepositProductSaveEvent.fixedDepositProductForm.isTenorRequired,
        tenors: fixedDepositProductSaveEvent.fixedDepositProductForm.tenors,
        tenorType: fixedDepositProductSaveEvent.fixedDepositProductForm.tenorType,
        type: fixedDepositProductSaveEvent.fixedDepositProductForm.type,
        eligibleCustomerType: fixedDepositProductSaveEvent.fixedDepositProductForm.eligibleCustomerType,
        profitPostingPeriodType: fixedDepositProductSaveEvent.fixedDepositProductForm.profitPostingPeriodType,
        isWithdrawalAllowed: fixedDepositProductSaveEvent.fixedDepositProductForm.isWithdrawalAllowed,
        withdrawalPercentage: fixedDepositProductSaveEvent.fixedDepositProductForm.withdrawalPercentage,
        isWithdrawProfitBeforeMaturityAllowed: fixedDepositProductSaveEvent.fixedDepositProductForm.isWithdrawProfitBeforeMaturityAllowed,
        daysInYear: fixedDepositProductSaveEvent.fixedDepositProductForm.daysInYear,
        depositAmountMultiplier: fixedDepositProductSaveEvent.fixedDepositProductForm.depositAmountMultiplier,
        description: fixedDepositProductSaveEvent.fixedDepositProductForm.description,
        hasIntroducer: fixedDepositProductSaveEvent.fixedDepositProductForm.hasIntroducer,
        lienPercentage: fixedDepositProductSaveEvent.fixedDepositProductForm.lienPercentage,
        maximumDepositAmount: fixedDepositProductSaveEvent.fixedDepositProductForm.maximumDepositAmount,
        minimumDepositAmount: fixedDepositProductSaveEvent.fixedDepositProductForm.minimumDepositAmount,
        preMatureCalculationConfiguration: fixedDepositProductSaveEvent.fixedDepositProductForm.preMatureCalculationConfiguration,
        profitCalculationBasedOn: fixedDepositProductSaveEvent.fixedDepositProductForm.profitCalculationBasedOn,
        profitPostingPeriod: fixedDepositProductSaveEvent.fixedDepositProductForm.profitPostingPeriod,
        status: fixedDepositProductSaveEvent.fixedDepositProductForm.status
    }

    return fixedDepositProduct;
}
