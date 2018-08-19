import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from "@angular/core";
import { BaseComponent } from "../../../../../common/components/base.component";
import { DemandDepositProductService } from "../../../../../services/demand-deposit-product/service-api/demand-deposit-product.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductChequeBookSize } from "../../../../../services/demand-deposit-product/domain/product-chequebook-size.model";
import { NotificationService } from '../../../../../common/notification/notification.service';
import { ConfirmationService } from "primeng/components/common/confirmationservice";


export const initialChequeBookSizeSaveFormData: ProductChequeBookSize = new ProductChequeBookSize();

export interface ChequeBookSizeSaveEvent {
  chequeBookSizeForm: ProductChequeBookSize;
  verifier: string;
}

@Component({
  selector: 'cheque-book-size',
  templateUrl: './cheque-book-size.component.html'
})
export class ChequeBookSizeComponent extends BaseComponent implements OnInit {

  chequeBookSizes: any[];
  demandDepositProductId: number;
  totalRecords: number;
  totalPages: number;
  chequeBookSizeForm: FormGroup;
  id: number;


  @Input('formData') set formData(formData: ProductChequeBookSize) {
    this.prepareChequeBookSizeForm(formData);
  }
  @Input('editMode') editMode: boolean;

  @Input('command') command: string;

  @Output('onSave') onSaved = new EventEmitter<ChequeBookSizeSaveEvent>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(
    private demadDepositProductService: DemandDepositProductService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService) {

    super();
  }

  ngOnInit() {
    this.subscribers.routeSub = this.route.params.subscribe(params => {
      this.demandDepositProductId = +params['id'];
      console.log('Demand Deposit Product Id:' + this.demandDepositProductId);
      this.fetchDemandDepositProductChequeBookSizes();
      this.formData = initialChequeBookSizeSaveFormData;
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

  onRowSelect(event) {
    // this.router.navigate(['detail', event.data.id], { relativeTo: this.route });
  }

  create(): void {
    const chequeBookSizes: ProductChequeBookSize = this.chequeBookSizeForm.value;
    chequeBookSizes.demandDepositProductId = this.demandDepositProductId;
    this.subscribers.saveSub = this.demadDepositProductService.addDemandDepositProductChequeBookSizes(chequeBookSizes, { 'id': this.demandDepositProductId + '' }).subscribe(
      (data) => {
        this.notificationService.sendSuccessMsg("cheque.book.size.save.success");
        this.fetchDemandDepositProductChequeBookSizes();
      }
    );

  }

  emitSaveEvent() {
    const chequeBookSizes: ProductChequeBookSize = this.chequeBookSizeForm.value;
    chequeBookSizes.demandDepositProductId = this.demandDepositProductId;
    this.onSaved.emit({
      chequeBookSizeForm: this.chequeBookSizeForm.value,
      verifier: ''
    });
  }

  demandDepositProductFormInvalid() {
    return this.chequeBookSizeForm.invalid;
  }

  prepareChequeBookSizeForm(formData: ProductChequeBookSize) {
    if (formData == null) { formData = initialChequeBookSizeSaveFormData; }
    this.id = formData.id;
    this.chequeBookSizeForm = this.formBuilder.group({
      bookSize: [formData.bookSize]
    });
  }

  cancel() {
    this.navigateAway();
  }

  navigateAway() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }




  deleteCheckBookSize(chequeBookSize: ProductChequeBookSize) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this Cheque Book Size?',
      accept: () => {
        this.deleteDemandDepositProductChequeBookSizes(chequeBookSize);
      }
    });
  }

  deleteDemandDepositProductChequeBookSizes(chequeBookSize: ProductChequeBookSize) {
    this.subscribers.deleteCheckBookSize = this.demadDepositProductService
      .deleteDemandDepositProductChequeBookSizes({ id: this.demandDepositProductId, chequeBookSizeId: chequeBookSize.id })
      .subscribe((data) => {
        this.notificationService.sendSuccessMsg("chequebookSize.delete.success");
        this.fetchDemandDepositProductChequeBookSizes();
      })
  }

}
