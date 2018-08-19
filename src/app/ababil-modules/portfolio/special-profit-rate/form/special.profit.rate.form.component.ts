import { Location } from '@angular/common';
import { NotificationService } from '../../../../common/notification/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OnInit } from "@angular/core";
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { VerifierSelectionEvent } from '../../../../common/components/verifier-selection/verifier.selection.component';
import * as urlSearchParameterConstants from '../../../../common/constants/app.search.parameter.constants';
import { ApprovalflowService } from './../../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from './../../../../common/components/base.form.component';
import { SpecialProfitRateService } from '../../../../services/special-profit-rate/service-api/special.profit.rate.service';
import { AccountSpecialProfitRate } from '../../../../services/special-profit-rate/domain/special.profit.rate.model';
import { ProductService } from '../../../../services/product/service-api/product.service';
import { DemandDepositProductService } from '../../../../services/demand-deposit-product/service-api/demand-deposit-product.service';
import { DemandDepositProduct } from '../../../../services/demand-deposit-product/domain/demand-deposit-product.model';
import { DemandDepositAccountService } from '../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { DemandDepositAccount } from '../../../../services/demand-deposit-account/domain/demand.deposit.account.models';


export let initialAccountSpecialProfitRateFormData: AccountSpecialProfitRate = new AccountSpecialProfitRate();
initialAccountSpecialProfitRateFormData.isProfitCalculationOn = false;
export const DETAILS_UI: string = "views/demand-deposit-product/special-profit-rate?";


@Component({
    selector: 'special-profit-rate-form',
    templateUrl: './special.profit.rate.form.component.html'
})

export class SpecialProfitRateFormComponent extends FormBaseComponent implements OnInit {

    accountSpecialProfitRate: AccountSpecialProfitRate = new AccountSpecialProfitRate();
    accountUrl: string;
    customerUrl: string;
    specialProfitRateId: number;
    routeBack: string;
    accountId: number;
    command: string = "CreateAccountSpecialProfitRateCommand";
    accountSpecialProfitRateForm: FormGroup;
    type: string;
    specialRate: boolean;
    productId: number;
    demandDepositProductDetail: DemandDepositProduct = new DemandDepositProduct();
    queryParams: any;
    demandDepositAccount: DemandDepositAccount = new DemandDepositAccount();
    specialProfitRateIdChange: Subject<number> = new Subject<number>();


    constructor(private route: ActivatedRoute,
        private router: Router,
        private specialProfitRateService: SpecialProfitRateService,
        private productService: ProductService,
        private demandDepositProductService: DemandDepositProductService,
        private demandDepositAccountService: DemandDepositAccountService,
        private notificationService: NotificationService,
        private formBuilder: FormBuilder,
        protected location: Location,
        protected approvalflowService: ApprovalflowService, ) {
        super(location, approvalflowService);
    }

    ngOnInit(): void {


        this.showVerifierSelectionModal = of(false);
        this.prepareSpecialProfitRateForm(null);
        this.subscribers.routeParamSub = this.route.params.subscribe(
            params => {
                this.subscribers.queryParamSub = this.route.queryParams.subscribe(
                    queryParams => {
                        this.queryParams = queryParams;
                        this.routeBack = queryParams['account'] ? queryParams['account'] : null;
                        this.commandReference = queryParams['commandReference'];
                        this.accountId = queryParams['accountId'];
                        this.taskId = this.queryParams['taskId'];
                        if (this.queryParams['taskId']) {
                            this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                                data => {
                                    this.prepareSpecialProfitRateForm(data);
                                });
                        }
                    });
            });
        this.fetchAccountSpecialProfitRateDetails();
        this.fetchProductConfiguration();

