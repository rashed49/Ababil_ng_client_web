export class ApprovalflowProfile {
    id?: number;
    code?: string;
    name?: string;
}

export class ApprovalflowTask {
    id?: number;
    name?: string;
    allowDelegateTask?: boolean;
    approverAssignmentRestriction?: string;
    profileId?: string;
    approverRuleDepartmentRestriction?: string;
    approverRuleBranchRestriction?: string;
    approverRuleUserLevelRestriction?: string;
    approverRuleCheckTransactionLimit?: boolean;
    delegateeRuleDepartmentRestriction?: string;
    delegateeRuleBranchRestriction?: string;
    delegateeRuleUserLevelRestriction?: string;
    delegateeRuleCheckTransactionLimit?: boolean;
    branchId?: number;
}
export class User {
    id?: number;
    name?: string;
}

export class PendingTask {
    id?: number;
    activity?: string;
    maker?: string;
    branchId?: string;
    commandIdentifier?: string;
    commandReference?: string;
    summary?: string;
    view?: string;
    status?:string;
}

export class ApprovalflowTaskStatus {
    id?: number;
    status?: string
}

export class ApproverRule {
    id?: number;
    branchRestriction?: ApproverBranchRestriction;
    branchId?: number;
    approverDepartmentRestriction: ApproverDepartmentRestriction;
    departmentId?: number;
    userLevelRestriction?: UserLevelRestriction;
    userLevelId?: number;
    checkTransactionLimit?: boolean;
    taskIndex?: number;

}

export class ApprovalflowProfileListResponse {
    pageSize?: number;
    pageNumber?: number;
    pageCount?: number
    content?: any;
}

export type ApproverBranchRestriction = 'SameBranch' | 'SpecificBranch' | 'AccountOwnerBranch' | 'AnyBranch';
export type ApproverDepartmentRestriction = 'Any' | 'Same' | 'Specific';
export type UserLevelRestriction = 'Any' | 'Higher' | 'Same' | 'Specific';
export type ApproverAssignmentRestriction = 'SPECIFIC_USER' | 'ROLE';
export type ApprovalFlowTaskAction = 'ACCEPT' | "CORRECTION" | "REJECT";

//verfification info
export class VerificationInfo {
    makerCheckerEnabled: boolean;
    approverType: ApproverAssignmentRestriction;
    verifyUsers: string[];
    lastTask: boolean;
}

export class ApprovalFlowTaskCommand {
    action: ApprovalFlowTaskAction;
    comment: string
}
