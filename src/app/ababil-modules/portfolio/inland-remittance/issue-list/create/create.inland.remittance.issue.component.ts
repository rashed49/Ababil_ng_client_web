import { Component, OnInit, SimpleChanges } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BaseComponent } from "../../../../../common/components/base.component";
import { SelectItem } from 'primeng/api';
import { PurchaseMethod } from "../../../../../common/domain/inland.remittance.payment.method.enum.model";
import { InlandRemittanceIssueService } from "../../../../../services/inland-remittance/issue/service-api/inland.remittance.issue.service";
import { InlandRemittanceInstrumentService } from "../../../../../services/inland-remittance/instrument/service-api/inland.remittance.instrument.service";
import { InlandRemittanceLotService } from "../../../../../services/inland-remittance/lot/service-api/inland.remittance.lot.service";
import { LazyLoadEvent } from "primeng/components/common/lazyloadevent";
import { NotificationService } from "../../../../../common/notification/notification.service";
import { InlandRemittanceChargeService } from "../../../../../services/inland-remittance/charge/service-api/inland.remittance.charge.service";
import { InlandRemittanceChargeInformations } from "../../../../../services/inland-remittance/charge/domain/inland.remittance.charge.models";
import { InlandRemittanceInstrumentIssueInfos } from "../../../../../services/inland-remittance/issue/domain/inland.remittance.issue.models";
import { CurrencyService } from "../../../../../services/currency/service-api/currency.service";
import { Currency, ExchangeRate } from "../../../../../services/currency/domain/currency.models";
import { ExchangeRateService } from "../../../../../services/currency/service-api/exchange.rate.service";
import * as abbabilValidators from '../../../../../common/constants/app.validator.constants';
import * as commandConstants from '../../../../../common/constants/app.command.constants';
import { ApprovalflowService } from "../../../../../services/approvalflow/service-api/approval.flow.service";
import { FormBaseComponent } from "../../../../../common/components/base.form.component";
import { Location } from '@angular/common';
import { Observable, of } from "rxjs";
import { VerifierSelectionEvent } from "../../../../../common/components/verifier-selection/verifier.selection.component";
import { AccountService } from "../../../../../services/account/service-api/account.service";
export const DETAILS_UI = 'views/issue-view';

@Component({
    selector: 'Issue-create',
    templateUrl: './create.inland.remittance.issue.component.html',
    styleUrls: ['./create.inland.remittance.issue.component.scss']
})
export class CreateIssueComponent extends FormBaseComponent implements OnInit {

    createIssueForm: FormGroup;
    inlandRemittanceInstrumentIssueInfos: InlandRemittanceInstrumentIssueInfos;
    inlandRemittanceInstrumentIssueInfoses: InlandRemittanceInstrumentIssueInfos[] = [];
    inlandRemittanceChargeInformations: InlandRemittanceChargeInformations[] = [];
    purchaseMethod: SelectItem[] = PurchaseMethod;
    exchangeRate: ExchangeRate = new ExchangeRate;
    inlandRemittanceProduct: any[] = [];
    currencyCode: any[] = [];
    exchangeRateTypes: SelectItem[];

    remittanceProductTypeMap: Map<number, any> = new Map();
    searchMap: Map<string, any>

    showAccountOptions: boolean = false;
    samePurshaserChecker: boolean;
    samePayeeChecker: boolean;
    sameDebitChecker: boolean;
    showExchangeRate: boolean = false;

    id: number;
    baseTotalAmount: number;
    BasedExchangeRate: number = 1;
    totalChargeLCY: number = 0;
    totalAmount: number;