        this.fetchDemandDepositAccount();
        this.specialProfitRateIdChange
            .pipe(debounceTime(1500), distinctUntilChanged())
            .subscribe(model => {
                this.specialProfitRateId = model;
                this.specialProfitRateChange();
            });
    }

    fetchAccountSpecialProfitRateDetails() {
        this.specialProfitRateService.fetchAccountSpecialProfitRate({ accountId: this.accountId })
            .subscribe(data => {
                this.accountSpecialProfitRate = data;

                this.specialProfitRateIdChange.next(62);

            });

    }
    specialProfitRateChange() {


        if (this.specialProfitRateId) {
            this.command = "UpdateAccountSpecialProfitRateCommand";
            this.prepareSpecialProfitRateForm(this.accountSpecialProfitRate);

        }
        else {
            this.prepareSpecialProfitRateForm(null);
        }

    }

    disableSpecialProfitRateField: boolean;
    prepareSpecialProfitRateForm(formData: AccountSpecialProfitRate) {
        formData = (formData == null ? initialAccountSpecialProfitRateFormData : formData);
        if (formData.id != null || formData.id != undefined) {
            if (!formData.isProfitCalculationOn) {
                this.disableSpecialProfitRateField = false;
            }
            else {
                this.disableSpecialProfitRateField = true;
            }
        }
        this.specialProfitRateId = formData.id;
        this.accountSpecialProfitRate = formData;
        this.accountSpecialProfitRateForm = this.formBuilder.group({
            specialProfitRate: [{ value: formData.specialProfitRate, disabled: this.disableSpecialProfitRateField }, [Validators.required, Validators.min(0), Validators.max(100)]],
            specialPsr: [formData.specialPsr, [Validators.min(0), Validators.max(100)]],
            specialWeightage: [formData.specialWeightage, [Validators.min(0), Validators.max(100)]],
            reason: [formData.reason, [Validators.required]],
            accountId: [formData.accountId],
            isProfitCalculationOn: [formData.isProfitCalculationOn]
        });

        this.accountSpecialProfitRateForm.get('isProfitCalculationOn').valueChanges.subscribe(
            value => {
                if (value) {
                    this.disableSpecialProfitRateField = false;
                    this.accountSpecialProfitRateForm.get('specialProfitRate').setValue(null);
                    this.accountSpecialProfitRateForm.get('specialProfitRate').clearValidators();
                    this.accountSpecialProfitRateForm.get('specialProfitRate').reset({ value: '', disabled: true });
                    this.accountSpecialProfitRateForm.get('specialProfitRate').updateValueAndValidity();
                }

                if (!this.accountSpecialProfitRateForm.get('isProfitCalculationOn').value) {
                    this.disableSpecialProfitRateField = true;
                    this.accountSpecialProfitRateForm.get('specialProfitRate').setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
                    this.accountSpecialProfitRateForm.get('specialProfitRate').enable();
                    this.accountSpecialProfitRateForm.get('specialProfitRate').updateValueAndValidity();

                }

            });

    }


    submit() {
        if (!this.taskId) {
            this.showVerifierSelectionModal = of(true);
        } else {
            this.saveAccountSpecialProfitRate({ verifier: null, approvalFlowRequired: null }, this.taskId);
        }
    }


    onVerifierSelect(selectEvent: VerifierSelectionEvent) {
        this.saveAccountSpecialProfitRate(selectEvent, null);
    }

    saveAccountSpecialProfitRate(selectEvent: VerifierSelectionEvent, taskId: string) {
        let accountSpecialProfitRate: AccountSpecialProfitRate = this.accountSpecialProfitRateForm.value;
        accountSpecialProfitRate.id = this.specialProfitRateId;
        accountSpecialProfitRate.accountId = this.accountId;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, selectEvent.verifier, DETAILS_UI, this.location.path().concat("&"));
        accountSpecialProfitRate.id ? this.updateAccountSpecialProfitRate(accountSpecialProfitRate, urlSearchParams) : this.createAccountSpecialProfitRate(accountSpecialProfitRate, urlSearchParams);
    }

    createAccountSpecialProfitRate(accountSpecialProfitRate: AccountSpecialProfitRate, urlSearchMap) {
        this.specialProfitRateService.createAccountSpecialProfitRate(accountSpecialProfitRate, { accountId: this.accountId }, urlSearchMap)
            .subscribe(data => {
                if (urlSearchMap.has(urlSearchParameterConstants.VERIFIER)) {
                    this.notificationService.sendSuccessMsg("workflow.task.verify.send");
                } else {
                    this.notificationService.sendSuccessMsg("workflow.task.verify.send");
                }
                this.navigateAway();
            });
    }

    updateAccountSpecialProfitRate(accountSpecialProfitRate: AccountSpecialProfitRate, urlSearchMap) {
        this.specialProfitRateService.updateAccountSpecialProfitRate(accountSpecialProfitRate, { accountId: this.accountId, accounSpecialProfitRateId: this.specialProfitRateId }, urlSearchMap)
            .subscribe(data => {
                if (urlSearchMap.has(urlSearchParameterConstants.VERIFIER)) {
                    this.notificationService.sendSuccessMsg("workflow.task.verify.send");
                } else {
                    this.notificationService.sendSuccessMsg("workflow.task.verify.send");
                }
                this.navigateAway();
            });
    }

    fetchProductConfiguration() {
        let urlSearchParam: Map<string, string> = new Map([['name', 'profit-calculation']]);
        this.subscribers.fetchProductConfigurationSub = this.productService
            .fetchProductConfiguration(urlSearchParam)
            .subscribe(config => {
                this.type = config.type;
            });
    }


    fetchDemandDepositProduct() {
        this.subscribers.ddproductSub = this.demandDepositProductService.fetchDemandDepositProductDetails({ id: this.demandDepositAccount.productId }).subscribe(
            data => {
                this.demandDepositProductDetail = data;
            }
        )
    }
    fetchDemandDepositAccount() {
        this.subscribers.fetchDemandDepositAccountDetailsSub = this.demandDepositAccountService
            .fetchDemandDepositAccountDetails({ id: this.accountId + "" }).subscribe(
                data => {
                    this.demandDepositAccount = data;
                    this.fetchDemandDepositProduct();
                }
            );
    }

    formInvalid() {
        return this.accountSpecialProfitRateForm.invalid;
    }

    navigateAway() {
        this.router.navigate([this.queryParams['account']], {
            queryParams: { cus: this.queryParams['cus'] }
        });
    }

    cancel() {
        this.navigateAway();
    }






}