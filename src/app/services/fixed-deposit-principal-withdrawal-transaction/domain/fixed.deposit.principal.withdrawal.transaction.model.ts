export class FixedDepositTransaction {
    id: number;
    activityId: number;
    casaAccountId: number;
    fixedDepositAccountId: number;
    referenceNumber: string;
    globalTxnNo: number;
    instrumentDate: Date;
    instrumentNumber: string;
    narration: string;
    transactionAmount: number;

   // transaction:string;
    constructor() {
    }
}