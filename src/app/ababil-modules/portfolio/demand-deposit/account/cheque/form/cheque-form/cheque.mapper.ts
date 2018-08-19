import {ChequeBookSaveEvent} from './cheque.form.component';
import { ChequeBook } from '../../../../../../../services/cheque/domain/cheque.models';


export function mapChequeBook(chequeBookSaveEvent:ChequeBookSaveEvent):ChequeBook{
    let chequeBook:ChequeBook = {
        accountId: chequeBookSaveEvent.chequeBookForm.accountId,
        chequePrefix : chequeBookSaveEvent.chequeBookForm.chequePrefix,
        startLeafNumber: chequeBookSaveEvent.chequeBookForm.startLeafNumber,
        endLeafNumber: chequeBookSaveEvent.chequeBookForm.endLeafNumber
    }

    return chequeBook;
}
