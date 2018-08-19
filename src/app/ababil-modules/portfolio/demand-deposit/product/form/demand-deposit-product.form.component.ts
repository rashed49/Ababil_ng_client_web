import { ValidatorConstants } from './../../../../../common/constants/app.validator.constants';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscriber, Observable, of } from 'rxjs';
import * as searchParamConstants from '../../../../../common/constants/app.search.parameter.constants';
import * as commandConstants from '../../../../../common/constants/app.command.constants';
import { DemandDepositProduct } from '../../../../../services/demand-deposit-product/domain/demand-deposit-product.model';
import { BaseComponent } from '../../../../../common/components/base.component';
import { VerifierSelectionEvent } from '../../../../../common/components/verifier-selection/verifier.selection.component';
import { SavingsProductCalculationType, SavingsDailyProductCalculationBasedOn, SavingsMonthlyProductCalculationBasedOn, SavingsProfitApplyFrequency, ProductStatus, EligibleCustomerType, DaysInYear } from '../../../../../common/domain/demand-deposit-product.enum.model';
import { CurrencyRestriction } from '../../../../../common/domain/currency.enum.model';
import { FieldsetModule } from 'primeng/primeng';
import { InputSwitchModule } from 'primeng/primeng';
import { InputTextareaModule } from 'primeng/primeng';
import { ProductChequeBookSize } from '../../../../../services/demand-deposit-product/domain/product-chequebook-size.model';
import { ProductChequePrefix } from '../../../../../services/demand-deposit-product/domain/product-cheque-prefix.model';
import { CurrencyService } from '../../../../../services/currency/service-api/currency.service';
import { Currency } from '../../../../../services/currency/domain/currency.models';
import { FormBaseComponent } from '../../../../../common/components/base.form.component';
import { ApprovalflowService } from '../../../../../services/approvalflow/service-api/approval.flow.service';
import { Location } from '@angular/common';

export const initialDemandDepositProductFormData: DemandDepositProduct = new DemandDepositProduct();
initialDemandDepositProductFormData.demandDepositProductChequeBookSizes = [new ProductChequeBookSize()];
initialDemandDepositProductFormData.demandDepositProductChequePrefixes = [new ProductChequePrefix()]

export interface DemandDepositProductSaveEvent {
    demandDepositProductForm: DemandDepositProduct;
    verifier: string;
    taskId: string;
    approvalFlowRequired: boolean
}

@Component({
    selector: 'demand-deposit-product-form',
    templateUrl: './demand-deposit-product.form.component.html'
})
export class DemandDepositProductFormComponent extends FormBaseComponent implements OnInit {

    id: number;
    demandDepositProductForm: FormGroup;
    currencies: Currency[];
    currencyMap: Map<number, string>;
    currencyRestriction: SelectItem[] = CurrencyRestriction;
    hasMinimumBalance: boolean = false;
    hasInitialDeposit: boolean = false;
    enableTransactionRuleEnforced: boolean = false;
    enableisMinimumRequiredBalanceEnforced: boolean = false;
    productStatus: SelectItem[] = ProductStatus;
    savingsProductCalculationType: SelectItem[] = SavingsProductCalculationType;
    savingsDailyProductCalculationBasedOn: SelectItem[] = SavingsDailyProductCalculationBasedOn;
    savingsMonthlyProductCalculationBasedOn: SelectItem[] = SavingsMonthlyProductCalculationBasedOn;
    savingsProfitApplyFrequency: SelectItem[] = SavingsProfitApplyFrequency;
    eligibleCustomerType: SelectItem[] = EligibleCustomerType;
    daysInYear: SelectItem[] = DaysInYear;
    dormancyArray: any[] = [];
    disableChequePrefixRequired: boolean = true;
    disableProfitEarningCriteria: boolean = true;
    disableDailyCalculation: boolean = true;
    disableMonthlyCalculation: boolean = true;
    disableTransactionRule: boolean = true;
    disableMinimumRequiredBalance: boolean = true;
    disableInitialDeposit: boolean = true;
    disableDormancyTracking: boolean = true;
    enableChequePrefixStyle: boolean = false;
    enableMinimumBalanceStyle: boolean = false;
    enableTransactionRuleStyle: boolean = false;
    multipleCurrency: boolean = false;
    displayDormancyErrorMessage: boolean = false;

