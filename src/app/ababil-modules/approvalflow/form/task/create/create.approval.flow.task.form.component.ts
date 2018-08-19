import {Component,OnInit,OnDestroy} from '@angular/core';
import {TaskFormData} from '../approval.flow.task.form.component';
import {ActivatedRoute,Router} from '@angular/router';
import {ApprovalflowService} from '../../../../../services/approvalflow/service-api/approval.flow.service';
import {TaskSaveEvent } from '../approval.flow.task.form.component';
import {Subscriber,Observable} from 'rxjs';
import {NotificationService,NotificationType} from '../../../../../common/notification/notification.service';
import {BaseComponent} from '../../../../../common/components/base.component';

@Component({
  selector: 'create-approvalflow-task-form',
  templateUrl: './create.approval.flow.task.form.component.html',
})
export class CreateApprovalFlowTaskFormComponent extends BaseComponent implements OnInit{

   taskFormData:Observable<TaskFormData>;

   constructor(private route: ActivatedRoute,private router:Router, private workFlowService:ApprovalflowService,private notificationService:NotificationService) {
      super();
   }
    
   ngOnInit(){
      
   }

   onSave(event: TaskSaveEvent): void {
      this.subscribers.saveSub=this.workFlowService.createApprovalflowTask(event.task,{"profileId":event.task.profileId}).subscribe(
         (data)=>{
            this.notificationService.sendSuccessMsg("workflow.task.save.success");
            this.navigateAway();
         }      
       )
   }

   onCancel(): void{
      this.navigateAway();
   }

   navigateAway(){
     this.router.navigate(['../../'],{ relativeTo: this.route })
   }

   ngOnDestroy(){
      for (let subscriberKey in this.subscribers) {
          let subscriber = this.subscribers[subscriberKey];
          if (subscriber instanceof Subscriber) {
            subscriber.unsubscribe();
          }
       }
   }

}