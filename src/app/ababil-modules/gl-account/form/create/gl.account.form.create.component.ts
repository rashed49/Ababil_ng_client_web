import { ApprovalflowService } from './../../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from './../../../../common/components/base.form.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, of } from 'rxjs';
import { GlAccountSaveEvent } from '../gl.account.form.component';
import { GlAccountService } from '../../../../services/glaccount/service-api/gl.account.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as mapper from '../gl.account.mapper';
import { NotificationService } from '../../../../common/notification/notification.service';
import { Location } from '@angular/common';
import { initialGlAccountFormData } from '../gl.account.form.component';
import { BaseComponent } from '../../../../common/components/base.component';
import * as commandConstants from '../../../../common/constants/app.command.constants';
import * as urlSearchParameterConstants from '../../../../common/constants/app.search.parameter.constants';
import { GlAccount } from '../../../../services/glaccount/domain/gl.account.model';

export const SUCCESS_MSG:string[] = ["glaccount.update.success","workflow.task.verify.send"];
export const DETAILS_UI:string = "views/gl-account?";

@Component({
  selector: 'gl-account-create-form',
  templateUrl: './gl.account.form.create.component.html'
})
export class GlAccountCreateFormComponent extends FormBaseComponent implements OnInit {

  glAccountFormData: Observable<GlAccount>;
  command: string;

  constructor(protected approvalFlowService:ApprovalflowService,protected location: Location, private route: ActivatedRoute, private router: Router, private glAccountService: GlAccountService, private notificationService: NotificationService) {
    super(location,approvalFlowService);
  }

  ngOnInit() {
    this.showVerifierSelectionModal=of(false);
    this.command = commandConstants.GL_ACCOUNT_CREATE_COMMAND;
    this.subscribers.routeSub = this.route.params.subscribe(params => {
      let parentGlId = +params['parentgl'];
      this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
        if (queryParams['taskId']) {
          this.taskId = queryParams['taskId'];
          this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
            data=>{
                this.glAccountFormData = new Observable(observer => {
                  let glAccount = data;
                  glAccount.parentGlId = parentGlId;
                  observer.next(glAccount);
                });
            }
          ); 
        } else {
              this.glAccountFormData = new Observable(observer => {
                 let glAccount = initialGlAccountFormData;
                 //glAccount.parentGlId = parentGlId;
                 observer.next(glAccount);
              });
        }
      });
    });
  }

  onSave(event: GlAccountSaveEvent): void {
    let glaccount = mapper.mapGlAccount(event);
    let urlSearchParams= this.getQueryParamMapForApprovalFlow(null,event.verifier,DETAILS_UI,this.location.path().concat("?"));
    this.subscribers.saveSub = this.glAccountService.createGlAccount(glaccount, urlSearchParams).subscribe(
      (data) => {
        this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowReuired || !!this.taskId)]); 
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
      this.router.navigate(['glaccount']);
    }    
  }

}