    base_currency: string;
    selectedCurrency: string;
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
        private inlandRemittanceIssueService: InlandRemittanceIssueService,
        private instrumentService: InlandRemittanceInstrumentService,
        private lotService: InlandRemittanceLotService,
        private notificationService: NotificationService,
        private router: Router,
        private formBuilder: FormBuilder,
        private inlandRemittanceChargeService: InlandRemittanceChargeService,
        private currencyService: CurrencyService,
        private exchangeRateService: ExchangeRateService,
        protected location: Location,
        protected approvalFlowService: ApprovalflowService,
        private accountService: AccountService) {
        super(location, approvalFlowService);
    }

    ngOnInit(): void {
        this.exchangeRateTypes = [];
        this.preparecreateIssueForm(new InlandRemittanceInstrumentIssueInfos);
        this.fetchInlandRemittanceProductType();
        this.fetchBaseCurrency();
        this.showVerifierSelectionModal = of(false);
    }

    preparecreateIssueForm(inlandRemittanceInstrumentIssueInfos: InlandRemittanceInstrumentIssueInfos) {
        this.createIssueForm = this.formBuilder.group({
            purchaseAmount: [inlandRemittanceInstrumentIssueInfos.purchaseAmount, [Validators.required]],
            purchaserName: [inlandRemittanceInstrumentIssueInfos.purchaserName, [Validators.required, abbabilValidators.personNameValidator]],
            purchaserAddress: [inlandRemittanceInstrumentIssueInfos.purchaserAddress, [Validators.required]],
            purchaserMobile: [inlandRemittanceInstrumentIssueInfos.purchaserMobile, [Validators.required, abbabilValidators.phoneNumberValidator]],
            purchaserNid: [inlandRemittanceInstrumentIssueInfos.purchaserNid, [Validators.required]],
            payeeName: [inlandRemittanceInstrumentIssueInfos.payeeName, [Validators.required, abbabilValidators.personNameValidator]],
            payeeAddress: [inlandRemittanceInstrumentIssueInfos.payeeAddress, [Validators.required]],
            payeeMobile: [inlandRemittanceInstrumentIssueInfos.payeeMobile, [Validators.required, abbabilValidators.phoneNumberValidator]],
            payeeNid: [inlandRemittanceInstrumentIssueInfos.payeeNid, [Validators.required]],
            purchaseMethod: [inlandRemittanceInstrumentIssueInfos.purchaseMethod, [Validators.required]],
            purchaserAccountNo: [inlandRemittanceInstrumentIssueInfos.purchaserAccountNo],
            inlandRemittanceProductId: [inlandRemittanceInstrumentIssueInfos.remittanceProductId, [Validators.required]],
            currencyCode: [inlandRemittanceInstrumentIssueInfos.instrumentCurrencyCode, [Validators.required]],
            purchaseRemark: [inlandRemittanceInstrumentIssueInfos.purchaseRemark, [Validators.required]],
            purchaserChequeNo: [inlandRemittanceInstrumentIssueInfos.purchaserChequeNo, [Validators.required]],
            exchangeRate: [''],
            exchangeRateTypeId: [''],
            baseamount: [null],
            chequeDate: [new Date(inlandRemittanceInstrumentIssueInfos.chequeDate)]
        });

        this.createIssueForm.get('exchangeRateTypeId').valueChanges.subscribe(data => {
            this.fetchExchangeRateByCurrencyCode(this.createIssueForm.get('exchangeRateTypeId').value, this.createIssueForm.get('currencyCode').value);
        });

        this.createIssueForm.get('purchaseAmount').valueChanges.subscribe(val => {
            let amount = this.createIssueForm.get('purchaseAmount').value;
            this.createIssueForm.get('baseamount').setValue(amount * this.createIssueForm.get('exchangeRate').value);
        });

        this.createIssueForm.get('exchangeRate').valueChanges.subscribe(value => {
            this.createIssueForm.get('baseamount').setValue(this.createIssueForm.get('exchangeRate').value * this.createIssueForm.get('purchaseAmount').value);
        });

        this.createIssueForm.get('inlandRemittanceProductId').valueChanges.subscribe(val => {
            if (val != null) {
                this.lotService.fetchInlandRemittanceCurrency({ productId: val }).subscribe(data => {
                    this.currencyCode = [{ label: 'Choose Remittance Currency  Type', value: null }].concat(data.map(element => {
                        return { label: element.currencyCode, value: element.currencyCode }
                    }));
                });
            }
        });

        if (this.createIssueForm.get('inlandRemittanceProductId').value != null) {
            this.lotService.fetchInlandRemittanceCurrency({ productId: this.createIssueForm.get('inlandRemittanceProductId').value }).subscribe(data => {
                this.currencyCode = [{ label: 'Choose Remittance Currency  Type', value: null }].concat(data.map(element => {
                    return { label: element.currencyCode, value: element.currencyCode }
                }));
            });
        }
        this.createIssueForm.get('currencyCode').valueChanges.subscribe(val => {
            console.log(val);
            this.selectedCurrency = val;
            if (this.base_currency == this.selectedCurrency) {
                this.showExchangeRate = false;
                this.inlandRemittanceChargeInformations = [];
                this.createIssueForm.get('purchaseAmount').reset();
                this.createIssueForm.get('exchangeRate').reset();
                this.createIssueForm.get('baseamount').reset();
            } else {
                this.fetchExchangeRateTypes();
                this.showExchangeRate = true;
                this.inlandRemittanceChargeInformations = [];
                this.createIssueForm.get('purchaseAmount').reset();

            }
        });
        //Purchase type selection changes
        this.createIssueForm.get('purchaseMethod').valueChanges.subscribe(val => {
            console.log(val);
            if (val === "ACCOUNT") {
                this.showAccountOptions = true;
            } else {
                this.showAccountOptions = false;
            }
        });
    }

    back() {
        this.router.navigate(['../'], { relativeTo: this.route });
    }

    fetchInlandRemittanceProductType() {
        this.subscribers.fetchLotSub = this.lotService
            .fetchInlandRemittanceProduct()
            .subscribe(res => {
                this.inlandRemittanceProduct = [{ label: 'Choose Remittance Product type', value: null }].concat(res.map(element => {
                    return { label: element.name, value: element.id }
                }));
            });
    }

    addInlandRemittanceInstrumentInstrumentIssue() {
        this.markFormGroupAsTouched(this.createIssueForm)
        if (this.createIssueForm.invalid) return;
        this.inlandRemittanceInstrumentIssueInfos = new InlandRemittanceInstrumentIssueInfos();
        this.inlandRemittanceInstrumentIssueInfos.remittanceProductId = this.createIssueForm.get('inlandRemittanceProductId').value;
        this.inlandRemittanceInstrumentIssueInfos.instrumentCurrencyCode = this.createIssueForm.get('currencyCode').value;
        this.inlandRemittanceInstrumentIssueInfos.purchaseAmount = this.createIssueForm.get('purchaseAmount').value;
        this.inlandRemittanceInstrumentIssueInfos.purchaserName = this.createIssueForm.get('purchaserName').value;
        this.inlandRemittanceInstrumentIssueInfos.purchaserAddress = this.createIssueForm.get('purchaserAddress').value;
        this.inlandRemittanceInstrumentIssueInfos.purchaserMobile = this.createIssueForm.get('purchaserMobile').value;
        this.inlandRemittanceInstrumentIssueInfos.purchaserNid = this.createIssueForm.get('purchaserNid').value;
        this.inlandRemittanceInstrumentIssueInfos.payeeNid = this.createIssueForm.get('payeeNid').value;
        this.inlandRemittanceInstrumentIssueInfos.payeeName = this.createIssueForm.get('payeeName').value;
        this.inlandRemittanceInstrumentIssueInfos.payeeAddress = this.createIssueForm.get('payeeAddress').value;
        this.inlandRemittanceInstrumentIssueInfos.payeeMobile = this.createIssueForm.get('payeeMobile').value;
        this.inlandRemittanceInstrumentIssueInfos.purchaseMethod = this.createIssueForm.get('purchaseMethod').value;
        this.inlandRemittanceInstrumentIssueInfos.purchaserAccountNo = this.createIssueForm.get('purchaserAccountNo').value;
        this.inlandRemittanceInstrumentIssueInfos.purchaseRemark = this.createIssueForm.get('purchaseRemark').value;
        this.inlandRemittanceInstrumentIssueInfos.purchaserChequeNo = this.createIssueForm.get('purchaserChequeNo').value;
        this.inlandRemittanceInstrumentIssueInfos.exchangeRate = this.createIssueForm.get('exchangeRate').value;
        this.inlandRemittanceInstrumentIssueInfos.rateType = this.createIssueForm.get('exchangeRateTypeId').value;
        this.inlandRemittanceInstrumentIssueInfos.chequeDate = this.createIssueForm.get('chequeDate').value;

        this.inlandRemittanceInstrumentIssueInfos.inlandRemittanceChargeInformations = this.inlandRemittanceChargeInformations;
        this.inlandRemittanceInstrumentIssueInfoses = [this.inlandRemittanceInstrumentIssueInfos, ...this.inlandRemittanceInstrumentIssueInfoses];

        this.createIssueForm.get('inlandRemittanceProductId').reset();
        this.createIssueForm.get('currencyCode').reset();
        this.createIssueForm.get('purchaseAmount').reset();
        this.createIssueForm.get('chequeDate').reset();

        if (!this.samePurshaserChecker) {
            this.createIssueForm.get('purchaserName').reset();
            this.createIssueForm.get('purchaserAddress').reset();
            this.createIssueForm.get('purchaserMobile').reset();
            this.createIssueForm.get('purchaserNid').reset();
        }
        if (!this.samePayeeChecker) {
            this.createIssueForm.get('payeeNid').reset();
            this.createIssueForm.get('payeeName').reset();
            this.createIssueForm.get('payeeAddress').reset();
            this.createIssueForm.get('payeeMobile').reset();
        }
        if (!this.sameDebitChecker) {
            this.createIssueForm.get('purchaseMethod').reset();
            this.createIssueForm.get('purchaserAccountNo').reset();
            this.createIssueForm.get('purchaserChequeNo').reset();
            this.createIssueForm.get('purchaseRemark').reset();
        }
        this.inlandRemittanceChargeInformations = [];
    }

    createInlandRemittanceInstrumentIssue(instrumentIssueToSave, urlSearchParams, event) {
        this.subscribers.InlandRemittanceInstrumentIssueSaveSub = this.instrumentService
            .saveInlandRemittanceInstrumentIssue(instrumentIssueToSave, urlSearchParams).subscribe(data => {
                event.approvalFlowRequired
                    ? this.notificationService.sendSuccessMsg("workflow.task.verify.send")
                    : this.notificationService.sendSuccessMsg("inland.remittance.issue.createtion.success");
                console.log(data);
                this.router.navigate(['/remittance/instrument-list']);
            });
    }

    saveInlandRemittanceInstrumentInstrumentIssue() {
        this.showVerifierSelectionModal = of(true);
        this.command = commandConstants.CREATE_INLAND_INSTRUMENT_ISSUE;
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let view_ui = DETAILS_UI + `?`;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));
        this.createInlandRemittanceInstrumentIssue(this.inlandRemittanceInstrumentIssueInfoses, urlSearchParams, event);
    }

    deleteInlandRemittanceInstrumentInstrumentIssue(index) {
        let temp = Object.assign([], this.inlandRemittanceInstrumentIssueInfoses);
        temp.splice(index, 1);
        this.inlandRemittanceInstrumentIssueInfoses = Object.assign([], temp);
    }

    fatchInladRemittanceCharges(amount) {
        let urlQueryParamMap = new Map();
        urlQueryParamMap.set("activityId", "1");
        urlQueryParamMap.set("productId", this.createIssueForm.get('inlandRemittanceProductId').value);
        urlQueryParamMap.set("currencyCode", this.createIssueForm.get('currencyCode').value);
        urlQueryParamMap.set("amount", amount);
        if (this.createIssueForm.get('inlandRemittanceProductId').value && this.createIssueForm.get('currencyCode').value) {
            this.subscribers.fatchChargeSub = this.inlandRemittanceChargeService
                .fetchInladRemittanceCharge(urlQueryParamMap).subscribe(data => {
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

                        if (this.base_currency == this.selectedCurrency) {
                            inlandRemittanceChargeInformation.commissionLCY = this.BasedExchangeRate * result.chargeAmount;
                            inlandRemittanceChargeInformation.vatLCY = this.BasedExchangeRate * result.vatAmount;
                            inlandRemittanceChargeInformation.totalAmountLCY = result.chargeAmount + result.vatAmount;
                            this.baseTotalAmount = (this.createIssueForm.get('purchaseAmount').value + this.totalChargeLCY);
                        }
                        else {
                            inlandRemittanceChargeInformation.commissionLCY = this.createIssueForm.get('exchangeRate').value * result.chargeAmount;
                            inlandRemittanceChargeInformation.vatLCY = this.createIssueForm.get('exchangeRate').value * result.vatAmount;
                            inlandRemittanceChargeInformation.totalAmountLCY = this.createIssueForm.get('exchangeRate').value * result.chargeAmount + this.createIssueForm.get('exchangeRate').value * result.vatAmount;
                            this.totalChargeLCY=this.totalChargeLCY+(this.createIssueForm.get('exchangeRate').value * result.chargeAmount + this.createIssueForm.get('exchangeRate').value * result.vatAmount);
                            this.baseTotalAmount = (this.createIssueForm.get('baseamount').value + this.totalChargeLCY);
                        }

                        temporaryInlandRemittanceChargeInformations.push(inlandRemittanceChargeInformation);
                    }
                    this.inlandRemittanceChargeInformations = [...temporaryInlandRemittanceChargeInformations];
                });
        }
    }

    fetchBaseCurrency() {
        let urlQueryParamMap = new Map();
        urlQueryParamMap.set("name", "base-currency")
        this.subscribers.baseCurrencySub = this.currencyService.fetchBaseCurrency(urlQueryParamMap)
            .subscribe(data => {
                this.base_currency = data;
            });
    }

    fetchExchangeRateTypes() {
        this.exchangeRateTypes = [];
        this.exchangeRateTypes.push({ label: "Select exchange type", value: null });
        this.exchangeRateService.fetchExchangeRateTypes().subscribe(data => {
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
                this.createIssueForm.get('exchangeRate').setValue(exchangeRate.rate);
            }
        );
    }
    showSignature() {
        if (this.createIssueForm.get('purchaserAccountNo').value) {
            this.accountNumber = this.createIssueForm.get('purchaserAccountNo').value;
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

