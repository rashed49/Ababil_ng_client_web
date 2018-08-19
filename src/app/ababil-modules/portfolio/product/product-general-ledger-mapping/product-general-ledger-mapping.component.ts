import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../../../common/components/base.component";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../../common/notification/notification.service';
import { Product } from '../../../../services/product/domain/product.models';
import { ProductService } from '../../../../services/product/service-api/product.service';
import { map }from 'rxjs/operators';
import { GlAccount } from "../../../../services/glaccount/domain/gl.account.model";
import { GeneralLedgerType } from "../../../../services/demand-deposit-product/domain/general-ledger-type.model";
import { ProductGeneralLedgerAssignmentService } from "../../../../services/product-general-ledger-assignment/service-api/product-general-ledger-assignment.service";
import { ProductGeneralLedgerMapping } from "../../../../services/product-general-ledger-assignment/domain/product-general-ledger-assignment.model";
import { ConfirmationService } from "primeng/components/common/confirmationservice";
import { GlAccountService } from "../../../../services/glaccount/service-api/gl.account.service";

@Component({
  selector: 'product-general-ledger-mapping',
  templateUrl: './product-general-ledger-mapping.component.html'
})
export class ProductGeneralLedgerMappingComponent extends BaseComponent implements OnInit {

  queryParams: any;
  productId: number;
  product: Product = new Product();
  productGeneralLedgerMappingForm: FormGroup;
  generalLedgerAccount: GlAccount[] = [];
  generalLedgerTypes: GeneralLedgerType[] = [];
  productGeneralLedgerMapping: ProductGeneralLedgerMapping[];
  editDialog: boolean = false;
  generalLedgerId: number;
  enableCreateButton: boolean = false;
  formData: ProductGeneralLedgerMapping = new ProductGeneralLedgerMapping();
  glAccountLookUpMode: string = 'GL_ACCOUNT';
  glAccountLookUpDisplay: boolean = false;
  glAccountTypeIdSet = new Set([]);

  constructor(private productService: ProductService,
    private route: ActivatedRoute, private router: Router,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private productGeneralLedgerAssignmentService: ProductGeneralLedgerAssignmentService,
    private generalLedgerAccountService: GlAccountService) {
    super();
  }

  ngOnInit() {
    this.prepareProductGeneralLedgerMappingForm(this.formData);

    this.subscribers.routeSub = this.route.params.subscribe(params => {
      this.productId = +params['id'];
      this.fetchProductDetails();
      this.fetchProductGeneralLedgerMapping();
    });

    this.subscribers.querySub = this.route.queryParams
      .subscribe(query => this.queryParams = query);
  }

  fetchProductGeneralLedgerMapping() {

    this.subscribers.fetchProductGeneralLedgerMappingSub = this.productGeneralLedgerAssignmentService
      .fetchProductGeneralLedgerMapping({ productId: this.productId + "" })
      .subscribe(data => {
        this.productGeneralLedgerMapping = data.content;
        data.content.forEach(element => {
          this.glAccountTypeIdSet.add(element.generalLedgerTypeId);
        });
      });
  }

  fetchProductGeneralLedgerAccount() {
    this.subscribers.fetchGeneralLedgerSub = this.productService
      .fetchGeneralLedger()
      .subscribe(data => this.generalLedgerAccount = data);
  }
  generalLedgerTypesThatAreNotAdded: any;
  fetchProductGeneralLedgerAccountType() {
    let urlserchParam = new Map();
    if (this.product.type != undefined) urlserchParam.set('product-type', this.product.type);
    this.subscribers.fetchGeneralLedgerTypeSub = this.productService
      .fetchGeneralLedgerType(urlserchParam)
      .subscribe(data => {
        this.generalLedgerTypes = data.filter(one => !this.glAccountTypeIdSet.has(one.id));
        this.generalLedgerTypesThatAreNotAdded = data.filter(one => !this.glAccountTypeIdSet.has(one.id));
      });
  }

  fetchProductDetails() {
    this.subscribers.fetchDemandDepositProductDetailsSub = this.productService
      .fetchProductDetails({ id: this.productId + '' })
      .pipe(map(data => {
        this.product = data;
        this.fetchProductGeneralLedgerAccountType();
      })).subscribe();
  }

