import {TellerSaveEvent} from './teller.form.component';
import { Teller } from '../../../../../../services/teller/domain/teller.models';


export function mapTeller(tellerSaveEvent:TellerSaveEvent):Teller{
    let teller:Teller = {
        id: tellerSaveEvent.tellerForm.id,
        // currencyCode : tellerSaveEvent.tellerForm.currencyCode,
        code: tellerSaveEvent.tellerForm.code,
        title: tellerSaveEvent.tellerForm.title,

        glId : tellerSaveEvent.tellerForm.glId,
        branchId : tellerSaveEvent.tellerForm.branchId,
        tellerType: tellerSaveEvent.tellerForm.tellerType,
        currencyRestriction: tellerSaveEvent.tellerForm.currencyRestriction,

        allowedGlTransaction : tellerSaveEvent.tellerForm.allowedGlTransaction,
        allowedClientTransaction: tellerSaveEvent.tellerForm.allowedClientTransaction,
        denominationRequired: tellerSaveEvent.tellerForm.denominationRequired,

        forceLimit : tellerSaveEvent.tellerForm.forceLimit,
    //    tellerLimits: tellerSaveEvent.tellerForm.tellerLimits,
        tellerStatus: tellerSaveEvent.tellerForm.tellerStatus
    }

    return teller;
}
