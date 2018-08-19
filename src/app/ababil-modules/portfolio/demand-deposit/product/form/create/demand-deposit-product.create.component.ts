import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, of } from 'rxjs';
import { DemandDepositProductService } from '../../../../../../services/demand-deposit-product/service-api/demand-deposit-product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../../common/notification/notification.service';
import { Location } from '@angular/common';
import { BaseComponent } from '../../../../../../common/components/base.component';
import * as commandConstants from '../../../../../../common/constants/app.command.constants';
import * as urlSearchParameterConstants from '../../../../../../common/constants/app.search.parameter.constants';
import { DemandDepositProduct } from '../../../../../../services/demand-deposit-product/domain/demand-deposit-product.model';
import { DemandDepositProductSaveEvent } from '../demand-deposit-product.form.component';
import { FormBaseComponent } from '../../../../../../common/components/base.form.component';
import { ApprovalflowService } from '../../../../../../services/approvalflow/service-api/approval.flow.service';

export const SUCCESS_MSG: string[] = ["demand.deposit.product.create.success", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/demand-deposit-product?";

@Component({
  templateUrl: './demand-deposit-product.create.component.html'
})
export class DemandDepositProductCreateFormComponent extends FormBaseComponent implements OnInit {

  demandDepositProductFormData: Observable<DemandDepositProduct>;
  command: string =commandConstants.DEMAND_DEPOSIT_PRODUCT_CREATE_COMMAND;

  constructor(protected location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private demandDepositProductService: DemandDepositProductService,
    private notificationService: NotificationService,
  protected approvalFlowService:ApprovalflowService ) {
    super(location,approvalFlowService);
  }

  ngOnInit() {
    this.showVerifierSelectionModal=of(false);
    this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
        if (queryParams['taskId']) {
          this.taskId = queryParams['taskId'];
          this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
            data=>{
                this.demandDepositProductFormData = new Observable(observer => {
                  let product = data;
                  observer.next(product);
                });
            }
          ); 
        } else {
              this.demandDepositProductFormData = new Observable(observer => {
                 let product = new DemandDepositProduct();
                 observer.next(product);
              });
        }
      });
  }

  onSave(event: DemandDepositProductSaveEvent): void {
    let newDemandDepositProduct = event.demandDepositProductForm;
    this.subscribers.createDemandDepositProductSub = this.demandDepositProductService.createDemandDepositProduct(newDemandDepositProduct, null).subscribe(
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
