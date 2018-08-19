import { ContactInformation } from "../../cis/domain/contact.information.model";
import { Address } from "../../cis/domain/address.model";

export class CashTransaction {
  id?: number;
  tellerId?: number;
  transactionDate?: Date;
  valueDate?: Date;
  amountCcy?: number;
  amountLcy?: number;
  transactionCurrencyCode?: string;
  exchangeRate?: number;
  exchangeRateTypeId?: number;
  chargeAmount?: number;
  vatAmount?: number;
  narration?: string;
  sourceOfFund: string;
}
export class CashReceive extends CashTransaction {
  transactionDebitAccountType?: string;
  accountId?: number;
  transactionCreditAccountType?: string;
  ibtaInformation?: IbtaInformation;
  bearerInfo?: BearerInfo;
  bearerTransaction: boolean;
  activityId: number;
  globalTxnNumber: number;
  tellerDenominationTransactions: TellerDenominationTransaction[];
  constructor() {
    super();
    this.ibtaInformation = new IbtaInformation();
    this.bearerInfo = new BearerInfo();
  }
}

export class CashWithdraw extends CashTransaction {
  transactionDebitAccountType?: string;
  accountId?: number;
  transactionCreditAccountType?: string;
  instrumentType?: string;
  instrumentNumber?: string;
  instrumentDate?: Date;
  ibtaInformation?: IbtaInformation;
  bearerInfo?: BearerInfo;
  bearerTransaction: boolean;
  activityId: number;
  globalTxnNumber: number;
  tellerDenominationTransactions: TellerDenominationTransaction[];
  constructor() {
    super();
    this.ibtaInformation = new IbtaInformation();
  }

}

export class CashTransfer extends CashTransaction {
  activityId : number;
  destinationTellerId?: number;
  tellerDenominationTransactionList?: TellerDenominationTransaction[];
  cashTransferTransactionType: string;
  globalTxnNumber: number;
  tellerDenominationTransactions?: TellerDenominationTransaction[];
  tellerId: number;
  transactionCurrencyCode: string;
}

export class TellerDenominationTransaction {
  id?: number;
  denominationId?: number;
  quantity: number;
}

export class Denomination {
  id?: number;
  currencyCode?: string;
  denominationType?: string;
  denominationValue?: number;

}
export class TellerDenominationTransactionTable {
  id?: number;
  tellerId?: number;
  denomination: Denomination;
  quantity: number;
  balanceQuantity: number;
  netBalance: number;
  debitQuantity: number;
  creditQuantity: number;
}

export class TellerDenominationView {
  denominationType: string;
  denominationValue: string;
  quantity: number;
  netBalance: number;
}

export enum TransactionAccountType {
  GL,
  SUBGL,
  CASA,
  SSP,
  MTDR,
  INV,
  TELLER
}

export class IbtaInformation {
  adviceNumber: string;
  originating: boolean;
  originatingDate: Date;
  originatingBranchId: number;
  respondingBranchId: number;
  respondingDate: Date;
  ibtaTrCode: string;
}

export class IbtaTransactionParticulars {
  id?: number;
  code?: string;
  particulars?: string;
}

export class BearerInfo {
  id?: number;
  contactInformation: ContactInformation;
  fatherName: string;
  motherName: string;
  name: string;
  nid: string;
  relationship: string;
  address: string;

  constructor() {
    this.contactInformation = new ContactInformation();
  }
}



