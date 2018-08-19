import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NotificationService } from "../../../../../common/notification/notification.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { InlandRemittanceChargeService } from "../../../../../services/inland-remittance/charge/service-api/inland.remittance.charge.service";
import { CurrencyService } from "../../../../../services/currency/service-api/currency.service";
import { ExchangeRateService } from "../../../../../services/currency/service-api/exchange.rate.service";
import { BaseComponent } from "../../../../../common/components/base.component";
import { InlandRemittanceInstrumentIssueInfos } from "../../../../../services/inland-remittance/issue/domain/inland.remittance.issue.models";
import { SelectItem } from 'primeng/api';
import { ExchangeRate } from "../../../../../services/currency/domain/currency.models";
import { InlandRemittanceChargeInformations } from "../../../../../services/inland-remittance/charge/domain/inland.remittance.charge.models";
import { InlandRemittanceIssueService } from "../../../../../services/inland-remittance/issue/service-api/inland.remittance.issue.service";
import { InlandRemittanceInstrument } from "../../../../../services/inland-remittance/instrument/domain/inland.remittance.instrument.models";
import { InlandRemittanceInstrumentReIssueInfo } from "../../../../../services/inland-remittance/issue/domain/inland.remittance.reissue.models";
import { PurchaseMethod } from "../../../../../common/domain/inland.remittance.payment.method.enum.model";
import * as commandConstants from '../../../../../common/constants/app.command.constants';
import { ApprovalflowService } from "../../../../../services/approvalflow/service-api/approval.flow.service";
import { FormBaseComponent } from "../../../../../common/components/base.form.component";
import { Location } from '@angular/common';
import { Observable, of } from "rxjs";
import { VerifierSelectionEvent } from "../../../../../common/components/verifier-selection/verifier.selection.component";
import { AccountService } from "../../../../../services/account/service-api/account.service";
export const DETAILS_UI = 'views/reissue-view';
@Component({
    selector: 'reissue',
    templateUrl: './inland.remittance.reissue.component.html',
    styleUrls: ['./inland.remittance.reissue.component.html']
})
export class ReissueComponent extends FormBaseComponent implements OnInit {


    reissueForm: FormGroup;
    inlandRemittanceChargeInformations: InlandRemittanceChargeInformations[] = [];
    inlandRemittanceInstrumentReIssueInfo: InlandRemittanceInstrumentReIssueInfo = new InlandRemittanceInstrumentReIssueInfo();
    purchaseMethod: SelectItem[] = PurchaseMethod;
    queryParams: any;
    instrumentNo: string;
    productId: number;
    currencyCode: string;
    exchangeRateTypes: SelectItem[];
    exchangeRate: ExchangeRate = new ExchangeRate;
    base_currency: string;
    BasedExchangeRate: number = 1;
    totalChargeLCY: number = 0;
    selectedCurrency: string;
    purchaseAmount: number;
    showExchangeRate: boolean = true;
    showAccountOptions: boolean = false;
    productType: string;
    accountNumber: string;

    signatureAccountId: number;
    signatureCustomerInputId: number;
    demandDepositSignatureDisplay = false;

    signatureFixedDepositAccountId: number;
    fixedDepositSignatureDisplay = false;
    signatureFixedDepositCustomerInputId: number;

    signatureRecurringDepositCustomerInputId: number;
    signatureRecurringDepositAccountId: number;
    recurringDepositSignatureDisplay = false;


    constructor(private route: ActivatedRoute,
        private notificationService: NotificationService,
        private router: Router,
        private formBuilder: FormBuilder,
        private inlandRemittanceChargeService: InlandRemittanceChargeService,
        private currencyService: CurrencyService,
        private exchangeRateService: ExchangeRateService,
        private inlandRemittanceIssueService: InlandRemittanceIssueService,
        protected location: Location,
        protected approvalFlowService: ApprovalflowService,
        private accountService: AccountService) {
        super(location, approvalFlowService);
    }

    ngOnInit(): void {

        this.preparecreateIssueForm(new InlandRemittanceInstrumentReIssueInfo);
        this.fetchExchangeRateTypes();
        this.fetchBaseCurrency();
        this.showVerifierSelectionModal = of(false);


        this.subscribers.queryParamSub = this.route.queryParams.subscribe(data => {
            this.queryParams = data;
            this.instrumentNo = this.queryParams.instrumentNo;
            this.currencyCode = this.queryParams.currencyCode;
            this.productId = this.queryParams.productId;
            this.productType = this.queryParams.productType;
            //  this.purchaseAmount = this.queryParams.purchaseAmount;
        });


    }

