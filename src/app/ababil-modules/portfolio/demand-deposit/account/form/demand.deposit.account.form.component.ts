import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { NotificationService } from '../../../../../common/notification/notification.service';
import { AccountService } from './../../../../../services/account/service-api/account.service';
import { CISService } from '../../../../../services/cis/service-api/cis.service';
import { DemandDepositAccountService } from '../../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { DemandDepositProductService } from '../../../../../services/demand-deposit-product/service-api/demand-deposit-product.service';
import { ProductService } from '../../../../../services/product/service-api/product.service';

import { Address } from '../../../../../services/cis/domain/address.model';
import { Customer } from '../../../../../services/cis/domain/customer.model';
import { Currency } from '../../../../../services/currency/domain/currency.models';
import { DemandDepositProduct } from '../../../../../services/demand-deposit-product/domain/demand-deposit-product.model';
import { DemandDepositAccount } from '../../../../../services/demand-deposit-account/domain/demand.deposit.account.models';
import { SelectItem } from 'primeng/api';
import { ContactInformation } from '../../../../../services/cis/domain/contact.information.model';
import { CurrencyRestriction } from './../../../../../common/domain/currency.enum.model';
import { AccountOpeningChannels } from './../../../../../services/account/domain/account.opening.channels';
import { FormBaseComponent } from '../../../../../common/components/base.form.component';
import { ApprovalflowService } from '../../../../../services/approvalflow/service-api/approval.flow.service';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { VerifierSelectionEvent } from '../../../../../common/components/verifier-selection/verifier.selection.component';

export const CREATE_SUCCESS_MSG: string[] = ["demand.deposit.account.create.success", "workflow.task.verify.send"];
export const UPDATE_SUCCESS_MSG: string[] = ["demand.deposit.account.update.success", "workflow.task.verify.send"];

export const DETAILS_UI: string = "views/demand-deposit-account?";

@Component({
    selector: 'demand-deposit-account-form',
    templateUrl: './demand.deposit.account.form.component.html'
})
export class DemandDepositAccountFormComponent extends FormBaseComponent implements OnInit {

    createMode: boolean = true;
    demandDepositAccountForm: FormGroup;
    status: any;
    demandDepositAccount: DemandDepositAccount = new DemandDepositAccount();
    formData: DemandDepositAccount = new DemandDepositAccount();
    customerId: number;
    customer: Customer = new Customer();
    accountNumber: string;
    specialRate: boolean = false;
    demandDepositProductId: number;
    demandDepositProducts: DemandDepositProduct[];
    demandDepositProductMap: Map<number, string>;
    demandDepositProductDetails: DemandDepositProduct = new DemandDepositProduct();
    currencies: SelectItem[] = [];
    currencyMap: Map<number, string>;
    currencyDetails: Currency = new Currency();
    introducerAccountNumber: string;
    accountOpeningChannels: AccountOpeningChannels[] = [];
    multipleCurrency: boolean = false;
    urlSearchParams: Map<string, string>;
    introducerDetail: DemandDepositAccount = new DemandDepositAccount();
    queryParams: any;
    contactAddress: Address = new Address();
    contactInformation: ContactInformation = new ContactInformation();
    type: string = '';
    accountDetailFieldDisable: boolean = false;
    command: string = "CreateDemandDepositAccountCommand"
    demandDepostAccountId: number;
    @ViewChild('contactAddressComponent') contactAddressComponent: any;
    @ViewChild('contactInformationComponent') contactInformationComponent: any;

    constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private notificationService: NotificationService,
        protected location: Location,
        private accountService: AccountService,
        private cisService: CISService,
        private demandDepositAccountService: DemandDepositAccountService,
        private productService: ProductService,
        private demandDepositProductService: DemandDepositProductService,
        protected approvalFlowService: ApprovalflowService
    ) {
        super(location, approvalFlowService);
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);
        this.prepareDemandDepositAccountForm(null);

        this.subscribers.paramsSub = this.route.params.subscribe(params => {
            this.customerId = +params['customerId'];
            this.fetchCustomerDetails();

            this.demandDepositAccount.id = +params['id'];
            this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {

                if (queryParams['commandReference']) {
                    this.commandReference = queryParams['commandReference'];
                }
                this.queryParams = queryParams;
                if(queryParams['accountStatus']) {
                    this.accountDetailFieldDisable = (queryParams.accountStatus !== "INACTIVE" ) ? true : false;
                }
                if (queryParams['taskId']) {
                    this.taskId = queryParams['taskId'];

                    this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                        data => {
                            if (this.queryParams.command === "ActivateDemandDepositAccountCommand") {
                                this.fetchDemandDepositAccountDetails(data);
                                this.command = this.queryParams.command;
                            } else {
                                this.prepareDemandDepositAccountForm(data);
                                this.contactAddress = data.contactAddress;
                                this.contactInformation = data.contactInformation
                                this.command = this.queryParams.command;
                                this.accountNumber = data.number;
                                this.status = data.status;


                                if (data.introducerAccountId) this.fetchIntroducerDetails(data.introducerAccountId);
                            }

                            // this.prepareDemandDepositAccountForm(data);
                            // this.contactAddress = data.contactAddress;
                            // this.contactInformation = data.contactInformation
                            // this.command = this.queryParams.command;
                            // this.demandDepositAccountForm.get('productId').setValue(data.productId);
                            // this.demandDepositProductId = data.productId;

                            // this.accountNumber = data.number;
                            // this.demandDepositAccountForm.get('number').setValue(this.accountNumber);


                            // if (data.introducerAccountId) { this.fetchIntroducerDetails(data.introducerAccountId); }

                        }
                    );
                }
                else {
                    if (this.demandDepositAccount.id) {
                        this.command = "UpdateDemandDepositAccountCommand";
                        this.fetchDemandDepositAccountDetails(this.demandDepositAccount.id);
                    }
                    else {
                        this.prepareDemandDepositAccountForm(null);
                        this.command = "CreateDemandDepositAccountCommand";
                    }
                }

            });
        });

        this.fetchDemandDepositProducts();
        this.fetchAccountOpeningChannels();
        this.fetchProductConfiguration();
    }

    prepareDemandDepositAccountForm(formData: DemandDepositAccount) {
        formData = (formData == null ? new DemandDepositAccount() : formData);
        this.demandDepostAccountId = formData.id;
        this.demandDepositAccountForm = this.formBuilder.group({
            productId: [formData.productId, [Validators.required]],
            name: [formData.name, [Validators.required, Validators.minLength(3), Validators.maxLength(200), Validators.pattern(new RegExp(/^[a-z ,.'-]+$/i))]],
            number: [{ value: formData.number, disabled: true }],
            currencyCode: [formData.currencyCode, [Validators.required]],
            introducerAccountId: [formData.introducerAccountId],
            introducerName: [{ value: this.introducerDetail.name, disabled: true }],
            purpose: [formData.purpose],
            accountOpeningChannelId: [formData.accountOpeningChannelId],
            relationshipManager: [formData.relationshipManager]
        });
        this.onDemandDepositProductChange(false);
        this.onIntroducerAccountChange();

        this.demandDepositAccountForm.get('currencyCode').valueChanges.subscribe(
            value => {
                //  console.log(value);
            }
        )

    }

    ngDoCheck() {
        if (this.accountDetailFieldDisable && !this.createMode) {
            this.demandDepositAccountForm.get('name').disable();
            this.demandDepositAccountForm.get('currencyCode').disable();
            this.demandDepositAccountForm.get('productId').disable();
        }
    }

    onIntroducerAccountChange(): void {
        this.demandDepositAccountForm.get('introducerAccountId').valueChanges
            .pipe(debounceTime(1500), distinctUntilChanged(), filter(val => val))
            .subscribe(value => {
                this.introducerAccountNumber = value;
                this.searchIntroducerByAccountNumber(this.introducerAccountNumber);
                this.demandDepositAccountForm.get('introducerName').reset();
            });
    }

    onDemandDepositProductChange(flag: boolean) {
        this.demandDepositProductId = this.demandDepositAccountForm.get('productId').value;
        if (this.demandDepositProductId) {
            this.fetchDemandDepositProductDetail(flag);
        }
    }

    fetchDemandDepositProductDetail(flag: boolean) {
        this.subscribers.fetchDemandDepositProductDetailSub = this.demandDepositProductService
            .fetchDemandDepositProductDetails({ id: this.demandDepositProductId + "" })
            .pipe(map(data => {
                this.demandDepositProductDetails = data;
                this.showCurrency();
                this.hasIntroducer();
                if (flag) this.demandDepositAccountForm.get('number').reset();
            })).subscribe();
    }

    hasIntroducer() {
        this.demandDepositProductDetails.hasIntroducer
            ? this.demandDepositAccountForm.get('introducerAccountId').setValidators(Validators.required)
            : this.demandDepositAccountForm.get('introducerAccountId').clearValidators();

        this.demandDepositAccountForm.get('introducerAccountId').updateValueAndValidity();
    }

    showCurrency() {
        if (CurrencyRestriction[1].value == this.demandDepositProductDetails.currencyRestriction) { //local currency
            this.demandDepositAccountForm.get('currencyCode').setValue(this.demandDepositProductDetails.currencies[0]);
            this.multipleCurrency = false;
        }
        else {
            this.currencies = [{ label: 'Choose currency', value: null }].concat(this.demandDepositProductDetails.currencies
                .map(currency => { return { label: currency, value: currency } }));
            this.multipleCurrency = true;
        }
        this.demandDepositAccountForm.get('currencyCode').setValidators(Validators.required);
    }

    fetchCustomerDetails() {
        this.subscribers.fetchCustomerDetailsSub = this.cisService
            .fetchCustomer({ id: this.customerId + "" })
            .pipe(map(data => {
                this.customer = data;
                if (!this.demandDepositAccountForm.get('name').value) {
                    this.demandDepositAccountForm.get('name').setValue(this.customer.name);
                }
            })).subscribe();
    }

    fetchProductConfiguration() {
        let urlSearchParam: Map<string, string> = new Map([['name', 'profit-calculation']]);
        this.subscribers.fetchProductConfigurationSub = this.productService
            .fetchProductConfiguration(urlSearchParam)
            .subscribe(profiles => this.type = profiles.type);
    }

    fetchDemandDepositAccountDetails(demandDepositAccountId: number) {
        this.subscribers.fetchDemandDepositAccountSub = this.demandDepositAccountService
            .fetchDemandDepositAccountDetails({ id: demandDepositAccountId + "" })
            .pipe(map(data => {
                this.demandDepositAccount = data;
                this.accountNumber = this.demandDepositAccount.number;
                this.contactAddress = this.demandDepositAccount.contactAddress;
                this.contactInformation = this.demandDepositAccount.contactInformation;
                this.status = this.demandDepositAccount.status;
                this.prepareDemandDepositAccountForm(this.demandDepositAccount);
                if (this.demandDepositAccount.introducerAccountId) this.fetchIntroducerDetails(this.demandDepositAccount.introducerAccountId);
            })).subscribe();
    }

    fetchIntroducerDetails(introducerAccountId: number) {
        this.subscribers.fetchIntroducerDetailsSub = this.demandDepositAccountService
            .fetchDemandDepositAccountDetails({ id: introducerAccountId + "" })
            .pipe(map(data => {
                this.introducerDetail = data;
                this.demandDepositAccountForm.get('introducerAccountId').setValue(this.introducerDetail.number);
                this.demandDepositAccountForm.get('introducerName').setValue(this.introducerDetail.name);
            })).subscribe();
    }

    fetchDemandDepositProducts() {
        this.urlSearchParams = new Map([['status', 'ACTIVE']]);
        this.subscribers.fetchDemandDepositProductsSub = this.demandDepositProductService
            .fetchDemandDepositProducts(this.urlSearchParams)
            .subscribe(data => this.demandDepositProducts = data.content);
    }

    generateAccountNumber() {
        let branchId = 7;
        let urlQueryMap = new Map();
        if (branchId != null) urlQueryMap.set('branchId', branchId);
        this.subscribers.fetchAvailablePercentageSub = this.productService
            .createAccountNumber({ id: this.demandDepositProductId }, urlQueryMap)
            .subscribe(data => {
                this.accountNumber = data;
                this.demandDepositAccountForm.get('number').setValue(this.accountNumber);
            });
    }

    disableAccountNumberGenerateButton(): boolean {
        return !(this.demandDepositProductId && this.demandDepositProductId != 0 && !this.accountDetailFieldDisable);
    }

    searchIntroducerByAccountNumber(introducerAccountId) {
        this.urlSearchParams = new Map([['accountNumber', introducerAccountId]]);
        this.subscribers.searchIntroducerSub = this.demandDepositAccountService
            .fetchDemandDepositAccounts(this.urlSearchParams)
            .subscribe(data => {
                this.introducerDetail = data.content[0];
                this.setIntroducer();
            });
    }

    setIntroducer() {
        if (this.introducerDetail == undefined || (this.introducerDetail.status != 'ACTIVATED')) {
            this.introducerDetail = new DemandDepositAccount();
            this.notificationService.sendErrorMsg("invalid.introducer.id");
        }
        this.demandDepositAccountForm.get('introducerAccountId').setValue(this.introducerDetail.number);
        this.demandDepositAccountForm.get('introducerName').setValue(this.introducerDetail.name);
    }

    submit() {
        this.showVerifierSelectionModal = of(true);

    }


    onVerifierSelect(selectEvent: VerifierSelectionEvent) {
        this.saveDemandDepositAccount(selectEvent, null);
    }

    saveDemandDepositAccount(selectEvent: VerifierSelectionEvent, taskId: string) {
        console.log(this.demandDepositAccount);
        this.markFormGroupAsTouched(this.demandDepositAccountForm);
        this.contactAddressComponent.markAsTouched();
        this.contactInformationComponent.markAsTouched();
        if (this.formsInvalid()) { return };
        this.demandDepositAccount.productId = this.demandDepositProductId;
        this.demandDepositAccount.introducerAccountId = this.introducerDetail.id;
        this.demandDepositAccount.currencyCode = (CurrencyRestriction[1].value == this.demandDepositProductDetails.currencyRestriction)  //local currency
            ? this.demandDepositProductDetails.currencies[0]
            : this.demandDepositAccountForm.get('currencyCode').value;
        this.demandDepositAccount.contactAddress = this.contactAddressComponent.extractData();
        this.demandDepositAccount.contactInformation = this.contactInformationComponent.extractData();
        this.demandDepositAccount.name = this.demandDepositAccountForm.get('name').value;
        this.demandDepositAccount.id = this.demandDepostAccountId;
        this.demandDepositAccount.number = this.accountNumber;
        this.demandDepositAccount.customerId = this.customer.id;
        this.demandDepositAccount.branchId = 7;
        this.demandDepositAccount.purpose = this.demandDepositAccountForm.get('purpose').value;
        this.demandDepositAccount.accountOpeningChannelId = this.demandDepositAccountForm.get('accountOpeningChannelId').value;
        this.demandDepositAccount.relationshipManager = this.demandDepositAccountForm.get('relationshipManager').value;
        if (this.demandDepositAccount.id) {
            let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, selectEvent.verifier, DETAILS_UI.concat("accountId=").concat(this.demandDepostAccountId.toString()).concat("&"), this.location.path().concat("&"));
            this.demandDepositAccount.status = this.status;
            this.demandDepositAccount.type = this.demandDepositAccount.type;
            this.updateDemandDepositAccount(this.demandDepositAccount, urlSearchParams, selectEvent.approvalFlowRequired);
        } else {
            this.createDemandDepositAccount(this.demandDepositAccount);
        }
    }

    createDemandDepositAccount(demandDepositAccount) {
        delete demandDepositAccount.accountBalance;  //should be removed after handeling accountBalance

        this.subscribers.saveDemandDepositAccountSub = this.demandDepositAccountService
            .createDemandDepositAccount(demandDepositAccount)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("demand.deposit.account.create.success");
                this.navigateToDetails(data.content);
            });
    }

    updateDemandDepositAccount(demandDepositAccount: DemandDepositAccount, urlSearchParam: any, approvalFlowRequired: boolean) {
        delete demandDepositAccount.accountBalance; //should be removed after handeling accountBalance
        this.subscribers.updateDemandDepositAccountSub = this.demandDepositAccountService
            .updateDemandDepositAccount(demandDepositAccount, { "id": demandDepositAccount.id + "" }, urlSearchParam)
            .subscribe(data => {
                //  this.notificationService.sendSuccessMsg(UPDATE_SUCCESS_MSG[+((approvalFlowRequired || !!this.taskId) && (this.demandDepositAccount.status == 'ACTIVATED'))]);

                if ((this.status != undefined) && (this.status === "ACTIVATED") || (this.status === "OPENED")) {
                    this.notificationService.sendSuccessMsg(UPDATE_SUCCESS_MSG[+(approvalFlowRequired || !!this.taskId)]);
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

        return (this.demandDepositAccountForm.invalid ||
            (this.demandDepositAccountForm.get('number').value == undefined) || this.contactAddressComponent.isInvalid()
            || this.contactInformationComponent.isInvalid());
    }

    cancel() {
        this.navigateAway();
    }

    navigateToDetails(accountId: number): void {
        this.router.navigate(['/demand-deposit-account', accountId, 'details'], {
            relativeTo: this.route,
            queryParamsHandling: "merge"
        });
    }

    // navigateAway() {
    //     if (this.queryParams['demandDeposit'] !== undefined) {
    //         this.router.navigate([this.queryParams['demandDeposit']], { queryParamsHandling: "merge" });
    //     } else {
    //         this.location.back();
    //     }
    // }
    navigateAway() {
        if (this.taskId && this.queryParams.command == "UpdateDemandDepositAccountCommand") {
            this.router.navigate(['../../', 'approval-flow', 'pendingtasks']);
        } else {

            if (this.demandDepositAccount.id) {
                this.router.navigate([this.queryParams['demandDeposit']], { queryParams: { cus: this.queryParams['cus'] } });
            } else {

                this.router.navigate([this.queryParams.cus], {
                    queryParams: { cus: this.queryParams['cus'] },
                });
            }
        }


    }


}