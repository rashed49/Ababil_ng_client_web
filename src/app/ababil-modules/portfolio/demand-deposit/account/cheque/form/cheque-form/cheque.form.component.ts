import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ApprovalflowService } from './../../../../../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from './../../../../../../../common/components/base.form.component';
import { Observable, of } from 'rxjs';
import { map }from 'rxjs/operators';
import { ChequeService } from '../../../../../../../services/cheque/service-api/cheque.service';
import { VerifierSelectionEvent } from '../../../../../../../common/components/verifier-selection/verifier.selection.component';
import { DemandDepositAccount } from '../../../../../../../services/demand-deposit-account/domain/demand.deposit.account.models';
import { DemandDepositProductService } from '../../../../../../../services/demand-deposit-product/service-api/demand-deposit-product.service';
import { DemandDepositProduct } from '../../../../../../../services/demand-deposit-product/domain/demand-deposit-product.model';
import { ProductChequePrefix } from '../../../../../../../services/demand-deposit-product/domain/product-cheque-prefix.model';
import { ChequeBook } from '../../../../../../../services/cheque/domain/cheque.models';


export let initialChequeBookFormData: ChequeBook = new ChequeBook();

export interface ChequeBookFormData {
    id: number,
    accountId: number,
    chequePrefix: string,
    startLeafNumber: string,
    endLeafNumber: string,
    chequeBookStatus: string,
}

export interface ChequeBookSaveEvent {
    chequeBookForm: ChequeBookFormData,
    verifier: string,
    taskId:string,
    accountId: number,
    approvalFlowReuired:boolean
}


@Component({
    selector: 'app-cheque-form',
    templateUrl: './cheque.form.component.html',
    styleUrls: ['./cheque.form.component.scss']
})
export class ChequeBookFormComponent extends FormBaseComponent implements OnInit {

    chequeBookForm: FormGroup;
    chequeBook: ChequeBookFormData;
    selectedAccountId: number;
    productId: number;
    id: number;
    demandDepositAccount: DemandDepositAccount = new DemandDepositAccount();
    productChequePrefixes: ProductChequePrefix[];
    chequeBookSize: number = 0;
    demandDepositProduct: DemandDepositProduct = new DemandDepositProduct();
    verifierSelectionModalVisible: Observable<boolean>;

    constructor(protected location:Location,
        protected approvalflowService: ApprovalflowService,
        private chequeService: ChequeService,
        private demandDepositProductService: DemandDepositProductService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder) {
            super(location,approvalflowService);
    }

    @Input('formData') set formData(formData: ChequeBookFormData) {
        this.prepareChequeBookForm(formData);
    }
    @Input() accountId: number;
    @Input('command') command: string;
    @Output('onSave') onSave = new EventEmitter<ChequeBookSaveEvent>();
    @Output('onCancel') onCancel = new EventEmitter<void>();

    ngOnInit(): void {
        this.showVerifierSelectionModal=of(false);    

        this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
            if (queryParams['taskId']) {
               this.taskId =  queryParams['taskId'];
            }
            if(queryParams['commandReference']) {
                this.commandReference = queryParams['commandReference'];
            }
           });

        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.selectedAccountId = +params['id'];
            this.fetchAccountDetailsByAccountId();
        });
    }

    prepareChequeBookForm(formData: ChequeBookFormData) {
        formData = (formData == null ? { id: null, accountId: this.accountId, chequePrefix: null, startLeafNumber: null, endLeafNumber: null, chequeBookStatus: null } : formData);
        this.chequeBook = formData;
        this.chequeBookForm = this.formBuilder.group({
            chequePrefix: [formData.chequePrefix, Validators.required],
            startLeafNumber: [formData.startLeafNumber, [Validators.required, Validators.min(0), Validators.minLength(1), Validators.maxLength(32)]],
            endLeafNumber: [formData.endLeafNumber, [Validators.required, Validators.min(0), Validators.minLength(1), Validators.maxLength(32)]]
        });

        this.demandDepositProduct.isChequePrefixRequired
            ? this.chequeBookForm.addControl('chequePrefix', new FormControl(formData.chequePrefix, [Validators.required]))
            : this.chequeBookForm.removeControl('chequePrefix');

        this.chequeBookForm.get('startLeafNumber').valueChanges.subscribe(val => {
            this.chequeBookSize = (val > 0 && this.chequeBookForm.get('endLeafNumber').value > val)
                ? this.chequeBookForm.get('endLeafNumber').value - this.chequeBookForm.get('startLeafNumber').value + 1
                : 0;
        });

        this.chequeBookForm.get('endLeafNumber').valueChanges.subscribe(val => {
            this.chequeBookSize = (val > 0 && this.chequeBookForm.get('startLeafNumber').value < val)
                ? this.chequeBookForm.get('endLeafNumber').value - this.chequeBookForm.get('startLeafNumber').value + 1
                : 0;
        });
    }

    submit() {
        if(!this.taskId){
           this.showVerifierSelectionModal=of(true);
        }else{
           this.emitSaveEvent({verifier:null,approvalFlowRequired:null},this.taskId, this.accountId);
        }
      }

      onVerifierSelect(selectEvent: VerifierSelectionEvent){
        this.emitSaveEvent(selectEvent,null,this.accountId);
     }



     emitSaveEvent(selectEvent: VerifierSelectionEvent,taskId:string, accountId: number) {
        let chequeBook = this.chequeBookForm.value;
        chequeBook.accountId = this.accountId;
        chequeBook.id = this.id;
        this.onSave.emit({
            chequeBookForm: this.chequeBookForm.value,
            verifier: selectEvent.verifier,
            taskId: this.taskId,
            accountId: this.accountId,
            approvalFlowReuired: selectEvent.approvalFlowRequired
        });
    }

    fetchAccountDetailsByAccountId() {
        this.subscribers.depositAccountSub = this.chequeService
            .fetchAccountDetailsByAccountId({ 'id': this.selectedAccountId + '' })
            .subscribe(profileDetails => {
                this.demandDepositAccount = profileDetails;
                this.productId = profileDetails.productId;
                this.fetchDemandDepositProductDetails();
            });
    }

    private fetchDemandDepositProductDetails() {
        this.subscribers.fetchSub = this.demandDepositProductService
            .fetchDemandDepositProductDetails({ id: this.productId + '' })
            .pipe(map(data => {
                this.demandDepositProduct = data;
                if (this.demandDepositProduct.isChequePrefixRequired) {
                    this.fetchChequePrefixesByProdId();
                }
            })).subscribe();
    }

    fetchChequePrefixesByProdId() {
        this.subscribers.chequePrefixSub = this.chequeService
            .fetchChequePrefixesByProdId({ 'id': this.productId + '' })
            .subscribe(data => {
                this.productChequePrefixes = data.content;
                // this.prepareChequeBookForm(this.formData);
            });
    }


    cancel() {
        this.onCancel.emit();
    }

    formsInvalid(): boolean {
        return this.chequeBookForm.invalid;
    }

}
