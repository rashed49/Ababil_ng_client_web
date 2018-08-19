import { Location } from '@angular/common';
import { ApprovalflowService } from './../../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from './../../../../common/components/base.form.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, of } from 'rxjs';
import { GlAccountSaveEvent } from '../gl.account.form.component';
import { GlAccountService } from '../../../../services/glaccount/service-api/gl.account.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as mapper from '../gl.account.mapper';
import { NotificationService } from '../../../../common/notification/notification.service';
import { BaseComponent } from '../../../../common/components/base.component';
import * as commandConstants from '../../../../common/constants/app.command.constants';
import * as urlSearchParameterConstants from '../../../../common/constants/app.search.parameter.constants';
import {GlAccount} from '../../../../services/glaccount/domain/gl.account.model';

export const SUCCESS_MSG:string[] = ["glaccount.update.success","workflow.task.verify.send"];
export const DETAILS_UI:string = "views/gl-account?";

@Component({
  selector: 'gl-account-edit-form',
  templateUrl: './gl.account.form.edit.component.html'
})
export class GlAccountEditFormComponent extends FormBaseComponent implements OnInit{

  glAccountFormData: Observable<GlAccount>;
  private selectedGlAccountId: number;
  command:string;

  constructor(protected location:Location,protected approvalFlowService:ApprovalflowService, private route: ActivatedRoute, private router: Router, private glAccountService: GlAccountService, private notificationService: NotificationService) {
      super(location,approvalFlowService);
  }

  ngOnInit() {
    this.showVerifierSelectionModal=of(false);
    this.command = commandConstants.GL_ACCOUNT_UPDATE_COMMAND;
    this.subscribers.routeSub = this.route.params.subscribe(params => {
    this.selectedGlAccountId = +params['id'];

    this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
        if (queryParams['taskId']) {
          this.taskId = queryParams['taskId'];
          this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
            data=>{
               this.glAccountFormData = data;
            }
          ); 
        } else {
              this.fetchGlAccountDetails();  
        }
      });     
    });
  }

  fetchGlAccountDetails() {
    this.subscribers.fetchSub = this.glAccountService.fetchGlAccountDetails({ id: this.selectedGlAccountId + "" }).subscribe(
      glaccount => {
        this.glAccountFormData = glaccount;
      }
    );
  }

  onSave(event: GlAccountSaveEvent): void {
    let glaccount = mapper.mapGlAccount(event);
    let urlSearchParams = this.getQueryParamMapForApprovalFlow(null,event.verifier,DETAILS_UI,this.location.path().concat("?"));
    this.subscribers.updateSub = this.glAccountService.updateGlAccount({ id: this.selectedGlAccountId }, glaccount,urlSearchParams).subscribe(
      (data) => {
        this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowReuired || !!this.taskId)]);
        this.navigateAway();
      }
    );
  }

  onCancel(): void {
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