  createProductGeneralLedgerMapping(): void {
    const productGeneralLedgerMapping: ProductGeneralLedgerMapping = this.productGeneralLedgerMappingForm.value;
    productGeneralLedgerMapping.productId = this.productId;
    productGeneralLedgerMapping.generalLedgerId = this.generalLedgerId;
    this.glAccountTypeIdSet.add(this.productGeneralLedgerMappingForm.get('generalLedgerTypeId').value);
    this.subscribers.createProductGeneralLedgerMappingSub = this.productGeneralLedgerAssignmentService
      .createProductGeneralLedgerMapping(productGeneralLedgerMapping, { 'productId': this.productId + "" })
      .subscribe(data => {
        this.notificationService.sendSuccessMsg('product.general.ledger.mapping.create.success');
        this.refresh();
        this.fetchProductGeneralLedgerAccountType();
      });
  }

  productFormInvalid() {
    return this.productGeneralLedgerMappingForm.invalid;
  }
  selectedGeneralLedgerType: string;
  prepareProductGeneralLedgerMappingForm(formData: ProductGeneralLedgerMapping) {
    this.productGeneralLedgerMappingForm = this.formBuilder.group({
      generalLedgerName: [formData.generalLedgerName, Validators.required],
      generalLedgerCode: [formData.generalLedgerCode, Validators.required],
      generalLedgerTypeId: [formData.generalLedgerTypeId, Validators.required],
      productId: [formData.productId],
      id: [formData.id]
    });

    this.productGeneralLedgerMappingForm.get('generalLedgerTypeId').valueChanges.subscribe(
      value => {
        if (value) {
          this.selectedGeneralLedgerType = this.generalLedgerTypesThatAreNotAdded.filter(glType => glType.id === this.productGeneralLedgerMappingForm.get('generalLedgerTypeId').value)[0].generalLedgerHeadType;
        }
      }
    );

  }

  delete(generalLedgerId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this mapping?',
      accept: () => this.deleteProductGeneralLedgerMapping(generalLedgerId)
    });
  }

  deleteProductGeneralLedgerMapping(generalLedgerId) {
    this.glAccountTypeIdSet.clear();
    this.subscribers.deleteProductGeneralLedgerMappingSub = this.productGeneralLedgerAssignmentService
      .deleteProductGeneralLedgerMapping({ "productId": this.productId, "generalLedgerId": generalLedgerId })
      .subscribe(data => {
        this.notificationService.sendSuccessMsg("product.general.ledger.mapping.delete.success");

        this.refresh();

      });
  }

  refresh() {
    this.fetchProductGeneralLedgerMapping();
    this.fetchProductGeneralLedgerAccountType();
    this.productGeneralLedgerMappingForm.reset();
  }

  cancel() {
    this.navigateAway();
  }

  navigateAway() {
    if (this.queryParams.product !== undefined) {
      this.router.navigate([this.queryParams.product], {
        relativeTo: this.route,
        queryParams: {
          taskId: this.queryParams.taskId,
          command: this.queryParams.command,
          commandReference: this.queryParams.commandReference
        }
      });
    }
  }

  searchGlAccount() {
    this.glAccountLookUpDisplay = true;
  }

  onEnter(value: String) {
    let glCode = value;
    console.log(glCode);
    let urlserchParam = new Map();
    urlserchParam.set('code', glCode);
    urlserchParam.set('asPage', false);
    this.subscribers.gLSub = this.generalLedgerAccountService.fetchGlAccounts(urlserchParam).subscribe(
      (data) => {
        if (data.length > 0) {
          let gl = data[0];
          if (gl.accountNature === this.selectedGeneralLedgerType) {
            this.generalLedgerId = gl.id;
            this.productGeneralLedgerMappingForm.get('generalLedgerName').setValue(gl.name);
            this.productGeneralLedgerMappingForm.get('generalLedgerCode').setValue(gl.code);
          } else {
            this.productGeneralLedgerMappingForm.get('generalLedgerCode').setErrors({ 'misMatchGLHeadType': true });
          }

        }
        else {
          this.productGeneralLedgerMappingForm.get('generalLedgerCode').setErrors({ 'invalidCode': true });
        }
      });
  }

  onSearchResult(event) {
    let gl = event.data;
    if (gl.accountNature === this.selectedGeneralLedgerType) {
      this.generalLedgerId = gl.id;
      this.productGeneralLedgerMappingForm.get('generalLedgerName').setValue(gl.name);
      this.productGeneralLedgerMappingForm.get('generalLedgerCode').setValue(gl.code);
    } else {
      this.productGeneralLedgerMappingForm.get('generalLedgerName').setErrors({ 'misMatchGLHeadType': true });
    }
  }

  onSearchModalClose(event) {
    this.glAccountLookUpDisplay = false;
  }

}
