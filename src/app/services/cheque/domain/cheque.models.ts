export class ChequeBook {
    id?: number;
    accountId?: number;
    chequePrefix?: string;

    startLeafNumber?: string;
    endLeafNumber?: string;

    chequeBookStatus?: ChequeBookStatus;
    constructor(){
    }
}

export interface Cheque {
    id?: number;
    bookId?: number;
    accountId?: number;

    chequeStatus?: string;
    chequePrefix?: string;
    chequeNumber?: string;

    globaltxnNo?: number;
 
}
export enum ChequeBookStatus{
    ISSUED,CORRECTED
}
