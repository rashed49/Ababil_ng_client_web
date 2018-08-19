import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormBaseComponent } from "../../../../../common/components/base.form.component";
import { NotificationService } from './../../../../../common/notification/notification.service';
import * as ababilValidator from './../../../../../common/constants/app.validator.constants';
import { AbabilCustomValidators } from "../../../../../common/validators/ababil.custom.validators";
import { ChargeCurrencyType } from '../../../../../common/domain/charge.currency.type.enum.model';
import { ApprovalflowService } from "../../../../../services/approvalflow/service-api/approval.flow.service";
import { GlAccountService } from "../../../../../services/glaccount/service-api/gl.account.service";
import { of, Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import * as commandConstants from '../../../../../common/constants/app.command.constants';
import { VerifierSelectionEvent } from "../../../../../common/components/verifier-selection/verifier.selection.component";
import { TimeDepositChargeService } from "../../../../../services/time-deposit-charge/service-api/time.deposit.charge.service";
import { TimeDepositChargeConfiguration, ActivateTimeDepositChargeConfigurationCommand } from "../../../../../services/time-deposit-charge/domain/time.deposit.charge.configuration.model";
import { TimeDepositSlabChargeConfig } from "../../../../../services/time-deposit-charge/domain/time.deposit.slab.charge.config.model";
import { TimeDepositVatCalculationInfo } from "../../../../../services/time-deposit-charge/domain/time.deposit.vat.calculation.info.model";
import { TimeDepositSlabVatConfig } from "../../../../../services/time-deposit-charge/domain/time.deposit.slab.vat.config.mode";
import { TimeDepositProduct } from "../../../../../services/time-deposit-product/domain/time.deposit.product.model";
import { TimeDepositChargeCalculationInfo } from "../../../../../services/time-deposit-charge/domain/time.charge.calculation.info.model";
import { FixedDepositProductService } from "../../../../../services/fixed-deposit-product/service-api/fixed.deposit.product.service";
import { RecurringDepositProductService } from "../../../../../services/recurring-deposit-product/service-api/recurring.deposit.product.service";
import { FixedDepositProduct } from "../../../../../services/fixed-deposit-product/domain/fixed.deposit.product.model";
import { RecurringDepositProduct } from "../../../../../services/recurring-deposit-product/domain/recurring.deposit.product.model";
import { ProductService } from "../../../../../services/product/service-api/product.service";

export const SUCCESS_MSG: string[] = ["time.deposit.charge.configuration.update.success", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/time-deposit-charge-configuration?";


export interface GroupedTimeDepositProducts {
    label: string;
    items: any[];
}

@Component({
    selector: 'time-deposit-charge-configuration-form',
    templateUrl: './time.deposit.charge.configuration.form.component.html'
})
export class TimeDepositChargeConfigurationFormComponent extends FormBaseComponent implements OnInit {
    chargeConfigurationForm: FormGroup;
    productCurrencies: SelectItem[] = [{ label: 'Select currency', value: null }];
    timeDepositProducts: GroupedTimeDepositProducts[] = [];
    fixedProducts: FixedDepositProduct[] = [];
    recurringProducts: RecurringDepositProduct[] = [];
    chargeConfiguration: TimeDepositChargeConfiguration = new TimeDepositChargeConfiguration();
    timeDepositChargeCalculationInfo: TimeDepositChargeCalculationInfo = new TimeDepositChargeCalculationInfo();
    timeDepositSlabChargeConfigs: TimeDepositSlabChargeConfig[] = [];
    timeDepositVatCalculationInfo: TimeDepositVatCalculationInfo = new TimeDepositVatCalculationInfo();
    timeDepositSlabVatConfigs: TimeDepositSlabVatConfig[] = [];
    chargeCurrencyTypes: SelectItem[] = ChargeCurrencyType;
    chargeConfigurationId: number;
    isChargeSlabBased: boolean = false;
    isChargeFixed: boolean = false;
    isVatSlabBased: boolean = false;
    isVatFixed: boolean = false;
    balanceLength: number = ababilValidator.balanceLength;
    queryParams: any;
    glAccountLookUpDisplay: boolean = false;
    glAccountLookUpMode: string = 'GL_ACCOUNT';
    chargeGl: number;
    vatGl: number;
    isChargeGl: boolean = false;
    minMaxChargeValid: boolean = true;
    minMaxVatValid: boolean = true;
    defaultConfiguration: boolean = true;
    timeDepositChargeConfigurationToUpdate: TimeDepositChargeConfiguration;
    command: string = commandConstants.UPDATE_TIME_DEPOSIT_CHARGE_CONFIGURATION_COMMAND;
    selectedTimeDepositProductType: string;
    productTypes: SelectItem[] = [{label:'Select product type', value: null},{ label: 'Fixed deposit product', value: 'FIXED_DEPOSIT' }, { label: 'Instalment deposit product', value: 'RECURRING_DEPOSIT' }];
    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private timeDepositChargeService: TimeDepositChargeService,
        private fixedDepositProductService: FixedDepositProductService,
        private recurringDepositProductService: RecurringDepositProductService,
        private notificationService: NotificationService,
        private glAcountService: GlAccountService,
        protected location: Location,
        protected approvalFlowService: ApprovalflowService,
        private productService: ProductService) {
        super(location, approvalFlowService);

    }

    ngOnInit(): void {

        this.showVerifierSelectionModal = of(false);
        // this.timeDepositProducts.push({ label: 'Fixed deposit', items: [] }, { label: 'Instalment deposit', items: [] });

        this.subscribers.routeSub = this.route.params.subscribe(param => {
            this.chargeConfigurationId = param.id;
            if (this.chargeConfigurationId) {
                this.subscribers.fetchChargeConfigurationSub = this.timeDepositChargeService
                    .fetchTimeDepositChargeConfiguration({ id: this.chargeConfigurationId })
                    .subscribe(data => {
                        this.chargeConfiguration = data;
                        if (this.chargeConfiguration.defaultConfiguration) {
                            this.chargeConfiguration.calculationCurrency = 'Base currency';
                            this.chargeConfiguration.transactionCurrency = 'Base currency';
                        }

                        if (this.chargeConfiguration.productId) {
                            this.fetchProductDetail(this.chargeConfiguration.productId);
                        }

                        this.prepareChargeConfigurationForm(this.chargeConfiguration);
                        this.timeDepositSlabChargeConfigs = this.chargeConfiguration.timeDepositChargeCalculationInfo.timeDepositSlabChargeConfigs ? this.chargeConfiguration.timeDepositChargeCalculationInfo.timeDepositSlabChargeConfigs : [];
                        this.isChargeSlabBased = this.chargeConfiguration.timeDepositChargeCalculationInfo.slabBased;
                        this.isChargeFixed = this.chargeConfiguration.timeDepositChargeCalculationInfo.fixed;
                        this.timeDepositSlabVatConfigs = this.chargeConfiguration.timeDepositVatCalculationInfo.timeDepositSlabVatConfigs ? this.chargeConfiguration.timeDepositVatCalculationInfo.timeDepositSlabVatConfigs : [];
                        this.isVatSlabBased = this.chargeConfiguration.timeDepositVatCalculationInfo.slabBased;
                        this.isVatFixed = this.chargeConfiguration.timeDepositVatCalculationInfo.fixed;
                        this.chargeGl = this.chargeConfiguration.chargeGl;
                        this.vatGl = this.chargeConfiguration.vatGl;
                        this.fetchGeneralLedgerAccounts(this.chargeGl, 'CHARGE_GL');
                        this.fetchGeneralLedgerAccounts(this.vatGl, 'VAT_GL');
                    });
            }
        });

        this.subscribers.querySub = this.route.queryParams.subscribe(query => this.queryParams = query);
        this.prepareChargeConfigurationForm(null);

    }

    prepareChargeConfigurationForm(formData: TimeDepositChargeConfiguration) {

        formData = formData ? formData : new TimeDepositChargeConfiguration();
        formData.timeDepositChargeCalculationInfo = formData.timeDepositChargeCalculationInfo ? formData.timeDepositChargeCalculationInfo : new TimeDepositChargeCalculationInfo();
        formData.timeDepositVatCalculationInfo = formData.timeDepositVatCalculationInfo ? formData.timeDepositVatCalculationInfo : new TimeDepositVatCalculationInfo();
        this.chargeConfigurationForm = this.formBuilder.group({
            timeDepositProduct: [formData.productId, [Validators.required]],
            defaultConfiguration: [formData.defaultConfiguration],
            currencyCode: [formData.currencyCode, [Validators.required]],
            calculationCurrency: [formData.calculationCurrency, [Validators.required]],
            transactionCurrency: [formData.transactionCurrency, [Validators.required]],
            chargeGl: [null, [Validators.required]],
            vatGl: [null, [Validators.required]],
            isChargeSlabBased: [formData.timeDepositChargeCalculationInfo.slabBased],
            isChargeFixed: [formData.timeDepositChargeCalculationInfo.fixed],
            chargeAmount: [formData.timeDepositChargeCalculationInfo.chargeAmount, [Validators.required, AbabilCustomValidators.isNumber]],
            minCharge: [formData.timeDepositChargeCalculationInfo.minCharge],
            maxCharge: [formData.timeDepositChargeCalculationInfo.maxCharge],
            isVatSlabBased: [formData.timeDepositVatCalculationInfo.slabBased],
            isVatFixed: [formData.timeDepositVatCalculationInfo.fixed],
            vatAmount: [formData.timeDepositVatCalculationInfo.vatAmount, [Validators.required, AbabilCustomValidators.isNumber]],
            minVat: [formData.timeDepositVatCalculationInfo.minVat],
            maxVat: [formData.timeDepositVatCalculationInfo.maxVat]
        });

        if (formData.defaultConfiguration) {
            this.chargeConfigurationForm.controls.calculationCurrency.setValue('Base currency');
            this.chargeConfigurationForm.controls.transactionCurrency.setValue('Base currency');
            this.chargeConfigurationForm.controls.currencyCode.clearValidators();
            this.chargeConfigurationForm.controls.currencyCode.updateValueAndValidity();
        } else {
            this.defaultConfiguration = false;
        }

        if (!formData.timeDepositChargeCalculationInfo.slabBased && !formData.timeDepositChargeCalculationInfo.fixed) {
            this.chargeConfigurationForm.controls.minCharge.setValidators([Validators.required, AbabilCustomValidators.isNumber]);
            this.chargeConfigurationForm.controls.minCharge.updateValueAndValidity();
            this.chargeConfigurationForm.controls.maxCharge.setValidators([Validators.required, AbabilCustomValidators.isNumber]);
            this.chargeConfigurationForm.controls.maxCharge.updateValueAndValidity();
        }

        if (!formData.timeDepositVatCalculationInfo.slabBased && !formData.timeDepositVatCalculationInfo.fixed) {
            this.chargeConfigurationForm.controls.minVat.setValidators([Validators.required, AbabilCustomValidators.isNumber]);
            this.chargeConfigurationForm.controls.minVat.updateValueAndValidity();
            this.chargeConfigurationForm.controls.maxVat.setValidators([Validators.required, AbabilCustomValidators.isNumber]);
            this.chargeConfigurationForm.controls.maxVat.updateValueAndValidity();
        }

        this.chargeConfigurationForm.controls.timeDepositProduct.valueChanges
            .subscribe(data => {
                if (data) {
                    this.chargeConfigurationForm.controls.currencyCode.setValue(null);
                    this.fetchProductDetail(data);
                }
            });

        this.chargeConfigurationForm.controls.defaultConfiguration.valueChanges
            .subscribe(data => {
                if (data) {
                    this.chargeConfigurationForm.controls.currencyCode.clearValidators();
                    this.chargeConfigurationForm.controls.currencyCode.updateValueAndValidity();
                    this.defaultConfiguration = true;
                    this.chargeConfigurationForm.controls.calculationCurrency.setValue('Base currency');
                    this.chargeConfigurationForm.controls.transactionCurrency.setValue('Base currency');
                } else {
                    this.defaultConfiguration = false;
                    this.chargeConfigurationForm.controls.currencyCode.reset();
                    this.chargeConfigurationForm.controls.calculationCurrency.reset();
                    this.chargeConfigurationForm.controls.transactionCurrency.reset();
                    this.chargeConfigurationForm.controls.currencyCode.setValidators(Validators.required);
                    this.chargeConfigurationForm.controls.currencyCode.updateValueAndValidity();
                }
            })

        this.chargeConfigurationForm.controls.isChargeSlabBased.valueChanges
            .subscribe(data => {
                if (data) {
                    this.isChargeSlabBased = true;
                    this.chargeConfigurationForm.controls.minCharge.clearValidators();
                    this.chargeConfigurationForm.controls.minCharge.updateValueAndValidity();
                    this.chargeConfigurationForm.controls.maxCharge.clearValidators();
                    this.chargeConfigurationForm.controls.maxCharge.updateValueAndValidity();
                } else {
                    this.isChargeSlabBased = false;
                    this.chargeConfigurationForm.controls.minCharge.setValidators(Validators.required);
                    this.chargeConfigurationForm.controls.minCharge.updateValueAndValidity();
                    this.chargeConfigurationForm.controls.maxCharge.setValidators(Validators.required);
                    this.chargeConfigurationForm.controls.maxCharge.updateValueAndValidity();
                }
            });

        this.chargeConfigurationForm.controls.isChargeFixed.valueChanges
            .subscribe(data => {
                if (data) {
                    this.isChargeFixed = true;
                    this.chargeConfigurationForm.controls.minCharge.clearValidators();
                    this.chargeConfigurationForm.controls.minCharge.updateValueAndValidity();
                    this.chargeConfigurationForm.controls.maxCharge.clearValidators();
                    this.chargeConfigurationForm.controls.maxCharge.updateValueAndValidity();
                } else {
                    this.isChargeFixed = false;
                    this.chargeConfigurationForm.controls.minCharge.setValidators(Validators.required);
                    this.chargeConfigurationForm.controls.minCharge.updateValueAndValidity();
                    this.chargeConfigurationForm.controls.maxCharge.setValidators(Validators.required);
                    this.chargeConfigurationForm.controls.maxCharge.updateValueAndValidity();
                }
            });

        this.chargeConfigurationForm.controls.isVatSlabBased.valueChanges
            .subscribe(data => {
                if (data) {
                    this.isVatSlabBased = true;
                    this.chargeConfigurationForm.controls.minVat.clearValidators();
                    this.chargeConfigurationForm.controls.minVat.updateValueAndValidity();
                    this.chargeConfigurationForm.controls.maxVat.clearValidators();
                    this.chargeConfigurationForm.controls.maxVat.updateValueAndValidity();
                } else {
                    this.isVatSlabBased = false;
                    this.chargeConfigurationForm.controls.minVat.setValidators(Validators.required);
                    this.chargeConfigurationForm.controls.minVat.updateValueAndValidity();
                    this.chargeConfigurationForm.controls.maxVat.setValidators(Validators.required);
                    this.chargeConfigurationForm.controls.maxVat.updateValueAndValidity();
                }
            });

        this.chargeConfigurationForm.controls.isVatFixed.valueChanges
            .subscribe(data => {
                if (data) {
                    this.isVatFixed = true;
                    this.chargeConfigurationForm.controls.minVat.clearValidators();
                    this.chargeConfigurationForm.controls.minVat.updateValueAndValidity();
                    this.chargeConfigurationForm.controls.maxVat.clearValidators();
                    this.chargeConfigurationForm.controls.maxVat.updateValueAndValidity();
                } else {
                    this.isVatFixed = false
                    this.chargeConfigurationForm.controls.minVat.setValidators(Validators.required);
                    this.chargeConfigurationForm.controls.minVat.updateValueAndValidity();
                    this.chargeConfigurationForm.controls.maxVat.setValidators(Validators.required);
                    this.chargeConfigurationForm.controls.maxVat.updateValueAndValidity();
                }
            });

        this.chargeConfigurationForm.controls.minCharge.valueChanges.subscribe(data => {
            this.validateMinMaxCharge();
        });

        this.chargeConfigurationForm.controls.maxCharge.valueChanges.subscribe(data => {
            this.validateMinMaxCharge();
        });

        this.chargeConfigurationForm.controls.minVat.valueChanges.subscribe(data => {
            this.validateMinMaxVat();
        });

        this.chargeConfigurationForm.controls.maxVat.valueChanges.subscribe(data => {
            this.validateMinMaxVat();
        });
    }

    validateMinMaxCharge() {
        let minCharge: number = this.chargeConfigurationForm.controls.minCharge.value;
        let maxCharge: number = this.chargeConfigurationForm.controls.maxCharge.value;
        this.minMaxChargeValid = (minCharge >= 0 && maxCharge >= 0 && minCharge >= maxCharge) ? false : true;
    }

    validateMinMaxVat() {
        let minVat: number = this.chargeConfigurationForm.controls.minVat.value;
        let maxVat: number = this.chargeConfigurationForm.controls.maxVat.value;
        this.minMaxVatValid = (minVat >= 0 && maxVat >= 0 && minVat >= maxVat) ? false : true;
    }

    fetchTimeDepositProductCurrency(productType, productId: number) {
        if (productType === "FIXED_DEPOSIT") {
            this.subscribers.fetchTimeDepositProductCurrencySub = this.fixedDepositProductService.fetchFixedDepositProductDetails({ id: productId })
                .subscribe(data => {
                    this.productCurrencies = [{ label: 'Select currency', value: null }].concat(data.currencies.map(currency => {
                        return { label: currency, value: currency }
                    }));
                });
        }
        if (productType === "RECURRING_DEPOSIT") {
            this.subscribers.fetchTimeDepositProductCurrencySub = this.recurringDepositProductService.fetchRecurringDepositProductDetails({ recurringDepositProductId: productId })
                .subscribe(data => {
                    this.productCurrencies = [{ label: 'Select currency', value: null }].concat(data.currencies.map(currency => {
                        return { label: currency, value: currency }
                    }));
                });
        }





    }
    fetchFixedDepositProducts() {
        this.subscribers.fetchSub = this.fixedDepositProductService.fetchFixedDepositProducts(new Map())
            .subscribe(data => {
                this.fixedProducts = data.content;
                this.products = data.content;
            });
    }
    fetchRecurringDepositProducts() {
        this.subscribers.fetchSub = this.recurringDepositProductService.fetchRecurringDepositProducts(new Map())
            .subscribe(data => {
                this.recurringProducts = data.content;
                this.products = data.content;

            });
    }
    // fetchFixedDepositProducts() {
    //     return this.fixedDepositProductService.fetchFixedDepositProducts(new Map())
    //         .map(data => { return data.content });
    // }
    // fetchRecurringDepositProducts() {
    //     return this.recurringDepositProductService.fetchRecurringDepositProducts(new Map())
    //         .map(data => { return data.content });
    // }
    products: any[] = [];
    // fetchAllTimeDepositProducts() {


    //     Observable.forkJoin([
    //         this.fetchFixedDepositProducts(),
    //         this.fetchRecurringDepositProducts()]).map(([s1, s2]) => {
    //             // s1.forEach(element => {
    //             //     this.timeDepositProducts[0].items.push({ label: element.name, value: element.id });
    //             // });
    //             // s2.forEach(element => {
    //             //     this.timeDepositProducts[1].items.push({ label: element.name, value: element.id });
    //             // });
    //             this.products = [...s1, ...s2];


    //         }).subscribe();

    // }

    saveChargeConfiguration() {
        this.markFormGroupAsTouched(this.chargeConfigurationForm);
        if (this.formInvalid()) { return }

        let chargeConfigurationToSave: TimeDepositChargeConfiguration = this.extractData();
        this.chargeConfiguration.id ? this.updateTimeDepositChargeConfiguration() : this.createTimeDepositChargeConfiguration(chargeConfigurationToSave);
    }

    formInvalid(): boolean {
        let invalid: boolean = false;
        if (this.chargeConfigurationForm.invalid || !this.chargeGl || !this.vatGl) {
            invalid = true;
        }

        if (this.timeDepositSlabChargeConfigs.length > 0) {
            if (this.chargeSlabInvalid(this.timeDepositSlabChargeConfigs[this.timeDepositSlabChargeConfigs.length - 1])) {
                invalid = true;
            }
        }

        if (this.timeDepositSlabVatConfigs.length > 0) {
            if (this.vatSlabInvalid(this.timeDepositSlabVatConfigs[this.timeDepositSlabVatConfigs.length - 1])) {
                invalid = true;
            }
        }
        return invalid;
    }

    extractData(): TimeDepositChargeConfiguration {
        if (this.timeDepositSlabChargeConfigs.length > 0 && this.timeDepositSlabChargeConfigs[this.timeDepositSlabChargeConfigs.length - 1].fixed) {
            this.timeDepositSlabChargeConfigs[this.timeDepositSlabChargeConfigs.length - 1].maxCharge = null;
            this.timeDepositSlabChargeConfigs[this.timeDepositSlabChargeConfigs.length - 1].minCharge = null;
        }

        if (this.timeDepositSlabVatConfigs.length > 0 && this.timeDepositSlabVatConfigs[this.timeDepositSlabVatConfigs.length - 1].fixed) {
            this.timeDepositSlabVatConfigs[this.timeDepositSlabVatConfigs.length - 1].maxVat = null;
            this.timeDepositSlabVatConfigs[this.timeDepositSlabVatConfigs.length - 1].minVat = null;
        }

        let chargeConfigurationToSave: TimeDepositChargeConfiguration = this.chargeConfiguration;
        chargeConfigurationToSave.productId = this.chargeConfigurationForm.controls.timeDepositProduct.value;
           chargeConfigurationToSave.productName = this.products.filter(product => product.id == chargeConfigurationToSave.productId).map(product => product.name)[0];
        chargeConfigurationToSave.chargeGl = this.chargeGl;
        chargeConfigurationToSave.vatGl = this.vatGl;
        chargeConfigurationToSave.defaultConfiguration = this.chargeConfigurationForm.controls.defaultConfiguration.value;
        chargeConfigurationToSave.currencyCode = this.defaultConfiguration ? null : this.chargeConfigurationForm.controls.currencyCode.value;
        chargeConfigurationToSave.calculationCurrency = this.defaultConfiguration ? 'BASE_CURRENCY' : this.chargeConfigurationForm.controls.calculationCurrency.value;
        chargeConfigurationToSave.transactionCurrency = this.defaultConfiguration ? 'BASE_CURRENCY' : this.chargeConfigurationForm.controls.transactionCurrency.value;

        chargeConfigurationToSave.timeDepositChargeCalculationInfo.slabBased = this.chargeConfigurationForm.controls.isChargeSlabBased.value;
        chargeConfigurationToSave.timeDepositChargeCalculationInfo.fixed = chargeConfigurationToSave.timeDepositChargeCalculationInfo.slabBased ? null : this.chargeConfigurationForm.controls.isChargeFixed.value;
        chargeConfigurationToSave.timeDepositChargeCalculationInfo.chargeAmount = this.chargeConfigurationForm.controls.chargeAmount.value;
        chargeConfigurationToSave.timeDepositChargeCalculationInfo.minCharge = chargeConfigurationToSave.timeDepositChargeCalculationInfo.fixed ? null : this.chargeConfigurationForm.controls.minCharge.value;
        chargeConfigurationToSave.timeDepositChargeCalculationInfo.maxCharge = chargeConfigurationToSave.timeDepositChargeCalculationInfo.fixed ? null : this.chargeConfigurationForm.controls.maxCharge.value;
        chargeConfigurationToSave.timeDepositChargeCalculationInfo.timeDepositSlabChargeConfigs = chargeConfigurationToSave.timeDepositChargeCalculationInfo.slabBased ? this.timeDepositSlabChargeConfigs : [];

        chargeConfigurationToSave.timeDepositVatCalculationInfo.slabBased = this.chargeConfigurationForm.controls.isVatSlabBased.value;
        chargeConfigurationToSave.timeDepositVatCalculationInfo.fixed = chargeConfigurationToSave.timeDepositVatCalculationInfo.slabBased ? null : this.chargeConfigurationForm.controls.isVatFixed.value;
        chargeConfigurationToSave.timeDepositVatCalculationInfo.vatAmount = this.chargeConfigurationForm.controls.vatAmount.value;
        chargeConfigurationToSave.timeDepositVatCalculationInfo.minVat = chargeConfigurationToSave.timeDepositVatCalculationInfo.fixed ? null : this.chargeConfigurationForm.controls.minVat.value;
        chargeConfigurationToSave.timeDepositVatCalculationInfo.maxVat = chargeConfigurationToSave.timeDepositVatCalculationInfo.fixed ? null : this.chargeConfigurationForm.controls.maxVat.value;
        chargeConfigurationToSave.timeDepositVatCalculationInfo.timeDepositSlabVatConfigs = chargeConfigurationToSave.timeDepositVatCalculationInfo.slabBased ? this.timeDepositSlabVatConfigs : [];

        return chargeConfigurationToSave;
    }

    createTimeDepositChargeConfiguration(timeDepositChargeConfiguration: TimeDepositChargeConfiguration) {
        //this.command = commandConstants.SAVE_TIME_DEPOSIT_CHARGE_CONFIGURATION_COMMAND;
        timeDepositChargeConfiguration.chargeInfoId = this.queryParams.chargeInfoId;

        this.subscribers.createChargeConfiguration = this.timeDepositChargeService
            .createTimeDepositChargeConfiguration(timeDepositChargeConfiguration)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("time.deposit.charge.configuration.save.success");
                this.back();
            });
    }

    updateTimeDepositChargeConfiguration() {
        this.showVerifierSelectionModal = of(true);
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let view_ui = DETAILS_UI;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));

        let updateCharge = new ActivateTimeDepositChargeConfigurationCommand();
        updateCharge.timeDepositChargeInfo.timeDepositChargeConfigurations[0] = this.extractData();
        updateCharge.timeDepositChargeInfo.chargeName = this.queryParams.chargeName;
        updateCharge.timeDepositChargeInfo.id = updateCharge.timeDepositChargeInfo.timeDepositChargeConfigurations[0].chargeInfoId;

        this.subscribers.updateSub = this.timeDepositChargeService.updateTimeDepositChargeConfiguration(updateCharge, urlSearchParams)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
                this.back();
            });
    }

    addChargeSlab() {
        if (this.timeDepositSlabChargeConfigs.length > 0) {
            if (this.chargeSlabInvalid(this.timeDepositSlabChargeConfigs[this.timeDepositSlabChargeConfigs.length - 1])) { return }
        }

        let slabChargeConfig: TimeDepositSlabChargeConfig = new TimeDepositSlabChargeConfig();
        if (this.timeDepositSlabChargeConfigs.length == 0) {
            slabChargeConfig.fromAmount = 0;
        } else if (this.timeDepositSlabChargeConfigs.length > 0) {
            slabChargeConfig.fromAmount = this.timeDepositSlabChargeConfigs[this.timeDepositSlabChargeConfigs.length - 1].toAmount;
        }

        if (this.timeDepositSlabChargeConfigs.length > 0 && this.timeDepositSlabChargeConfigs[this.timeDepositSlabChargeConfigs.length - 1].fixed) {
            this.timeDepositSlabChargeConfigs[this.timeDepositSlabChargeConfigs.length - 1].minCharge = null;
            this.timeDepositSlabChargeConfigs[this.timeDepositSlabChargeConfigs.length - 1].maxCharge = null;
        }

        this.timeDepositSlabChargeConfigs = [...this.timeDepositSlabChargeConfigs, slabChargeConfig];
    }

    addVatSlab() {
        if (this.timeDepositSlabVatConfigs.length > 0) {
            if (this.vatSlabInvalid(this.timeDepositSlabVatConfigs[this.timeDepositSlabVatConfigs.length - 1])) { return }
        }

        let slabVatConfig: TimeDepositSlabVatConfig = new TimeDepositSlabVatConfig();
        if (this.timeDepositSlabVatConfigs.length == 0) {
            slabVatConfig.fromAmount = 0;
        } else if (this.timeDepositSlabVatConfigs.length > 0) {
            slabVatConfig.fromAmount = this.timeDepositSlabVatConfigs[this.timeDepositSlabVatConfigs.length - 1].toAmount;
        }

        if (this.timeDepositSlabVatConfigs.length > 0 && this.timeDepositSlabVatConfigs[this.timeDepositSlabVatConfigs.length - 1].fixed) {
            this.timeDepositSlabVatConfigs[this.timeDepositSlabVatConfigs.length - 1].minVat = null;
            this.timeDepositSlabVatConfigs[this.timeDepositSlabVatConfigs.length - 1].maxVat = null;
        }

        this.timeDepositSlabVatConfigs = [...this.timeDepositSlabVatConfigs, slabVatConfig];
    }

    chargeSlabInvalid(slabChargeConfig: TimeDepositSlabChargeConfig) {
        let error: boolean = false;
        if (slabChargeConfig.toAmount <= slabChargeConfig.fromAmount) {
            error = true;
        } else if (!slabChargeConfig.chargeAmount) {
            error = true;
        } else if (!slabChargeConfig.fixed && (!slabChargeConfig.minCharge || !slabChargeConfig.maxCharge || !(slabChargeConfig.maxCharge > slabChargeConfig.minCharge))) {
            error = true;
        }
        return error;
    }

    vatSlabInvalid(slabVatConfig: TimeDepositSlabVatConfig) {
        let error: boolean = false;
        if (slabVatConfig.toAmount <= slabVatConfig.fromAmount) {
            error = true;
        } else if (!slabVatConfig.vatAmount) {
            error = true;
        } else if (!slabVatConfig.fixed && (!slabVatConfig.minVat || !slabVatConfig.maxVat || !(slabVatConfig.maxVat > slabVatConfig.minVat))) {
            error = true;
        }
        return error;
    }

    chargeSlabDelete() {
        let deleteIndex = this.timeDepositSlabChargeConfigs.length - 1;
        this.timeDepositSlabChargeConfigs.splice(deleteIndex, 1);
        this.timeDepositSlabChargeConfigs = [...this.timeDepositSlabChargeConfigs];
    }

    vatSlabDelete() {
        let deleteIndex = this.timeDepositSlabVatConfigs.length - 1;
        this.timeDepositSlabVatConfigs.splice(deleteIndex, 1);
        this.timeDepositSlabVatConfigs = [...this.timeDepositSlabVatConfigs];
    }

    back() {
        this.router.navigate(['time-deposit-charge'], { queryParamsHandling: "merge" });
    }

    searchGlAccount(isChargeGl: boolean) {
        this.isChargeGl = isChargeGl;
        this.glAccountLookUpDisplay = true;
    }

    onSearchModalClose(event) {
        this.glAccountLookUpDisplay = false;
    }

    onSearchResult(event) {
        let gl = event.data;
        let glName = gl.name + " (" + gl.code + ")";
        if (this.isChargeGl) {
            this.chargeGl = gl.code;
            this.chargeConfigurationForm.controls.chargeGl.setValue(glName);
        } else {
            this.vatGl = gl.code;
            this.chargeConfigurationForm.controls.vatGl.setValue(glName);
        }
    }

    fetchGeneralLedgerAccounts(glCode: number, glFlag: string) {
        let urlSearchParam: Map<string, string> = new Map([['code', glCode + ""]])
        this.subscribers.fetchIncomeGeneralLedgerSub = this.glAcountService
            .fetchGeneralLedgerAccountsWithType(urlSearchParam)
            .pipe(map(data => data[0].name + " (" + data[0].code + ")"))
            .subscribe(data => {
                if ('CHARGE_GL' === glFlag) {
                    this.chargeConfigurationForm.controls.chargeGl.setValue(data);
                } else if ('VAT_GL' === glFlag) {
                    this.chargeConfigurationForm.controls.vatGl.setValue(data);
                }
            });
    }

    onProductTypeChange() {
        this.products = [];
        if (this.selectedTimeDepositProductType === "FIXED_DEPOSIT") {

            this.fetchFixedDepositProducts();
        }
        if (this.selectedTimeDepositProductType === "RECURRING_DEPOSIT") {
            this.fetchRecurringDepositProducts();
        }
    }
    fetchProductDetail(productId) {
        this.subscribers.fetchProductSub = this.productService.fetchProductDetails({ productId: productId }).subscribe(
            productDetails => {
                if (productDetails.type === "FIXED_DEPOSIT") {
                    this.fetchFixedDepositProducts();
                    this.selectedTimeDepositProductType = "FIXED_DEPOSIT";
                    this.fetchTimeDepositProductCurrency("FIXED_DEPOSIT", productDetails.id);

                }
                else if (productDetails.type === "RECURRING_DEPOSIT") {
                    this.fetchRecurringDepositProducts();
                    this.selectedTimeDepositProductType = "RECURRING_DEPOSIT";
                    this.fetchTimeDepositProductCurrency("RECURRING_DEPOSIT", productDetails.id);

                }
                else{
                    this.selectedTimeDepositProductType = null;
                    this.onProductTypeChange();
                }
            }
        )
    }
}