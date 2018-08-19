import { Currency } from './../../../services/currency/domain/currency.models';
import { CurrencyService } from './../../../services/currency/service-api/currency.service';
import { Location } from '@angular/common';
import { ApprovalflowService } from './../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from './../../../common/components/base.form.component';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { Status, GlSubType, GlType, LeafType, ReconciliationType, ReEvaluationFrequency } from '../../../common/domain/gl.enum.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscriber,Observable, of } from 'rxjs';
import { BaseComponent } from '../../../common/components/base.component';
import * as searchParamConstants from '../../../common/constants/app.search.parameter.constants';
import * as commandConstants from '../../../common/constants/app.command.constants';
import { VerifierSelectionEvent } from '../../../common/components/verifier-selection/verifier.selection.component';
import {GlAccount} from '../../../services/glaccount/domain/gl.account.model';
import { CurrencyRestriction } from '../../../common/domain/currency.enum.model';

export let initialGlAccountFormData: GlAccount = new GlAccount();
// initialGlAccountFormData.allowBackPeriodTransaction=false;
// initialGlAccountFormData.negativeBalanceAllowed=false;
// initialGlAccountFormData.temporaryGl=false;

export interface GlAccountSaveEvent {
    glAccountForm: GlAccount,
    verifier: string,
    taskId:string,
    approvalFlowReuired:boolean
}

@Component({
    selector: 'gl-account-form',
    templateUrl: './gl.account.form.component.html'
})
export class GlAccountFormComponent extends FormBaseComponent implements OnInit{

    currencyRestrictions: SelectItem[] = CurrencyRestriction;
    glSubTypes: SelectItem[] = GlSubType;
    glTypes: SelectItem[] = GlType;
    leafTypes: SelectItem[] = LeafType;
    reconciliationType: SelectItem[] = ReconciliationType;
    reEvaluationFrequency: SelectItem[] = ReEvaluationFrequency;
    status: SelectItem[] = Status;
    currencies:Currency[];
    

    glAccountForm: FormGroup;
    id: number;

    @Input('formData') set formData(formData: GlAccount) {
        this.prepareGlAccountForm(formData);
    }
    @Input('editMode') editMode:boolean;
    @Input('command')  command:string; 
        
    @Output('onSave') onSave = new EventEmitter<GlAccountSaveEvent>();
    @Output('onCancel') onCancel = new EventEmitter<void>();    

    constructor(protected location:Location,
        protected approvalflowService: ApprovalflowService, 
        private route: ActivatedRoute, 
        private router: Router, 
        private formBuilder: FormBuilder,
        private currencyService:CurrencyService) {
        super(location,approvalflowService);
    }

    ngOnInit() {
       this.showVerifierSelectionModal=of(false);       
       this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
        if (queryParams['taskId']) {
           this.taskId =  queryParams['taskId'];
        }
       });
    }

    prepareGlAccountForm(formData: GlAccount) {
        (formData == null) ? formData = initialGlAccountFormData : formData;
        this.id = formData.id;
        // this.glAccountForm = this.formBuilder.group({
        //     name: [formData.name, Validators.required],
        //     code: [formData.code, Validators.required],
        //     description: [formData.description, Validators.required],
        //     leafType: [formData.leafType, Validators.required],
        //     glCategoryId: [formData.glCategoryId],
        //     glType: [formData.glType, Validators.required],
        //     glSubType: [formData.glSubType],
        //     closingDateTime:[formData.closingDateTime==null?null:new Date(formData.closingDateTime)],
        //     reconciliationType: [formData.reconciliationType, Validators.required],
        //     parentGlId: [formData.parentGlId],
        //     status: [formData.status, Validators.required],
        //     allowBackPeriodTransaction: [formData.allowBackPeriodTransaction, Validators.required],
        //     revaluationFrequency: [formData.revaluationFrequency, Validators.required],
        //     currencyRestriction: [formData.currencyRestriction, Validators.required],
        //     functionalCurrency: [formData.functionalCurrency],
        //     temporaryGl: [formData.temporaryGl, Validators.required],
        //     negativeBalanceAllowed: [formData.negativeBalanceAllowed, Validators.required]
        // });
    }

    submit() {
      if(!this.taskId){
         this.showVerifierSelectionModal=of(true);
      }else{
         this.emitSaveEvent({verifier:null,approvalFlowRequired:null},this.taskId);
      }
    }

    onVerifierSelect(selectEvent: VerifierSelectionEvent){
       this.emitSaveEvent(selectEvent,null);
    }

    emitSaveEvent(selectEvent: VerifierSelectionEvent,taskid:string) {
        let glAccount = this.glAccountForm.value;
        glAccount.id = this.id;
        this.onSave.emit({
            glAccountForm: this.glAccountForm.value,
            verifier: selectEvent.verifier,
            taskId: this.taskId,
            approvalFlowReuired: selectEvent.approvalFlowRequired
        });
    }

    fetchCurrencies(){
         this.currencyService.fetchCurrencies(new Map()).subscribe(data=>{
             this.currencies = data.content;
         });
    }

    cancel() {
        this.onCancel.emit();
    }

    glAccountFormInvalid() {
        return this.glAccountForm.invalid;
    }

}