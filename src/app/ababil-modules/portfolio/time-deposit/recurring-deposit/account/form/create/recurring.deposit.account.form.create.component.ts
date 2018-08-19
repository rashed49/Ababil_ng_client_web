import { RecurringDepositAccountService } from './../../../../../../../services/recurring-deposit-account/service-api/recurring.deposit.account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../../../../../../common/components/base.component";
import { RecurringDepositAccount } from './../../../../../../../services/recurring-deposit-account/domain/recurring.deposit.account.model';
import { NotificationService } from './../../../../../../../common/notification/notification.service';
import { Location } from '@angular/common';
import { ApprovalflowService } from '../../../../../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from '../../../../../../../common/components/base.form.component';
import { Observable, of } from 'rxjs';
import { RecurringDepositAccountSaveEvent } from '../recurring.deposit.account.form.component';

export const SUCCESS_MSG: string[] = ["recurring.deposit.account.create.success", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/recurring-deposit-account?";

@Component({
    selector: 'recurring-deposit-account-form-create',
    templateUrl: './recurring.deposit.account.form.create.component.html'
})
export class RecurringDepositAccountFormCreateComponent extends FormBaseComponent implements OnInit {

    recurringDepositAccountFormData: Observable<RecurringDepositAccount>;
    queryParams: any;
    command: string = "CreateRecurringDepositAccountCommand";

    constructor(private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private recurringDepositAccountService: RecurringDepositAccountService,
        protected approvalFlowService: ApprovalflowService,
        protected location: Location
    ) {
      super(location, approvalFlowService);
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal=of(false);

        this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
            this.queryParams = queryParams;
            if (queryParams['taskId']) {
              this.taskId = queryParams['taskId'];
              this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                data=>{
                    this.recurringDepositAccountFormData = new Observable(observer => {
                      let recurringDepositAccount = data;
                      observer.next(recurringDepositAccount);
                    });
                }
              ); 
            } else {
                  this.recurringDepositAccountFormData = new Observable(observer => {
                     let recurringDepositAccount = new RecurringDepositAccount();
                     observer.next(recurringDepositAccount);
                  });
            }
          });
    }

    

    onSave(event: RecurringDepositAccountSaveEvent): void {
        let recurringDepositAccount = event.recurringDepositAccountForm;
        this.subscribers.createRecurringDepositAccountSub = this.recurringDepositAccountService
        .createRecurringDepositAccount(recurringDepositAccount)
        .subscribe(data => {
            this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
            this.navigateAway();
        });
    }

    onCancel(): void {
        this.navigateAway();
    }

    navigateAway() {
        if(this.taskId){
          this.router.navigate(['approval-flow/pendingtasks']); 
        } else{
          this.router.navigate([this.queryParams['cus']], { relativeTo: this.route });
        }    
      }

}