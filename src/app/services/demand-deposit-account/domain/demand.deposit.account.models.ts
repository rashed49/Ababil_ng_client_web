import { Account } from './../../account/domain/account.model';
import { Address } from '../../cis/domain/address.model';
import { DemandDepositChargeInformation } from './demand.deposit.account.charge.models';

export class DemandDepositAccount extends Account {

    currencyCode: string;
    introducerAccountId: number;
    openingDate: Date;
    closingDate: Date;
    enforceTransactionRule: boolean;
    overrideTransactionRuleByNotice: boolean;
    hasNotice: boolean;
    hasInstruction: boolean;
    accountBalance: DemandDepositAccountBalance;

    constructor() {
        super();
        this.accountBalance = new DemandDepositAccountBalance();
    }

}

export class DemandDepositAccountBalance {

    id: number;
    demandDepositAccountId: number;
    currentBalance: number;
    blockAmount: number;
    clearingAmount: number;
    lienAmount: number;
    minimumBalance: number;
    transactionAllowed: boolean;
    lastClientTransactionDate: Date;
    availableBalance: number;
    provisionalProfit: number;
    constructor() {
    }

}

export class ActivateDepositAccountCommand {
    action: string;
    object: Object;
    constructor(public accountId) {
        this.action = "ACTIVATE";
    }
}
export class DeactivateDepositAccountCommand {
    action: string;
    constructor(public accountId) {
        this.action = "DEACTIVATE";
    }
}
export class ReactivateDepositAccountCommand {
    action: string;
    constructor(public accountId) {
        this.action = "REACTIVATE";
    }
}
export class DepositAccountCloseCommand {
    action: string;
    constructor(public accountId) {
        this.action = "CLOSE";
    }
}
export class ReactivateDepositDormantAccountCommand {
    action: string;
    object: Object;
    constructor(public accountId) {
        this.action = "DORMANT_ACCOUNT_REACTIVATION";
    }
}

export class DemandDepositAccountMinimumBalance {

    minimumBalance: number;

    comment: string;
    constructor() {
    }
}

export class DemandDepositAccountMinimumBalanceLog extends DemandDepositAccountMinimumBalance {

    id: number;
    accountId: number;
    accountBalanceId: number;
    previousMinimumBalance: number;
    constructor() {
        super();
    }
}


export class DemandDepositAccountCloseRequest {
    accountId: number;
    netPayable: number;
    profit: number;
    profitTaxAmount: number;
    charges: DemandDepositChargeInformation[];
    destinationAccountId: number;
    destinationAccountType: string;
    activityId: number;
    constructor() {
        this.charges = [];
    }
}

export class ReactivateDemandDepositAccountCommandDetails {
    comment: string;
    charges: DemandDepositChargeInformation[];
    constructor() {
        this.charges = [];
    }
}

export enum DemandDepositAccountAction {ACTIVATE,DEACTIVATE,REACTIVATE,DORMANT_ACCOUNT_REACTIVATION,CLOSE}


export class ActionCommand {
    action: string;
    object: Object;
    constructor(){

    }
}