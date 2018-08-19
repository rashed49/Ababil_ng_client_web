import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BaseComponent } from '../../../../common/components/base.component';
import { ActivatedRoute,Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApprovalflowService } from './../../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from './../../../../common/components/base.form.component';
import { Subscriber, Observable, of } from 'rxjs';
import * as commandConstants from '../../../../common/constants/app.command.constants';
import { VerifierSelectionEvent } from '../../../../common/components/verifier-selection/verifier.selection.component';
import value from '*.json';
import { Notice } from './../../../../services/bank-notice/domain/notice.models';
import { NotificationService } from '../../../../common/notification/notification.service';
import { ViewsBaseComponent } from './../../view.base.component';
import { AccountSpecialProfitRate } from '../../../../services/special-profit-rate/domain/special.profit.rate.model';
import { ProductService } from '../../../../services/product/service-api/product.service';


export let initialAccountSpecialProfitRateFormData: AccountSpecialProfitRate = new AccountSpecialProfitRate();
initialAccountSpecialProfitRateFormData.isProfitCalculationOn = true;



@Component({
    selector: 'special-profit-rate-view',
    templateUrl: './special.profit.rate.view.component.html'
})

export class SpecialProfitRateViewComponent extends ViewsBaseComponent implements OnInit {
    type: string;
    disableSpecialProfitRateField: boolean;
    specialProfitRateId: number;
    accountSpecialProfitRate: AccountSpecialProfitRate = new AccountSpecialProfitRate();
    accountSpecialProfitRateForm: FormGroup;
    
    constructor(protected location:Location,
        protected notificationService: NotificationService,      
        protected approvalflowService: ApprovalflowService,
        protected productService: ProductService,
        private route: ActivatedRoute,
        protected router: Router,
        private formBuilder: FormBuilder) {
            super(location,router, approvalflowService, notificationService);
    }
    ngOnInit(){
        this.showVerifierSelectionModal=of(false);   
        this.prepareSpecialProfitRateForm(null);
        this.subscribers.routeSub = this.route.queryParams.subscribe(params => {
            this.command = params['command'];
            this.processId = params['taskId'];
            this.taskId = params['taskId'];
            this.commandReference = params['commandReference'];
            console.log(params);
                this.subscribers.fetchApprovalFlowTaskInstancePayloadSub=this.fetchApprovalFlowTaskInstancePayload()
                .subscribe(data=>{
                   this.prepareSpecialProfitRateForm(data);           
                });
            });
         this.fetchProductConfiguration();

}
prepareSpecialProfitRateForm(formData: AccountSpecialProfitRate) {
    formData = (formData == null ? initialAccountSpecialProfitRateFormData : formData);
    this.specialProfitRateId = formData.id;
    this.accountSpecialProfitRate = formData;
    this.accountSpecialProfitRateForm = this.formBuilder.group({
        specialProfitRate: [{value:formData.specialProfitRate, disabled: this.disableSpecialProfitRateField}, [Validators.required,Validators.min(0), Validators.max(100)]],
        specialPsr: [formData.specialPsr, [Validators.min(0), Validators.max(100)]],
        specialWeightage: [formData.specialWeightage,[Validators.min(0), Validators.max(100)]],
        reason: [formData.reason, [Validators.required]],
        accountId: [formData.accountId],
        isProfitCalculationOn: [formData.isProfitCalculationOn]
    });



    
    // this.accountSpecialProfitRateForm.get('isProfitCalculationOn').valueChanges.subscribe(
    //     value => {
    //         if(!value) {
    //             this.disableSpecialProfitRateField = true;
    //             this.accountSpecialProfitRateForm.get('specialProfitRate').setValue(null);
    //             this.accountSpecialProfitRateForm.get('specialProfitRate').clearValidators();
    //             this.accountSpecialProfitRateForm.get('specialProfitRate').reset({ value: '', disabled: true });
    //             this.accountSpecialProfitRateForm.get('specialProfitRate').updateValueAndValidity();
    //         }

    //         if(this.accountSpecialProfitRateForm.get('isProfitCalculationOn').value){
    //             this.disableSpecialProfitRateField = false;
    //             this.accountSpecialProfitRateForm.get('specialProfitRate').setValidators([Validators.required,Validators.min(0), Validators.max(100)]);
    //             this.accountSpecialProfitRateForm.get('specialProfitRate').enable();
    //             this.accountSpecialProfitRateForm.get('specialProfitRate').updateValueAndValidity();

    //         }
         
    //     });

}

fetchProductConfiguration() {
    let urlSearchParam: Map<string, string> = new Map([['name', 'profit-calculation']]);
    this.subscribers.fetchProductConfigurationSub = this.productService
        .fetchProductConfiguration(urlSearchParam)
        .subscribe(config => {
            this.type = config.type;
        });
}

cancel() {
    this.location.back();
}

}