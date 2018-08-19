import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from "@angular/core";
import { BaseComponent } from "../../../../common/components/base.component";
import { DemandDepositProductService } from "../../../../services/demand-deposit-product/service-api/demand-deposit-product.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductChequeBookSize } from "../../../../services/demand-deposit-product/domain/product-chequebook-size.model";
import { NotificationService } from '../../../../common/notification/notification.service';
import { ConfirmationService } from "primeng/components/common/confirmationservice";
import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';
import { ViewsBaseComponent } from "../../view.base.component";
import { Location } from '@angular/common';

@Component({
  selector: 'cheque-book-size',
  templateUrl: './cheque.book.size.view.component.html'
})
export class ChequeBookSizeViewComponent extends ViewsBaseComponent implements OnInit {

  chequeBookSizes: any[];
  demandDepositProductId: number;
  totalRecords: number;
  totalPages: number;
  id: number;
  queryParams: any;

  constructor(
    private demadDepositProductService: DemandDepositProductService,
    private route: ActivatedRoute,
    protected notificationService: NotificationService,
    protected router: Router,
    protected location: Location,
    protected workflowService: ApprovalflowService,
    private confirmationService: ConfirmationService) {

        super(location,router, workflowService, notificationService);
  }

  ngOnInit() {
    this.subscribers.querySub = this.route.queryParams
    .subscribe(data => {this.queryParams = data;
      this.demandDepositProductId = +data['productId'];
      this.fetchDemandDepositProductChequeBookSizes();
  });
  }

  fetchDemandDepositProductChequeBookSizes() {
    this.subscribers.fetchsub = this.demadDepositProductService.fetchDemandDepositProductChequeBookSizes({ id: this.demandDepositProductId + '' }).subscribe(
      data => {
        this.chequeBookSizes = data.content;
        this.totalRecords = (data.pageSize * data.pageCount);
        this.totalPages = data.pageCount;
      }
    );
  }

  cancel() {
    this.location.back();
  }
}
