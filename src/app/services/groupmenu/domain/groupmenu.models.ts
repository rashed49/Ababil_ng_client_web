
export interface GroupMenuProfile{
    id?:number,
    code?:string,
    name?:string, 
 }
 
 export interface GroupmenuTask{
   id?:number;
   name?:string;
   allowDelegateTask?:boolean;
   approverAssignmentRestriction?:string;
   profileId?:string;
   approverRuleDepartmentRestriction?:string;
   approverRuleBranchRestriction?:string;
   approverRuleUserLevelRestriction?:string;
   approverRuleCheckTransactionLimit?:boolean;
   delegateeRuleDepartmentRestriction?:string;
   delegateeRuleBranchRestriction?:string;
   delegateeRuleUserLevelRestriction?:string;
   delegateeRuleCheckTransactionLimit?:boolean;
 }
 
 export interface GroupmenuTaskStatus{
     id?:number,
     status?:string
 }
 
 export interface ApproverRule{
     id?:number,
     branchRestriction?:ApproverBranchRestriction,
     branchId?: number,
     approverDepartmentRestriction:ApproverDepartmentRestriction,
     departmentId?: number,
     userLevelRestriction?: UserLevelRestriction,
     userLevelId?: number,
     checkTransactionLimit?: boolean,
     taskIndex?: number,
 
 }
 
 export interface GroupmenuProfileListResponse{
     pageSize?:number,
     pageNumber?:number,
     pageCount?:number
     content?:any,
 }
 
 export type ApproverBranchRestriction = 'SameBranch' | 'SpecificBranch' | 'AccountOwnerBranch' | 'AnyBranch';
 export type ApproverDepartmentRestriction = 'Any' | 'Same' | 'Specific';
 export type UserLevelRestriction = 'Any' | 'Higher' | 'Same' | 'Specific';
 export type ApproverAssignmentRestriction = 'SpecificUser' | 'Role';
 