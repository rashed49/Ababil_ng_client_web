import { Component, ViewChild, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NotificationService } from "../../../../common/notification/notification.service";
import { InlandRemittanceIssueService } from "../../../../services/inland-remittance/issue/service-api/inland.remittance.issue.service";
import { BaseComponent } from "../../../../common/components/base.component";
import { LazyLoadEvent } from "primeng/components/common/lazyloadevent";
import { InlandRemittanceInstrument } from "../../../../services/inland-remittance/instrument/domain/inland.remittance.instrument.models";
import { RemittanceInstrumentStatus } from "../../../../common/domain/inland.remittance.instrument.status.enum.model";
import { InlandRemittanceInstrumentPaymentInfo } from "../../../../services/inland-remittance/issue/domain/inland.remittance.issue.payment.models";
import { InlandRemittanceInstrumentLostInfo } from "../../../../services/inland-remittance/issue/domain/inland.remittance.issue.lost.models";
import { InlandRemittanceProduct } from "../../../../services/inland-remittance/lot/domain/inland.remittance.lot.models";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Location } from '@angular/common';
import { Observable, of } from "rxjs";
import * as commandConstants from '../../../../common/constants/app.command.constants';
import { FormBaseComponent } from "../../../../common/components/base.form.component";
import { ApprovalflowService } from "../../../../services/approvalflow/service-api/approval.flow.service";
import { VerifierSelectionEvent } from "../../../../common/components/verifier-selection/verifier.selection.component";

export const DETAILS_UI = 'views/payment-view';


@Component({
    selector: 'issue-list',
    templateUrl: './inland.remittance.issue.list.component.html',
    styleUrls: ['./inland.remittance.issue.list.component.html']
})
export class IssueListComponent extends FormBaseComponent implements OnInit {


    @ViewChild('lostIssue') lostIssue: any;
    @ViewChild('refundIssue') refundIssue: any;
    @ViewChild('paymentIssue') paymentIssue: any;
    @ViewChild('viewIssue') viewIssue: any;

    inlandRemittanceInstrument: InlandRemittanceInstrument[] = [];
    inlandRemittanceInstrument1: InlandRemittanceInstrument = new InlandRemittanceInstrument();
    inlandRemittanceInstruments: InlandRemittanceInstrument = new InlandRemittanceInstrument();
    inlandRemittanceInstrumentPaymentInfo: InlandRemittanceInstrumentPaymentInfo = new InlandRemittanceInstrumentPaymentInfo();
    inlandRemittanceInstrumentLostInfo: InlandRemittanceInstrumentLostInfo = new InlandRemittanceInstrumentLostInfo();
    inlandRemittanceProduct: InlandRemittanceProduct = new InlandRemittanceProduct();
    totalRecords: number;
    totalPages: number;
    selectedRow: any;
    displayIssueActionButtons: boolean = false;
    displayReissueActionButton: boolean = false;
    displayLostIssue: boolean = false;
    displaypaymentIssue: boolean = false;
    displayRefundIssue: boolean = false;
    displayViewIssue: boolean = false;
    urlSearchMap: Map<string, any> = new Map();
    InlandIssueSearchForm: FormGroup;
    issue: InlandRemittanceInstrument;
    instrumentNo: string;
    currencyCode: string;
    productId: number;
    purchaseAmount: number;
    productType: string;

    constructor(private inlandRemittanceIssueService: InlandRemittanceIssueService,
        private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private formBuilder: FormBuilder,
        protected location: Location,
        protected approvalFlowService: ApprovalflowService) {
        super(location, approvalFlowService);
    }

    ngOnInit(): void {
        this.fetchInlandRemittanceIssues(this.urlSearchMap);
        this.prepareInlandIssueSearchForm();
        this.showVerifierSelectionModal = of(false);
    }
    fetchInlandRemittanceIssues(searchMap: Map<string, any>) {
        this.subscribers.fatchInlandRemittanceIssueSub = this.inlandRemittanceIssueService
            .fetchInlandRemittanceIssues(searchMap)
            .subscribe(data => {
                this.inlandRemittanceInstrument = data.content;
                this.totalRecords = (data.pageSize * data.pageCount);
                this.totalPages = data.pageCount;
                console.log(data);
            });
    }

