import { Component, OnInit, OnDestroy } from '@angular/core';
import { TellerSaveEvent, initialTellerFormData } from '../teller.form.component';
import { Teller } from '../../../../../../../services/teller/domain/teller.models';
import { TellerService } from '../../../../../../../services/teller/service-api/teller.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/primeng';
import { Observable, Subscriber, of } from 'rxjs';
import { NotificationService, NotificationType } from '../../../../../../../common/notification/notification.service';
import { BaseComponent } from '../../../../../../../common/components/base.component';
import * as commandConstants from '../../../../../../../common/constants/app.command.constants';
import * as mapper from '../teller.mapper';
import * as urlSearchParameterConstants from '../../../../../../../common/constants/app.search.parameter.constants';
import { FormBaseComponent } from '../../../../../../../common/components/base.form.component';
import { ApprovalflowService } from '../../../../../../../services/approvalflow/service-api/approval.flow.service';
import { Location } from '@angular/common';

export const SUCCESS_MSG: string[] = ["teller.create.success", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/teller?";

@Component({
    selector: 'app-create-teller-form',
    templateUrl: './create.teller.form.component.html',
    styleUrls: ['./create.teller.form.component.scss']
})
export class CreateTellerFormComponent extends FormBaseComponent implements OnInit {

    constructor(private tellerService: TellerService,
        private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        protected approvalFlowService: ApprovalflowService,
        protected location: Location) {
        super(location, approvalFlowService);
    }

    tellerFormData: Observable<Teller>;

    //tellerFormData = new Teller();
    command: string = commandConstants.TELLER_CREATE_COMMAND;
    id: number;

    ngOnInit() {
        this.showVerifierSelectionModal=of(false);
        this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
            if (queryParams['taskId']) {
              this.taskId = queryParams['taskId'];
              this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                data=>{
                    this.tellerFormData = new Observable(observer => {
                      let teller = data;
                      observer.next(teller);
                    });
                }
              ); 
            } else {
                  this.tellerFormData = new Observable(observer => {
                     let teller = initialTellerFormData;
                     observer.next(teller);
                  });
            }
          });
    }

    onSave(event: TellerSaveEvent): void {
        let teller = mapper.mapTeller(event);
        teller.id = this.id;
        teller.tellerLimits = event.tellerForm.tellerLimits;
        let urlSearchParams= this.getQueryParamMapForApprovalFlow(null,event.verifier,DETAILS_UI,this.location.path().concat("?"));
        this.subscribers.saveSub = this.tellerService.createTeller(teller, urlSearchParams).subscribe(
            (data) => {
                this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]); 
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
        } else{
          this.router.navigate(['../'], { relativeTo: this.route });
        }    
      }
}
