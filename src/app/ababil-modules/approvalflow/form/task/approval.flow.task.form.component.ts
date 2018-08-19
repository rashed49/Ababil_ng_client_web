import { BankService } from './../../../../services/bank/service-api/bank.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';
import { ApprovalflowTask } from '../../../../services/approvalflow/domain/approval.flow.models';
import { Subscriber } from 'rxjs';
import { BaseComponent } from '../../../../common/components/base.component';
import {AssignmentRestrictions,BranchRestrictions,DepartmentRestrictions,UserLevelRestrictions} from '../../../../common/domain/approvalflow.enum.model';

export class TaskFormData {
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
  branchId?:number;

  constructor(){
      this.allowDelegateTask = false;
      this.approverRuleCheckTransactionLimit = false;
      this.approverRuleCheckTransactionLimit = false;
      this.delegateeRuleCheckTransactionLimit = false;  
  }
}

export interface TaskSaveEvent {
  task: ApprovalflowTask;
}

@Component({
  selector: 'approvalflow-task-form',
  templateUrl: './approval.flow.task.form.component.html',
})
export class ApprovalFlowTaskFormComponent extends BaseComponent implements OnInit{

  constructor(private bankService:BankService,private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private workflowService: ApprovalflowService) {
    super();
   }

  taskForm: FormGroup;
  task: ApprovalflowTask;

  assignmentRestrictions: SelectItem[] = AssignmentRestrictions;
  branchRestrictions: SelectItem[] = BranchRestrictions;
  departmentRestrictions: SelectItem[] = DepartmentRestrictions;
  userLevelRestriction: SelectItem[] = UserLevelRestrictions;
  selectedProfileId: number;
  branches:any[];

  @Input('formData') set formData(formData: TaskFormData) {
    this.prepareTaskForm(formData);
  }

  @Input('editMode') editMode: boolean;
  @Input('backRoute') backRoute: string;
  @Output('onSave') onSave = new EventEmitter<TaskSaveEvent>();
  @Output('onCancel') onCancel = new EventEmitter<void>();

  //this part will be changed
  ngOnInit() {
    
    this.fetchBranches();
    this.subscribers.routeSub = this.route.params.subscribe(params => {
      this.selectedProfileId = +params['id'];      
    });
  }

  prepareTaskForm(formData: TaskFormData) {

    formData = (formData == null) ? new TaskFormData():formData;
    this.task = formData;
    this.taskForm = this.formBuilder.group({
      name: [formData.name, [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
      allowDelegateTask: [formData.allowDelegateTask, [Validators.required]],
      approverAssignmentRestriction: [formData.approverAssignmentRestriction, [Validators.required]],
      //approverRuleDepartmentRestriction: [formData.approverRuleDepartmentRestriction, [Validators.required]],
      approverRuleBranchRestriction: [formData.approverRuleBranchRestriction, [Validators.required]],
      approverRuleUserLevelRestriction: [formData.approverRuleUserLevelRestriction, [Validators.required]],
      approverRuleCheckTransactionLimit: [formData.approverRuleCheckTransactionLimit, [Validators.required]],
      // delegateeRuleDepartmentRestriction: [formData.delegateeRuleDepartmentRestriction, [Validators.required]],
      // delegateeRuleBranchRestriction: [formData.delegateeRuleBranchRestriction, [Validators.required]],
      // delegateeRuleCheckTransactionLimit: [formData.delegateeRuleCheckTransactionLimit, [Validators.required]],
      // delegateeRuleUserLevelRestriction: [formData.delegateeRuleUserLevelRestriction, [Validators.required]],
    });

    this.taskForm.controls['approverRuleBranchRestriction'].valueChanges.subscribe(value=>{
        if(value!='SPECIFIC_BRANCH'){
            this.taskForm.removeControl('branchId');
        }else{
           this.taskForm.addControl('branchId',new FormControl(formData.branchId,[Validators.required]));
        }
        this.taskForm.updateValueAndValidity();
    });

    this.initEnterNavigation("approvalflow-task-form");
  }

  formsInvalid(): boolean {
    return (this.taskForm.invalid);
  }

  save() {
    this.markFormGroupAsTouched(this.taskForm);
    if(this.taskForm.invalid) return;
    let task = this.taskForm.value;
    task.id = this.task.id;
    task.profileId = this.selectedProfileId;
    this.onSave.emit({
      task: task
    });
  }

  cancel() {
    this.onCancel.emit();
  }

  navigateAway() {
    this.router.navigate([this.backRoute], { relativeTo: this.route });
  }

  fetchBranches() {
        this.bankService.fetchBranchProfiles({ bankId: 1 }, new Map()).subscribe(
            data => {
                this.branches = [{label:'Select Branch',value:null},...data.map(branch => {
                    return { label: branch.name, value: branch.id }
                })];
            }
        )
  }

}