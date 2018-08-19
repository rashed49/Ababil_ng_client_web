export const FETCH_ACCOUNT_OPERATOR_INFORMATION = "/accounts/{id}/operator-information";
export const FETCH_ACCOUNT_OPERATOR_INFORMATION_DETAIL = "/accounts/{id}/operator-information/{operatorId}";
export const CREATE_ACCOUNT_OPERATOR_INFORMATION = "/accounts/{id}/operator-information";
export const UPDATE_ACCOUNT_OPERATOR_INFORMATION = "/accounts/{id}/operator-information/{operatorId}";
export const DELETE_ACCOUNT_OPERATOR_INFORMATION = "/accounts/{id}/operator-information/{operatorId}";

export const FETCH_ACCOUNT_OPERATOR_SIGNATORIES = "/accounts/{id}/operator-information/{operatorId}/signatories";
export const FETCH_ACCOUNT_OPERATOR_SIGNATORY_DETAIL = "/accounts/{id}/operator-information/{operatorId}/signatories/{signatoryId}";
export const CREATE_ACCOUNT_OPERATOR_SIGNATORIES = "/accounts/{id}/operator-information/{operatorId}/signatories";
export const UPDATE_ACCOUNT_OPERATOR_SIGNATORY = "/accounts/{id}/operator-information/{operatorId}/signatories/{signatoryId}";
export const DELETE_ACCOUNT_OPERATOR_SIGNATORY = "/accounts/{id}/operator-information/{operatorId}/signatories/{signatoryId}";
export const UPLOAD_ACCOUNT_SIGNATORY_SIGNATURE = "/accounts/{id}/operator-information/{operatorId}/signatories/{individualId}";
export const FETCH_ACCOUNT_SIGNATORY_SIGNATURE = "/accounts/{id}/operator-information/{operatorId}/signatories/{signatoryId}/signature";
export const ADD_ACCOUNT_SIGNATORY_SIGNATURE ="/accounts/{id}/operator-information/{operatorId}/signatories";

