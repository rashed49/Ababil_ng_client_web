import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup } from '@angular/forms';
import { NotificationService } from '../../../../common/notification/notification.service';
import { Product } from '../../../../services/product/domain/product.models';
import { ProductService } from '../../../../services/product/service-api/product.service';
import { map } from 'rxjs/operators';
import { GlAccount } from "../../../../services/glaccount/domain/gl.account.model";
import { GeneralLedgerType } from "../../../../services/demand-deposit-product/domain/general-ledger-type.model";
import { ProductGeneralLedgerAssignmentService } from "../../../../services/product-general-ledger-assignment/service-api/product-general-ledger-assignment.service";
import { ProductGeneralLedgerMapping } from "../../../../services/product-general-ledger-assignment/domain/product-general-ledger-assignment.model";
import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';
import { ViewsBaseComponent } from "../../view.base.component";
import { Location } from '@angular/common';


@Component({
  templateUrl: './general.ledger.mapping.view.component.html'
})
export class GeneralLedgerMappingViewComponent extends ViewsBaseComponent implements OnInit {

  queryParams: any;
  productId: number;
  product: Product = new Product();
  productGeneralLedgerMappingForm: FormGroup;
  productGeneralLedgerMappingDialogForm: FormGroup;
  generalLedgerAccount: GlAccount[] = [];
  generalLedgerType: GeneralLedgerType[] = [];
  productGeneralLedgerMapping: ProductGeneralLedgerMapping[];
  editDialog: boolean = false;
  generalLedgerId: number;
  enableCreateButton: boolean = false;
  formData: ProductGeneralLedgerMapping = new ProductGeneralLedgerMapping();

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    protected notificationService: NotificationService,
    protected router: Router,
    protected location: Location,
    protected workflowService: ApprovalflowService,
    private productGeneralLedgerAssignmentService: ProductGeneralLedgerAssignmentService) { super(location, router, workflowService, notificationService); }

  ngOnInit() {

    this.subscribers.routeSub = this.route.params.subscribe(params => {
      // this.productId = +params['id'];
      // this.fetchProductDetails();
      // this.fetchProductGeneralLedgerMapping();
      // this.fetchProductGeneralLedgerAccount();
      // this.fetchProductGeneralLedgerAccountType();
    });

    this.subscribers.querySub = this.route.queryParams
      .subscribe(data => {
      this.queryParams = data;
        this.productId = +data['productId'];
        this.fetchProductDetails();
        this.fetchProductGeneralLedgerMapping();
        this.fetchProductGeneralLedgerAccount();
        // this.fetchProductGeneralLedgerAccountType();
      });
  }

  fetchProductGeneralLedgerMapping() {
    this.subscribers.fetchProductGeneralLedgerMappingSub = this.productGeneralLedgerAssignmentService
      .fetchProductGeneralLedgerMapping({ productId: this.productId + "" })
      .subscribe(data => this.productGeneralLedgerMapping = data.content);
  }

  fetchProductGeneralLedgerAccount() {
    this.subscribers.fetchGeneralLedgerSub = this.productService
      .fetchGeneralLedger()
      .subscribe(data => this.generalLedgerAccount = data);
  }

  fetchProductGeneralLedgerAccountType() {
    let urlSearchParam = new Map();
    if (this.product.type != undefined) urlSearchParam.set('product-type', this.product.type);
    this.subscribers.fetchGeneralLedgerTypeSub = this.productService
      .fetchGeneralLedgerType(urlSearchParam)
      .subscribe(data => this.generalLedgerType = data);
  }

  fetchProductDetails() {
    this.subscribers.fetchDemandDepositProductDetailsSub = this.productService
      .fetchProductDetails({ id: this.productId + '' })
      .pipe(map(data => {
        this.product = data;
        this.fetchProductGeneralLedgerAccountType();
      })).subscribe();
  }


  // refresh() {
  //   this.fetchProductGeneralLedgerMapping();
  //   this.productGeneralLedgerMappingForm.reset();
  // }

  cancel() {
    this.location.back();
  }

  navigateAway() {
    if (this.queryParams.product !== undefined) {
      this.router.navigate([this.queryParams.product]);
    }
  }

}
