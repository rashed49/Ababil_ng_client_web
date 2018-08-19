//product
export const FETCH_PRODUCTS="/products";
export const FETCH_PRODUCT_DETAILS="/products/{productId}";
export const CREATE_ACCOUNT_NUMBER="/products/{id}/accounts/"; //should be in account endpoints


//profit rate
export const FETCH_PRODUCT_PROFIT_RATES = '/products/{productId}/profit-rates';
export const CREATE_PRODUCT_PROFIT_RATES = '/products/{productId}/profit-rates';
export const FETCH_PRODUCT_PROFIT_RATE = '/products/{productId}/profit-rates/{profitRateId}';
export const UPDATE_PRODUCT_PROFIT_RATE = '/products/{productId}/profit-rates/{profitRateId}';
export const FETCH_PRODUCT_CONFIGURATION = '/products/configuration';

//gl mapping
export const FETCH_PRODUCT_GENERAL_LEDGER_MAPPING = '/products/{id}/general-ledger';
export const CREATE_PRODUCT_GENERAL_LEDGER_MAPPING = '/products/{id}/general-ledger';
export const DELETE_PRODUCT_GENERAL_LEDGER_MAPPING = '/products/{id}/general-ledger/{generalLedgerId}';

//gl
export const FETCH_GENERAL_LEDGER = '/general-ledger-accounts';
export const FETCH_GENERAL_LEDGER_TYPE = '/general-ledger-type';