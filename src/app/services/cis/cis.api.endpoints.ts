export const SEARCH_CUSTOMER = '/customers';
export const CREATE_CUSTOMER = '/customers';
export const FETCH_CUSTOMER = '/customers/{id}';
export const UPDATE_CUSTOMER = '/customers/{id}';
export const FETCH_SUBJECTS = '/customers/{id}/subjects';
export const CREATE_INDIVIDUAL = '/customers/{id}/subjects';
export const ADD_SUBJECT = '/customers/{id}/subjects';
export const DELETE_SUBJECT = '/customers/{id}/subjects/{subjectId}';
export const FETCH_SUBJECT_DETAILS = '/customers/{id}/subjects/{subjectId}';
export const UPDATE_SUBJECT = '/customers/{id}/subjects/{subjectId}';
export const FETCH_APPLICANT_TYPES = '/customers/subjects/types/';
export const FETCH_APPLICANT_TYPES_BY_CUSID = '/customers/subjects/types/{cusId}';
export const CREATE_ORG_OWNER = '/customers/organizations/{organizationId}/owners';
export const FETCH_ORG_OWNERS = '/customers/organizations/{organizationId}/owners';
export const FETCH_ORG_TYPES = '/organization-types';
export const FETCH_ORG_OWNER_DETAILS = '/customers/organizations/{organizationId}/owners/{id}';
export const UPDATE_ORG_OWNER = '/customers/organizations/{organizationId}/owners/{ownerId}';
export const ACTION_COMMAND = '/customers/{id}/commands';
export const ADD_EXISTING_SUBJECT = '/customers/{id}/subjects/{subjectId}';

export const FETCH_INDIVIDUAL_INFORMATION = '/individuals';
export const CREATE_INDIVIDUAL_INFORMATION = '/individuals';
export const DELETE_INDIVIDUAL_INFORMATION = '/individuals/{id}';
export const FETCH_INDIVIDUAL_INFORMATION_DETAILS = '/individuals/{id}';
export const UPDATE_INDIVIDUAL_INFORMATION = '/individuals/{id}';
export const SEARCH_INDIVIDUAL_INFORMATION = '/individuals';
// export const UPLOAD_INDIVIDUAL_PICTURE = '/individuals/{id}/images/{uuid}';
// export const FETCH_INDIVIDUAL_PICTURE = '/individuals/{id}/images/{uuid}';
export const UPLOAD_INDIVIDUAL_PICTURE = '/individuals/{id}/image';
export const FETCH_INDIVIDUAL_PICTURE = '/individuals/{id}/image';
export const FETCH_ASSIGNABLE_SHARE = "/customers/organizations/{organizationId}/owners/available-percentage";
export const FETCH_OCCUPATIONS = "/occupation-types";
//related to misc services
export const FETCH_CUSTOMER_SOURCE_OF_FUNDS = '/source-of-funds';
export const FETCH_CUSTOMER_TYPE_OF_BUSINESS = '/type-of-businesses';
export const FETCH_CUSTOMER_CLASSIFICATION_TYPES = '/individual-classifications';
export const FETCH_CONFIGURATION = '/cis-configurations/{key}';
export const FETCH_OTHER_INFORMATION_TOPICS = '/other-information-topics'

//fatca

export const FETCH_FATCA_DESCRIPTIONS = '/fatca-descriptions';
export const FETCH_FATCA_ENTITY_TYPES = '/fatca-entity-types';

//owner
export const FETCH_OWNER_TYPES = '/ownertypes';
export const CREATE_OWNER_TYPE = '/ownertypes';
export const UPDATE_OWNER_TYPE = '/ownertypes/{ownerTypeId}';

//organization
export const FETCH_ORGANIZATION_TYPES = '/organization-types';
export const CREATE_ORGANIZATION_TYPES = '/organization-types';
export const UPDATE_ORGANIZATION_TYPES = '/organization-types/{organizationTypeId}'
export const SEARCH_ORGANIZATION_INFORMATION = '/customers/organizations';
export const FETCH_ORGANIZATION_DETAILS = '/customers/organizations/{organizationId}';
export const REMOVE_ORGANIZATION_OWNER = '/customers/organizations/{organizationId}/owners/{ownerId}';

//relationship officer
export const FETCH_RELATIONSHIP_OFFICERS = '/relationship-officers';

