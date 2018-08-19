import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from "@angular/core";
import { BaseComponent } from "../../../../../common/components/base.component";
import { ProductChequePrefix } from "../../../../../services/demand-deposit-product/domain/product-cheque-prefix.model";
import { DemandDepositProductService } from "../../../../../services/demand-deposit-product/service-api/demand-deposit-product.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductChequeBookSize } from "../../../../../services/demand-deposit-product/domain/product-chequebook-size.model";
import { NotificationService } from '../../../../../common/notification/notification.service';
import { ConfirmationService } from "primeng/components/common/confirmationservice";



export const initialChequePrefixSaveFormData: ProductChequePrefix = new ProductChequePrefix();

export interface ChequePrefixSaveEvent {
    chequePrefixForm: ProductChequePrefix;
    verifier: string;
}

@Component({
    selector: 'cheque-prefix',
    templateUrl: './cheque-prefix.component.html'
})
export class ChequePrefixComponent extends BaseComponent implements OnInit {

    chequePrefixes: any[];
    demandDepositProductId: number;
    totalRecords: number;
    totalPages: number;
    chequePrefixForm: FormGroup;

    id: number;


    @Input('formData') set formData(formData: ProductChequePrefix) {
        this.prepareChequePrefixForm(formData);
    }
    @Input('editMode') editMode: boolean;

    @Input('command') command: string;

    @Output('onSave') onSaved = new EventEmitter<ChequePrefixSaveEvent>();

    @Output('onCancel') onCancel = new EventEmitter<void>();

    constructor(
        private demadDepositProductService: DemandDepositProductService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private conformationService: ConfirmationService) {
        super();
    }

    ngOnInit() {
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.demandDepositProductId = +params['id'];
            console.log('Demand Deposit Product Id:' + this.demandDepositProductId);
            this.fetchDemandDepositProductChequePrefixes();
            this.formData = initialChequePrefixSaveFormData;
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

    onRowSelect(event) {
        // this.router.navigate(['detail', event.data.id], { relativeTo: this.route });
    }


    create(): void {
        const chequePrefixes: ProductChequePrefix = this.chequePrefixForm.value;
        chequePrefixes.demandDepositProductId = this.demandDepositProductId;
        this.subscribers.saveSub = this.demadDepositProductService.addDemandDepositProductChequePrefixes(chequePrefixes, { 'id': this.demandDepositProductId + '' }).subscribe(
            (data) => {
                this.notificationService.sendSuccessMsg("cheque.prefix.save.success");
                this.fetchDemandDepositProductChequePrefixes();
            }
        );

    }


    emitSaveEvent() {
        const chequeBookSizes: ProductChequeBookSize = this.chequePrefixForm.value;
        chequeBookSizes.demandDepositProductId = this.demandDepositProductId;
        this.onSaved.emit({
            chequePrefixForm: this.chequePrefixForm.value,
            verifier: ''
        });
    }

    demandDepositProductFormInvalid() {
        return this.chequePrefixForm.invalid;
    }

    prepareChequePrefixForm(formData: ProductChequePrefix) {
        if (formData == null) { formData = initialChequePrefixSaveFormData; }
        this.id = formData.id;
        this.chequePrefixForm = this.formBuilder.group({
            prefix: [formData.prefix]
        });
    }

    cancel() {
        this.navigateAway();
    }

    navigateAway() {
        this.router.navigate(['../'], { relativeTo: this.route });
    }

    deleteChequePrifix(productChequePrifix: ProductChequePrefix) {
        this.conformationService.confirm({
            message: 'are you sure you want to delete the cheque prifix?',
            accept: () => {
                this.deleteDemandDepositProductChequePrefixes(productChequePrifix);
            }
        });

    }

    deleteDemandDepositProductChequePrefixes(productChequePrifix: ProductChequePrefix) {
        this.subscribers.deleteChequePrefix = this.demadDepositProductService
            .deleteDemandDepositProductChequePrefixes({ id: this.demandDepositProductId, chequePrefixesId: productChequePrifix.id })
            .subscribe((data) => {
                this.notificationService.sendSuccessMsg('ChequePrefix.delete.success')
                this.fetchDemandDepositProductChequePrefixes();
            })
    }

}
