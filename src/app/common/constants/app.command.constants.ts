export const GL_ACCOUNT_CREATE_COMMAND = "CreateGlAccountCommand";
export const GL_ACCOUNT_UPDATE_COMMAND = "UpdateGlAccountCommand";
export const CUSTOMER_CREATE_COMMAND = "CreateCustomerCommand";
export const CUSTOMER_UPDATE_COMMAND = "UpdateCustomerCommand";
export const DEMAND_DEPOSIT_PRODUCT_CREATE_COMMAND = "CreateDemandDepositProductCommand";
export const DEMAND_DEPOSIT_PRODUCT_UPDATE_COMMAND = "UpdateDemandDepositProductCommand";
export const ACTIVATE_DEMAND_DEPOSIT_ACCOUNT_COMMAND = "ActivateDemandDepositAccountCommand";
export const SAVE_GENERAL_LEDGER_ACCOUNTS_COMMAND = "SaveGeneralLedgerAccountsCommand";

export const CREATE_GENERAL_LEDGER_ACCOUNT_PROFIT_RATE_COMMAND = "CreateGeneralLedgerAccountProfitRateCommand";
export const UPDATE_GENERAL_LEDGER_ACCOUNT_PROFIT_RATE_COMMAND = "UpdateGeneralLedgerAccountProfitRateCommand"

//Subledger Commands
export const CREATE_SUB_LEDGER_COMMAND = "CreateSubsidiaryLedgerCommand";
export const UPDATE_SUB_LEDGER_COMMAND = "UpdateSubsidiaryLedgerCommand"

export const GL_ACCOUNT_LIMIT_CREATE_COMMAND = "CreateGeneralLedgerAccountLimitCommand";
export const GL_ACCOUNT_LIMIT_UPDATE_COMMAND = "UpdateGeneralLedgerAccountLimitCommand";




//Bank & Branch
export const BANK_CREATE_COMMAND = "CreateBankCommand";
export const BANK_UPDATE_COMMAND = "UpdateBankCommand";
export const BANK_DELETE_COMMAND = "DeleteBankCommand";
export const OWN_BRANCH_CREATE_COMMAND = "CreateOwnBranchCommand";
export const OWN_BRANCH_UPDATE_COMMAND = "UpdateOwnBranchCommand";
export const OWN_BRANCH_DELETE_COMMAND = "DeleteOwnBranchCommand";
export const OTHER_BRANCH_CREATE_COMMAND = "CreateOtherBranchCommand";
export const OTHER_BRANCH_UPDATE_COMMAND = "UpdateOtherBranchCommand";
export const OTHER_BRANCH_DELETE_COMMAND = "DeleteOtherBranchCommand";

//Teller
export const TELLER_CREATE_COMMAND = "CreateTellerCommand";
export const TELLER_UPDATE_COMMAND = "UpdateTellerCommand";
export const TELLER_ALLOCATION_CREATE_COMMAND = "CreateTellerAllocationCommand";
export const TELLER_ALLOCATION_UPDATE_COMMAND = "UpdateTellerAllocationCommand";
export const TELLER_TRANSACTION_CASH_RECEIVE_COMMAND = "CashReceiveTransactionCommand";
export const TELLER_TRANSACTION_CASH_WITHDRAW_COMMAND = "CashWithdrawTransactionCommand";

//Cheque
export const CHEQUE_BOOK_CREATE_COMMAND = "CreateChequeBookCommand";
export const CHEQUE_BOOK_CORRECTION_COMMAND = "ChequeBookCorrectionCommand";

//Bank Notice
export const CREATE_BANK_NOTICE_COMMAND = "CreateBankNoticeCommand";


export const ACTIVATE_CUSTOMER_COMMAND = 'ActivateCustomerCommand'

// acount operator
export const ACCOUNT_SIGNATORY_CREATE_COMMAND = "CreateAccountSignatoryCommand";
export const TACCOUNT_SIGNATORY_UPDATE_COMMAND = "UpdateAccountSignatoryCommand";



//Special Instructions

export const NO_WITHDRAW_BY_CHEQUE_IMPOSE_COMMAND = 'ImposeNoWithdrawByChequeInstructionCommand';
export const CHEQUE_STOP_IMPOSE_COMMAND = 'ImposeChequeStopInstructionCommand';
export const NO_WITHDRAW_BY_TRANSFER_IMPOSE_COMMAND = 'ImposeNoWithdrawByTransferInstructionCommand';
export const NO_DEPOSIT_BY_TRANSFER_IMPOSE_COMMAND = 'ImposeNoDepositByTransferInstructionCommand';
export const MINIMUM_BALANCE_IMPOSE_COMMAND = "ImposeMinimumBalanceInstructionCommand";
export const NO_CASH_WITHDRAW_ONLINE_IMPOSE_COMMAND = 'ImposeNoCashWithdrawOnlineInstructionCommand';
export const NO_CASH_DEPOSIT_ONLINE_IMPOSE_COMMAND = 'ImposeNoCashDepositOnlineInstructionCommand';
export const NO_WITHDRAW_IMPOSE_COMMAND = 'ImposeNoWithdrawInstructionCommand';
export const NO_TRANSFER_WITHDRAW_ONLINE_IMPOSE_COMMAND = 'ImposeNoTransferWithdrawOnlineInstructionCommand';
export const NO_TRANSFER_DEPOSIT_ONLINE_IMPOSE_COMMAND = 'ImposeNoTransferDepositOnlineInstructionCommand';
export const NO_CASH_WITHDRAW_IMPOSE_COMMAND = 'ImposeNoCashWithdrawInstructionCommand';
export const NO_CASH_DEPOSIT_IMPOSE_COMMAND = 'ImposeNoCashDepositInstructionCommand';
export const NO_TRANSACTION_IMPOSE_COMMAND = "ImposeNoTransactionInstructionCommand";


