import { Location } from '@angular/common';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApprovalflowService } from './../../../../services/approvalflow/service-api/approval.flow.service';
import { ViewsBaseComponent } from './../../view.base.component';
import { DemandDepositProduct } from '../../../../services/demand-deposit-product/domain/demand-deposit-product.model';
import { DemandDepositProductService } from '../../../../services/demand-deposit-product/service-api/demand-deposit-product.service';
import { NotificationService } from './../../../../common/notification/notification.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'demand-deposit-product-view',
  templateUrl: './demand.deposit.product.view.component.html'
})
export class DemandDepositProductViewComponent extends ViewsBaseComponent implements OnInit {

  demandDepositProductId: number;
  totalRecords: number;

  demandDepositProductDetails: DemandDepositProduct = new DemandDepositProduct();
  demandDepositProductEligibility: string;
  currencyRestriction: string;
  savingsProfitApplyFrequency: string;
  savingsDailyProductCalculationBasedOn: string;

  queryParams: any = {};

  constructor(
    private route: ActivatedRoute,
    protected router: Router,
    protected location: Location,
    protected notificationService: NotificationService,
    private demandDepositProductService: DemandDepositProductService,
    protected approvalflowService: ApprovalflowService) {
    super(location, router, approvalflowService, notificationService);
  }

  ngOnInit() {
    this.showVerifierSelectionModal = of(false);
    // this.subscribers.routeSub = this.route.queryParams.subscribe(params => {
    //     this.demandDepositProductId = +params['id'];
    //     this.command = params['command'];
    //     this.processId = params['taskId'];
    //     this.fetchDemandDepositProductDetails();
    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
      this.command = this.queryParams.command;
      this.taskId = this.queryParams.taskId;
      this.processId = this.queryParams.taskId;
      this.demandDepositProductId = this.queryParams.demandDepositProductId;
      if ((this.queryParams.inactive) && (this.queryParams.command === "ActivateDemandDepositProductCommand")) {
        this.fetchDemandDepositProductDetails();
      } else {
        this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
          .subscribe(data => {
            this.demandDepositProductDetails = data;
            this.demandDepositProductEligibility = (this.demandDepositProductDetails.eligibleCustomerType) ? (this.demandDepositProductDetails.eligibleCustomerType.join(' , ').replace('_', ' ').replace('_', ' ')) : null;
            this.currencyRestriction = (this.demandDepositProductDetails.currencyRestriction) ? (this.demandDepositProductDetails.currencyRestriction.replace('_', ' ').replace('_', ' ')) : null;
            this.savingsProfitApplyFrequency = (this.demandDepositProductDetails.savingsProfitApplyFrequency) ? (this.demandDepositProductDetails.savingsProfitApplyFrequency.replace('_', ' ').replace('_', ' ')) : null;
            this.savingsDailyProductCalculationBasedOn = (this.demandDepositProductDetails.savingsDailyProductCalculationBasedOn) ? (this.demandDepositProductDetails.savingsDailyProductCalculationBasedOn.replace('_', ' ').replace('_', ' ').replace('_', ' ')) : null;
          });
      }
    });

  }

  fetchDemandDepositProductDetails() {
    this.subscribers.fetchSub = this.demandDepositProductService
      .fetchDemandDepositProductDetails({ id: this.demandDepositProductId + '' })
      .pipe(map(demandDepositProduct => {
        this.demandDepositProductDetails = demandDepositProduct;
        this.demandDepositProductEligibility = (this.demandDepositProductDetails.eligibleCustomerType) ? (this.demandDepositProductDetails.eligibleCustomerType.join(' , ').replace('_', ' ').replace('_', ' ')) : null;
        this.currencyRestriction = (this.demandDepositProductDetails.currencyRestriction) ? (this.demandDepositProductDetails.currencyRestriction.replace('_', ' ').replace('_', ' ')) : null;
        this.savingsProfitApplyFrequency = (this.demandDepositProductDetails.savingsProfitApplyFrequency) ? (this.demandDepositProductDetails.savingsProfitApplyFrequency.replace('_', ' ').replace('_', ' ')) : null;
        this.savingsDailyProductCalculationBasedOn = (this.demandDepositProductDetails.savingsDailyProductCalculationBasedOn) ? (this.demandDepositProductDetails.savingsDailyProductCalculationBasedOn.replace('_', ' ').replace('_', ' ').replace('_', ' ')) : null;
      })).subscribe();

  }
  cancel() {
    this.location.back();
  }

  goToProfitRate() {
    this.router.navigate(['profit-rate/'], {
      relativeTo: this.route,
      queryParams: {
        productId: this.demandDepositProductId,
        routeBack: this.currentPath(this.location),
        cus: this.queryParams.cus
      }
    });
  }

  goToProductGeneralLedgerMapping() {
    this.router.navigate(['general-ledger-mapping/'], {
      relativeTo: this.route,
      queryParams: {
        productId: this.demandDepositProductId,
        routeBack: this.currentPath(this.location),
        cus: this.queryParams.cus
      }
    });
  }

  goToChequePrefix() {
    this.router.navigate(['cheque-prefix/'], {
      relativeTo: this.route,
      queryParams: {
        productId: this.demandDepositProductId,
        routeBack: this.currentPath(this.location),
        cus: this.queryParams.cus
      }
    });
  }

  goToChequeBookSize() {
    this.router.navigate(['cheque-book-size/'], {
      relativeTo: this.route,
      queryParams: {
        productId: this.demandDepositProductId,
        routeBack: this.currentPath(this.location),
        cus: this.queryParams.cus
      }
    });
  }

}