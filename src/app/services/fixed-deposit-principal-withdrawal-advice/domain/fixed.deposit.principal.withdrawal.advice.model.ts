export class WithdrawalAdvice {

    id: number;
    status: string;
    expiryDate: Date;
    depositAccountId: number;
    fixedDepositAccount: number;
    recoveredAmount: number;
    referenceNumber: string;
    withdrawalLimit: number;
    withdrawnAmount: number;
    constructor() {
    }
}