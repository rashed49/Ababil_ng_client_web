import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChequeBookSaveEvent } from '../cheque.form.component';
import { ChequeBook } from '../../../../../../../../services/cheque/domain/cheque.models';
import { ChequeService } from '../../../../../../../../services/cheque/service-api/cheque.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as mapper from '../cheque.mapper';
import { initialChequeBookFormData } from '../cheque.form.component';
import { FormBaseComponent } from './../../../../../../../../common/components/base.form.component';
import { Location } from '@angular/common';
import { Message } from 'primeng/primeng';
import { Observable, Subscriber, of } from 'rxjs';
import { NotificationService, NotificationType } from '../../../../../../../../common/notification/notification.service';
import { BaseComponent } from '../../../../../../../../common/components/base.component';
import * as commandConstants from '../../../../../../../../common/constants/app.command.constants';
import * as urlSearchParameterConstants from '../../../../../../../../common/constants/app.search.parameter.constants';
import { ApprovalflowService } from './../../../../../../../../services/approvalflow/service-api/approval.flow.service';

export const DETAILS_UI:string = "views/cheque-book?";

@Component({
    selector: 'app-create-cheque-form',
    templateUrl: './create.cheque.form.component.html'
})
export class CreateChequeBookFormComponent extends FormBaseComponent implements OnInit {

    chequeBookFormData: Observable<ChequeBook>;
    selectedAccountId: number;
    accountId: number;
    command: string;

    constructor(private chequeService: ChequeService,
        private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        protected approvalFlowService:ApprovalflowService,protected location: Location, ) {

            super(location,approvalFlowService);

    }

    // chequeBookFormData = {id: null, accountId: null, chequePrefix: '', startLeafNumber: '', endLeafNumber: '', chequeBookStatus: ''};


    ngOnInit() {
        this.showVerifierSelectionModal=of(false);
        this.command = commandConstants.CHEQUE_BOOK_CREATE_COMMAND;

        this.subscribers.routeSub = this.route.params.subscribe(params => {  
            this.selectedAccountId = +params['id'];
            this.accountId = +params['id'];
            // console.log(this.accountId);

            this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
                if (queryParams['taskId']) {
                  this.taskId = queryParams['taskId'];
                  console.log(this.taskId);
                  this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                    data=>{
                        console.log(data);
                        this.chequeBookFormData = new Observable(observer => {
                          let chequeBook = data;
                          chequeBook.accountId = this.accountId ;
                          observer.next(chequeBook);
                        });
                    }
                  ); 
                } else {
                    console.log("no task id");
                      this.chequeBookFormData = new Observable(observer => {
                         let chequeBook = initialChequeBookFormData;
                         chequeBook.accountId = this.accountId;
                         observer.next(chequeBook);
                      });
                }
              });
        });

    }

    onSave(event: ChequeBookSaveEvent): void {
        let chequeBook = mapper.mapChequeBook(event);
        let urlSearchParams= this.getQueryParamMapForApprovalFlow(null,event.verifier,DETAILS_UI,this.location.path().concat("&"));
        this.subscribers.saveSub = this.chequeService.createChequeBook(chequeBook, { "accountId": this.accountId }, urlSearchParams).subscribe(
            (data) => {
                if(event.approvalFlowReuired){
                    this.notificationService.sendSuccessMsg("workflow.task.verify.send"); 
                }else{
                    this.notificationService.sendSuccessMsg("cheque.book.create.success"); 

                }
              this.navigateAway();
            }
          )
    }

    onCancel(): void {
        this.navigateAway();
    }

    navigateAway(): void {
        if(this.taskId){
            this.router.navigate(['approval-flow/pendingtasks']); 
          } else{
        this.router.navigate(['../'], { relativeTo: this.route, queryParamsHandling: "merge" });
    }

}

}
