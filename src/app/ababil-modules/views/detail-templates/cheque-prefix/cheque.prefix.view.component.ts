import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from "@angular/core";
import { BaseComponent } from "../../../../common/components/base.component";
import { ProductChequePrefix } from "../../../../services/demand-deposit-product/domain/product-cheque-prefix.model";
import { DemandDepositProductService } from "../../../../services/demand-deposit-product/service-api/demand-deposit-product.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductChequeBookSize } from "../../../../services/demand-deposit-product/domain/product-chequebook-size.model";
import { NotificationService } from '../../../../common/notification/notification.service';
import { ConfirmationService } from "primeng/components/common/confirmationservice";
import { ViewsBaseComponent } from "../../view.base.component";
import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';
import { Location } from '@angular/common';


@Component({
    selector: 'cheque-prefix-view',
    templateUrl: './cheque.prefix.view.component.html'
})
export class ChequePrefixViewComponent extends ViewsBaseComponent implements OnInit {

    chequePrefixes: any[];
    demandDepositProductId: number;
    totalRecords: number;
    totalPages: number;
    queryParams: any;
    id: number;


    constructor(
        private demadDepositProductService: DemandDepositProductService,
        private route: ActivatedRoute,
        protected notificationService: NotificationService,
        protected router: Router,
        private formBuilder: FormBuilder,
        protected location: Location,
        protected workflowService: ApprovalflowService,
        private conformationService: ConfirmationService) {
            super(location,router, workflowService, notificationService);
    }

    ngOnInit() {
      
        this.subscribers.querySub = this.route.queryParams
        .subscribe(data => {this.queryParams = data;
          this.demandDepositProductId = +data['productId'];
          this.fetchDemandDepositProductChequePrefixes();
      });
    }

    fetchDemandDepositProductChequePrefixes() {
        this.subscribers.fetchsub = this.demadDepositProductService.fetchDemandDepositProductChequePrefixes({ id: this.demandDepositProductId + '' }).subscribe(
            data => {
                this.chequePrefixes = data.content;
                this.totalRecords = (data.pageSize * data.pageCount);
                this.totalPages = data.pageCount;
            }
        );
    }

    cancel() {
        this.location.back();
      }
}
