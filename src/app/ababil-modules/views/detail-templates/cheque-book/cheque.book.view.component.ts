import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApprovalflowService } from './../../../../services/approvalflow/service-api/approval.flow.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChequeService } from '../../../../services/cheque/service-api/cheque.service';
import { DemandDepositAccount } from '../../../../services/demand-deposit-account/domain/demand.deposit.account.models';
import { ChequeBook } from '../../../../services/cheque/domain/cheque.models';
import { NotificationService } from '../../../../common/notification/notification.service';
import { ViewsBaseComponent } from './../../view.base.component';
import { ProductChequePrefix } from '../../../../services/demand-deposit-product/domain/product-cheque-prefix.model';
import { DemandDepositProduct } from '../../../../services/demand-deposit-product/domain/demand-deposit-product.model';
import { DemandDepositProductService } from '../../../../services/demand-deposit-product/service-api/demand-deposit-product.service';

export let initialChequeBookFormData: ChequeBook = new ChequeBook();

export interface ChequeBookFormData {
    id: number,
    accountId: number,
    chequePrefix: string,
    startLeafNumber: string,
    endLeafNumber: string,
    chequeBookStatus: string,
}

@Component({
    selector: 'cheque-book-view',
    templateUrl: './cheque.book.view.component.html'
})
export class ChequeBookCreateViewComponent extends ViewsBaseComponent implements OnInit {

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
        protected notificationService: NotificationService,      
        protected approvalflowService: ApprovalflowService,
        private chequeService: ChequeService,
        private demandDepositProductService: DemandDepositProductService,
        private route: ActivatedRoute,
        protected router: Router,
        private formBuilder: FormBuilder) {
            super(location,router, approvalflowService, notificationService);
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal=of(false);    
        this.prepareChequeBookForm(null);
        this.subscribers.routeSub = this.route.queryParams.subscribe(params => {
            this.command = params['command'];
            this.processId = params['taskId'];
            this.taskId = params['taskId'];
            console.log(this.taskId);
            this.commandReference = params['commandReference'];
                this.subscribers.fetchApprovalFlowTaskInstancePayloadSub=this.fetchApprovalFlowTaskInstancePayload()
                .subscribe(data=>{
                    this.selectedAccountId = data.accountId;
                   this.prepareChequeBookForm(data);
              
                });
    
            });

    }

    prepareChequeBookForm(formData: ChequeBookFormData) {
        formData = (formData == null ? { id: null, accountId: this.selectedAccountId, chequePrefix: null, startLeafNumber: null, endLeafNumber: null, chequeBookStatus: null } : formData);
        this.chequeBook = formData;
        this.chequeBookForm = this.formBuilder.group({
            chequePrefix: [formData.chequePrefix, Validators.required],
            startLeafNumber: [formData.startLeafNumber, [Validators.required, Validators.min(0), Validators.minLength(1), Validators.maxLength(32)]],
            endLeafNumber: [formData.endLeafNumber, [Validators.required, Validators.min(0), Validators.minLength(1), Validators.maxLength(32)]]
        });

        if (this.demandDepositProduct.isChequePrefixRequired) {
            this.chequeBookForm.addControl('chequePrefix', new FormControl(formData.chequePrefix, [Validators.required]));
        } else {
            this.chequeBookForm.removeControl('chequePrefix');
        }

        this.chequeBookSize = this.chequeBookForm.get('endLeafNumber').value - this.chequeBookForm.get('startLeafNumber').value + 1;
        
        this.fetchAccountDetailsByAccountId();
    }
    cancel() {
        this.location.back();
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
            });
    }


}
