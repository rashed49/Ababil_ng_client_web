import { Account } from './../../account/domain/account.model';


export class FixedDepositAccount extends Account {

    introducerAccountId?: number;
    activationDate?: Date;
    expiryDate?: Date;
    tenorType?: DepositTermType;
    tenor?: number;
    initialDeposit?: number;
    renewalTenor?: number;
    renewalDate?: Date;
    renewalOption?: RenewalOption;
    renewalPrincipal?: number;
    fixedDepositAccountBalance?: FixedDepositAccountBalance;
    isAutoRenewalAllowed?: boolean;
    linkAccountId?: number;


    constructor() {
        super();
        this.fixedDepositAccountBalance = new FixedDepositAccountBalance();
    }

}

export class FixedDepositAccountBalance {


    id: number;
    balance?: number;;
    principalDebit?: number;
    principalCredit?: number;
    principalBalance?: number;
    profitDebit?: number;
    profitCredit?: number;
    profitBalance?: number;
    withdrawableProfit?: number;
    withdrawablePrincipal?: number;
    lienAmount?: number;
    quardAmount?: number;
    openingBalance?: number;
    lastRenewalAmount?: number;
    totalTaxDeducted?: number;
    totalExciseDutyDeducted?: number;
    dueTaxAmount?: number;
    dueExciseDuty?: number;
    provisionalProfit?: number;

    constructor() {
    }

}

export type DepositTermType = 'DAYS' | 'MONTHS' | 'YEARS';
export type RenewalOption = 'FULL_BALANCE' | ' PRINCIPAL_BALANCE' | 'OTHER_AMOUNT';

export class ActivateFixedDepositAccountCommand {
    action: string;
    constructor(public accountId) {
        this.action = "ACTIVATE";
    }
}




