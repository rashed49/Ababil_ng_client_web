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
import { of } from "rxjs";
import { map } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import * as commandConstants from '../../../../../common/constants/app.command.constants';
import { VerifierSelectionEvent } from "../../../../../common/components/verifier-selection/verifier.selection.component";
import { DemandDepositChargeService } from "../../../../../services/demand-deposit-charge/service-api/demand.deposit.charge.service";
import { DemandDepositProduct } from "../../../../../services/demand-deposit-product/domain/demand-deposit-product.model";
import { DemandDepositChargeConfiguration, ActivateDemandDepositChargeConfigurationCommand } from "../../../../../services/demand-deposit-charge/domain/demand.deposit.charge.configuration.model";
import { DemandDepositChargeCalculationInfo } from "../../../../../services/demand-deposit-charge/domain/demand.deposit.charge.calculation.info.model";
import { DemandDepositSlabChargeConfig } from "../../../../../services/demand-deposit-charge/domain/demand.deposit.slab.charge.config.model";
import { DemandDepositVatCalculationInfo } from "../../../../../services/demand-deposit-charge/domain/demand.deposit.vat.calculation.info.model";
import { DemandDepositSlabVatConfig } from "../../../../../services/demand-deposit-charge/domain/demand.deposit.slab.vat.config.mode";
import { DemandDepositProductService } from "../../../../../services/demand-deposit-product/service-api/demand-deposit-product.service";
import { ChargeAndVatOptions } from "../../../../../common/domain/charge.vat.option.enum.model";

