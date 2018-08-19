import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormBaseComponent } from "../../../../../common/components/base.form.component";
import { InlandRemittanceChargeCalculationInfo } from '../../../../../services/inland-remittance/charge/domain/inland.remittance.charge.calculation.info.model';
import { InlandRemittanceChargeConfiguration, ActivateInlandRemittanceChargeConfigurationCommand } from "../../../../../services/inland-remittance/charge/domain/inland.remittance.charge.configuration.model";
import { InlandRemittanceLotService } from "../../../../../services/inland-remittance/lot/service-api/inland.remittance.lot.service";
import { InlandRemittanceProduct } from "../../../../../services/inland-remittance/lot/domain/inland.remittance.lot.models";
import { InlandRemittanceChargeService } from "../../../../../services/inland-remittance/charge/service-api/inland.remittance.charge.service";
import { InlandRemittanceSlabChargeConfig } from "../../../../../services/inland-remittance/charge/domain/inland.remittance.slab.charge.config.model";
import { NotificationService } from './../../../../../common/notification/notification.service';
import * as ababilValidator from './../../../../../common/constants/app.validator.constants';
import { InlandRemittanceVatCalculationInfo } from "../../../../../services/inland-remittance/charge/domain/inland.remittance.vat.calculation.info.model";
import { InlandRemittanceSlabVatConfig } from "../../../../../services/inland-remittance/charge/domain/inland.remittance.slab.vat.config.mode";
import { AbabilCustomValidators } from "../../../../../common/validators/ababil.custom.validators";
import { ChargeCurrencyType } from '../../../../../common/domain/charge.currency.type.enum.model';
import { ApprovalflowService } from "../../../../../services/approvalflow/service-api/approval.flow.service";
import { GlAccountService } from "../../../../../services/glaccount/service-api/gl.account.service";
import { of } from "rxjs";
import { map } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import * as commandConstants from '../../../../../common/constants/app.command.constants';
import { VerifierSelectionEvent } from "../../../../../common/components/verifier-selection/verifier.selection.component";
import { ChargeAndVatOptions } from "../../../../../common/domain/charge.vat.option.enum.model";


