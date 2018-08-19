import { Location } from '@angular/common';
import { NotificationService } from './../../../../../../common/notification/notification.service';
import { BankNoticeService } from './../../../../../../services/bank-notice/service-api/bank.notice.service';
import { Notice } from './../../../../../../services/bank-notice/domain/notice.models';
import { BaseComponent } from './../../../../../../common/components/base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OnInit } from "@angular/core";
import { Observable, of } from 'rxjs';
import { VerifierSelectionEvent } from '../../../../../../common/components/verifier-selection/verifier.selection.component';
import * as urlSearchParameterConstants from '../../../../../../common/constants/app.search.parameter.constants';
import { ApprovalflowService } from './../../../../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from './../../../../../../common/components/base.form.component';

export let initialBankNoticeFormData: Notice = new Notice();
export const DETAILS_UI: string = "views/bank-notice?";

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

export interface BankNoticeSaveEvent {
    bankNoticeForm: Notice,
    verifier: string,
    taskId: string,
    accountId: number,
    approvalFlowReuired: boolean
}

@Component({
    selector: 'bank-notice-form',
    templateUrl: './bank.notice.form.component.html'
})

export class BankNoticeFormComponent extends FormBaseComponent implements OnInit {

    routeBack: string;
    accountUrl: string;
    customerUrl: string;
    notice: Notice = new Notice();
    bankNoticeForm: FormGroup;
    bankNoticeFormData: Observable<Notice>;
    accountId: number;
    noticeId: number = null;
    
    bankNotice: Notice = new Notice();
    demanDepositUrl

    minStartDate: Date = new Date();
    command: string = "CreateDemandDepositAccountNoticeCommand";

    constructor(private route: ActivatedRoute,
        private router: Router,
        private bankNoticeService: BankNoticeService,
        private notificationService: NotificationService,
        private formBuilder: FormBuilder,
        protected location: Location,
        protected approvalflowService: ApprovalflowService ) {
        super(location, approvalflowService);
    }