export const SUCCESS_MSG: string[] = ["demand.deposit.charge.configuration.update.success", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/demand-deposit-charge-configuration?";

@Component({
    selector: 'demand-deposit-charge-configuration-form',
    templateUrl: './demand.deposit.charge.configuration.form.component.html'
})
export class DemandDepositChargeConfigurationFormComponent extends FormBaseComponent implements OnInit {
    chargeConfigurationForm: FormGroup;
    productCurrencies: SelectItem[] = [{ label: 'Choose', value: null }];
    demandDepositProducts: DemandDepositProduct[] = [];
    chargeConfiguration: DemandDepositChargeConfiguration = new DemandDepositChargeConfiguration();
    demandDepositChargeCalculationInfo: DemandDepositChargeCalculationInfo = new DemandDepositChargeCalculationInfo();
    demandDepositSlabChargeConfigs: DemandDepositSlabChargeConfig[] = [];
    demandDepositVatCalculationInfo: DemandDepositVatCalculationInfo = new DemandDepositVatCalculationInfo();
    demandDepositSlabVatConfigs: DemandDepositSlabVatConfig[] = [];
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
    chargeOptions: SelectItem[] = ChargeAndVatOptions;
    selectedChargeOption: string;
    vatOptions: SelectItem[] = ChargeAndVatOptions;
    selectedVatOption: string;
    demandDepositChargeConfigurationToUpdate: DemandDepositChargeConfiguration;
    command: string = commandConstants.UPDATE_DEMAND_DEPOSIT_CHARGE_CONFIGURATION_COMMAND;

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private demandDepositChargeService: DemandDepositChargeService,
        private demandDepositProductService: DemandDepositProductService,
        private notificationService: NotificationService,
        private glAcountService: GlAccountService,
        protected location: Location,
        protected approvalFlowService: ApprovalflowService) {
        super(location, approvalFlowService);
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);
        this.selectedChargeOption = this.chargeOptions[2].value;
        this.selectedVatOption = this.vatOptions[2].value;

        this.subscribers.routeSub = this.route.params.subscribe(param => {
            this.chargeConfigurationId = param.id;
            if (this.chargeConfigurationId) {
                this.subscribers.fetchChargeConfigurationSub = this.demandDepositChargeService
                    .fetchDemandDepositChargeConfiguration({ id: this.chargeConfigurationId })
                    .subscribe(data => {
                        this.chargeConfiguration = data;
                        if (this.chargeConfiguration.defaultConfiguration) {
                            this.chargeConfiguration.calculationCurrency = 'Base currency';
                            this.chargeConfiguration.transactionCurrency = 'Base currency';
                        }

                        if (this.chargeConfiguration.productId) {
                            this.fetchDemandDepositProductCurrency(this.chargeConfiguration.productId);
                        }

                        this.prepareChargeConfigurationForm(this.chargeConfiguration);
                        this.demandDepositSlabChargeConfigs = this.chargeConfiguration.demandDepositChargeCalculationInfo.demandDepositSlabChargeConfigs ? this.chargeConfiguration.demandDepositChargeCalculationInfo.demandDepositSlabChargeConfigs : [];
                        this.isChargeSlabBased = this.chargeConfiguration.demandDepositChargeCalculationInfo.slabBased;
                        this.isChargeFixed = this.chargeConfiguration.demandDepositChargeCalculationInfo.fixed;
                        this.demandDepositSlabVatConfigs = this.chargeConfiguration.demandDepositVatCalculationInfo.demandDepositSlabVatConfigs ? this.chargeConfiguration.demandDepositVatCalculationInfo.demandDepositSlabVatConfigs : [];
                        this.isVatSlabBased = this.chargeConfiguration.demandDepositVatCalculationInfo.slabBased;
                        this.isVatFixed = this.chargeConfiguration.demandDepositVatCalculationInfo.fixed;

                        this.selectedChargeOption = this.isChargeSlabBased
                            ? this.chargeOptions[0].value
                            : this.isChargeFixed
                                ? this.chargeOptions[1].value
                                : this.chargeOptions[2].value;

                        this.selectedVatOption = this.isVatSlabBased
                            ? this.vatOptions[0].value
                            : this.isVatFixed
                                ? this.vatOptions[1].value
                                : this.vatOptions[2].value;

                        this.chargeGl = this.chargeConfiguration.chargeGl;
                        this.vatGl = this.chargeConfiguration.vatGl;
                        this.fetchGeneralLedgerAccounts(this.chargeGl, 'CHARGE_GL');
                        this.fetchGeneralLedgerAccounts(this.vatGl, 'VAT_GL');
                    });
            }
        });

        this.subscribers.querySub = this.route.queryParams.subscribe(query => this.queryParams = query);

        this.fetchDemandDepositProduct();
        this.prepareChargeConfigurationForm(null);
    }

    prepareChargeConfigurationForm(formData: DemandDepositChargeConfiguration) {
        formData = formData ? formData : new DemandDepositChargeConfiguration();
        formData.demandDepositChargeCalculationInfo = formData.demandDepositChargeCalculationInfo ? formData.demandDepositChargeCalculationInfo : new DemandDepositChargeCalculationInfo();
        formData.demandDepositVatCalculationInfo = formData.demandDepositVatCalculationInfo ? formData.demandDepositVatCalculationInfo : new DemandDepositVatCalculationInfo();

        this.chargeConfigurationForm = this.formBuilder.group({
            demandDepositProduct: [formData.productId, [Validators.required]],
            defaultConfiguration: [formData.defaultConfiguration],
            currencyCode: [formData.currencyCode, [Validators.required]],
            calculationCurrency: [formData.calculationCurrency, [Validators.required]],
            transactionCurrency: [formData.transactionCurrency, [Validators.required]],
            chargeGl: [null, [Validators.required]],
            vatGl: [null, [Validators.required]],
            isChargeSlabBased: [formData.demandDepositChargeCalculationInfo.slabBased],
            isChargeFixed: [formData.demandDepositChargeCalculationInfo.fixed],
            chargeAmount: [formData.demandDepositChargeCalculationInfo.chargeAmount, [Validators.required, AbabilCustomValidators.isNumber]],
            minCharge: [formData.demandDepositChargeCalculationInfo.minCharge],
            maxCharge: [formData.demandDepositChargeCalculationInfo.maxCharge],
            isVatSlabBased: [formData.demandDepositVatCalculationInfo.slabBased],
            isVatFixed: [formData.demandDepositVatCalculationInfo.fixed],
            vatAmount: [formData.demandDepositVatCalculationInfo.vatAmount, [Validators.required, AbabilCustomValidators.isNumber]],
            minVat: [formData.demandDepositVatCalculationInfo.minVat],
            maxVat: [formData.demandDepositVatCalculationInfo.maxVat]
        });

        if (formData.defaultConfiguration) {
            this.chargeConfigurationForm.controls.calculationCurrency.setValue('Base currency');
            this.chargeConfigurationForm.controls.transactionCurrency.setValue('Base currency');
            this.chargeConfigurationForm.controls.currencyCode.clearValidators();
            this.chargeConfigurationForm.controls.currencyCode.updateValueAndValidity();
        } else {
            this.defaultConfiguration = false;
        }

        if (!formData.demandDepositChargeCalculationInfo.slabBased && !formData.demandDepositChargeCalculationInfo.fixed) {
            this.chargeConfigurationForm.controls.minCharge.setValidators([Validators.required, AbabilCustomValidators.isNumber]);
            this.chargeConfigurationForm.controls.minCharge.updateValueAndValidity();
            this.chargeConfigurationForm.controls.maxCharge.setValidators([Validators.required, AbabilCustomValidators.isNumber]);
            this.chargeConfigurationForm.controls.maxCharge.updateValueAndValidity();
        }

        if (!formData.demandDepositVatCalculationInfo.slabBased && !formData.demandDepositVatCalculationInfo.fixed) {
            this.chargeConfigurationForm.controls.minVat.setValidators([Validators.required, AbabilCustomValidators.isNumber]);
            this.chargeConfigurationForm.controls.minVat.updateValueAndValidity();
            this.chargeConfigurationForm.controls.maxVat.setValidators([Validators.required, AbabilCustomValidators.isNumber]);
            this.chargeConfigurationForm.controls.maxVat.updateValueAndValidity();
        }

        this.chargeConfigurationForm.controls.demandDepositProduct.valueChanges
            .subscribe(data => {
                if (data) {
                    this.chargeConfigurationForm.controls.currencyCode.setValue(null);
                    this.fetchDemandDepositProductCurrency(data);
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

    chargeOptionChange() {
        if (this.selectedChargeOption === 'SLAB') {
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

            if (this.selectedChargeOption === 'FIXED') {
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
        }
    }

    vatOptionChange() {
        if (this.selectedVatOption === 'SLAB') {
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

            if (this.selectedVatOption === 'FIXED') {
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
        }
    }

    fetchDemandDepositProductCurrency(productId: number) {
        this.subscribers.fetchDemandDepositProductCurrencySub = this.demandDepositProductService.fetchDemandDepositProductDetails({ id: productId })
            .subscribe(data => {
                this.productCurrencies = [{ label: 'Choose', value: null }].concat(data.currencies.map(currency => {
                    return { label: currency, value: currency }
                }));
            });
    }

    fetchDemandDepositProduct() {
        this.subscribers.fetchDemandDepositProductSub = this.demandDepositProductService.fetchDemandDepositProducts(new Map())
            .subscribe(data => this.demandDepositProducts = data.content);
    }

    saveChargeConfiguration() {
        this.markFormGroupAsTouched(this.chargeConfigurationForm);
        if (this.formInvalid()) { return }

        let chargeConfigurationToSave: DemandDepositChargeConfiguration = this.extractData();
        this.chargeConfiguration.id ? this.updateDemandDepositChargeConfiguration() : this.createDemandDepositChargeConfiguration(chargeConfigurationToSave);
    }

    formInvalid(): boolean {
        let invalid: boolean = false;
        if (this.chargeConfigurationForm.invalid || !this.chargeGl || !this.vatGl) {
            invalid = true;
        }

        if (this.demandDepositSlabChargeConfigs.length > 0) {
            if (this.chargeSlabInvalid(this.demandDepositSlabChargeConfigs[this.demandDepositSlabChargeConfigs.length - 1])) {
                invalid = true;
            }
        }

        if (this.demandDepositSlabVatConfigs.length > 0) {
            if (this.vatSlabInvalid(this.demandDepositSlabVatConfigs[this.demandDepositSlabVatConfigs.length - 1])) {
                invalid = true;
            }
        }
        return invalid;
    }

    extractData(): DemandDepositChargeConfiguration {
        if (this.demandDepositSlabChargeConfigs.length > 0 && this.demandDepositSlabChargeConfigs[this.demandDepositSlabChargeConfigs.length - 1].fixed) {
            this.demandDepositSlabChargeConfigs[this.demandDepositSlabChargeConfigs.length - 1].maxCharge = null;
            this.demandDepositSlabChargeConfigs[this.demandDepositSlabChargeConfigs.length - 1].minCharge = null;
        }

        if (this.demandDepositSlabVatConfigs.length > 0 && this.demandDepositSlabVatConfigs[this.demandDepositSlabVatConfigs.length - 1].fixed) {
            this.demandDepositSlabVatConfigs[this.demandDepositSlabVatConfigs.length - 1].maxVat = null;
            this.demandDepositSlabVatConfigs[this.demandDepositSlabVatConfigs.length - 1].minVat = null;
        }

        let chargeConfigurationToSave: DemandDepositChargeConfiguration = this.chargeConfiguration;
        chargeConfigurationToSave.productId = this.chargeConfigurationForm.controls.demandDepositProduct.value;
        chargeConfigurationToSave.productName = this.demandDepositProducts.filter(product => product.id == chargeConfigurationToSave.productId).map(product => product.name)[0];
        chargeConfigurationToSave.chargeGl = this.chargeGl;
        chargeConfigurationToSave.vatGl = this.vatGl;
        chargeConfigurationToSave.defaultConfiguration = this.chargeConfigurationForm.controls.defaultConfiguration.value;
        chargeConfigurationToSave.currencyCode = this.defaultConfiguration ? null : this.chargeConfigurationForm.controls.currencyCode.value;
        chargeConfigurationToSave.calculationCurrency = this.defaultConfiguration ? 'BASE_CURRENCY' : this.chargeConfigurationForm.controls.calculationCurrency.value;
        chargeConfigurationToSave.transactionCurrency = this.defaultConfiguration ? 'BASE_CURRENCY' : this.chargeConfigurationForm.controls.transactionCurrency.value;

        chargeConfigurationToSave.demandDepositChargeCalculationInfo.slabBased = this.selectedChargeOption === 'SLAB' ? true : false;
        chargeConfigurationToSave.demandDepositChargeCalculationInfo.fixed = this.selectedChargeOption === 'FIXED' ? true : false;
        chargeConfigurationToSave.demandDepositChargeCalculationInfo.chargeAmount = this.chargeConfigurationForm.controls.chargeAmount.value;
        chargeConfigurationToSave.demandDepositChargeCalculationInfo.minCharge = chargeConfigurationToSave.demandDepositChargeCalculationInfo.fixed ? null : this.chargeConfigurationForm.controls.minCharge.value;
        chargeConfigurationToSave.demandDepositChargeCalculationInfo.maxCharge = chargeConfigurationToSave.demandDepositChargeCalculationInfo.fixed ? null : this.chargeConfigurationForm.controls.maxCharge.value;
        chargeConfigurationToSave.demandDepositChargeCalculationInfo.demandDepositSlabChargeConfigs = chargeConfigurationToSave.demandDepositChargeCalculationInfo.slabBased ? this.demandDepositSlabChargeConfigs : [];

        chargeConfigurationToSave.demandDepositVatCalculationInfo.slabBased = this.selectedVatOption === 'SLAB' ? true : false;
        chargeConfigurationToSave.demandDepositVatCalculationInfo.fixed = this.selectedVatOption === 'FIXED' ? true : false;
        chargeConfigurationToSave.demandDepositVatCalculationInfo.vatAmount = this.chargeConfigurationForm.controls.vatAmount.value;
        chargeConfigurationToSave.demandDepositVatCalculationInfo.minVat = chargeConfigurationToSave.demandDepositVatCalculationInfo.fixed ? null : this.chargeConfigurationForm.controls.minVat.value;
        chargeConfigurationToSave.demandDepositVatCalculationInfo.maxVat = chargeConfigurationToSave.demandDepositVatCalculationInfo.fixed ? null : this.chargeConfigurationForm.controls.maxVat.value;
        chargeConfigurationToSave.demandDepositVatCalculationInfo.demandDepositSlabVatConfigs = chargeConfigurationToSave.demandDepositVatCalculationInfo.slabBased ? this.demandDepositSlabVatConfigs : [];

        return chargeConfigurationToSave;
    }

    createDemandDepositChargeConfiguration(demandDepositChargeConfiguration: DemandDepositChargeConfiguration) {
        demandDepositChargeConfiguration.chargeInfoId = this.queryParams.chargeInfoId;

        this.subscribers.createChargeConfiguration = this.demandDepositChargeService
            .createDemandDepositChargeConfiguration(demandDepositChargeConfiguration)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("demand.deposit.charge.configuration.save.success");
                this.back();
            });
    }

    updateDemandDepositChargeConfiguration() {
        this.showVerifierSelectionModal = of(true);
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let view_ui = DETAILS_UI;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("?"));

        let updateCharge = new ActivateDemandDepositChargeConfigurationCommand();
        updateCharge.demandDepositChargeInfo.demandDepositChargeConfigurations[0] = this.extractData();
        updateCharge.demandDepositChargeInfo.chargeName = this.queryParams.chargeName;
        updateCharge.demandDepositChargeInfo.id = updateCharge.demandDepositChargeInfo.demandDepositChargeConfigurations[0].chargeInfoId;

        this.subscribers.updateSub = this.demandDepositChargeService.updateDemandDepositChargeConfiguration(updateCharge, urlSearchParams)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
                this.back();
            });
    }

    addChargeSlab() {
        if (this.demandDepositSlabChargeConfigs.length > 0) {
            if (this.chargeSlabInvalid(this.demandDepositSlabChargeConfigs[this.demandDepositSlabChargeConfigs.length - 1])) { return }
        }

        let slabChargeConfig: DemandDepositSlabChargeConfig = new DemandDepositSlabChargeConfig();
        if (this.demandDepositSlabChargeConfigs.length == 0) {
            slabChargeConfig.fromAmount = 0;
        } else if (this.demandDepositSlabChargeConfigs.length > 0) {
            slabChargeConfig.fromAmount = this.demandDepositSlabChargeConfigs[this.demandDepositSlabChargeConfigs.length - 1].toAmount;
        }

        if (this.demandDepositSlabChargeConfigs.length > 0 && this.demandDepositSlabChargeConfigs[this.demandDepositSlabChargeConfigs.length - 1].fixed) {
            this.demandDepositSlabChargeConfigs[this.demandDepositSlabChargeConfigs.length - 1].minCharge = null;
            this.demandDepositSlabChargeConfigs[this.demandDepositSlabChargeConfigs.length - 1].maxCharge = null;
        }

        this.demandDepositSlabChargeConfigs = [...this.demandDepositSlabChargeConfigs, slabChargeConfig];
    }

    addVatSlab() {
        if (this.demandDepositSlabVatConfigs.length > 0) {
            if (this.vatSlabInvalid(this.demandDepositSlabVatConfigs[this.demandDepositSlabVatConfigs.length - 1])) { return }
        }

        let slabVatConfig: DemandDepositSlabVatConfig = new DemandDepositSlabVatConfig();
        if (this.demandDepositSlabVatConfigs.length == 0) {
            slabVatConfig.fromAmount = 0;
        } else if (this.demandDepositSlabVatConfigs.length > 0) {
            slabVatConfig.fromAmount = this.demandDepositSlabVatConfigs[this.demandDepositSlabVatConfigs.length - 1].toAmount;
        }

        if (this.demandDepositSlabVatConfigs.length > 0 && this.demandDepositSlabVatConfigs[this.demandDepositSlabVatConfigs.length - 1].fixed) {
            this.demandDepositSlabVatConfigs[this.demandDepositSlabVatConfigs.length - 1].minVat = null;
            this.demandDepositSlabVatConfigs[this.demandDepositSlabVatConfigs.length - 1].maxVat = null;
        }

        this.demandDepositSlabVatConfigs = [...this.demandDepositSlabVatConfigs, slabVatConfig];
    }

    chargeSlabInvalid(slabChargeConfig: DemandDepositSlabChargeConfig) {
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

    vatSlabInvalid(slabVatConfig: DemandDepositSlabVatConfig) {
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
        let deleteIndex = this.demandDepositSlabChargeConfigs.length - 1;
        this.demandDepositSlabChargeConfigs.splice(deleteIndex, 1);
        this.demandDepositSlabChargeConfigs = [...this.demandDepositSlabChargeConfigs];
    }

    vatSlabDelete() {
        let deleteIndex = this.demandDepositSlabVatConfigs.length - 1;
        this.demandDepositSlabVatConfigs.splice(deleteIndex, 1);
        this.demandDepositSlabVatConfigs = [...this.demandDepositSlabVatConfigs];
    }

    back() {
        this.router.navigate(['demand-deposit-charge'], { queryParamsHandling: "merge" });
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
}