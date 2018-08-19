export const FETCH_GL_CATEGORIES="/glcategories";

//profit configuration
export const FETCH_GENERAL_LEDGER_PROFIT_RATES="/general-ledger-accounts/{generalLedgerAccountId}/profit-rates";
export const CREATE_GENERAL_LEDGER_PROFIT_RATE="/general-ledger-accounts/{generalLedgerAccountId}/profit-rates";


export const FETCH_GL_ACCOUNTS="/general-ledger-accounts";
export const CREATE_GL_ACCOUNT="/general-ledger-accounts";
export const UPDATE_GL_ACCOUNT="/general-ledger-accounts/{id}";
export const DELETE_GL_ACCOUNT="";
export const FETCH_GL_ACCOUNT_DETAILS="/general-ledger-accounts/{id}";
export const FETCH_GL_ACCOUNT_PATH="/general-ledger-accounts/{id}/paths";

//GL_Account profit rate endpoints
export const FETCH_GL_ACCOUNT_PROFIT_RATES = "/general-ledger-accounts/{generalLedgerAccountId}/profit-rates";
export const CREATE_GL_ACCOUNT_PROFIT_RATES= "/general-ledger-accounts/{generalLedgerAccountId}/profit-rates";
export const FETCH_GENERAL_LEDGER_ACCOUNTS = "/general-ledger-accounts";
export const FETCH_GENERAL_LEDGER_PROFIT_RATE="/general-ledger-accounts/{generalLedgerAccountId}/profit-rates/{generalLedgerAccountProfitRateId}";
export const UPDATE_GENERAL_LEDGER_PROFIT_RATE="/general-ledger-accounts/{generalLedgerAccountId}/profit-rates/{generalLedgerAccountProfitRateId}";

//limit configuration
export const FETCH_GL_ACCOUNT_LIMITS="/general-ledger-accounts/{generalLedgerAccountId}/limits";
export const CREATE_GENERAL_LEDGER_ACCOUNT_LIMIT="/general-ledger-accounts/{generalLedgerAccountId}/limits";
export const UPDATE_GENERAL_LEDGER_ACCOUNT_LIMIT="/general-ledger-accounts/{generalLedgerAccountId}/limits/{generalLedgerAccountLimitId}";

//general ledger configurations
export const FETCH_GENERAL_LEDGER_CONFIGURATIONS = "/general-ledger-account-configurations";

//balance sheet report configuration
export const FETCH_BALANCE_SHEET_MAPPINGS = "/balance-sheet-mappings";
export const SAVE_BALANCE_SHEET_MAPPINGS = "/balance-sheet-mappings";
export const FETCH_BALANCE_SHEET_MAPPING = "/balance-sheet-mappings/{id}";
export const DELETE_BALANCE_SHEET_MAPPING = "/balance-sheet-mappings/{id}";


// general ledger dashboard
export const FETCH_GL_INCOME_EXPENSE_OF_LAST_12_MONTHS = '/general-ledger-accounts/dashboards/income-expense';
export const FETCH_TOP_INCOME_BRANCHES = '/general-ledger-accounts/dashboards/top-income-branches';
export const FETCH_TOP_INVESTMENT_BRANCHES = '/general-ledger-accounts/dashboards/top-investment-branches';
export const FETCH_TOP_DEPOSIT_BRANCHES = '/general-ledger-accounts/dashboards/top-deposit-branches';
export const FETCH_TOTAL_INCOME = '/general-ledger-accounts/dashboards/total-income';
export const FETCH_TOTAL_INVESTMENT = '/general-ledger-accounts/dashboards/total-investment';
export const FETCH_TOTAL_DEPOSIT = '/general-ledger-accounts/dashboards/total-deposit';
export const FETCH_TOTAL_EXPENSE = '/general-ledger-accounts/dashboards/total-expense';
export const FETCH_DEPOSIT_DETAIL = '/general-ledger-accounts/dashboards/deposit-details';

// subsidiary ledger 

export const FETCH_SUB_GL="/subsidiary-ledgers";
export const CREATE_SUB_GL="/subsidiary-ledgers";
export const UPDATE_SUB_GL="/subsidiary-ledgers/{subsidiaryLedgerId}";
export const FETCH_SUB_GL_DETAILS="/subsidiary-ledgers/{subsidiaryLedgerId}";
export const FETCH_SUB_GL_CODE_LNGTH="/general-ledger-account-configurations";


