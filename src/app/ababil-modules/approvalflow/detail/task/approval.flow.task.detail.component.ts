import { BankService } from './../../../../services/bank/service-api/bank.service';
import {Component,OnInit,OnDestroy} from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import {ApprovalflowTask} from '../../../../services/approvalflow/domain/approval.flow.models';
import {ApprovalflowService} from '../../../../services/approvalflow/service-api/approval.flow.service';
import {Subscriber,Observable} from 'rxjs';
import { PathParameters } from '../../../../services/base.service';
import { BaseComponent } from '../../../../common/components/base.component';

@Component({
    selector:'approvalflow-task-detail',
    templateUrl:'./approval.flow.task.detail.component.html'
})
export class ApprovalflowTaskDetailComponent extends BaseComponent implements OnInit{

   private selectedTaskId:number;
   private selectedProfileId:number;
   task:ApprovalflowTask={};
   branchRestrictionMap:Map<string,string> = new Map(); 
   
   approverAssignmentRestrictionMap:Map<string,string> = new Map();
   approverBranchRestrictionMap:Map<string,string> = new Map();
   userLevelRestrictionMap:Map<string,string> = new Map();
   branches:Map<number,string>=new Map();


   constructor(private bankService:BankService,private route: ActivatedRoute, private router: Router, private workflowService:ApprovalflowService) {
       super();
   } 

   ngOnInit():void{
       this.subscribers.routeSub = this.route.params.subscribe(params => {
           this.selectedTaskId = +params['taskid'];
           this.selectedProfileId = +params['id'];   
       });
       this.fetchTaskDetails();
       this.fetchBranches();
       this.approverAssignmentRestrictionMap.set("ROLE","Role");
       this.approverAssignmentRestrictionMap.set("SPECIFIC_USER","Specific User");

       this.approverBranchRestrictionMap.set("SAME_BRANCH","Same Branch");
       this.approverBranchRestrictionMap.set("SPECIFIC_BRANCH","Specific Branch");
       this.approverBranchRestrictionMap.set("ACCOUNT_OWNER_BRANCH","Account Owner Branch");
       this.approverBranchRestrictionMap.set("ANY_BRANCH","Any Branch");

       this.userLevelRestrictionMap.set("ANY","Any");
       this.userLevelRestrictionMap.set("HIGHER","Higher");
       this.userLevelRestrictionMap.set("SAME","Same");
       this.userLevelRestrictionMap.set("SPECIFIC","Specific");
    }

    fetchTaskDetails(){
       this.subscribers.fetchTaskSub=this.workflowService.
       fetchApprovalflowTaskDetail({id:this.selectedTaskId+"",profileId:this.selectedProfileId+""}).subscribe((task)=>{
           this.task=task;
       })
    }

    cancel(){
      this.navigateAway();
    }

    navigateAway(): void{
      this.router.navigate(['../../'], { relativeTo: this.route });
    }

    fetchBranches() {
        this.bankService.fetchBranchProfiles({ bankId: 1 }, new Map()).subscribe(
            data => {
                data.forEach(element => {
                   this.branches.set(element.id,element.name);  
                });
            }
        )
    }

}