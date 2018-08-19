import { Component, OnInit,ViewChild,ElementRef,Renderer2 } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ApprovalflowService } from '../../../services/approvalflow/service-api/approval.flow.service';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from '../../../common/notification/notification.service';
import { ApprovalFlowTaskAction } from '../../../services/approvalflow/domain/approval.flow.models';
import { of,Observable } from 'rxjs';
import { BaseComponent } from '../../../common/components/base.component';
import {VerifierSelectionEvent} from '../../../common/components/verifier-selection/verifier.selection.component';

@Component({
    selector: 'verify-task',
    templateUrl: './verify-task.component.html',
    styleUrls: ['./verify-task.component.scss']
})
export class VerifyTaskComponent extends BaseComponent implements OnInit {

    processId:string;
    command:string;
    commandReference:string;
    showVerifierSelectionModal:Observable<boolean>;   
    @ViewChild('report') container:ElementRef;
    
    constructor(private notificationService:NotificationService,private renderer:Renderer2 ,private formBuilder:FormBuilder,private route: ActivatedRoute,private router:Router, private workflowService:ApprovalflowService) {
        super();            
    }

    ngOnInit() {
        this.container.nativeElement.innerHTML = `<p> Loading... </p>`;
        this.showVerifierSelectionModal=of(false);

        this.subscribers.routeSub = this.route.params.subscribe(params => {
            
            this.processId = params['taskInstanceId'];
            this.command = params['command'];
            this.commandReference = params['commandRef'];
            this.fetchVerificationDetail();//should be done with flatmap
        });
    }
    
    fetchVerificationDetail(){
        this.subscribers.fetchSub=this.workflowService.fetchVerificationDetails({"processId":this.processId+""}).subscribe(
           data=>{
              this.container.nativeElement.innerHTML = data.content;            
           }
        ); 
    }

    submit(){
        this.showVerifierSelectionModal=of(true);
    }

    onVerifierSelect(selectEvent: VerifierSelectionEvent){
       this.verifyTask("ACCEPT",selectEvent.verifier);
    }

    verifyTask(task:ApprovalFlowTaskAction,verifier:string){
       let urlSearchParam = new Map();
       if(verifier!=null) urlSearchParam.set("verifier",verifier);                     
       this.subscribers.submitSub=this.workflowService.
          verifyTask({action:task,comment:null},{processId:this.processId},urlSearchParam)
          .subscribe(data=>{
              this.navigateAway();
              this.notificationService.sendSuccessMsg("workflow.task.verify");
       });
    }

    cancel(){
        this.navigateAway();
    }

    navigateAway(){
        this.router.navigate(['/approval-flow/pendingtasks']);
    }
}
