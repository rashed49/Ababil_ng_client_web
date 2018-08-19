import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, of } from 'rxjs';
import { FixedDepositProductService } from '../../../../../../../services/fixed-deposit-product/service-api/fixed.deposit.product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../../../common/notification/notification.service';
import { Location } from '@angular/common';
import { BaseComponent } from '../../../../../../../common/components/base.component';
import * as commandConstants from '../../../../../../../common/constants/app.command.constants';
import * as urlSearchParameterConstants from '../../../../../../../common/constants/app.search.parameter.constants';
import { FixedDepositProduct } from '../../../../../../../services/fixed-deposit-product/domain/fixed.deposit.product.model';
import { FixedDepositProductSaveEvent, initialFixedDepositProduct } from '../fixed.deposit.product.form.component';
import { FormBaseComponent } from '../../../../../../../common/components/base.form.component';
import { ApprovalflowService } from '../../../../../../../services/approvalflow/service-api/approval.flow.service';


export const SUCCESS_MSG: string[] = ["fixed.deposit.product.create.success", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/fixed-deposit-product?";
@Component({
  templateUrl: './fixed.deposit.product.create.component.html'
})
export class FixedDepositProductFormCreateComponent extends FormBaseComponent implements OnInit {

  //fixedDepositProductFormData: Observable<FixedDepositProduct>;
  command: string = "CreateFixedDepositProductCommand";
  fixedDepositProductFormData: Observable<FixedDepositProduct>;

  constructor(protected location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private fixedDepositProductService: FixedDepositProductService,
    private notificationService: NotificationService,
    protected approvalFlowService: ApprovalflowService
  ) {
    super(location, approvalFlowService);
  }

  ngOnInit() {
    this.showVerifierSelectionModal=of(false);
    this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
        if (queryParams['taskId']) {
          this.taskId = queryParams['taskId'];
          this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
            data=>{
                this.fixedDepositProductFormData = new Observable(observer => {
                  let fixedDepositProduct = data;
                  observer.next(fixedDepositProduct);
                });
            }
          ); 
        } else {
              this.fixedDepositProductFormData = new Observable(observer => {
                 let fixedDepositProduct = initialFixedDepositProduct;
                 observer.next(fixedDepositProduct);
              });
        }
      });
  }

  onSave(event: FixedDepositProductSaveEvent): void {
    let newFixedDepositProduct = event.fixedDepositProductForm;
    this.subscribers.saveFixedDepositProductSub = this.fixedDepositProductService.createFixedDepositProduct(newFixedDepositProduct).subscribe(
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

