import { Bank } from "../../../../services/bank/domain/bank.models";

export function mapBank(bankSaveEvent: any):Bank{
    let bank: Bank = {
        name: bankSaveEvent.name,
        code: bankSaveEvent.code,
        centralBankCode: bankSaveEvent.centralBankCode,
        swiftCode: bankSaveEvent.swiftCode,
        ownBank: bankSaveEvent.ownBank
    }
    return bank;
}