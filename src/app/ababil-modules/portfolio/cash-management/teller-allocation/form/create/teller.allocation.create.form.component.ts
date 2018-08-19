import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/primeng';
import { Subscriber, of } from 'rxjs';
import { NotificationService, NotificationType } from '../../../../../../common/notification/notification.service';
import { BaseComponent } from '../../../../../../common/components/base.component';
import { TellerAllocationSaveEvent, initialTellerAllocationFormData } from '../teller.allocation.form.component';
import { DatePipe } from '@angular/common/src/pipes';
import * as commandConstants from '../../../../../../common/constants/app.command.constants';
import * as urlSearchParameterConstants from '../../../../../../common/constants/app.search.parameter.constants';
import * as mapper from '../teller.allocation.mapper';
import { Observable } from 'rxjs';
import { TellerAllocation } from '../../../../../../services/teller/domain/teller.models';
import { TellerAllocationService } from '../../../../../../services/teller/service-api/teller.allocation.service';
import { FormBaseComponent } from '../../../../../../common/components/base.form.component';
import { ApprovalflowService } from '../../../../../../services/approvalflow/service-api/approval.flow.service';
import { Location } from '@angular/common';


export const SUCCESS_MSG:string[] = ["teller.allocation.create.success","workflow.task.verify.send"];
export const DETAILS_UI:string = "views/teller-allocation?";


@Component({
  selector: 'teller-allocation-create-form',
  templateUrl: './teller.allocation.create.form.component.html',
})
export class TellerAllocationCreateFormComponent extends FormBaseComponent implements OnInit {

  tellerAllocationFormData :Observable<TellerAllocation>;

  command:string = commandConstants.TELLER_ALLOCATION_CREATE_COMMAND;
  

  constructor(
    protected approvalFlowService:ApprovalflowService,
    protected location: Location, 
    private tellerAllocationService: TellerAllocationService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
   ) {
    super(location,approvalFlowService);
  }

  ngOnInit() {
    this.showVerifierSelectionModal=of(false); 
      this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
        if (queryParams['taskId']) {
          this.taskId = queryParams['taskId'];
          this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
            data=>{
                this.tellerAllocationFormData = new Observable(observer => {
                  let tellerAllocation = data;
                  observer.next(tellerAllocation);
                });
            }
          ); 
        } else {
              this.tellerAllocationFormData = new Observable(observer => {
                 let tellerAllocation = initialTellerAllocationFormData;
                 observer.next(tellerAllocation);
              });
        }
      });
   }

   onSave(event: TellerAllocationSaveEvent): void {
    let tellerAllocation = mapper.maptellerAllocation(event);
    let urlSearchParams= this.getQueryParamMapForApprovalFlow(null,event.verifier,DETAILS_UI,this.location.path().concat("?"));
    this.subscribers.saveSub=this.tellerAllocationService.createTellerAllocation(tellerAllocation,urlSearchParams).subscribe(
       (data)=>{
        this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]); 
        this.navigateAway();
       }      
    )
 }

  onCancel(): void {
    this.navigateAway();
  }

  navigateAway() {
    if(this.taskId){
      this.router.navigate(['approval-flow/pendingtasks']); 
    } else{
      this.router.navigate(['../'], { relativeTo: this.route });
    }    
  }

}