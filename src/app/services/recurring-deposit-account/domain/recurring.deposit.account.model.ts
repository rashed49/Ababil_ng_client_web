import { Account } from './../../account/domain/account.model';

export class RecurringDepositAccount extends Account {
    introducerAccountId: number;
    linkAccountId: number;
    tenorType: string;
    tenor: number;
    activationDate: Date;
    expiryDate: Date;
    instalmentAmount: number;
    pensionType: string;
    pensionPeriod: number;
    pensionPeriodType: string;
    recurringDepositAccountBalance: RecurringDepositAccountBalance;

    constructor() {
        super();
        this.recurringDepositAccountBalance = new RecurringDepositAccountBalance();

    }
}

export class RecurringDepositAccountBalance {


    id: number;
    balance?: number;;
    principalDebit?: number;
    principalCredit?: number;
    principalBalance?: number;
    profitDebit?: number;
    profitCredit?: number;
    profitBalance?: number;
    withdrawableProfit?: number;

    lienAmount?: number;
    openingBalance?: number;
    totalTaxDeducted?: number;
    totalExciseDutyDeducted?: number;
    dueTaxAmount?: number;
    dueExciseDuty?: number;

    dueInstallment?: number;
    totalInstallment?: number;
    advanceInstallment?: number;
    givenInstallment?: number;
    provisionalProfit
    constructor() {
        
    }

}




export class ActivateRecurringDepositAccountCommand {
    action: string;
    constructor() {
        this.action = "ACTIVATE";
    }
}