    ngOnInit(): void {

        this.showVerifierSelectionModal = of(false);
        this.minStartDate.setDate(this.minStartDate.getDate());
        this.prepareBankNoticeForm(null);
        this.subscribers.routeParamSub = this.route.params.subscribe(
            params => {
                this.accountId = +params['id'];
                this.subscribers.queryParamSub = this.route.queryParams.subscribe(
                    queryParams => {
                        this.routeBack = queryParams['bankNotice'] ? queryParams['bankNotice'] : null;
                        this.accountUrl = queryParams['demandDeposit'];
                        this.customerUrl = queryParams['cus'];
                        this.commandReference = params['commandReference'];

                        if (queryParams['taskId']) {
                            this.taskId = queryParams['taskId'];
                            console.log(this.taskId);
                            if (queryParams['noticeId']) {
                                this.noticeId = queryParams['noticeId'];
                                this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                                    data => {
                                        
                                        console.log("in case of edit");
                                        console.log(data);
                                        this.prepareBankNoticeForm(data);
                                    }
                                );
                            } else {
                                this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                                    data => {
                                        console.log("hey");
                                        console.log(data);
                                        
                                        // this.bankNoticeFormData = new Observable(observer => {
                                        //     let bankNotice = data;
                                        //     bankNotice.accountId = this.accountId;
                                        //     observer.next(bankNotice);
                                        //     this.prepareBankNoticeForm(data);
                                        // });
                                        
                                        this.prepareBankNoticeForm(data);
                                       
                                    });
                            }
                        }
                        else {
                            if (queryParams['noticeId']) {
                                this.noticeId = queryParams['noticeId'];
                                this.command = "UpdateDemandDepositAccountNoticeCommand";
                                this.fetchBankNoticeDetails();
                            }
                            else {
                                // this.bankNoticeFormData = new Observable(observer => {
                                //     let bankNotice = initialBankNoticeFormData;
                                //     bankNotice.demandDepositAccountId = this.accountId;
                                //     observer.next(bankNotice);
                                //      this.prepareBankNoticeForm(null);

                                // });
                                this.prepareBankNoticeForm(null);
                            }
                        }
                    }
                );
            }
        );
    }


    fetchBankNoticeDetails() {
        this.bankNoticeService.fetchNoticeDetail({ id: this.accountId, accountNoticeId: this.noticeId })
            .subscribe(data => {
                this.notice = data;
                this.prepareBankNoticeForm(this.notice);
            });
    }

    prepareBankNoticeForm(formData: Notice) {
        formData = (formData == null ? { chequeNumber: null, demandDepositAccountId: this.accountId, description: null, expireDate: null, id: null, noticeAmount: null, noticeDate: null,startDate: null} : formData);   
        this.bankNotice = formData;  
        this.bankNoticeForm = this.formBuilder.group({

            startDate: [new Date(formData.startDate), [Validators.required]],
            expireDate: [new Date(formData.expireDate), [Validators.required]],
            noticeAmount: [formData.noticeAmount, [Validators.required, Validators.min(1)]],
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

    submit() {
        if (!this.taskId) {
            this.showVerifierSelectionModal = of(true);
        } else {
            this.saveBankNotice({ verifier: null, approvalFlowRequired: null }, this.taskId);
        }
    }


    onVerifierSelect(selectEvent: VerifierSelectionEvent) {

        // let urlSearchMap = new Map();
        // let urlSearchParams= this.getQueryParamMapForApprovalFlow(null,event.verifier,DETAILS_UI,this.location.path().concat("?"));
        this.saveBankNotice(selectEvent, null);
    }

    saveBankNotice(selectEvent: VerifierSelectionEvent, taskId: string) {
        let notice: Notice = this.bankNoticeForm.value;
        //   let noticeEvent: BankNoticeSaveEvent ;
        //  noticeEvent.bankNoticeForm= this.bankNoticeForm.value;
        //  noticeEvent.approvalFlowReuired = event.approvalFlowReuired;
        //   noticeEvent.taskId = this.taskId;


        notice.demandDepositAccountId = this.accountId;
        notice.id = this.noticeId;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, selectEvent.verifier, DETAILS_UI, this.location.path().concat("&"));

        notice.id ? this.updateBankNotice(notice, urlSearchParams) : this.createBankNotice(notice, urlSearchParams);
    }

    createBankNotice(notice: Notice, urlSearchMap) {
        this.bankNoticeService.createBankNotice(notice, { id: this.accountId }, urlSearchMap)
            .subscribe(data => {
                if (urlSearchMap.has(urlSearchParameterConstants.VERIFIER)) {
                    this.notificationService.sendSuccessMsg("workflow.task.verify.send");
                } else {
                    this.notificationService.sendSuccessMsg("workflow.task.verify.send");
                }
                this.navigateAway();
            });
    }

    updateBankNotice(notice: Notice, urlSearchMap) {
        this.bankNoticeService.updateBankNotice({ id: this.accountId, accountNoticeId: this.noticeId }, notice, urlSearchMap)
            .subscribe(data => {
                if (urlSearchMap.has(urlSearchParameterConstants.VERIFIER)) {
                    this.notificationService.sendSuccessMsg("workflow.task.verify.send");
                } else {
                    this.notificationService.sendSuccessMsg("workflow.task.verify.send");
                }
                this.navigateAway();
            });
    }

    formInvalid() {
        return this.bankNoticeForm.invalid;
    }

    navigateAway() {
        this.router.navigate([this.routeBack ? this.routeBack : "../"], {
            relativeTo: this.route,
            queryParams: {
                demandDeposit: this.accountUrl,
                bankNotice: this.routeBack,
                cus: this.customerUrl
            }
        });
    }

    cancel() {
        this.navigateAway();
    }



}