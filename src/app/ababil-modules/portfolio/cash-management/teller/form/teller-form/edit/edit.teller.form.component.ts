import {Component,OnInit,OnDestroy} from '@angular/core';
import { TellerSaveEvent } from '../teller.form.component';
import { Teller } from '../../../../../../../services/teller/domain/teller.models';
import { TellerService } from '../../../../../../../services/teller/service-api/teller.service';
import {Router,ActivatedRoute} from '@angular/router';
import {Message} from 'primeng/primeng';
import {Subscriber,Observable, of} from 'rxjs';
import {initialTellerFormData} from '../teller.form.component';
import { NotificationService, NotificationType } from '../../../../../../../common/notification/notification.service';
import * as commandConstants from '../../../../../../../common/constants/app.command.constants';
import { VerifierSelectionEvent } from '../../../../../../../common/components/verifier-selection/verifier.selection.component';
import * as urlSearchParameterConstants from '../../../../../../../common/constants/app.search.parameter.constants';
import * as mapper from '../teller.mapper';
import { FormBaseComponent } from '../../../../../../../common/components/base.form.component';
import { Location } from '@angular/common';
import { ApprovalflowService } from '../../../../../../../services/approvalflow/service-api/approval.flow.service';

export const SUCCESS_MSG:string[] = ["teller.update.success","workflow.task.verify.send"];
export const DETAILS_UI:string = "views/teller?";

@Component({
  selector: 'edit-teller-form',
  templateUrl: './edit.teller.form.component.html',
})
export class EditTellerFormComponent extends FormBaseComponent implements OnInit{


  
constructor(
  private tellerService:TellerService,
  private router: Router,
   private route: ActivatedRoute,
    private notificationService:NotificationService,
    protected location:Location,
    protected approvalFlowService:ApprovalflowService){
      super(location,approvalFlowService);
    }
   

  private msgs: Message[] = [];
  tellerFormData:Observable<Teller>;
  private selectedId:number;
  
  command: string = commandConstants.TELLER_UPDATE_COMMAND;
  

  ngOnInit(){
    this.showVerifierSelectionModal=of(false);

        this.subscribers.routeSub = this.route.params.subscribe(params => {
           this.selectedId = +params['id'];
           this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
            if (queryParams['taskId']) {
              this.taskId = queryParams['taskId'];
              this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                data=>{
                   this.tellerFormData = data;
                }
              ); 
            } else {
              this.fetchTellerDetail(); 
            }
          });  
           
       });
  }

  fetchTellerDetail() {
    this.subscribers.fetchSub = this.tellerService.fetchTellerById({ id: this.selectedId + "" }).subscribe(
      teller => {
        this.tellerFormData = teller;
      }
    );
  }


  onSave(event: TellerSaveEvent): void {
    let teller = mapper.mapTeller(event);
    teller.id=this.selectedId;
    teller.tellerLimits = event.tellerForm.tellerLimits;
    let urlSearchParams = this.getQueryParamMapForApprovalFlow(null,event.verifier,DETAILS_UI,this.location.path().concat("?"));
      this.subscribers.updateSub = this.tellerService.updateTeller({"id":this.selectedId+""},teller,urlSearchParams).subscribe(
      (data) => {
        this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
        this.navigateAway();
      }
    );
  }



  onCancel(): void{
     this.navigateAway();
  }  

  navigateAway() {
    if(this.taskId){
       this.router.navigate(['approval-flow/pendingtasks']); 
    }else{
       this.router.navigate(['../'], { relativeTo: this.route });
    }
    
  }

}