export const SUCCESS_MSG: string[] = ["inland.remittance.charge.configuration.update.success", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/inland-remittance-charge-configuration?";

@Component({
    selector: 'inland-remittance-charge-configuration-form',
    templateUrl: './inland.remittance.charge.configuration.form.component.html'
})
export class InlandRemittanceChargeConfigurationFormComponent extends FormBaseComponent implements OnInit {
    chargeConfigurationForm: FormGroup;
    productCurrencies: SelectItem[] = [{ label: 'Choose', value: null }];
    inlandRemittanceProducts: InlandRemittanceProduct[] = [];
    chargeConfiguration: InlandRemittanceChargeConfiguration = new InlandRemittanceChargeConfiguration();
    inlandRemittanceChargeCalculationInfo: InlandRemittanceChargeCalculationInfo = new InlandRemittanceChargeCalculationInfo();
    inlandRemittanceSlabChargeConfigs: InlandRemittanceSlabChargeConfig[] = [];
    inlandRemittanceVatCalculationInfo: InlandRemittanceVatCalculationInfo = new InlandRemittanceVatCalculationInfo();
    inlandRemittanceSlabVatConfigs: InlandRemittanceSlabVatConfig[] = [];
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
    inlandRemittanceChargeConfigurationToUpdate: InlandRemittanceChargeConfiguration;
    command: string = commandConstants.UPDATE_INLAND_REMITTANCE_CHARGE_CONFIGURATION_COMMAND;

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private inlandRemittanceLotService: InlandRemittanceLotService,
        private inlandRemittanceChargeService: InlandRemittanceChargeService,
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
                this.subscribers.fetchChargeConfigurationSub = this.inlandRemittanceChargeService
                    .fetchInlandRemittanceChargeConfiguration({ id: this.chargeConfigurationId })
                    .subscribe(data => {
                        this.chargeConfiguration = data;
                        if (this.chargeConfiguration.defaultConfiguration) {
                            this.chargeConfiguration.calculationCurrency = 'Base currency';
                            this.chargeConfiguration.transactionCurrency = 'Base currency';
                        }

                        if (this.chargeConfiguration.inlandRemittanceProduct.id) {
                            this.fetchInlandRemittancCurrency(this.chargeConfiguration.inlandRemittanceProduct.id);
                        }

                        this.prepareChargeConfigurationForm(this.chargeConfiguration);
                        this.inlandRemittanceSlabChargeConfigs = this.chargeConfiguration.inlandRemittanceChargeCalculationInfo.inlandRemittanceSlabChargeConfigs ? this.chargeConfiguration.inlandRemittanceChargeCalculationInfo.inlandRemittanceSlabChargeConfigs : [];
                        this.isChargeSlabBased = this.chargeConfiguration.inlandRemittanceChargeCalculationInfo.slabBased;
                        this.isChargeFixed = this.chargeConfiguration.inlandRemittanceChargeCalculationInfo.fixed;
                        this.inlandRemittanceSlabVatConfigs = this.chargeConfiguration.inlandRemittanceVatCalculationInfo.inlandRemittanceSlabVatConfigs ? this.chargeConfiguration.inlandRemittanceVatCalculationInfo.inlandRemittanceSlabVatConfigs : [];
                        this.isVatSlabBased = this.chargeConfiguration.inlandRemittanceVatCalculationInfo.slabBased;
                        this.isVatFixed = this.chargeConfiguration.inlandRemittanceVatCalculationInfo.fixed;

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

        this.fetchInlandRemittanceProduct();
        this.prepareChargeConfigurationForm(null);
    }

    prepareChargeConfigurationForm(formData: InlandRemittanceChargeConfiguration) {
        formData = formData ? formData : new InlandRemittanceChargeConfiguration();
        formData.inlandRemittanceChargeCalculationInfo = formData.inlandRemittanceChargeCalculationInfo ? formData.inlandRemittanceChargeCalculationInfo : new InlandRemittanceChargeCalculationInfo();
        formData.inlandRemittanceVatCalculationInfo = formData.inlandRemittanceVatCalculationInfo ? formData.inlandRemittanceVatCalculationInfo : new InlandRemittanceVatCalculationInfo();

        this.chargeConfigurationForm = this.formBuilder.group({
            inlandRemittanceProduct: [formData.inlandRemittanceProduct.id, [Validators.required]],
            defaultConfiguration: [formData.defaultConfiguration],
            currencyCode: [formData.currencyCode, [Validators.required]],
            calculationCurrency: [formData.calculationCurrency, [Validators.required]],
            transactionCurrency: [formData.transactionCurrency, [Validators.required]],
            chargeGl: [null, [Validators.required]],
            vatGl: [null, [Validators.required]],
            isChargeSlabBased: [formData.inlandRemittanceChargeCalculationInfo.slabBased],
            isChargeFixed: [formData.inlandRemittanceChargeCalculationInfo.fixed],
            chargeAmount: [formData.inlandRemittanceChargeCalculationInfo.chargeAmount, [Validators.required, AbabilCustomValidators.isNumber]],
            minCharge: [formData.inlandRemittanceChargeCalculationInfo.minCharge],
            maxCharge: [formData.inlandRemittanceChargeCalculationInfo.maxCharge],
            isVatSlabBased: [formData.inlandRemittanceVatCalculationInfo.slabBased],
            isVatFixed: [formData.inlandRemittanceVatCalculationInfo.fixed],
            vatAmount: [formData.inlandRemittanceVatCalculationInfo.vatAmount, [Validators.required, AbabilCustomValidators.isNumber]],
            minVat: [formData.inlandRemittanceVatCalculationInfo.minVat],
            maxVat: [formData.inlandRemittanceVatCalculationInfo.maxVat]
        });

        if (formData.defaultConfiguration) {
            this.chargeConfigurationForm.controls.calculationCurrency.setValue('Base currency');
            this.chargeConfigurationForm.controls.transactionCurrency.setValue('Base currency');
            this.chargeConfigurationForm.controls.currencyCode.clearValidators();
            this.chargeConfigurationForm.controls.currencyCode.updateValueAndValidity();
        } else {
            this.defaultConfiguration = false;
        }

        if (!formData.inlandRemittanceChargeCalculationInfo.slabBased && !formData.inlandRemittanceChargeCalculationInfo.fixed) {
            this.chargeConfigurationForm.controls.minCharge.setValidators([Validators.required, AbabilCustomValidators.isNumber]);
            this.chargeConfigurationForm.controls.minCharge.updateValueAndValidity();
            this.chargeConfigurationForm.controls.maxCharge.setValidators([Validators.required, AbabilCustomValidators.isNumber]);
            this.chargeConfigurationForm.controls.maxCharge.updateValueAndValidity();
        }

        if (!formData.inlandRemittanceVatCalculationInfo.slabBased && !formData.inlandRemittanceVatCalculationInfo.fixed) {
            this.chargeConfigurationForm.controls.minVat.setValidators([Validators.required, AbabilCustomValidators.isNumber]);
            this.chargeConfigurationForm.controls.minVat.updateValueAndValidity();
            this.chargeConfigurationForm.controls.maxVat.setValidators([Validators.required, AbabilCustomValidators.isNumber]);
            this.chargeConfigurationForm.controls.maxVat.updateValueAndValidity();
        }

        this.chargeConfigurationForm.controls.inlandRemittanceProduct.valueChanges
            .subscribe(data => {
                if (data) {
                    this.chargeConfigurationForm.controls.currencyCode.setValue(null);
                    this.fetchInlandRemittancCurrency(data);
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

    fetchInlandRemittancCurrency(productId: number) {
        this.subscribers.fetchInlandRemittancCurrencySub = this.inlandRemittanceLotService.fetchInlandRemittanceCurrency({ productId: productId })
            .subscribe(data => {
                this.productCurrencies = [{ label: 'Choose', value: null }].concat(data.map(element => {
                    return { label: element.currencyCode, value: element.currencyCode }
                }));
            });
    }

    fetchInlandRemittanceProduct() {
        this.subscribers.fetchInlandRemittanceProductSub = this.inlandRemittanceLotService.fetchInlandRemittanceProduct()
            .subscribe(data => this.inlandRemittanceProducts = data);
    }

    saveChargeConfiguration() {
        this.markFormGroupAsTouched(this.chargeConfigurationForm);
        if (this.formInvalid()) { return }

        let chargeConfigurationToSave: InlandRemittanceChargeConfiguration = this.extractData();
        this.chargeConfiguration.id ? this.updateInlandRemittanceChargeConfiguration() : this.createInlandRemittanceChargeConfiguration(chargeConfigurationToSave);
    }

    formInvalid(): boolean {
        let invalid: boolean = false;
        if (this.chargeConfigurationForm.invalid || !this.chargeGl || !this.vatGl) {
            invalid = true;
        }

        if (this.inlandRemittanceSlabChargeConfigs.length > 0) {
            if (this.chargeSlabInvalid(this.inlandRemittanceSlabChargeConfigs[this.inlandRemittanceSlabChargeConfigs.length - 1])) {
                invalid = true;
            }
        }

        if (this.inlandRemittanceSlabVatConfigs.length > 0) {
            if (this.vatSlabInvalid(this.inlandRemittanceSlabVatConfigs[this.inlandRemittanceSlabVatConfigs.length - 1])) {
                invalid = true;
            }
        }
        return invalid;
    }

    extractData(): InlandRemittanceChargeConfiguration {
        if (this.inlandRemittanceSlabChargeConfigs.length > 0 && this.inlandRemittanceSlabChargeConfigs[this.inlandRemittanceSlabChargeConfigs.length - 1].fixed) {
            this.inlandRemittanceSlabChargeConfigs[this.inlandRemittanceSlabChargeConfigs.length - 1].maxCharge = null;
            this.inlandRemittanceSlabChargeConfigs[this.inlandRemittanceSlabChargeConfigs.length - 1].minCharge = null;
        }

        if (this.inlandRemittanceSlabVatConfigs.length > 0 && this.inlandRemittanceSlabVatConfigs[this.inlandRemittanceSlabVatConfigs.length - 1].fixed) {
            this.inlandRemittanceSlabVatConfigs[this.inlandRemittanceSlabVatConfigs.length - 1].maxVat = null;
            this.inlandRemittanceSlabVatConfigs[this.inlandRemittanceSlabVatConfigs.length - 1].minVat = null;
        }

        let chargeConfigurationToSave: InlandRemittanceChargeConfiguration = this.chargeConfiguration;
        chargeConfigurationToSave.inlandRemittanceProduct.id = this.chargeConfigurationForm.controls.inlandRemittanceProduct.value;
        chargeConfigurationToSave.chargeGl = this.chargeGl;
        chargeConfigurationToSave.vatGl = this.vatGl;
        chargeConfigurationToSave.defaultConfiguration = this.chargeConfigurationForm.controls.defaultConfiguration.value;
        chargeConfigurationToSave.currencyCode = this.defaultConfiguration ? null : this.chargeConfigurationForm.controls.currencyCode.value;
        chargeConfigurationToSave.calculationCurrency = this.defaultConfiguration ? 'BASE_CURRENCY' : this.chargeConfigurationForm.controls.calculationCurrency.value;
        chargeConfigurationToSave.transactionCurrency = this.defaultConfiguration ? 'BASE_CURRENCY' : this.chargeConfigurationForm.controls.transactionCurrency.value;

        chargeConfigurationToSave.inlandRemittanceChargeCalculationInfo.slabBased = this.selectedChargeOption === 'SLAB' ? true : false;
        chargeConfigurationToSave.inlandRemittanceChargeCalculationInfo.fixed = this.selectedChargeOption === 'FIXED' ? true : false;
        chargeConfigurationToSave.inlandRemittanceChargeCalculationInfo.chargeAmount = this.chargeConfigurationForm.controls.chargeAmount.value;
        chargeConfigurationToSave.inlandRemittanceChargeCalculationInfo.minCharge = chargeConfigurationToSave.inlandRemittanceChargeCalculationInfo.fixed ? null : this.chargeConfigurationForm.controls.minCharge.value;
        chargeConfigurationToSave.inlandRemittanceChargeCalculationInfo.maxCharge = chargeConfigurationToSave.inlandRemittanceChargeCalculationInfo.fixed ? null : this.chargeConfigurationForm.controls.maxCharge.value;
        chargeConfigurationToSave.inlandRemittanceChargeCalculationInfo.inlandRemittanceSlabChargeConfigs = chargeConfigurationToSave.inlandRemittanceChargeCalculationInfo.slabBased ? this.inlandRemittanceSlabChargeConfigs : [];

        chargeConfigurationToSave.inlandRemittanceVatCalculationInfo.slabBased = this.selectedVatOption === 'SLAB' ? true : false;
        chargeConfigurationToSave.inlandRemittanceVatCalculationInfo.fixed = this.selectedVatOption === 'FIXED' ? true : false;
        chargeConfigurationToSave.inlandRemittanceVatCalculationInfo.vatAmount = this.chargeConfigurationForm.controls.vatAmount.value;
        chargeConfigurationToSave.inlandRemittanceVatCalculationInfo.minVat = chargeConfigurationToSave.inlandRemittanceVatCalculationInfo.fixed ? null : this.chargeConfigurationForm.controls.minVat.value;
        chargeConfigurationToSave.inlandRemittanceVatCalculationInfo.maxVat = chargeConfigurationToSave.inlandRemittanceVatCalculationInfo.fixed ? null : this.chargeConfigurationForm.controls.maxVat.value;
        chargeConfigurationToSave.inlandRemittanceVatCalculationInfo.inlandRemittanceSlabVatConfigs = chargeConfigurationToSave.inlandRemittanceVatCalculationInfo.slabBased ? this.inlandRemittanceSlabVatConfigs : [];

        return chargeConfigurationToSave;
    }

    createInlandRemittanceChargeConfiguration(inlandRemittanceChargeConfiguration: InlandRemittanceChargeConfiguration) {
        inlandRemittanceChargeConfiguration.chargeInfoId = this.queryParams.chargeInfoId;

        this.subscribers.createChargeConfiguration = this.inlandRemittanceChargeService
            .createInlandRemittanceChargeConfiguration(inlandRemittanceChargeConfiguration)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("inland.remittance.charge.configuration.save.success");
                this.back();
            });
    }

    updateInlandRemittanceChargeConfiguration() {
        this.showVerifierSelectionModal = of(true);
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let view_ui = DETAILS_UI;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("?"));

        let updateCharge = new ActivateInlandRemittanceChargeConfigurationCommand();
        updateCharge.inlandRemittanceChargeInfo.inlandRemittanceChargeConfigurations[0] = this.extractData();
        updateCharge.inlandRemittanceChargeInfo.chargeName = this.queryParams.chargeName;
        updateCharge.inlandRemittanceChargeInfo.id = updateCharge.inlandRemittanceChargeInfo.inlandRemittanceChargeConfigurations[0].chargeInfoId;

        this.subscribers.updateSub = this.inlandRemittanceChargeService.updateInlandRemittanceChargeConfiguration(updateCharge, urlSearchParams)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
                this.back();
            });
    }

    addChargeSlab() {
        if (this.inlandRemittanceSlabChargeConfigs.length > 0) {
            if (this.chargeSlabInvalid(this.inlandRemittanceSlabChargeConfigs[this.inlandRemittanceSlabChargeConfigs.length - 1])) { return }
        }

        let slabChargeConfig: InlandRemittanceSlabChargeConfig = new InlandRemittanceSlabChargeConfig();
        if (this.inlandRemittanceSlabChargeConfigs.length == 0) {
            slabChargeConfig.fromAmount = 0;
        } else if (this.inlandRemittanceSlabChargeConfigs.length > 0) {
            slabChargeConfig.fromAmount = this.inlandRemittanceSlabChargeConfigs[this.inlandRemittanceSlabChargeConfigs.length - 1].toAmount;
        }

        if (this.inlandRemittanceSlabChargeConfigs.length > 0 && this.inlandRemittanceSlabChargeConfigs[this.inlandRemittanceSlabChargeConfigs.length - 1].fixed) {
            this.inlandRemittanceSlabChargeConfigs[this.inlandRemittanceSlabChargeConfigs.length - 1].minCharge = null;
            this.inlandRemittanceSlabChargeConfigs[this.inlandRemittanceSlabChargeConfigs.length - 1].maxCharge = null;
        }

        this.inlandRemittanceSlabChargeConfigs = [...this.inlandRemittanceSlabChargeConfigs, slabChargeConfig];
    }

    addVatSlab() {
        if (this.inlandRemittanceSlabVatConfigs.length > 0) {
            if (this.vatSlabInvalid(this.inlandRemittanceSlabVatConfigs[this.inlandRemittanceSlabVatConfigs.length - 1])) { return }
        }

        let slabVatConfig: InlandRemittanceSlabVatConfig = new InlandRemittanceSlabVatConfig();
        if (this.inlandRemittanceSlabVatConfigs.length == 0) {
            slabVatConfig.fromAmount = 0;
        } else if (this.inlandRemittanceSlabVatConfigs.length > 0) {
            slabVatConfig.fromAmount = this.inlandRemittanceSlabVatConfigs[this.inlandRemittanceSlabVatConfigs.length - 1].toAmount;
        }

        if (this.inlandRemittanceSlabVatConfigs.length > 0 && this.inlandRemittanceSlabVatConfigs[this.inlandRemittanceSlabVatConfigs.length - 1].fixed) {
            this.inlandRemittanceSlabVatConfigs[this.inlandRemittanceSlabVatConfigs.length - 1].minVat = null;
            this.inlandRemittanceSlabVatConfigs[this.inlandRemittanceSlabVatConfigs.length - 1].maxVat = null;
        }

        this.inlandRemittanceSlabVatConfigs = [...this.inlandRemittanceSlabVatConfigs, slabVatConfig];
    }

    chargeSlabInvalid(slabChargeConfig: InlandRemittanceSlabChargeConfig) {
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

    vatSlabInvalid(slabVatConfig: InlandRemittanceSlabVatConfig) {
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
        let deleteIndex = this.inlandRemittanceSlabChargeConfigs.length - 1;
        this.inlandRemittanceSlabChargeConfigs.splice(deleteIndex, 1);
        this.inlandRemittanceSlabChargeConfigs = [...this.inlandRemittanceSlabChargeConfigs];
    }

    vatSlabDelete() {
        let deleteIndex = this.inlandRemittanceSlabVatConfigs.length - 1;
        this.inlandRemittanceSlabVatConfigs.splice(deleteIndex, 1);
        this.inlandRemittanceSlabVatConfigs = [...this.inlandRemittanceSlabVatConfigs];
    }

    back() {
        this.router.navigate(['remittance/charge'], { queryParamsHandling: "merge" });
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