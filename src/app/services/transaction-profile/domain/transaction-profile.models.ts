export class DemandDepositAccountTransactionProfile {
    demandDepositAccountId: number;
    id: number;
    maxCreditAmountPerTransaction: number;
    maxDebitAmountPerTransaction: number;
    monthlyTotalCreditTxnAmount: number;
    monthlyTotalCreditTxnCount: number;
    monthlyTotalDebitTxnAmount: number;
    monthlyTotalDebitTxnCount: number;
    transactionLimitTypeId: number;
    transactionProfileDescription: string;
    transactionLimitMandatory:boolean;
}