    fatchInladRemittanceCharges() {
        let urlQueryParamMap = new Map();
        urlQueryParamMap.set("activityId", "5");
        urlQueryParamMap.set("productId", this.queryParams.productId);
        urlQueryParamMap.set("currencyCode", this.queryParams.currencyCode);
        urlQueryParamMap.set("amount", "100");
        this.subscribers.fatchChargeSub = this.inlandRemittanceChargeService
            .fetchInladRemittanceCharge(urlQueryParamMap).subscribe(data => {
                this.inlandRemittanceChargeInformations = data;
                let tempInlandRemittanceChargeInformations: InlandRemittanceChargeInformations[] = data;
                let temporaryInlandRemittanceChargeInformations: InlandRemittanceChargeInformations[] = [];

                for (let result of tempInlandRemittanceChargeInformations) {
                    let inlandRemittanceChargeInformation: InlandRemittanceChargeInformations = new InlandRemittanceChargeInformations();
                    inlandRemittanceChargeInformation.chargeAmount = result.chargeAmount;
                    inlandRemittanceChargeInformation.vatAmount = result.vatAmount;
                    inlandRemittanceChargeInformation.chargeName = result.chargeName;
                    inlandRemittanceChargeInformation.chargeGl = result.chargeGl;
                    inlandRemittanceChargeInformation.vatGl = result.vatGl;
                    inlandRemittanceChargeInformation.chargeId = result.chargeId;
                    inlandRemittanceChargeInformation.modifiedChargeAmount = result.modifiedChargeAmount;
                    inlandRemittanceChargeInformation.modifiedVatAmount = result.modifiedVatAmount;
                    inlandRemittanceChargeInformation.totalAmount = result.chargeAmount + result.vatAmount;
                    this.totalChargeLCY = this.totalChargeLCY + (result.chargeAmount + result.vatAmount);

                    if (this.base_currency == this.queryParams.currencyCode) {
                        inlandRemittanceChargeInformation.commissionLCY = this.BasedExchangeRate * result.chargeAmount;
                        inlandRemittanceChargeInformation.vatLCY = this.BasedExchangeRate * result.vatAmount;
                        inlandRemittanceChargeInformation.totalAmountLCY = result.chargeAmount + result.vatAmount;
                    }
                    else {
                        inlandRemittanceChargeInformation.commissionLCY = this.reissueForm.get('exchangeRate').value * result.chargeAmount;
                        inlandRemittanceChargeInformation.vatLCY = this.reissueForm.get('exchangeRate').value * result.vatAmount;
                        inlandRemittanceChargeInformation.totalAmountLCY = inlandRemittanceChargeInformation.commissionLCY + inlandRemittanceChargeInformation.vatLCY;
                    }

                    temporaryInlandRemittanceChargeInformations.push(inlandRemittanceChargeInformation);
                }
                this.inlandRemittanceChargeInformations = [...temporaryInlandRemittanceChargeInformations];
            });
    }

    preparecreateIssueForm(inlandRemittanceInstrumentReIssueInfo: InlandRemittanceInstrumentReIssueInfo) {
        this.reissueForm = this.formBuilder.group({
            purchaseMethod: [inlandRemittanceInstrumentReIssueInfo.purchaseMethod, [Validators.required]],
            purchaserAccountNo: [inlandRemittanceInstrumentReIssueInfo.purchaserAccountNo, [Validators.required]],
            purchaserChequeNo: [inlandRemittanceInstrumentReIssueInfo.purchaserChequeNo, [Validators.required]],
            exchangeRate: [''],
            exchangeRateTypeId: [''],
            chequeDate: [new Date(inlandRemittanceInstrumentReIssueInfo.chequeDate)]
        });
        this.reissueForm.get('exchangeRateTypeId').valueChanges.subscribe(
            data => {
                console.log('ok');
                this.fetchExchangeRateByCurrencyCode(this.reissueForm.get('exchangeRateTypeId').value, this.queryParams.currencyCode);
                this.fatchInladRemittanceCharges();
            });

        this.reissueForm.get('purchaseMethod').valueChanges.subscribe(val => {
            console.log(val);
            if (val === "ACCOUNT") {
                this.showAccountOptions = true;
            } else {
                this.showAccountOptions = false;
            }
        });

    }

