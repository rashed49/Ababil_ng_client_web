import { SelectItem } from 'primeng/api';
import { CurrencyRestriction } from './../../../../../../common/domain/teller.enum.model';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { NotificationService } from "../../../../../../common/notification/notification.service";
import { CISService } from './../../../../../../services/cis/service-api/cis.service';
import { Customer } from "../../../../../../services/cis/domain/customer.model";
import { Address } from "../../../../../../services/cis/domain/address.model";
import { DemandDepositAccountService } from "../../../../../../services/demand-deposit-account/service-api/demand.deposit.account.service";
import { DemandDepositAccount } from "../../../../../../services/demand-deposit-account/domain/demand.deposit.account.models";
import { RecurringDepositProduct } from './../../../../../../services/recurring-deposit-product/domain/recurring.deposit.product.model';
import { RecurringDepositProductService } from "../../../../../../services/recurring-deposit-product/service-api/recurring.deposit.product.service";
import { AccountService } from './../../../../../../services/account/service-api/account.service';
import { AccountOpeningChannels } from "../../../../../../services/account/domain/account.opening.channels";
import { CurrencyService } from '../../../../../../services/currency/service-api/currency.service';
import { ContactInformation } from '../../../../../../services/cis/domain/contact.information.model';
import { ProductService } from '../../../../../../services/product/service-api/product.service';
import * as abbabilValidators from '../../../../../../common/constants/app.validator.constants';
import { RecurringDepositAccount } from '../../../../../../services/recurring-deposit-account/domain/recurring.deposit.account.model';
import { PensionType } from '../../../../../../common/domain/recurring.deposit.account.enum.model';
import { TenorType } from '../../../../../../common/domain/time.deposit.product.enum.model';
import { ApprovalflowService } from '../../../../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from '../../../../../../common/components/base.form.component';
import { of } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { VerifierSelectionEvent } from '../../../../../../common/components/verifier-selection/verifier.selection.component';

export interface RecurringDepositAccountSaveEvent {
    recurringDepositAccountForm: RecurringDepositAccount,
    verifier: string,
    taskId: string,
    approvalFlowRequired: boolean
}


@Component({
    selector: 'recurring-deposit-account-form',
    templateUrl: './recurring.deposit.account.form.component.html'
})
export class RecurringDepositAccountFormComponent extends FormBaseComponent implements OnInit {

