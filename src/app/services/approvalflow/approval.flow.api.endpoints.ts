//profiles
export const FETCH_APPROVALFLOW_PROFILES="/approvalflows";
export const FETCH_APPROVALFLOW_PROFILE="/approvalflows/{id}";
export const CREATE_APPROVALFLOW_PROFILE="/approvalflows";
export const UPDATE_APPROVALFLOW_PROFILE="/approvalflows/{id}";
export const DELETE_APPROVALFLOW_PROFILE="";

//task
export const FETCH_APPROVALFLOW_TASKS="/approvalflows/{profileId}/tasks";
export const FETCH_APPROVALFLOW_TASK="/approvalflows/{profileId}/tasks/{id}";
export const CREATE_APPROVALFLOW_TASK="/approvalflows/{profileId}/tasks";
export const UPDATE_APPROVALFLOW_TASK="/approvalflows/{profileId}/tasks/{id}";
export const DELETE_APPROVALFLOW_TASK="";

//commands
export const FETCH_APPROVALFLOW_COMMANDS="/approvalflows/{profileId}/commands";
export const UPDATE_APPROVALFLOW_COMMAND_MAPPINGS="/approvalflows/{profileId}/commands";
export const FETCH_PENDING_TASKS = '/approvalflows/tasks';
//verify list
export const FETCH_VERIFICATION_INFO="/approvalflows/verify";

//verification details
export const FETCH_VERIFICATION_DETAILS="/approvalflows/tasks/{processId}";
export const VERIFY_TASK="/approvalflows/tasks/{processId}/command";

export const FETCH_TASK_INSTANCE_PAYLOAD = "/approvalflows/tasks/{id}/payload";