    createInlandRemittanceReissue(reissueToSave, urlSearchParams, event) {
        this.subscribers.inlandRemittanceReissueSub = this.inlandRemittanceIssueService.saveInlandRemittanceReissue(reissueToSave, urlSearchParams)
            .subscribe(data => {
                event.approvalFlowRequired
                    ? this.notificationService.sendSuccessMsg("workflow.task.verify.send")
                    : this.notificationService.sendSuccessMsg("inland.remittance.reissue.createtion.success");
                this.preparecreateIssueForm(new InlandRemittanceInstrumentReIssueInfo);
                this.inlandRemittanceChargeInformations = [];
            });
    }
    saveInlandRemittanceReissue() {
        this.showVerifierSelectionModal = of(true);
        this.command = commandConstants.CREATE_INLAND_REMITTANCE_REISSUE;
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let view_ui = DETAILS_UI + `?`;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));
        this.markFormGroupAsTouched(this.reissueForm);
        if (this.reissueForm.invalid) return;
        this.inlandRemittanceInstrumentReIssueInfo = new InlandRemittanceInstrumentReIssueInfo();
        this.inlandRemittanceInstrumentReIssueInfo.inlandRemittanceChargeInformations = this.inlandRemittanceChargeInformations;
        this.inlandRemittanceInstrumentReIssueInfo.previousInstrumentNo = this.instrumentNo;
        this.inlandRemittanceInstrumentReIssueInfo.currencyCode = this.currencyCode;
        this.inlandRemittanceInstrumentReIssueInfo.productId = this.productId;
        this.inlandRemittanceInstrumentReIssueInfo.purchaseMethod = this.reissueForm.get('purchaseMethod').value;
        this.inlandRemittanceInstrumentReIssueInfo.purchaserAccountNo = this.reissueForm.get('purchaserAccountNo').value;
        this.inlandRemittanceInstrumentReIssueInfo.purchaserChequeNo = this.reissueForm.get('purchaserChequeNo').value;
        this.inlandRemittanceInstrumentReIssueInfo.exchangeRate = this.reissueForm.get('exchangeRate').value;
        this.inlandRemittanceInstrumentReIssueInfo.rateType = this.reissueForm.get('exchangeRateTypeId').value;
        this.inlandRemittanceInstrumentReIssueInfo.chequeDate = this.reissueForm.get('chequeDate').value;
        this.createInlandRemittanceReissue(this.inlandRemittanceInstrumentReIssueInfo, urlSearchParams, event);
    }

    fetchBaseCurrency() {
        let urlQueryParamMap = new Map();
        urlQueryParamMap.set("name", "base-currency")
        this.subscribers.baseCurrencySub = this.currencyService.fetchBaseCurrency(urlQueryParamMap)
            .subscribe(data => {
                this.base_currency = data;
                if (this.base_currency == this.queryParams.currencyCode) {
                    this.fatchInladRemittanceCharges();
                    this.showExchangeRate = false;
                }
            });
    }
    fetchExchangeRateTypes() {
        this.exchangeRateTypes = [];
        this.exchangeRateTypes.push({ label: "Select exchange type", value: null });
        this.exchangeRateService.fetchExchangeRateTypes().subscribe(
            data => {
                (data.content).forEach(element => {
                    this.exchangeRateTypes.push({ label: element.typeName, value: element.id });
                });
            }
        )
    }
    fetchExchangeRateByCurrencyCode(rateTypeId: number, currencyCode: string) {
        this.exchangeRateService.fetcExchangeRatesByCurrencyCode({ rateTypeId: rateTypeId, currencyCode: currencyCode }).subscribe(
            exchangeRate => {
                this.exchangeRate.rate = exchangeRate.rate;
                this.reissueForm.get('exchangeRate').setValue(exchangeRate.rate);
            }
        );
    }
    back() {
        this.router.navigate(['../'], { relativeTo: this.route });
    }
    showSignature() {
        if (this.reissueForm.get('purchaserAccountNo').value) {
            this.accountNumber = this.reissueForm.get('purchaserAccountNo').value;
            let accountQueryParams = new Map<string, string>().set('accountNumber', this.accountNumber);
            this.subscribers.fetchAccountDetailSub = this.accountService.fetchAccounts(accountQueryParams).subscribe(
                account => {
                    if (account.content[0].type == "DEMAND_DEPOSIT") {
                        this.signatureAccountId = account.content[0].id;
                        this.signatureCustomerInputId = account.content[0].customerId;
                        if (this.signatureAccountId && this.signatureCustomerInputId) {
                            this.demandDepositSignatureDisplay = true;
                        }
                    }

                    else if (account.content[0].type == "FIXED_DEPOSIT") {
                        this.signatureFixedDepositAccountId = account.content[0].id;
                        this.signatureFixedDepositCustomerInputId = account.content[0].customerId;
                        if (this.signatureFixedDepositAccountId && this.signatureFixedDepositCustomerInputId) {
                            this.fixedDepositSignatureDisplay = true;
                        }
                    }

                    else if (account.content[0].type == "RECURRING_DEPOSIT") {
                        this.signatureRecurringDepositAccountId = account.content[0].id;
                        this.signatureRecurringDepositCustomerInputId = account.content[0].customerId;
                        if (this.signatureRecurringDepositAccountId && this.signatureRecurringDepositCustomerInputId) {
                            this.recurringDepositSignatureDisplay = true;
                        }
                    }

                }
            )
        }
    }
}