    customerId: number;
    customer: Customer = new Customer();
    contactAddress: Address = new Address();
    contactInformation: ContactInformation = new ContactInformation();
    recurringDepositAccountForm: FormGroup;
    introducer: DemandDepositAccount = new DemandDepositAccount();
    linkAccount: DemandDepositAccount = new DemandDepositAccount();
    recurringDepositProducts: RecurringDepositProduct[];
    accountOpeningChannels: AccountOpeningChannels[] = [];
    recurringDepositProductId: number;
    recurringDepositProduct: RecurringDepositProduct = new RecurringDepositProduct();
    tenors: SelectItem[] = [];
    installmentSizes: SelectItem[] = [];
    pensionTypes: SelectItem[] = PensionType;
    pensionPeriodTypes: SelectItem[] = TenorType;
    accountNumber: string;
    introducerAccountNumber: string;
    linkAccountNumber: string;
    specialRate: boolean = false;
    type: string = '';
    tenorType: string;
    multipleCurrency: boolean = false;
    currencies: SelectItem[] = [];
    createMode: boolean = true;
    accountDetailFieldDisable: boolean;
    constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private cisService: CISService,
        private currencyService: CurrencyService,
        private demandDepositAccountService: DemandDepositAccountService,
        protected location: Location,
        protected approvalFlow: ApprovalflowService,
        private notificationService: NotificationService,
        private productService: ProductService,
        private recurringDepositProductService: RecurringDepositProductService) {
        super(location, approvalFlow);
    }

    @Input('formData') set formData(formData: RecurringDepositAccount) {
        this.prepareRecurringDepositAccountForm(formData);
        if (formData.id) this.createMode = false;
        if (formData.introducerAccountId) this.fetchIntroducerDetails(formData.introducerAccountId);
        if (formData.linkAccountId) this.fetchLinkAccountDetails(formData.linkAccountId);
        this.contactAddress = formData.contactAddress ? formData.contactAddress : new Address();
        this.contactInformation = formData.contactInformation ? formData.contactInformation : new ContactInformation();
    }
    @Input('command') command: string;
    @Output('onSave') onSave = new EventEmitter<RecurringDepositAccountSaveEvent>();
    @Output('onCancel') onCancel = new EventEmitter<void>();
    @ViewChild('contactAddressComponent') contactAddressComponent: any;
    @ViewChild('contactInformationComponent') contactInformationComponent: any;

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);
        this.prepareRecurringDepositAccountForm(null);
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.customerId = +params['customerId'];
            this.fetchCustomerDetails();
            this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
                if (queryParams['taskId']) {
                    this.taskId = queryParams['taskId'];
                }
                if (queryParams['commandReference']) {
                    this.commandReference = queryParams['commandReference'];
                }
                if (queryParams['accountStatus']) {
                    this.accountDetailFieldDisable = (queryParams.accountStatus !== "INACTIVE") ? true : false;

                } else {
                    this.accountDetailFieldDisable = false;
                }
            });
        });


        this.tenors = [{ label: "Choose", value: null }];

        this.fetchRecurringDepositProducts();
        this.fetchAccountOpeningChannels();
        this.fetchProductConfiguration();
    }
    // ngDoCheck() {
    //     if (this.accountDetailFieldDisable && !this.createMode) {
    //         // this.recurringDepositAccountForm.get('name').disable();
    //         // this.recurringDepositAccountForm.get('currencyCode').disable();
    //         // this.recurringDepositAccountForm.get('productId').disable();
    //     }
    // }
    prepareRecurringDepositAccountForm(formData: RecurringDepositAccount) {
        formData = formData ? formData : new RecurringDepositAccount();
        console.log(formData.accountOpeningChannelId);
        this.tenorType = formData.tenorType;
        this.recurringDepositAccountForm = this.formBuilder.group({
            productId: [formData.productId, [Validators.required]],
            name: [formData.name, [Validators.required, Validators.minLength(3), Validators.maxLength(200), abbabilValidators.accountNameValidator]],
            number: [{ value: formData.number, disabled: true }],
            currencyCode: [formData.currencyCode, [Validators.required]],
            introducerAccountId: [formData.introducerAccountId],
            introducerName: [{ value: this.introducer.name, disabled: true }],
            linkAccountId: [formData.linkAccountId],
            linkAccountName: [{ value: this.linkAccount.name, disabled: true }],
            purpose: [formData.purpose],
            accountOpeningChannelId: [formData.accountOpeningChannelId],
            relationshipManager: [formData.relationshipManager],
            tenorType: [{ value: formData.tenorType, disabled: true }],
            tenor: [formData.tenor],
            instalmentAmount: [formData.instalmentAmount, [Validators.required]],
            pensionType: [formData.pensionType],
            pensionPeriod: [formData.pensionPeriod],
            pensionPeriodType: [formData.pensionPeriodType]
        });
        this.onRecurringDepositProductChange(false);
        this.onIntroducerAccountChange();
        this.onLinkAccountChange();
    }

    onRecurringDepositProductChange(flag: boolean) {
        this.recurringDepositProductId = this.recurringDepositAccountForm.get('productId').value;
        if (this.recurringDepositProductId) {
            this.fetchRecurringDepositProductDetail(this.recurringDepositProductId, flag);
        }
    }

    onIntroducerAccountChange(): void {
        this.recurringDepositAccountForm.get('introducerAccountId').valueChanges
            .pipe(debounceTime(1500), distinctUntilChanged(), filter(val => val))
            .subscribe(value => {
                this.introducerAccountNumber = value;
                this.recurringDepositAccountForm.get('introducerName').reset();
                this.searchIntroducerByAccountNumber(this.introducerAccountNumber);
            });
    }

    onLinkAccountChange() {
        this.recurringDepositAccountForm.get('linkAccountId').valueChanges
            .pipe(debounceTime(1500), distinctUntilChanged(), filter(val => val))
            .subscribe(value => {
                this.linkAccountNumber = value;
                this.recurringDepositAccountForm.get('linkAccountName').reset();
                this.searchLinkAccountByAccountNumber(this.linkAccountNumber);
            });
    }

    searchIntroducerByAccountNumber(introducerAccountNumber) {
        let urlSearchParams: Map<string, string> = new Map([['accountNumber', introducerAccountNumber]]);
        this.subscribers.searchIntroducerSub = this.demandDepositAccountService
            .fetchDemandDepositAccounts(urlSearchParams)
            .subscribe(data => {
                this.introducer = data.content[0];
                this.setIntroducer();
            });
    }

    searchLinkAccountByAccountNumber(linkAccountNumber) {
        let urlSearchParams: Map<string, string> = new Map([['accountNumber', linkAccountNumber]]);
        this.subscribers.searchIntroducerSub = this.demandDepositAccountService
            .fetchDemandDepositAccounts(urlSearchParams)
            .subscribe(data => {
                this.linkAccount = data.content[0];
                this.setLinkAccount();
            });
    }

    setIntroducer() {
        if (this.introducer == undefined || (this.introducer.status != 'ACTIVATED')) {
            this.introducer = new DemandDepositAccount();
            this.notificationService.sendErrorMsg("invalid.introducer.id");
        }
        this.recurringDepositAccountForm.get('introducerAccountId').setValue(this.introducer.number);
        this.recurringDepositAccountForm.get('introducerName').setValue(this.introducer.name);
    }

    setLinkAccount() {
        if (this.linkAccount == undefined || (this.linkAccount.status != 'ACTIVATED')) {
            this.linkAccount = new DemandDepositAccount();
            this.notificationService.sendErrorMsg("invalid.link.account.id");
        }
        this.recurringDepositAccountForm.get('linkAccountId').setValue(this.linkAccount.number);
        this.recurringDepositAccountForm.get('linkAccountName').setValue(this.linkAccount.name);
    }

    fetchProductConfiguration() {
        let urlSearchParam: Map<string, string> = new Map([['name', 'profit-calculation']]);
        this.subscribers.fetchProductConfigurationSub = this.productService
            .fetchProductConfiguration(urlSearchParam)
            .subscribe(profiles => this.type = profiles.type);
    }

    generateAccountNumber() {
        let branchId = 7;
        let urlQueryMap = new Map();
        if (branchId) urlQueryMap.set('branchId', branchId);
        this.subscribers.fetchAvailablePercentageSub = this.accountService
            .generateAccountNumber({ id: this.recurringDepositProductId }, urlQueryMap)
            .subscribe(data => {
                this.accountNumber = data;
                this.recurringDepositAccountForm.get('number').setValue(this.accountNumber);
            });
    }
    isProductPensionScheme: boolean = false;
    fetchRecurringDepositProductDetail(recurringDepositProductId, flag: boolean) {
        this.subscribers.fetchRecurringDepositProductDetailSub = this.recurringDepositProductService
            .fetchRecurringDepositProductDetails({ recurringDepositProductId: recurringDepositProductId })
            .pipe(map(data => {
                this.recurringDepositProduct = data;
                this.tenors = [{ label: "Choose", value: null }, ...this.recurringDepositProduct.tenors.map(tenor => {
                    return { label: tenor.toString(), value: tenor };
                })];
                this.showCurrency();
                this.hasIntroducer();
                this.linkAccountRequired();
                this.hasTenor();
                if (flag) {
                    this.recurringDepositAccountForm.get('tenorType').setValue(this.recurringDepositProduct.tenorType);
                    this.recurringDepositAccountForm.get('number').reset();
                    this.tenorType = this.recurringDepositProduct.tenorType;
                }
                if (this.recurringDepositProduct.isInstallmentFixed) {
                    this.installmentSizes = [{ label: "Choose", value: null }, ...this.recurringDepositProduct.installmentSizes.map(installmentSize => {
                        return { label: installmentSize.toString(), value: installmentSize };
                    })];
                }
                this.isProductPensionScheme = data.isPensionScheme ? true : false;
                this.hasPensionScheme();
            })).subscribe();
    }

    showCurrency() {
        if (this.recurringDepositProduct.currencyRestriction === 'LOCAL_CURRENCY') {
            this.recurringDepositAccountForm.get('currencyCode').setValue(this.recurringDepositProduct.currencies[0]);
            this.multipleCurrency = false;
        }
        else {
            this.currencies = [{ label: 'Choose currency', value: null }].concat(this.recurringDepositProduct.currencies
                .map(currency => { return { label: currency, value: currency } }));
            this.multipleCurrency = true;
        }
        this.recurringDepositAccountForm.get('currencyCode').setValidators(Validators.required);
    }

    hasPensionScheme() {
        if (this.recurringDepositProduct.isPensionScheme) {
            this.isProductPensionScheme = true;
            // this.recurringDepositAccountForm.get('pensionType').enable();
            this.recurringDepositAccountForm.get('pensionType').setValidators([Validators.required]);
            this.recurringDepositAccountForm.get('pensionType').updateValueAndValidity();
            // this.recurringDepositAccountForm.get('pensionPeriod').enable();
            this.recurringDepositAccountForm.get('pensionPeriod').setValidators([Validators.required]);
            this.recurringDepositAccountForm.get('pensionPeriod').updateValueAndValidity();
            this.recurringDepositAccountForm.get('pensionPeriodType').setValidators([Validators.required]);
            this.recurringDepositAccountForm.get('pensionPeriodType').updateValueAndValidity();
        } else {
            this.isProductPensionScheme = false;
            // this.recurringDepositAccountForm.get('pensionType').disable();
            this.recurringDepositAccountForm.get('pensionType').clearValidators();
            this.recurringDepositAccountForm.get('pensionType').updateValueAndValidity();
            // this.recurringDepositAccountForm.get('pensionPeriod').disable();
            this.recurringDepositAccountForm.get('pensionPeriod').clearValidators();
            this.recurringDepositAccountForm.get('pensionPeriod').updateValueAndValidity();
            this.recurringDepositAccountForm.get('pensionPeriodType').clearValidators();
            this.recurringDepositAccountForm.get('pensionPeriodType').updateValueAndValidity();
        }
    }
    hasTenor() {
        if (this.recurringDepositProduct.isTenorRequired) {
            this.recurringDepositAccountForm.get('tenorType').setValidators(Validators.required);
            this.recurringDepositAccountForm.get('tenorType').updateValueAndValidity();
            this.recurringDepositAccountForm.get('tenor').setValidators(Validators.required);
            this.recurringDepositAccountForm.get('tenor').updateValueAndValidity();
        }
        else {
            this.recurringDepositAccountForm.get('tenorType').clearValidators();
            this.recurringDepositAccountForm.get('tenorType').updateValueAndValidity();
            this.recurringDepositAccountForm.get('tenor').clearValidators();
            this.recurringDepositAccountForm.get('tenor').updateValueAndValidity();
        }
    }


    hasIntroducer() {
        if (this.recurringDepositProduct.hasIntroducer) {
            this.recurringDepositAccountForm.get('introducerAccountId').setValidators(Validators.required);
            this.recurringDepositAccountForm.get('introducerAccountId').updateValueAndValidity();
        }
        else {
            this.recurringDepositAccountForm.get('introducerAccountId').clearValidators();
            this.recurringDepositAccountForm.get('introducerAccountId').updateValueAndValidity();
        }
    }

    linkAccountRequired() {
        if (this.recurringDepositProduct.isLinkAccountRequired) {
            this.recurringDepositAccountForm.get('linkAccountId').setValidators(Validators.required);
            this.recurringDepositAccountForm.get('linkAccountId').updateValueAndValidity();
        }
        else {
            this.recurringDepositAccountForm.get('linkAccountId').clearValidators();
            this.recurringDepositAccountForm.get('linkAccountId').updateValueAndValidity();
        }
    }

    hasSpecialRate(value) {
        if (value) {
            this.specialRate = true;
        } else {
            this.recurringDepositAccountForm.get('specialProfitRate').setValue(null);
            this.recurringDepositAccountForm.get('specialPsr').setValue(null);
            this.recurringDepositAccountForm.get('specialWeightage').setValue(null);
            this.specialRate = false;
        }
    }

    fetchCustomerDetails() {
        this.subscribers.fetchCustomerSub = this.cisService
            .fetchCustomer({ id: this.customerId })
            .pipe(map(data => {
                this.customer = data;
                if (!this.recurringDepositAccountForm.get('name').value) {
                    this.recurringDepositAccountForm.get('name').setValue(this.customer.name);
                }
            })).subscribe();
    }

    fetchRecurringDepositProducts() {
        let urlSearchParams = new Map([['status', 'ACTIVE']]);
        this.subscribers.fetchSub = this.recurringDepositProductService
            .fetchRecurringDepositProducts(urlSearchParams)
            .subscribe(data => {
                this.recurringDepositProducts = data.content;
            });
    }

    fetchAccountOpeningChannels() {
        this.subscribers.fetchAccountOpeningChannelsSub = this.accountService
            .fetchAccountOpeningChannels()
            .subscribe(data => this.accountOpeningChannels = data);
    }

    fetchIntroducerDetails(introducerAccountId: number) {
        this.subscribers.fetchIntroducerDetailsSub = this.demandDepositAccountService
            .fetchDemandDepositAccountDetails({ id: introducerAccountId })
            .pipe(map(data => {
                this.introducer = data;
                this.recurringDepositAccountForm.get('introducerAccountId').setValue(this.introducer.number);
                this.recurringDepositAccountForm.get('introducerName').setValue(this.introducer.name);
            })).subscribe();
    }

    fetchLinkAccountDetails(linkAccountId: number) {
        this.subscribers.fetchIntroducerDetailsSub = this.demandDepositAccountService
            .fetchDemandDepositAccountDetails({ id: linkAccountId })
            .pipe(map(data => {
                this.linkAccount = data;
                this.recurringDepositAccountForm.get('linkAccountId').setValue(this.introducer.number);
                this.recurringDepositAccountForm.get('linkAccountName').setValue(this.introducer.name);
            })).subscribe();
    }

    disableAccountNumberGenerateButton(): boolean {
        return (this.recurringDepositProductId && this.recurringDepositProductId != 0 && !this.createMode && this.accountDetailFieldDisable);
    }

    submit() {

        this.showVerifierSelectionModal = of(true);
    }

    onVerifierSelect(selectEvent: VerifierSelectionEvent) {
        this.emitSaveEvent(selectEvent, null);
    }
    emitSaveEvent(selectEvent: VerifierSelectionEvent, taskid: string) {
        this.markFormGroupAsTouched(this.recurringDepositAccountForm);
        this.contactAddressComponent.markAsTouched();
        this.contactInformationComponent.markAsTouched();
        if (this.formsInvalid()) {
            return;
        }
        let recurringDepositAccount = this.recurringDepositAccountForm.value;
        recurringDepositAccount.branchId = 7;
        recurringDepositAccount.customerId = this.customerId;
        recurringDepositAccount.introducerAccountId = this.introducer.id;
        recurringDepositAccount.linkAccountId = this.linkAccount.id;
        recurringDepositAccount.number = this.accountNumber;
        recurringDepositAccount.currencyCode = (CurrencyRestriction[1].value == this.recurringDepositProduct.currencyRestriction)  //local currency
            ? this.recurringDepositProduct.currencies[0]
            : this.recurringDepositAccountForm.get('currencyCode').value;
        recurringDepositAccount.tenorType = this.tenorType;
        recurringDepositAccount.contactAddress = this.contactAddressComponent.extractData();
        recurringDepositAccount.contactInformation = this.contactInformationComponent.extractData();
        recurringDepositAccount.productId = this.recurringDepositAccountForm.get('productId').value;
        recurringDepositAccount.type = "RECURRING_DEPOSIT";
        recurringDepositAccount.name = this.recurringDepositAccountForm.get('name').value;
        recurringDepositAccount.accountOpeningChannelId = this.recurringDepositAccountForm.get('accountOpeningChannelId').value;

        this.onSave.emit({
            recurringDepositAccountForm: recurringDepositAccount,
            verifier: selectEvent.verifier,
            taskId: this.taskId,
            approvalFlowRequired: selectEvent.approvalFlowRequired
        });
    }

    cancel() {
        this.onCancel.emit();
    }

    formsInvalid(): boolean {

        return (this.recurringDepositAccountForm.invalid
            || (this.recurringDepositAccountForm.get('number').value == undefined)
            || this.contactAddressComponent.isInvalid()
            || this.contactInformationComponent.isInvalid());
    }

    onPensionSchemeValueChange(value: boolean) {
        console.log(value);

    }
}