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

export let initialBankNoticeFormData: Notice = new Notice();

export interface BankNoticeFormData {
    chequeNumber:string,
    demandDepositAccountId:number,
    description:string,
    expireDate:Date,
    id:number,
    noticeAmount:number,
    noticeDate:Date,
    startDate:Date
}

@Component({
    selector: 'bank-notice-view',
    templateUrl: './bank.notice.view.component.html'
})
export class BankNoticeCreateViewComponent extends ViewsBaseComponent implements OnInit {

    bankNoticeForm: FormGroup;
    bankNotice: BankNoticeFormData;
    selectedAccountId: number;
    id: number;

    constructor(protected location:Location,
        protected notificationService: NotificationService,      
        protected approvalflowService: ApprovalflowService,
        private route: ActivatedRoute,
        protected router: Router,
        private formBuilder: FormBuilder) {
            super(location,router, approvalflowService, notificationService);
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal=of(false);    
        this.prepareBankNoticeForm(null);
        this.subscribers.routeSub = this.route.queryParams.subscribe(params => {
            this.command = params['command'];
            this.processId = params['taskId'];
            this.taskId = params['taskId'];
            this.commandReference = params['commandReference'];

                this.subscribers.fetchApprovalFlowTaskInstancePayloadSub=this.fetchApprovalFlowTaskInstancePayload()
                .subscribe(data=>{
                    this.selectedAccountId = data.accountId;
                   this.prepareBankNoticeForm(data);
              
                });
    
            });

    }

    prepareBankNoticeForm(formData: BankNoticeFormData) {
        formData = (formData == null ? { chequeNumber: null, demandDepositAccountId: this.selectedAccountId, description: null, expireDate: null, id: null, noticeAmount: null, noticeDate: null,startDate: null} : formData);   
        this.bankNotice = formData;     
        this.id = formData.id;
        this.bankNoticeForm = this.formBuilder.group({
            startDate: [new Date(formData.startDate), [Validators.required]],
            expireDate: [new Date(formData.expireDate), [Validators.required]],
            noticeAmount: [formData.noticeAmount, [Validators.required,Validators.min(1)]],
            chequeNumber: [formData.chequeNumber],
            description: [formData.description, [Validators.required]]
        });

        this.bankNoticeForm.get('startDate').valueChanges.subscribe(
            value => {
                if (!value) {
                    this.bankNoticeForm.get('startDate').setValue(new Date());
                    this.bankNoticeForm.get('startDate').updateValueAndValidity();
                }
                if (this.bankNoticeForm.get('expireDate').value < value) {
                    this.bankNoticeForm.get('expireDate').setValue(value);
                    this.bankNoticeForm.get('expireDate').updateValueAndValidity();
                }
            }
        );

        this.bankNoticeForm.get('expireDate').valueChanges.subscribe(
            value => {
                if (!value) {
                    this.bankNoticeForm.get('expireDate').setValue(this.bankNoticeForm.get('startDate').value);
                    this.bankNoticeForm.get('expireDate').updateValueAndValidity();
                }
            }
        );

        if (!this.bankNoticeForm.get('startDate').value) {
            this.bankNoticeForm.get('startDate').setValue(new Date());
            this.bankNoticeForm.get('startDate').updateValueAndValidity();
        }
        if (this.bankNoticeForm.get('expireDate').value < this.bankNoticeForm.get('startDate').value) {
            this.bankNoticeForm.get('expireDate').setValue(this.bankNoticeForm.get('startDate').value);
            this.bankNoticeForm.get('expireDate').updateValueAndValidity();
        }

        if (!this.bankNoticeForm.get('expireDate').value) {
            this.bankNoticeForm.get('expireDate').setValue(this.bankNoticeForm.get('startDate').value);
            this.bankNoticeForm.get('expireDate').updateValueAndValidity();
        }
    }

    cancel() {
        this.location.back();
    }
}