    @Input('formData') set formData(formData: DemandDepositProduct) {
        this.prepareDemandDepositProductForm(formData);
    }
    @Input('editMode') editMode: boolean;
    @Input('createMode') createMode: boolean;
    @Input('command') command: string;
    @Output('onSave') onSave = new EventEmitter<DemandDepositProductSaveEvent>();
    @Output('onCancel') onCancel = new EventEmitter<void>();

    

    constructor(private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private currencyService: CurrencyService,
        protected location: Location,
        protected approvalFlowService: ApprovalflowService) {
            super(location, approvalFlowService);
    }

    ngOnInit() {
        this.showVerifierSelectionModal = of(false);
        this.prepareDemandDepositProductForm(null);
         
         this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
             if (queryParams['taskId']) {
                 this.taskId = queryParams['taskId'];
             }
             if (queryParams['commandReference']) {
                 this.commandReference = queryParams['commandReference'];
             }
         });
        this.fetchCurrencies();
    }

    prepareDemandDepositProductForm(formData: DemandDepositProduct) {
        if (formData == null) { formData = initialDemandDepositProductFormData; }
        this.id = formData.id;

        this.demandDepositProductForm = this.formBuilder.group({
            name: [formData.name, [Validators.required, Validators.pattern(ValidatorConstants.PRODUCT_NAME)]],
            code: [formData.code, [Validators.required, Validators.min(0)]],
            description: [formData.description, [Validators.pattern(ValidatorConstants.PRODUCT_NAME)]],
            hasIntroducer: [formData.hasIntroducer],
            hasCheque: [formData.hasCheque],
            isChequePrefixRequired: [formData.isChequePrefixRequired],
            status: [formData.status],
            isProfitBearing: [formData.isProfitBearing],
            minimumBalanceForProfitCalculation: [formData.minimumBalanceForProfitCalculation],
            minimumProfitToApply: [formData.minimumProfitToApply],
            savingsProfitApplyFrequency: [formData.savingsProfitApplyFrequency],
            savingsProductCalculationType: [formData.savingsProductCalculationType],
            savingsDailyProductCalculationBasedOn: [formData.savingsDailyProductCalculationBasedOn],
            savingsMonthlyProductCalculationBasedOn: [formData.savingsMonthlyProductCalculationBasedOn],
            currencyRestriction: [formData.currencyRestriction, [Validators.required]],
            currencies: [formData.currencies],
            isMinimumRequiredBalanceEnforced: [formData.isMinimumRequiredBalanceEnforced],
            initialDeposit: [formData.initialDeposit],
            isMinimumBalanceOverridable: [formData.isMinimumBalanceOverridable],
            minimumBalance: [formData.minimumBalance],
            hasMinimumRequiredOpeningBalance: [formData.hasMinimumRequiredOpeningBalance],
            isTransactionRuleEnforced: [formData.isTransactionRuleEnforced],
            canTransactionRuleOverridableByNotice: [formData.canTransactionRuleOverridableByNotice],
            canTransactionRuleOverride: [formData.canTransactionRuleOverride],
            maximumNumberOfTransactionPerWeek: [formData.maximumNumberOfTransactionPerWeek],
            maximumNumberOfTransactionPerMonth: [formData.maximumNumberOfTransactionPerMonth],
            maximumTransactionRatioOfBalance: [formData.maximumTransactionRatioOfBalance],
            maximumTransactionAmount: [formData.maximumTransactionAmount],
            individualMaxProfitableBalance: [formData.individualMaxProfitableBalance],
            jointMaxProfitableBalance: [formData.jointMaxProfitableBalance],
            orgMaxProfitableBalance: [formData.orgMaxProfitableBalance],
            isDormancyTrackingActive: [formData.isDormancyTrackingActive],
            daysToInactive: [formData.daysToInactive],
            daysToDormancy: [formData.daysToDormancy],
            daysToEscheat: [formData.daysToEscheat],
            isSweepInAllowed: [formData.isSweepInAllowed],
            isSweepOutAllowed: [formData.isSweepOutAllowed],
            eligibleCustomerType: [formData.eligibleCustomerType, [Validators.required]],
            daysInYear: [formData.daysInYear, [Validators.required]]
        });

        //hasCheque
        if (formData.hasCheque) {
            this.disableChequePrefixRequired = false;
            this.enableChequePrefixStyle = true;
        }

        //isChequePrefixRequired
        this.demandDepositProductForm.get('hasCheque').valueChanges
            .subscribe(val => {
                if (val) {
                    this.demandDepositProductForm.get('isChequePrefixRequired').enable();
                    this.enableChequePrefixStyle = true;
                } else {
                    this.demandDepositProductForm.get('isChequePrefixRequired').reset();
                    this.demandDepositProductForm.get('isChequePrefixRequired').disable();
                    this.enableChequePrefixStyle = false;
                }
            });

        //Profit earning criteria  //edit
        if (formData.isProfitBearing) {
            this.disableProfitEarningCriteria = false;
            this.demandDepositProductForm.get('minimumBalanceForProfitCalculation').setValidators([Validators.required, Validators.min(0), Validators.max(ValidatorConstants.MAXIMUM_AMOUNT)]);
            this.demandDepositProductForm.get('minimumProfitToApply').setValidators([Validators.required, Validators.min(0), Validators.max(ValidatorConstants.MAXIMUM_AMOUNT)]);
            this.demandDepositProductForm.get('savingsProfitApplyFrequency').setValidators([Validators.required]);
            this.demandDepositProductForm.get('savingsProductCalculationType').setValidators([Validators.required]);
            // this.demandDepositProductForm.updateValueAndValidity();
            this.demandDepositProductForm.get('individualMaxProfitableBalance').enable();
            this.demandDepositProductForm.get('jointMaxProfitableBalance').enable();
            this.demandDepositProductForm.get('orgMaxProfitableBalance').enable();
        }

        //Profit earning criteria
        this.demandDepositProductForm.get('isProfitBearing').valueChanges
            .subscribe(val => {
                if (val) {
                    this.demandDepositProductForm.get('individualMaxProfitableBalance').enable();
                    this.demandDepositProductForm.get('jointMaxProfitableBalance').enable();
                    this.demandDepositProductForm.get('orgMaxProfitableBalance').enable();
                    this.demandDepositProductForm.updateValueAndValidity();
                    this.demandDepositProductForm.get('minimumBalanceForProfitCalculation').enable();

                    this.demandDepositProductForm.get('minimumBalanceForProfitCalculation').setValidators([Validators.required, Validators.min(0), Validators.max(ValidatorConstants.MAXIMUM_AMOUNT)]);
                    this.demandDepositProductForm.get('minimumBalanceForProfitCalculation').updateValueAndValidity();

                    this.demandDepositProductForm.get('minimumProfitToApply').enable();
                    this.demandDepositProductForm.get('minimumProfitToApply').setValidators([Validators.required, Validators.min(0), Validators.max(ValidatorConstants.MAXIMUM_AMOUNT)]);
                    this.demandDepositProductForm.get('minimumProfitToApply').updateValueAndValidity();

                    this.demandDepositProductForm.get('savingsProfitApplyFrequency').enable();
                    this.demandDepositProductForm.get('savingsProfitApplyFrequency').setValidators([Validators.required]);
                    // this.demandDepositProductForm.get('savingsProfitApplyFrequency').updateValueAndValidity();

                    this.demandDepositProductForm.get('savingsProductCalculationType').enable();
                    this.demandDepositProductForm.get('savingsProductCalculationType').setValidators([Validators.required]);

                    this.demandDepositProductForm.get('savingsDailyProductCalculationBasedOn').disable();
                    this.demandDepositProductForm.get('savingsMonthlyProductCalculationBasedOn').disable();
                } else {
                    this.demandDepositProductForm.get('minimumBalanceForProfitCalculation').reset({ value: '', disabled: true });
                    this.demandDepositProductForm.get('minimumProfitToApply').reset({ value: '', disabled: true });
                    this.demandDepositProductForm.get('savingsProfitApplyFrequency').reset({ value: '', disabled: true });
                    this.demandDepositProductForm.get('savingsProductCalculationType').reset({ value: '', disabled: true });
                    this.demandDepositProductForm.get('savingsDailyProductCalculationBasedOn').reset({ value: '', disabled: true });
                    this.demandDepositProductForm.get('savingsMonthlyProductCalculationBasedOn').reset({ value: '', disabled: true });
                    this.demandDepositProductForm.get('individualMaxProfitableBalance').reset({ value: '', disabled: true });
                    this.demandDepositProductForm.get('jointMaxProfitableBalance').reset({ value: '', disabled: true });
                    this.demandDepositProductForm.get('orgMaxProfitableBalance').reset({ value: '', disabled: true });
                }

                // if(this.demandDepositProductForm.get('isProfitBearing').value === true) {
                //     console.log("Fff");
                //     this.demandDepositProductForm.get('individualMaxProfitableBalance').reset({ value: '', disabled: false });
                //     this.demandDepositProductForm.get('jointMaxProfitableBalance').reset({ value: '', disabled: false });
                //     this.demandDepositProductForm.get('orgMaxProfitableBalance').reset({ value: '', disabled: false });
                //     this.demandDepositProductForm.updateValueAndValidity();
                // }

            });

        //Profit earning criteria  //savings Product Calculation Type  //edit
        if (formData.isProfitBearing && formData.savingsProductCalculationType == SavingsProductCalculationType[1].value) {
            this.disableDailyCalculation = false;
            this.demandDepositProductForm.get('savingsDailyProductCalculationBasedOn').setValidators([Validators.required]);
        } else if (formData.isProfitBearing && formData.savingsProductCalculationType == SavingsProductCalculationType[2].value) {
            this.disableMonthlyCalculation = false;
            this.demandDepositProductForm.get('savingsMonthlyProductCalculationBasedOn').setValidators([Validators.required]);
        }

        //Profit earning criteria //savings Product Calculation Type
        this.demandDepositProductForm.get('savingsProductCalculationType').valueChanges.subscribe(val => {
            if (val === SavingsProductCalculationType[1].value) {
                this.demandDepositProductForm.get('savingsDailyProductCalculationBasedOn').enable();
                this.demandDepositProductForm.get('savingsDailyProductCalculationBasedOn').setValidators(Validators.required);
                this.demandDepositProductForm.get('savingsDailyProductCalculationBasedOn').updateValueAndValidity();
                this.demandDepositProductForm.get('savingsMonthlyProductCalculationBasedOn').reset({ value: '', disabled: true });
            } else {
                this.demandDepositProductForm.get('savingsDailyProductCalculationBasedOn').reset({ value: '', disabled: true });
                this.demandDepositProductForm.get('savingsMonthlyProductCalculationBasedOn').enable();
                this.demandDepositProductForm.get('savingsMonthlyProductCalculationBasedOn').setValidators(Validators.required);
            }
        });

        //isTransactionRuleEnforced //edit mode
        if (formData.isTransactionRuleEnforced) {
            this.disableTransactionRule = false;
            this.enableTransactionRuleStyle = true;
            let transactionPerWeek = this.demandDepositProductForm.get('maximumNumberOfTransactionPerWeek').value;

            this.demandDepositProductForm.get('maximumNumberOfTransactionPerWeek').setValidators([
                Validators.required, Validators.min(0), Validators.max(ValidatorConstants.MAXIMUM_NUMBER_OF_TRANSACTIONS)
            ]);
            this.demandDepositProductForm.get('maximumNumberOfTransactionPerMonth').setValidators([
                Validators.required, Validators.min(transactionPerWeek), Validators.max(transactionPerWeek * 4)
            ]);
            this.demandDepositProductForm.get('maximumTransactionRatioOfBalance').setValidators([
                Validators.required, Validators.min(0), Validators.max(0.99)
            ]);
            this.demandDepositProductForm.get('maximumTransactionAmount').setValidators([
                Validators.required,
                Validators.min(ValidatorConstants.MINIMUM_AMOUNT),
                Validators.max(ValidatorConstants.MAXIMUM_AMOUNT)
            ]);
        }

        //isTransactionRuleEnforced
        this.demandDepositProductForm.get('isTransactionRuleEnforced').valueChanges.subscribe(val => {
            if (val) {
                this.enableTransactionRuleStyle = true;
                this.demandDepositProductForm.get('canTransactionRuleOverride').enable();
                this.demandDepositProductForm.get('canTransactionRuleOverridableByNotice').enable();

                this.demandDepositProductForm.get('maximumNumberOfTransactionPerWeek').enable();
                this.demandDepositProductForm.get('maximumNumberOfTransactionPerWeek').setValidators([
                    Validators.required, Validators.min(0), Validators.max(ValidatorConstants.MAXIMUM_NUMBER_OF_TRANSACTIONS)
                ]);
                this.demandDepositProductForm.get('maximumNumberOfTransactionPerWeek').updateValueAndValidity();

                this.demandDepositProductForm.get('maximumNumberOfTransactionPerMonth').enable();

                this.demandDepositProductForm.get('maximumTransactionRatioOfBalance').enable();
                this.demandDepositProductForm.get('maximumTransactionRatioOfBalance').setValidators([
                    Validators.required, Validators.min(0), Validators.max(0.99)
                ]);
                this.demandDepositProductForm.get('maximumTransactionRatioOfBalance').updateValueAndValidity();

                this.demandDepositProductForm.get('maximumTransactionAmount').enable();
                this.demandDepositProductForm.get('maximumTransactionAmount').setValidators([
                    Validators.required,
                    Validators.min(ValidatorConstants.MINIMUM_AMOUNT),
                    Validators.max(ValidatorConstants.MAXIMUM_AMOUNT)
                ]);
                this.demandDepositProductForm.get('maximumTransactionAmount').updateValueAndValidity();
            } else {
                this.enableTransactionRuleStyle = false;
                this.demandDepositProductForm.get('canTransactionRuleOverride').reset({ value: '', disabled: true });
                this.demandDepositProductForm.get('canTransactionRuleOverridableByNotice').reset({ value: '', disabled: true });
                this.demandDepositProductForm.get('maximumNumberOfTransactionPerWeek').reset({ value: '', disabled: true });
                this.demandDepositProductForm.get('maximumNumberOfTransactionPerMonth').reset({ value: '', disabled: true });
                this.demandDepositProductForm.get('maximumTransactionRatioOfBalance').reset({ value: '', disabled: true });
                this.demandDepositProductForm.get('maximumTransactionAmount').reset({ value: '', disabled: true });
            }
        });

        //isTransactionRuleEnforced //maximumNumberOfTransactionPerWeek
        this.demandDepositProductForm.get('maximumNumberOfTransactionPerWeek').valueChanges.subscribe(val => {
            let transactionPerWeek = this.demandDepositProductForm.get('maximumNumberOfTransactionPerWeek').value;

            this.demandDepositProductForm.get('maximumNumberOfTransactionPerMonth').setValidators([
                Validators.required, Validators.min(transactionPerWeek), Validators.max(transactionPerWeek * 4)
            ]);
            this.demandDepositProductForm.get('maximumNumberOfTransactionPerMonth').updateValueAndValidity();
        });

        //balance //edit
        if (formData.isMinimumRequiredBalanceEnforced) {
            this.disableMinimumRequiredBalance = false;
            this.enableMinimumBalanceStyle = true;
            this.demandDepositProductForm.get('minimumBalance').setValidators([
                Validators.required,
                Validators.min(ValidatorConstants.MINIMUM_AMOUNT),
                Validators.max(ValidatorConstants.MAXIMUM_AMOUNT)
            ]);
        }

        //balance
        this.demandDepositProductForm.get('isMinimumRequiredBalanceEnforced').valueChanges.subscribe(val => {
            if (val) {
                this.enableMinimumBalanceStyle = true;
                this.demandDepositProductForm.get('isMinimumBalanceOverridable').enable();
                this.demandDepositProductForm.get('isMinimumBalanceOverridable').updateValueAndValidity();

                this.demandDepositProductForm.get('minimumBalance').enable();
                this.demandDepositProductForm.get('minimumBalance').setValidators([
                    Validators.required,
                    Validators.min(ValidatorConstants.MINIMUM_AMOUNT),
                    Validators.max(ValidatorConstants.MAXIMUM_AMOUNT)
                ]);
                this.demandDepositProductForm.get('minimumBalance').updateValueAndValidity();
            }
            else {
                this.enableMinimumBalanceStyle = false;
                this.demandDepositProductForm.get('isMinimumBalanceOverridable').reset({ value: '', disabled: true });
                this.demandDepositProductForm.get('minimumBalance').reset({ value: '', disabled: true });
            }
        });

        //balance //hasMinimumRequiredOpeningBalance //edit
        if (formData.hasMinimumRequiredOpeningBalance) {
            this.disableInitialDeposit = false;
            this.demandDepositProductForm.get('initialDeposit').setValidators([
                Validators.required,
                Validators.min(ValidatorConstants.MINIMUM_AMOUNT),
                Validators.max(ValidatorConstants.MAXIMUM_AMOUNT)
            ]);
        }

        //balance //hasMinimumRequiredOpeningBalance
        this.demandDepositProductForm.get('hasMinimumRequiredOpeningBalance').valueChanges.subscribe(val => {
            if (val) {
                this.demandDepositProductForm.get('initialDeposit').enable();
                this.demandDepositProductForm.get('initialDeposit').setValidators([
                    Validators.required,
                    Validators.min(ValidatorConstants.MINIMUM_AMOUNT),
                    Validators.max(ValidatorConstants.MAXIMUM_AMOUNT)
                ]);
                this.demandDepositProductForm.get('initialDeposit').updateValueAndValidity();
            } else {
                this.demandDepositProductForm.get('initialDeposit').reset({ value: '', disabled: true });
            }
        });

        //Dormancy rules //edit
        if (formData.isDormancyTrackingActive) {
            this.disableDormancyTracking = false;
            this.demandDepositProductForm.get('daysToInactive').setValidators([Validators.required]);
            this.demandDepositProductForm.get('daysToDormancy').setValidators([Validators.required]);
            this.demandDepositProductForm.get('daysToEscheat').setValidators([Validators.required]);

            this.dormancyArray[0] = formData.daysToInactive;
            this.dormancyArray[1] = formData.daysToDormancy;
            this.dormancyArray[2] = formData.daysToEscheat;
        }


        // Dormancy rules
        this.demandDepositProductForm.get('isDormancyTrackingActive').valueChanges
            .subscribe(val => {
                if (val) {
                    this.demandDepositProductForm.get('daysToInactive').enable();
                    this.demandDepositProductForm.get('daysToInactive').setValidators(Validators.required);
                    this.demandDepositProductForm.get('daysToInactive').updateValueAndValidity();

                    this.demandDepositProductForm.get('daysToDormancy').enable();
                    this.demandDepositProductForm.get('daysToDormancy').setValidators(Validators.required);
                    this.demandDepositProductForm.get('daysToDormancy').updateValueAndValidity();

                    this.demandDepositProductForm.get('daysToEscheat').enable();
                    this.demandDepositProductForm.get('daysToEscheat').setValidators(Validators.required);
                    this.demandDepositProductForm.get('daysToEscheat').updateValueAndValidity();

                    this.dormancyArray[0] = formData.daysToInactive;
                    this.dormancyArray[1] = formData.daysToDormancy;
                    this.dormancyArray[2] = formData.daysToEscheat;
                } else {
                    this.demandDepositProductForm.get('daysToInactive').reset({ value: '', disabled: true });
                    this.demandDepositProductForm.get('daysToDormancy').reset({ value: '', disabled: true });
                    this.demandDepositProductForm.get('daysToEscheat').reset({ value: '', disabled: true });
                }
            });

        //Dormancy rules //daysToInactive
        this.demandDepositProductForm.get('daysToInactive').valueChanges
            .subscribe(val => {
                this.dormancyArray[0] = +this.demandDepositProductForm.get('daysToInactive').value;
                this.isSorted();
            });

        this.demandDepositProductForm.get('daysToDormancy').valueChanges
            .subscribe(val => {
                this.dormancyArray[1] = +this.demandDepositProductForm.get('daysToDormancy').value;
                this.isSorted();
            });

        this.demandDepositProductForm.get('daysToEscheat').valueChanges
            .subscribe(val => {
                this.dormancyArray[2] = +this.demandDepositProductForm.get('daysToEscheat').value;
                this.isSorted();
            });

        //currency //edit
        if (CurrencyRestriction[2].value === formData.currencyRestriction) { //multi currency
            this.demandDepositProductForm.get('currencies').setValidators(Validators.required);
            this.demandDepositProductForm.get('currencies').updateValueAndValidity();
            this.multipleCurrency = true;
        }

        //currency
        this.demandDepositProductForm.get('currencyRestriction').valueChanges.subscribe(val => {
            this.demandDepositProductForm.get('currencies').reset();
            if (CurrencyRestriction[2].value === val) { //multi currency
                this.demandDepositProductForm.get('currencies').setValidators(Validators.required);
                this.demandDepositProductForm.get('currencies').updateValueAndValidity();
            } else {
                this.demandDepositProductForm.get('currencies').clearValidators();
            }
        });

    }

    submit() {
            this.showVerifierSelectionModal = of(true);
    }
    onVerifierSelect(selectEvent: VerifierSelectionEvent) {
        this.emitSaveEvent(selectEvent, null);
    }

    emitSaveEvent(selectEvent: VerifierSelectionEvent, taskid: string) {
        this.markFormGroupAsTouched(this.demandDepositProductForm);

        if (this.demandDepositProductFormInvalid()) {
            return;
        }

        let demandDepositProduct = this.demandDepositProductForm.value;
        demandDepositProduct.id = this.id;
        this.onSave.emit({
            demandDepositProductForm: demandDepositProduct,
            verifier: selectEvent.verifier,
            taskId: this.taskId,
            approvalFlowRequired: selectEvent.approvalFlowRequired
        });
    }

    cancel() {
        this.onCancel.emit();
    }

    demandDepositProductFormInvalid(): boolean {
        return this.demandDepositProductForm.invalid || !this.isSorted();
    }

    isSorted(): boolean {
        if (this.dormancyArray.includes(null) || this.dormancyArray.includes(undefined)) return false;
        if (this.dormancyArray.length < 2) return true;

        for (let i = 0; i < this.dormancyArray.length - 1; i++) {
            if (+this.dormancyArray[i] >= +this.dormancyArray[i + 1]) {
                this.displayDormancyErrorMessage = true;
                return false;
            }
        }
        this.displayDormancyErrorMessage = false;
        return true;
    }

    onCurrencyChange() {
        if (CurrencyRestriction[2].value === this.demandDepositProductForm.get('currencyRestriction').value) {  //multiple currency
            this.multipleCurrency = true;
        } else {
            this.demandDepositProductForm.get('currencies').setValue(null);
            this.multipleCurrency = false;
        }
    }

    fetchCurrencies() {
        this.subscribers.fetchCurrenciesSub = this.currencyService.fetchCurrencies(new Map())
            .subscribe(data => {
                this.currencies = data.content.map(currency => {
                    return { label: currency.name, value: currency.code }
                });
            });
    }
}



