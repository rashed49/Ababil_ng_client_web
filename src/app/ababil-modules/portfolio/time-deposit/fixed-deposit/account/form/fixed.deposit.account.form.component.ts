import { FixedDepositProduct } from './../../../../../../services/fixed-deposit-product/domain/fixed.deposit.product.model';
import { AccountOpeningChannels } from './../../../../../../services/account/domain/account.opening.channels';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';


import { NotificationService } from '../../../../../../common/notification/notification.service';
import { AccountService } from './../../../../../../services/account/service-api/account.service';
import { CISService } from '../../../../../../services/cis/service-api/cis.service';
import { CurrencyService } from '../../../../../../services/currency/service-api/currency.service';
import { DemandDepositAccountService } from '../../../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { ProductService } from '../../../../../../services/product/service-api/product.service';
import { FixedDepositAccountService } from '../../../../../../services/fixed-deposit-account/service-api/fixed.deposit.account.service';

import { Address } from '../../../../../../services/cis/domain/address.model';
import { Customer } from '../../../../../../services/cis/domain/customer.model';
import { FixedDepositAccount } from '../../../../../../services/fixed-deposit-account/domain/fixed.deposit.account.models';
import { SelectItem } from 'primeng/api';
import { TenorType } from '../../../../../../common/domain/time.deposit.product.enum.model';
import { RenewalOption } from '../../../../../../common/domain/renewal.option.enum.model';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

import { DemandDepositAccount } from "../../../../../../services/demand-deposit-account/domain/demand.deposit.account.models";
import { ContactInformation } from '../../../../../../services/cis/domain/contact.information.model';
import { CurrencyRestriction } from '../../../../../../common/domain/currency.enum.model';
import { FormBaseComponent } from '../../../../../../common/components/base.form.component';
import { ApprovalflowService } from '../../../../../../services/approvalflow/service-api/approval.flow.service';
import { VerifierSelectionEvent } from '../../../../../../common/components/verifier-selection/verifier.selection.component';

export const CREATE_SUCCESS_MSG: string[] = ["fixed.deposit.account.create.success", "workflow.task.verify.send"];
export const UPDATE_SUCCESS_MSG: string[] = ["fixed.deposit.account.update.success", "workflow.task.verify.send"];

export const DETAILS_UI: string = "views/fixed-deposit-account?";

@Component({
    selector: 'fixed-deposit-account-form',
    templateUrl: './fixed.deposit.account.form.component.html'
})
export class FixedDepositAccountFormComponent extends FormBaseComponent implements OnInit {

    multipleCurrency: boolean = false;
    currencies: SelectItem[] = [];
    createMode: boolean = true;
    fixedDepositAccountForm: FormGroup;
    fixedDepositAccount: FixedDepositAccount = new FixedDepositAccount();
    formData: FixedDepositAccount = new FixedDepositAccount();
    customerId: number;
    customer: Customer = new Customer();
    accountNumber: string;
    specialRate: boolean = false;
    type: string = '';
    tenorTypes: SelectItem[] = TenorType;
    renewalOptions: SelectItem[] = RenewalOption;
    fixedDepositProductId: number;
    fixedDepositProducts: FixedDepositProduct[];
    fixedDepositProductMap: Map<number, string>;
    fixedDepositProductDetails: FixedDepositProduct = new FixedDepositProduct();
    linkAccountNumber: string;
    introducerAccountNumber: string;
    accountOpeningChannels: AccountOpeningChannels[] = [];
    urlSearchParams: Map<string, string>;
    introducerDetail: DemandDepositAccount = new DemandDepositAccount();
    linkAccountDetail: DemandDepositAccount = new DemandDepositAccount();

    queryParams: any;
    contactAddress: Address = new Address();
    autoRenewalOverridable?: boolean;
    autoRenewAllowed: boolean;
    otherAmount: string;
    isOtherAmount: boolean = false;
    isLinkAccountRequired: boolean;
    tenors: SelectItem[];
    command: string = "CreateFixedDepositAccountCommand";
    initialDeposit: number;
    divisibleValue: number;
    minimumDepositAmount: number;
    maximumDepositAmount: number;
    saveButton: boolean = true;
    contactInformation: ContactInformation = new ContactInformation();
    status: any;
    accountDetailFieldDisable: boolean;
    @ViewChild('contactAddressComponent') contactAddressComponent: any;
    @ViewChild('contactInformationComponent') contactInformationComponent: any;

    constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private notificationService: NotificationService,
        protected location: Location,
        protected approvalFlow: ApprovalflowService,
        private accountService: AccountService,
        private cisService: CISService,
        private demandDepositAccountService: DemandDepositAccountService,
        private fixedDepositAccountService: FixedDepositAccountService,
        private productService: ProductService,
        private currencyService: CurrencyService) {
        super(location, approvalFlow);
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);

        this.prepareFixedDepositAccountForm(null);

        this.subscribers.paramsSub = this.route.params.subscribe(params => {
            this.customerId = +params['customerId'];
            this.fetchCustomerDetails();

            this.fixedDepositAccount.id = +params['id'];

            this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
                if (queryParams['commandReference']) {
                    this.commandReference = queryParams['commandReference'];
                }
                this.queryParams = queryParams;
                if (queryParams['accountStatus']) {
                    this.accountDetailFieldDisable = (queryParams.accountStatus !== "INACTIVE") ? true : false;
                } else {
                    this.accountDetailFieldDisable = false;
                }
                if (queryParams['taskId']) {
                    this.taskId = queryParams['taskId'];

                    this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                        data => {
                            if (this.queryParams.command === "ActivateFixedDepositAccountCommand") {
                                this.fetchFixedDepositAccountDetails(data);
                                this.command = this.queryParams.command;
                                this.createMode = false;
                            } else {
                                this.prepareFixedDepositAccountForm(data);
                                this.contactAddress = data.contactAddress;
                                this.contactInformation = data.contactInformation
                                this.command = this.queryParams.command;
                                this.status = data.status;
                                if (data.introducerAccountId) this.fetchIntroducerDetails(data.introducerAccountId);
                                this.fixedDepositAccountForm.get('productId').setValue(data.productId);
                                this.fixedDepositProductId = data.productId;
                                this.fetchFixedDepositProductDetail(false);
                                this.accountNumber = data.number;
                                this.fixedDepositAccountForm.get('number').setValue(this.accountNumber);
                                this.createMode = false;
                                if (data.linkAccountId) { this.fetchLinkAccountDetails(data.linkAccountId); }
                                if (data.introducerAccountId) { this.fetchIntroducerDetails(data.introducerAccountId); }

                            }
                        }
                    );
                }
                else {
                    if (this.fixedDepositAccount.id) {
                        this.createMode = false;
                        this.command = "UpdateFixedDepositAccountCommand";
                        this.fetchFixedDepositAccountDetails(this.fixedDepositAccount.id);
                    }
                    else {
                        this.prepareFixedDepositAccountForm(null);
                    }
                }
            });

        });

        this.fetchFixedDepositProducts();
        this.fetchAccountOpeningChannels();
        this.fetchProductConfiguration();
    }

    // ngDoCheck() {
    //     if (this.accountDetailFieldDisable && !this.createMode) {
    //         this.fixedDepositAccountForm.get('name').disable();
    //         this.fixedDepositAccountForm.get('currencyCode').disable();
    //         this.fixedDepositAccountForm.get('productId').disable();
    //     }
    // }

    prepareFixedDepositAccountForm(formData: FixedDepositAccount) {
        formData = (formData == null ? new FixedDepositAccount() : formData);

        this.fixedDepositAccountForm = this.formBuilder.group({
            id: [formData.id],
            productId: [formData.productId, [Validators.required]],
            name: [formData.name, [Validators.required, Validators.minLength(3), Validators.maxLength(200), Validators.pattern(new RegExp(/^[a-z ,.'-]+$/i))]],
            number: [{ value: formData.number, disabled: true }, [Validators.required]],
            currencyCode: [formData.currencyCode],
            introducerAccountId: [formData.introducerAccountId],
            introducerName: [{ value: this.introducerDetail.name, disabled: true }],
            purpose: [formData.purpose],
            accountOpeningChannelId: [formData.accountOpeningChannelId],
            relationshipManager: [formData.relationshipManager],
            activationDate: [formData.activationDate ? new Date(formData.activationDate) : null],
            expiryDate: [formData.expiryDate ? new Date(formData.expiryDate) : null],
            tenorType: [formData.tenorType],
            tenor: [formData.tenor],
            initialDeposit: [formData.initialDeposit, [Validators.required]],
            isAutoRenewalAllowed: [formData.isAutoRenewalAllowed],
            renewalTenor: [formData.renewalTenor],
            renewalOption: [formData.renewalOption],
            renewalPrincipal: [formData.renewalPrincipal],
            linkAccountId: [formData.linkAccountId],
            linkAccountName: [{ value: this.introducerDetail.name, disabled: true }]
        });
        this.onFixedDepositProductChange(false);
        this.onTenorChange();
        this.onIntroducerAccountChange();
        this.onInitialDepositChange();
        this.onLinkAccountChange();
    }

    onInitialDepositChange(): void {
        this.fixedDepositAccountForm.get('initialDeposit').valueChanges
            .pipe(debounceTime(1500), distinctUntilChanged(), filter(val => val))
            .subscribe(value => {
                this.initialDeposit = value;
                if (((this.initialDeposit % this.divisibleValue) == 0) && (this.initialDeposit >= this.minimumDepositAmount) && (this.initialDeposit <= this.maximumDepositAmount)) {
                    this.fixedDepositAccountForm.get('initialDeposit').setValue(this.initialDeposit);
                    this.fixedDepositAccountForm.get('renewalPrincipal').setValue(this.initialDeposit);
                    this.saveButton = true;
                }
                else {
                    this.notificationService.sendErrorMsg("Please insert a valid initial deposit amount");
                    this.saveButton = false;
                }
            });
    }

    onIntroducerAccountChange(): void {
        this.fixedDepositAccountForm.get('introducerAccountId').valueChanges
            .pipe(debounceTime(1500), distinctUntilChanged(), filter(val => val))
            .subscribe(value => {
                this.introducerAccountNumber = value;
                this.fixedDepositAccountForm.get('introducerName').reset();
                this.searchIntroducerByAccountNumber(this.introducerAccountNumber);
            });
    }

    onLinkAccountChange(): void {
        this.fixedDepositAccountForm.get('linkAccountId').valueChanges
            .pipe(debounceTime(1500), distinctUntilChanged(), filter(val => val))
            .subscribe(value => {
                this.linkAccountNumber = value;
                this.searchLinkAccountByAccountNumber(this.linkAccountNumber);
                this.fixedDepositAccountForm.get('linkAccountName').reset();
            });
    }

    onFixedDepositProductChange(flag: boolean) {
        this.fixedDepositProductId = this.fixedDepositAccountForm.get('productId').value;
        if (this.fixedDepositProductId) {
            this.fetchFixedDepositProductDetail(flag);
        }
    }

    onTenorChange() {
        this.fixedDepositAccountForm.get('tenor').valueChanges
            .subscribe(value => {
                if (value) {
                    if (this.autoRenewAllowed) {
                        this.fixedDepositAccountForm.get('renewalTenor').setValue(this.fixedDepositAccountForm.get('tenor').value);
                    }
                }
            });
    }



    fetchFixedDepositProductDetail(flag: boolean) {
        this.subscribers.fetchFixedDepositProductDetailSub = this.fixedDepositAccountService
            .fetchFixedDepositProductDetails({ fixedDepositProductId: this.fixedDepositProductId + "" })
            .pipe(map(data => {
                this.fixedDepositProductDetails = data;
                this.fixedDepositAccountForm.get('isAutoRenewalAllowed').setValue(this.fixedDepositProductDetails.isAutoRenewalAllowed);
                this.fixedDepositAccountForm.get('tenorType').setValue(this.fixedDepositProductDetails.tenorType);
                this.divisibleValue = this.fixedDepositProductDetails.depositAmountMultiplier;
                this.minimumDepositAmount = this.fixedDepositProductDetails.minimumDepositAmount;
                this.maximumDepositAmount = this.fixedDepositProductDetails.maximumDepositAmount;
                this.autoRenewalOverridable = this.fixedDepositProductDetails.isAutoRenewalOverridable;
                this.autoRenewAllowed = this.fixedDepositProductDetails.isAutoRenewalAllowed;
                this.isLinkAccountRequired = this.fixedDepositProductDetails.isLinkAccountRequired;
                this.tenors = [{ label: "Select tenor", value: null }, ...this.fixedDepositProductDetails.tenors.map(tenor => {
                    return { label: tenor.toString() + '' + '(' + this.fixedDepositProductDetails.tenorType + ')', value: tenor };
                })];
                this.showCurrency();
                this.hasIntroducer();
                this.hasRenewalOptions();
                this.hasTenor();
                this.hasLinkAccount();
                if (flag) this.fixedDepositAccountForm.get('number').reset();
                this.fixedDepositAccountForm.updateValueAndValidity();
            })).subscribe();
    }

    hasLinkAccount() {

        if (this.fixedDepositProductDetails.isLinkAccountRequired) {
            this.fixedDepositAccountForm.get('linkAccountId').setValidators(Validators.required);
            this.fixedDepositAccountForm.get('linkAccountId').updateValueAndValidity();
        } else {
            this.fixedDepositAccountForm.get('linkAccountId').clearValidators();
            this.fixedDepositAccountForm.get('linkAccountId').updateValueAndValidity();

        }
    }

    hasTenor() {
        if (this.fixedDepositProductDetails.isTenorRequired) {
            this.fixedDepositAccountForm.get('tenorType').setValidators(Validators.required);
            this.fixedDepositAccountForm.get('tenor').setValidators(Validators.required);
            this.fixedDepositAccountForm.get('tenorType').updateValueAndValidity();
            this.fixedDepositAccountForm.get('tenor').updateValueAndValidity();
        } else {
            this.fixedDepositAccountForm.get('tenorType').clearValidators();
            this.fixedDepositAccountForm.get('tenor').clearValidators();
            this.fixedDepositAccountForm.get('tenorType').updateValueAndValidity();
            this.fixedDepositAccountForm.get('tenor').updateValueAndValidity();
        }
    }

    hasRenewalOptions() {
        if (this.fixedDepositProductDetails.isAutoRenewalAllowed) {
            this.fixedDepositAccountForm.get('renewalTenor').setValidators(Validators.required);
            this.fixedDepositAccountForm.get('renewalOption').setValidators(Validators.required);
            this.fixedDepositAccountForm.get('renewalTenor').updateValueAndValidity();
            this.fixedDepositAccountForm.get('renewalOption').updateValueAndValidity();
        } else {
            this.fixedDepositAccountForm.get('renewalTenor').clearValidators();
            this.fixedDepositAccountForm.get('renewalOption').clearValidators();
            this.fixedDepositAccountForm.get('renewalTenor').updateValueAndValidity();
            this.fixedDepositAccountForm.get('renewalOption').updateValueAndValidity();
        }
    }

    hasIntroducer() {
        this.fixedDepositProductDetails.hasIntroducer
            ? this.fixedDepositAccountForm.get('introducerAccountId').setValidators(Validators.required)
            : this.fixedDepositAccountForm.get('introducerAccountId').clearValidators();
        this.fixedDepositAccountForm.get('introducerAccountId').updateValueAndValidity();
    }

    showCurrency() {
        if (this.fixedDepositProductDetails.currencyRestriction === 'LOCAL_CURRENCY') {
            this.fixedDepositAccountForm.get('currencyCode').setValue(this.fixedDepositProductDetails.currencies[0]);
            this.multipleCurrency = false;
        }
        else {
            this.currencies = [{ label: 'Choose currency', value: null }].concat(this.fixedDepositProductDetails.currencies
                .map(currency => { return { label: currency, value: currency } }));
            this.multipleCurrency = true;
        }
        this.fixedDepositAccountForm.get('currencyCode').setValidators(Validators.required);
    }

    fetchCustomerDetails() {
        this.subscribers.fetchCustomerSub = this.cisService
            .fetchCustomer({ id: this.customerId })
            .pipe(map(data => {
                this.customer = data;
                if (!this.fixedDepositAccountForm.get('name').value) {
                    this.fixedDepositAccountForm.get('name').setValue(this.customer.name);
                }
            })).subscribe();
    }

    fetchFixedDepositAccountDetails(fixedDepositAccountId: number) {
        this.subscribers.fetchDemandDepositAccountSub = this.fixedDepositAccountService
            .fetchFixedDepositAccountDetails({ fixedDepositAccountId: fixedDepositAccountId + "" })
            .pipe(map(data => {
                this.fixedDepositAccount = data;
                this.status = data.status;
                this.fixedDepositAccountForm.get('productId').setValue(this.fixedDepositAccount.productId);
                this.contactAddress = data.contactAddress;
                this.contactInformation = data.contactInformation
                this.fixedDepositProductId = this.fixedDepositAccount.productId;
                this.fetchFixedDepositProductDetail(false);

                this.accountNumber = this.fixedDepositAccount.number;
                this.fixedDepositAccountForm.get('number').setValue(this.accountNumber);
                this.prepareFixedDepositAccountForm(this.fixedDepositAccount);

                if (this.fixedDepositAccount.linkAccountId) { this.fetchLinkAccountDetails(this.fixedDepositAccount.linkAccountId); }
                if (this.fixedDepositAccount.introducerAccountId) { this.fetchIntroducerDetails(this.fixedDepositAccount.introducerAccountId); }

                this.fixedDepositAccountForm.get('number').setValue(this.fixedDepositAccount.number);
            })).subscribe();
    }

    fetchLinkAccountDetails(linkAccountId: number) {
        this.subscribers.fetchLinkAccountDetailsSub = this.accountService
            .fetchAccountDetails({ accountId: linkAccountId + "" })
            .pipe(map(data => {
                this.linkAccountDetail = data;
                this.fixedDepositAccountForm.get('linkAccountId').setValue(this.linkAccountDetail.number);
                this.fixedDepositAccountForm.get('linkAccountName').setValue(this.linkAccountDetail.name);
            })).subscribe();
    }

    fetchIntroducerDetails(introducerAccountId: number) {
        this.subscribers.fetchIntroducerDetailsSub = this.accountService
            .fetchAccountDetails({ accountId: introducerAccountId + "" })
            .pipe(map(data => {
                this.introducerDetail = data;
                this.fixedDepositAccountForm.get('introducerAccountId').setValue(this.introducerDetail.number);
                this.fixedDepositAccountForm.get('introducerName').setValue(this.introducerDetail.name);
            })).subscribe();
    }

    fetchFixedDepositProducts() {
        this.urlSearchParams = new Map([['status', 'ACTIVE']]);
        this.subscribers.fetchFixedDepositProductsSub = this.fixedDepositAccountService
            .fetchFixedDepositProducts(this.urlSearchParams)
            .subscribe(data => {
                this.fixedDepositProducts = data.content;
                this.fixedDepositProductMap = new Map();
                for (let product of this.fixedDepositProducts) {
                    this.fixedDepositProductMap.set(product.id, product.description);
                }
            });
    }

    generateAccountNumber() {
        let branchId = 7;
        let urlQueryMap = new Map();
        if (branchId != null) urlQueryMap.set('branchId', branchId);
        this.subscribers.fetchAvailablePercentageSub = this.productService
            .createAccountNumber({ id: this.fixedDepositProductId }, urlQueryMap)
            .subscribe(data => {
                this.accountNumber = data;
                this.fixedDepositAccountForm.get('number').setValue(this.accountNumber);
            });
    }

    fetchProductConfiguration() {
        this.urlSearchParams = new Map([['name', 'profit-calculation']]);
        this.subscribers.fetchProductConfigurationSub = this.productService
            .fetchProductConfiguration(this.urlSearchParams)
            .subscribe(profiles => this.type = profiles.type);
    }

    hasSpecialRate(value) {
        if (value) {
            this.specialRate = true;
        } else {
            this.fixedDepositAccountForm.get('specialProfitRate').setValue(null);
            this.fixedDepositAccountForm.get('specialPsr').setValue(null);
            this.fixedDepositAccountForm.get('specialWeightage').setValue(null);
            this.specialRate = false;
        }
    }

    hasAutoRenewalAllowed(value) {
        if (value) {
            this.autoRenewAllowed = true;
        } else {
            // this.fixedDepositAccountForm.get('specialProfitRate').setValue(null);
            this.autoRenewAllowed = false;
        }
    }

    hasOtherAmount() {
        this.otherAmount = this.fixedDepositAccountForm.get('renewalOption').value;
        this.isOtherAmount = ('OTHER_AMOUNT' == this.otherAmount) ? true : false;
        if (this.isOtherAmount) {
            this.fixedDepositAccountForm.get('renewalPrincipal').setValidators(Validators.required);
            this.fixedDepositAccountForm.get('renewalPrincipal').updateValueAndValidity();
        } else {
            this.fixedDepositAccountForm.get('renewalPrincipal').clearValidators();
            this.fixedDepositAccountForm.get('renewalPrincipal').updateValueAndValidity();

        }
    }
    disableAccountNumberGenerateButton(): boolean {
        return (this.fixedDepositProductId && this.fixedDepositProductId != 0 && !this.createMode && this.accountDetailFieldDisable);
    }

    searchIntroducerByAccountNumber(introducerAccountNumber) {
        this.urlSearchParams = new Map([['accountNumber', introducerAccountNumber]]);
        this.subscribers.searchIntroducerSub = this.demandDepositAccountService
            .fetchDemandDepositAccounts(this.urlSearchParams)
            .subscribe(data => {
                this.introducerDetail = data.content[0];
                this.setIntroducer();
            });
    }

    searchLinkAccountByAccountNumber(linkAccountNumber) {
        this.urlSearchParams = new Map([['accountNumber', linkAccountNumber]]);
        this.subscribers.searchLinkAccountSub = this.demandDepositAccountService
            .fetchDemandDepositAccounts(this.urlSearchParams)
            .subscribe(data => {
                this.linkAccountDetail = data.content[0];
                this.setLinkAccount();
            });
    }

    setIntroducer() {
        if (this.introducerDetail == undefined || (this.introducerDetail.status != 'ACTIVATED')) {
            this.introducerDetail = new DemandDepositAccount();
            this.notificationService.sendErrorMsg("invalid.introducer.id");
        }
        this.fixedDepositAccountForm.get('introducerAccountId').setValue(this.introducerDetail.number);
        this.fixedDepositAccountForm.get('introducerName').setValue(this.introducerDetail.name);
    }

    setLinkAccount() {
        if (this.linkAccountDetail == undefined || (this.linkAccountDetail.status != 'ACTIVATED')) {
            this.linkAccountDetail = new DemandDepositAccount();
            this.notificationService.sendErrorMsg("invalid.link.account.id");
        }
        this.fixedDepositAccountForm.get('linkAccountId').setValue(this.linkAccountDetail.number);
        this.fixedDepositAccountForm.get('linkAccountName').setValue(this.linkAccountDetail.name);
    }

    submit() {
        this.showVerifierSelectionModal = of(true);

    }


    onVerifierSelect(selectEvent: VerifierSelectionEvent) {
        this.saveFixedDepositAccount(selectEvent, null);
    }

    saveFixedDepositAccount(selectEvent: VerifierSelectionEvent, taskId: string) {
        this.markFormGroupAsTouched(this.fixedDepositAccountForm);
        this.contactAddressComponent.markAsTouched();
        this.contactInformationComponent.markAsTouched();
        if (this.formsInvalid()) { return }
        this.fixedDepositAccount = this.fixedDepositAccountForm.value;
        this.fixedDepositAccount.productId = this.fixedDepositProductId;
        this.fixedDepositAccount.introducerAccountId = this.introducerDetail.id;
        this.fixedDepositAccount.currencyCode = (CurrencyRestriction[1].value == this.fixedDepositProductDetails.currencyRestriction)  //local currency
            ? this.fixedDepositProductDetails.currencies[0]
            : this.fixedDepositAccountForm.get('currencyCode').value;
        this.fixedDepositAccount.linkAccountId = this.linkAccountDetail.id;
        this.fixedDepositAccount.contactAddress = this.contactAddressComponent.extractData();
        this.fixedDepositAccount.contactInformation = this.contactInformationComponent.extractData();
        this.fixedDepositAccount.name = this.fixedDepositAccountForm.get('name').value;
        this.fixedDepositAccount.number = this.accountNumber;
        this.fixedDepositAccount.customerId = this.customer.id;
        this.fixedDepositAccount.branchId = 7;

        if (this.fixedDepositAccount.id) {
            this.fixedDepositAccount.status = this.status;

            let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, selectEvent.verifier, DETAILS_UI.concat("accountId=").concat(this.fixedDepositAccount.id.toString()).concat("&"), this.location.path().concat("&"));
            this.updateFixedDepositAccount(this.fixedDepositAccount, urlSearchParams, selectEvent);
        } else {
            this.createFixedDepositAccount(this.fixedDepositAccount, selectEvent);
        }
    }

    createFixedDepositAccount(fixedDepositAccount, selectEvent) {
        delete fixedDepositAccount.accountBalance;  //this line should be removed after handeling accountBalance
        this.subscribers.saveFixedDepositAccountSub = this.fixedDepositAccountService
            .createFixedDepositAccount(fixedDepositAccount)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("fixed.deposit.account.create.success");
                this.navigateToDetails(data.content);
            });
    }

    updateFixedDepositAccount(fixedDepositAccount: FixedDepositAccount, urlSearchParam: any, selectEvent: VerifierSelectionEvent) {
        delete fixedDepositAccount.fixedDepositAccountBalance; //this line should be removed after handeling accountBalance
        console.log(fixedDepositAccount.status);
        this.subscribers.updateFixedDepositAccountSub = this.fixedDepositAccountService
            .updateFixedDepositAccount(fixedDepositAccount, { "fixedDepositAccountId": fixedDepositAccount.id + "" }, urlSearchParam)
            .subscribe(data => {
                if ((this.status != undefined) && (this.status === "ACTIVATED") || (this.status === "OPENED")) {
                    this.notificationService.sendSuccessMsg(UPDATE_SUCCESS_MSG[+(selectEvent.approvalFlowRequired || !!this.taskId)]);
                } else {
                    this.notificationService.sendSuccessMsg(UPDATE_SUCCESS_MSG[0]);
                }
                this.navigateAway();
            });
    }

    fetchAccountOpeningChannels() {
        this.subscribers.fetchAccountOpeningChannelsSub = this.accountService
            .fetchAccountOpeningChannels()
            .subscribe(data => this.accountOpeningChannels = data);
    }

    formsInvalid(): boolean {
        return (this.fixedDepositAccountForm.invalid ||
            (this.fixedDepositAccountForm.get('number').value == undefined) || this.contactAddressComponent.isInvalid()
            || this.contactInformationComponent.isInvalid());
    }

    cancel() {
        this.navigateAway();
    }

    navigateToDetails(accountId: number): void {
        this.router.navigate(['/fixed-deposit-account', accountId, 'details'], {
            relativeTo: this.route,
            queryParamsHandling: "merge"
        });
    }

    navigateAway() {
        if (this.taskId) {
            this.router.navigate(['../../', 'approval-flow', 'pendingtasks']);
        } else {

            if (this.fixedDepositAccount.id) {
                this.router.navigate(['/fixed-deposit-account', this.fixedDepositAccount.id, 'details'], {
                    queryParamsHandling: "merge"
                });
            } else {

                this.router.navigate([this.queryParams.cus], {
                    queryParams: { cus: this.queryParams['cus'] },
                });
            }
        }


    }

}