export const NO_WITHDRAW_BY_CHEQUE_WITHDRAW_COMMAND = 'WithdrawNoWithdrawByChequeInstructionCommand';
export const CHEQUE_STOP_WITHDRAW_COMMAND = 'WithdrawChequeStopInstructionCommand';
export const NO_WITHDRAW_BY_TRANSFER_WITHDRAW_COMMAND = 'WithdrawNoWithdrawByTransferInstructionCommand';
export const NO_DEPOSIT_BY_TRANSFER_WITHDRAW_COMMAND = 'WithdrawNoDepositByTransferInstructionCommand';
export const MINIMUM_BALANCE_WITHDRAW_COMMAND = "WithdrawMinimumBalanceInstructionCommand";
export const NO_CASH_WITHDRAW_ONLINE_WITHDRAW_COMMAND = 'WithdrawNoCashWithdrawOnlineInstructionCommand';
export const NO_CASH_DEPOSIT_ONLINE_WITHDRAW_COMMAND = 'WithdrawNoCashDepositOnlineInstructionCommand';
export const NO_WITHDRAW_WITHDRAW_COMMAND = 'WithdrawNoWithdrawInstructionCommand';
export const NO_TRANSFER_WITHDRAW_ONLINE_WITHDRAW_COMMAND = 'WithdrawNoTransferWithdrawOnlineInstructionCommand';
export const NO_TRANSFER_DEPOSIT_ONLINE_WITHDRAW_COMMAND = 'WithdrawNoTransferDepositOnlineInstructionCommand';
export const NO_CASH_WITHDRAW_WITHDRAW_COMMAND = 'WithdrawNoCashWithdrawInstructionCommand';
export const NO_CASH_DEPOSIT_WITHDRAW_COMMAND = 'WithdrawNoCashDepositInstructionCommand';
export const NO_TRANSACTION_WITHDRAW_COMMAND = 'WithdrawNoTransactionInstructionCommand';


//demand deposit
export const ACTIVATE_DEMAND_DEPOSIT_PRODUCT_COMMAND = "ActivateDemandDepositProductCommand";
export const ACTIVATE_DEMAND_DEPOSIT_CHARGE_CONFIGURATION_COMMAND = "ActivateDemandDepositChargeConfigurationCommand";
export const UPDATE_DEMAND_DEPOSIT_CHARGE_CONFIGURATION_COMMAND = "DemandDepositChargeConfigurationUpdateCommand";


//fixed deposit 
export const ACTIVATE_FIXED_DEPOSIT_PRODUCT_COMMAND = "ActivateFixedDepositProductCommand";
export const ACTIVATE_FIXED_DEPOSIT_ACCOUNT_COMMAND = "ActivateFixedDepositAccountCommand";

//recurring deposit
export const ACTIVATE_RECURRING_DEPOSIT_ACCOUNT_COMMAND = "ActivateRecurringDepositAccountCommand";
export const ACTIVATE_RECURRING_DEPOSIT_PRODUCT_COMMAND = "ActivateRecurringDepositProductCommand";

//inlandRemittance
export const CREATE_INLAND_REMITTANCE_LOT = "InlandRemittanceLotEntryCommand";
export const UPDATE_INLAND_REMITTANCE_LOT = "InlandRemittanceLotEditCommand";
export const CREATE_INLAND_INSTRUMENT_ISSUE = "InlandRemittanceInstrumentIssueCommand";
export const CREATE_INLAND_REMITTANCE_REISSUE = "InlandRemittanceInstrumentReIssueCommand";
export const CREATE_INLAND_REMITTANCE_PAYMENT = "InlandRemittanceInstrumentPaymentCommand";

//inland remittance charge
export const ACTIVATE_INLAND_REMITTANCE_CHARGE_CONFIGURATION_COMMAND = "ActivateInlandRemittanceChargeConfigurationCommand";
export const UPDATE_INLAND_REMITTANCE_CHARGE_CONFIGURATION_COMMAND = "InlandRemittanceChargeConfigurationUpdateCommand";

//fixed deposit withdrawal advice
export const CREATE_FIXED_DEPISIT_WITHDRAWAL_ADVICE = "CreateFixedDepositWithdrawalAdviceCommand";
export const UPDATE_FIXED_DEPISIT_WITHDRAWAL_ADVICE = "UpdateFixedDepositWithdrawalAdviceCommand";
export const CREATE_FIXED_DEPOSIT_WITHDRAWAL_TRANSACTION_RECOVERY = "FixedDepositWithdrawalRecoveryTransactionCommand";
export const CREATE_FIXED_DEPOSIT_WITHDRAWAL_TRANSACTION = "FixedDepositWithdrawalTransactionCommand";



//service provider 
export const CREATE_SERVICE_PROVIDER_COMMAND = "CreateBillCollectionCommand";
export const UPDATE_SERVICE_PROVIDER_COMMAND = "UpdateBillCollectionCommand";

//Time deposit charge
export const SAVE_TIME_DEPOSIT_CHARGE_CONFIGURATION_COMMAND= "TimeDepositChargeConfigurationSaveCommand";
export const ACTIVATE_TIME_DEPOSIT_CHARGE_CONFIGURATION_COMMAND = "ActivateTimeDepositChargeConfigurationCommand";
export const UPDATE_TIME_DEPOSIT_CHARGE_CONFIGURATION_COMMAND = "TimeDepositChargeConfigurationUpdateCommand";


//Time deposit lien
export const CREATE_TIME_DEPOSIT_LIEN = "CreateTimeDepositLienCommand";
export const UPDATE_TIME_DEPOSIT_LIEN = "UpdateTimeDepositLienCommand";
