export const FETCH_COUNTRIES="/countries";
export const FETCH_COUNTRY_DETAIL="/countries/{countryId}";
export const CREATE_COUNTRY="/countries";
export const CREATE_DIVISION="/countries/divisions";
export const FETCH_DIVISIONS_BY_COUNTRY="/countries/{countryId}/divisions";
export const FETCH_DISTRICS_BY_COUNTRY="/countries/{countryId}/districts";
export const FETCH_DIVISION_DETAIL="/countries/{countryId}/divisions/{divisionId}";
export const FETCH_DISTRICTS_BY_DIVISION="/countries/{divisionId}/districts";
export const FETCH_DISTRICT_DETAIL="/countries/{countryId}/divisions/{divisionId}/districts/{districtId}";
export const FETCH_UPAZILLAS_BY_DISTRICT="/countries/{districtId}/upazillas";
export const FETCH_UPAZILLA_DETAIL="/countries/{countryId}/divisions/{divisionId}/districts/{districtId}/upazillas/{upazillaId}";
export const FETCH_POSTCODES="/countries/postcodes";
export const FETCH_POSTCODES_BY_UPAZILLA="/countries/{upazillaId}/postcodes";
export const FETCH_POST_CODE_DETAILS = "/countries/{countryId}/postCodes/{postCodeId}";


