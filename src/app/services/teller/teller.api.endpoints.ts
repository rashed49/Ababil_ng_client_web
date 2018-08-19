export const FETCH_ALLOCATED_TELLERS = "/cash/teller-allocations";
export const FETCH_TELLER_TRANSACTIONS = "/teller-transactions";
export const CASH_RECIEVE = "/teller-transactions/cash-receive";
export const CASH_WITHDRAW = "/teller-transactions/cash-withdraw";
export const CASH_TRANSFER = "/teller-transactions/cash-transfer";
export const CASH_RECIEVE_DETAILS = "/teller-transactions/cash-receive/{voucherNumber}";
export const CASH_WITHDRAW_DETAILS = "/teller-transactions/cash-withdraw/{voucherNumber}";
export const CASH_TRANSFER_DETAILS = "/teller-transactions/cash-transfer/{voucherNumber}";
export const FETCH_TELLERS = '/tellers';
export const FETCH_TELLER_BY_ID = '/tellers/{id}';
export const CREATE_TELLER = '/tellers';
export const UPDATE_TELLER_BY_ID = '/tellers/{id}';
export const FETCH_DENOMINATIONS = '/denominations';
export const FETCH_DENOMINATION_BY_ID = '/denominations/{id}';
export const FETCH_DENOMINATION_BALANCE_BY_TELLER_ID = '/teller/{tellerId}/denominations';
export const FETCH_DENOMINATION_BALANCE_BY_CURRENCY_CODE = '/teller/{tellerId}/denominations/currency/{currencyCode}';
export const FETCH_DENOMINATION_BALANCE_BY_DENOMINATION_ID = '/teller/{tellerId}/denominations/{denominationId}';
export const FETCH_TELLER_BALANCES_BY_TELLER = '/teller/{tellerId}/balance';
export const FETCH_TELLER_BALANCES_BY_TELLER_AND_CURRENCY_CODE = '/teller/{tellerId}/balance/currency/{currencyCode}';
export const FETCH_GLOBAL_TXN_NUMBER = '/globaltxnno';
export const FETCH_ALLOWED_GL_BY_ACTIVITY_ID = "/activity-allowed-gls";
export const FETCH_ADVICE_NUMBER = "/advice-number";
export const FETCH_DETAIL_BY_ADVICE_NUMBER = "/advice-number/{advice-number}";
export const FETCH_UN_POSTED_TRANSACTIONS = "/teller-transactions/un-posted";
export const POST_UN_POSTED_TRANSACTIONS = "/teller-transactions/{voucherNumber}/commands";
export const FETCH_PENDING_TRANSFER_TRANSACTIONS = "/teller-transactions/cash-transfer/pending";
export const FETCH_TP_VIOLATION_CONFIGURATION = "/transaction-profiles/config/on-violation";
export const DELETE_ALLOCATED_TELLER = "/cash/teller-allocations/{id}";

export const FETCH_USERS_TO_ALLOCATE = "/admin/users" //admin service

//Teller allocation

export const CREATE_TELLER_ALLOCATION = '/cash/teller-allocations';
export const UPDATE_TELLER_ALLOCATION = '/cash/teller-allocations/{id}';
export const DELETE_TELLER_ALLOCATION = '/cash/teller-allocations/{id}';
export const FETCH_TELLER_ALLOCATION_DETAIL = '/cash/teller-allocations/{id}';

// 
export const FETCH_IBTA_TXN_PARTICULARS = '/ibta-transaction-particulars';
export const FETCH_IBTA_TXN_PARTICULARS_BY_ID = '/ibta-transaction-particulars/{id}'
export const FETCH_DENOMINATION_DETAILS = '/denominations/{id}'

//Service Provider
export const CREATE_SERVICE_PROVIDER = "/bill-collections";
export const FETCH_SERVICE_PROVIDERS = "/bill-collections";
export const FETCH_SERVICE_PROVIDER_DETAIL = "/bill-collections/{billCollectionId}"