    loadInlandRemittanceIssuesLazily(event: LazyLoadEvent) {
        if (this.urlSearchMap == null) {
            this.urlSearchMap = new Map();
        }
        this.urlSearchMap.set("page", (event.first / 20));
        this.fetchInlandRemittanceIssues(this.urlSearchMap);
    }

    onRowSelect(event) {
        this.displayIssueActionButtons = RemittanceInstrumentStatus[2].value == event.data.status ? true : false;
        this.displayReissueActionButton = RemittanceInstrumentStatus[5].value == event.data.status ? true : false;
        this.instrumentNo = event.data.instrumentNo;
        this.currencyCode = event.data.currencyCode;
        this.productId = event.data.inlandRemittanceProduct.id;
        // this.purchaseAmount=event.data.purchaseAmount;
        this.productType = event.data.inlandRemittanceProduct.name;
    }

    prepareInlandIssueSearchForm() {
        this.InlandIssueSearchForm = this.formBuilder.group({
            instrumentNo: ['', [Validators.maxLength(15)]],
            currencyCode: ['', [Validators.maxLength(10)]],
            purchaserMobile: ['', [Validators.maxLength(20)]],
            purchaserNid: ['', [Validators.maxLength(20)]],
            payeeMobile: ['', [Validators.maxLength(20)]],
            status: ['', [Validators.maxLength(15)]]
        });
    }
    inlandRemittanceIssuesearch(searchMap: Map<string, any>) {

        if (searchMap != null) this.urlSearchMap = searchMap;
        for (let control in this.InlandIssueSearchForm.controls) {
            this.urlSearchMap.delete(control);
            let formControlValue: string = this.InlandIssueSearchForm.get(control).value.trim();
            if (formControlValue.length !== 0)
                this.urlSearchMap.set(control, this.InlandIssueSearchForm.get(control).value);
        }
        this.subscribers.inlandRemittanceSearchSub = this.inlandRemittanceIssueService
            .searchInlandRemittanceIssue(this.urlSearchMap)
            .subscribe(data => {
                console.log(data);
                this.inlandRemittanceInstrument = data.content;
            });
    }

    lostInlandRemittanceIssue() {
        this.lostIssue.setData(this.selectedRow);
        this.displayLostIssue = true;
    }

    saveLostIssue(lostIssueTypeToSave: InlandRemittanceInstrumentLostInfo) {
        this.subscribers.InlandRemittanceInstrumentSaveSub = this.inlandRemittanceIssueService
            .InlandRemittanceLostIssue(lostIssueTypeToSave)
            .subscribe((data) => {
                this.notificationService.sendSuccessMsg("inland.remittance.lost.issue.success");
                this.displayLostIssue = false;
                this.fetchInlandRemittanceIssues(new Map());
                this.lostIssue.prepareLostIssueForm(new InlandRemittanceInstrumentLostInfo);
            });
    }

    saveLostInlandRemittanceIssue() {
        this.markFormGroupAsTouched(this.lostIssue.lostIssueForm);
        if (this.lostIssue.lostIssueForm.invalid) return;
        let inlandRemittanceInstrumentLostInfo = new InlandRemittanceInstrumentLostInfo();
        inlandRemittanceInstrumentLostInfo.currencyCode = this.lostIssue.inlandRemittanceInstrument.currencyCode;
        inlandRemittanceInstrumentLostInfo.productId = this.lostIssue.inlandRemittanceInstrument.inlandRemittanceProduct.id;
        inlandRemittanceInstrumentLostInfo.instrumentNo = this.lostIssue.inlandRemittanceInstrument.instrumentNo + "";
        inlandRemittanceInstrumentLostInfo.lostRemark = this.lostIssue.lostIssueForm.get('lostRemark').value;
        this.saveLostIssue(inlandRemittanceInstrumentLostInfo);
    }

    refundRemittanceIssue() {
        this.refundIssue.setData(this.selectedRow);
        this.displayRefundIssue = true;
    }

