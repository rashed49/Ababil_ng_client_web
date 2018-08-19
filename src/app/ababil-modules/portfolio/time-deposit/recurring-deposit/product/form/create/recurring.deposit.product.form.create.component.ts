import { RecurringDepositProductService } from './../../../../../../../services/recurring-deposit-product/service-api/recurring.deposit.product.service';
import { NotificationService } from './../../../../../../../common/notification/notification.service';
import { RecurringDepositProduct } from './../../../../../../../services/recurring-deposit-product/domain/recurring.deposit.product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from './../../../../../../../common/components/base.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as urlSearchParameterConstants from '../../../../../../../common/constants/app.search.parameter.constants';
import { FormBaseComponent } from '../../../../../../../common/components/base.form.component';
import { Location } from '@angular/common';
import { ApprovalflowService } from '../../../../../../../services/approvalflow/service-api/approval.flow.service';
import { Observable, Subscriber, of } from 'rxjs';
import { RecurringDepositProductSaveEvent } from '../recurring.deposit.product.form.component';


export const SUCCESS_MSG: string[] = ["recurring.deposit.product.create.success", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/recurring-deposit-product?";
@Component({
    selector: 'recurring-deposit-product-form-create',
    templateUrl: './recurring.deposit.product.form.create.component.html'
})
export class RecurringDepositProductFormCreateComponent extends FormBaseComponent implements OnInit {

    recurringDepositProductFormData: Observable<RecurringDepositProduct>;

    @ViewChild('recurringDeposit') recurringDeposit: any;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private recurringDepositProductService: RecurringDepositProductService,
        protected location: Location,
        protected approvalFlowService: ApprovalflowService
    ) {
      super(location, approvalFlowService);
    }
command:string = "CreateRecurringDepositProductCommand";
    ngOnInit(): void {

        this.showVerifierSelectionModal=of(false);
        this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
            if (queryParams['taskId']) {
              this.taskId = queryParams['taskId'];
              this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                data=>{
                    this.recurringDepositProductFormData = new Observable(observer => {
                      let recurringDepositProduct = data;
                      observer.next(recurringDepositProduct);
                    });
                }
              ); 
            } else {
                  this.recurringDepositProductFormData = new Observable(observer => {
                     let recurringDepositProduct = new RecurringDepositProduct();
                     observer.next(recurringDepositProduct);
                  });
            }
          });
        // this.recurringDepositProductFormData = new RecurringDepositProduct();
    }

 
    // onSave(recurringDepositProduct: RecurringDepositProduct): void {
    //     this.createRecurringDepositProduct(recurringDepositProduct);
    // }

    // createRecurringDepositProduct(recurringDepositProduct: RecurringDepositProduct) {
    //     let tempRecurringDepositProduct = new RecurringDepositProduct();
    //     tempRecurringDepositProduct = recurringDepositProduct;

    //     this.subscribers.recurringDepositProductCreateSub = this.recurringDepositProductService
    //         .createRecurringDepositProduct(tempRecurringDepositProduct)
    //         .subscribe(data => {
    //             this.notificationService.sendSuccessMsg('recurring.deposit.product.save.success');
    //             this.navigateAway();
    //         });
    // }


    onSave(event: RecurringDepositProductSaveEvent): void {
        let newRecurringDepositProduct = event.recurringDepositProductForm;
        this.subscribers.saveFixedDepositProductSub = this.recurringDepositProductService.createRecurringDepositProduct(newRecurringDepositProduct).subscribe(
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