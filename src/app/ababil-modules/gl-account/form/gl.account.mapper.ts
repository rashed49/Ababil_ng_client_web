import {GlAccountSaveEvent} from './gl.account.form.component';
import {GlAccount} from '../../../services/glaccount/domain/gl.account.model';


export function mapGlAccount(glAccountSaveEvent:GlAccountSaveEvent):GlAccount{
    // let glAccount:GlAccount = {
    //    id : glAccountSaveEvent.glAccountForm.id,
    //    code: glAccountSaveEvent.glAccountForm.code,
    //    name: glAccountSaveEvent.glAccountForm.name,
    //    description: glAccountSaveEvent.glAccountForm.description,
    //    leafType: glAccountSaveEvent.glAccountForm.leafType,
    //    glCategoryId: glAccountSaveEvent.glAccountForm.glCategoryId,
    //    glType: glAccountSaveEvent.glAccountForm.glType,
    //    glSubType: glAccountSaveEvent.glAccountForm.glSubType,
    //    reconciliationType: glAccountSaveEvent.glAccountForm.reconciliationType,
    //    parentGlId: glAccountSaveEvent.glAccountForm.parentGlId,
    //    status: glAccountSaveEvent.glAccountForm.status,
    //    allowBackPeriodTransaction: glAccountSaveEvent.glAccountForm.allowBackPeriodTransaction,
    //    closingDateTime: glAccountSaveEvent.glAccountForm.closingDateTime,
    //    revaluationFrequency: glAccountSaveEvent.glAccountForm.revaluationFrequency,
    //    currencyRestriction: glAccountSaveEvent.glAccountForm.currencyRestriction,
    //    functionalCurrency: glAccountSaveEvent.glAccountForm.functionalCurrency,
    //    temporaryGl: glAccountSaveEvent.glAccountForm.temporaryGl,
    //    negativeBalanceAllowed: glAccountSaveEvent.glAccountForm.negativeBalanceAllowed
    // }

    //return glAccount;
    return null;
}