    saveInladRemittanceRefundIssue(refundIssueTypeToSave: InlandRemittanceInstrument) {
        this.subscribers.refundIssueSaveSub = this.inlandRemittanceIssueService
            .saveInlandRemittanceRefundIssue(refundIssueTypeToSave, { 'instrumentId': this.refundIssue.inlandRemittanceInstrument.id })
            .subscribe((data) => {
                this.notificationService.sendSuccessMsg('inland.remittance.refund.issue.success');
                this.displayRefundIssue = false;
                this.fetchInlandRemittanceIssues(new Map());
                this.refundIssue.prepareRefundIssueForm();
            });
    }

    saveRefundInladRemittanceIssue() {
        this.saveInladRemittanceRefundIssue(this.refundIssue.refundIssueForm.value);
    }

    updateInlandRemittanceIssue(inlandRemittanceInstrument) {
        this.paymentIssue.setData(this.selectedRow);
        this.displaypaymentIssue = true;
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let view_ui = DETAILS_UI + `?`;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));

        this.markFormGroupAsTouched(this.paymentIssue.paymentIssueForm);
        if (this.paymentIssue.paymentIssueForm.invalid) return;
        let inlandRemittanceInstrumentPaymentInfo = new InlandRemittanceInstrumentPaymentInfo();
        inlandRemittanceInstrumentPaymentInfo.instrumentNo = this.paymentIssue.inlandRemittanceInstrument.instrumentNo + "";
        inlandRemittanceInstrumentPaymentInfo.currencyCode = this.paymentIssue.inlandRemittanceInstrument.currencyCode;
        inlandRemittanceInstrumentPaymentInfo.productId = this.paymentIssue.inlandRemittanceInstrument.inlandRemittanceProduct.id;
        inlandRemittanceInstrumentPaymentInfo.paymentMethod = this.paymentIssue.paymentIssueForm.get('paymentMethod').value;
        inlandRemittanceInstrumentPaymentInfo.payeeNid = this.paymentIssue.paymentIssueForm.get('payeeNid').value;
        inlandRemittanceInstrumentPaymentInfo.payeeAccountNo = this.paymentIssue.paymentIssueForm.get('payeeAccountNo').value;
        inlandRemittanceInstrumentPaymentInfo.paymentRemark = this.paymentIssue.paymentIssueForm.get('paymentRemark').value;
        this.InlandRemittancePaymentIssueSave(inlandRemittanceInstrumentPaymentInfo, urlSearchParams, event);
    }

    InlandRemittancePaymentIssueSave(PaymentIssueToSave: InlandRemittanceInstrumentPaymentInfo, urlSearchParams, event) {
        this.subscribers.InlandRemittancePaypentIssueSaveSub = this.inlandRemittanceIssueService
            .saveInlandRemittancePaymentIssue(PaymentIssueToSave, urlSearchParams).subscribe(data => {
                //this.notificationService.sendSuccessMsg("inland.remittance.payment.issue.createtion.success");
                event.approvalFlowRequired
                    ? this.notificationService.sendSuccessMsg("workflow.task.verify.send")
                    : this.notificationService.sendSuccessMsg("inland.remittance.payment.issue.createtion.success");
                this.displaypaymentIssue = false;
                this.fetchInlandRemittanceIssues(new Map());
                this.paymentIssue.preparePaymentIssueForm(new InlandRemittanceInstrumentPaymentInfo);
            });
    }

    saveInlandRemittancePaymentIssue() {
        this.showVerifierSelectionModal = of(true);
        this.command = commandConstants.CREATE_INLAND_REMITTANCE_PAYMENT;
    }
    viewIssueData() {
        this.viewIssue.setData(this.selectedRow);
        this.displayViewIssue = true;
    }

    cancelPaymentIssue() {
        this.displaypaymentIssue = false;
        this.paymentIssue.paymentIssueForm.reset();
    }
    cancelLostIssue() {
        this.displayLostIssue = false;
        this.lostIssue.lostIssueForm.reset();
    }
    cancelRefundIssue() {
        this.displayRefundIssue = false;
        this.refundIssue.refundIssueForm.reset();
    }
    back() {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }

    RemittanceReissue() {
        this.router.navigate(['remittance/issue-list/reissue'], {
            queryParams: {
                instrumentNo: this.instrumentNo,
                currencyCode: this.currencyCode,
                productId: this.productId,
                productType: this.productType
                // purchaseAmount:this.purchaseAmount
            }
        });
    }
}