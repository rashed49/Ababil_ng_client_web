import { BaseComponent } from './../../../../../../common/components/base.component';
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { RecurringDepositProduct } from '../../../../../../services/recurring-deposit-product/domain/recurring.deposit.product.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidatorConstants } from '../../../../../../common/constants/app.validator.constants';
import { Observable, of } from 'rxjs';
import { VerifierSelectionEvent } from '../../../../../../common/components/verifier-selection/verifier.selection.component';
import { Currency } from '../../../../../../services/currency/domain/currency.models';
import { SelectItem } from 'primeng/api';
import { CurrencyRestriction } from '../../../../../../common/domain/currency.enum.model';
import { CurrencyService } from './../../../../../../services/currency/service-api/currency.service';
import { TenorType, ProfitCalculationBasedOn, ProfitPostingPeriod, ProfitPostingPeriodType, DaysInYear } from '../../../../../../common/domain/time.deposit.product.enum.model';
import { FormBaseComponent } from '../../../../../../common/components/base.form.component';
import { ApprovalflowService } from '../../../../../../services/approvalflow/service-api/approval.flow.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

export interface RecurringDepositProductSaveEvent {
    recurringDepositProductForm: RecurringDepositProduct,
    verifier: string,
    taskId: string,
    approvalFlowRequired: boolean
}

@Component({
    selector: 'recurring-deposit-product-form',
    templateUrl: './recurring.deposit.product.form.component.html',
    styleUrls: ['./recurring.deposit.product.form.component.scss']
})
export class RecurringDepositProductFormComponent extends FormBaseComponent implements OnInit {

    recurringDepositProductForm: FormGroup;
    recurringDepositProductId: number;
    tenors: number[] = [];
    installmentSizes: number[] = [];
    datatableTenorType: string = '';
    currencies: Currency[];
    currencyMap: Map<number, string>;
    currencyRestriction: SelectItem[] = CurrencyRestriction;
    tenorType: SelectItem[] = TenorType;
    profitCalculationBasedOn: SelectItem[] = ProfitCalculationBasedOn;
    profitPostingPeriod: SelectItem[] = ProfitPostingPeriod;
    profitPostingPeriodType: SelectItem[] = ProfitPostingPeriodType;
    daysInYear: SelectItem[] = DaysInYear;
    ammountArray: any[] = [];

    multipleCurrency: boolean = false;
    disableProfitAppliedBeforeMaturity: boolean = true;
    disableTenorType: boolean = true;
    disableAddTenorButton: boolean = true;
    disableTenor: boolean = true;
    disableInitialDeposit: boolean = true;
    disableLienPercentage: boolean = true;
    displayAmountErrorMessage: boolean = false;
    disableFixedInstallments: boolean = true;
    disableAddFixedInstallmentSizeButton: boolean = true;
    isInstallmentFixed: boolean = false;

    withdrawProfitBeforeMaturityAllowed: boolean = true;
    compoundingBeforeMaturityAllowed: boolean = true;
    constructor(private formBuilder: FormBuilder,
        private currencyService: CurrencyService,
        private route: ActivatedRoute,
        protected location: Location,
        protected approvalFlowService: ApprovalflowService) {
        super(location, approvalFlowService);
    }

    @Input('formData') set formData(formData: RecurringDepositProduct) {
        this.prepareRecurringDepositProductForm(formData);

    }
    @Input('command') command: string;
    @Output('onSave') onSave = new EventEmitter<RecurringDepositProductSaveEvent>();
    @Output('onCancel') onCancel = new EventEmitter<void>();

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);
        this.prepareRecurringDepositProductForm(null);

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

    prepareRecurringDepositProductForm(formData: RecurringDepositProduct) {
        if (formData == null) { formData = new RecurringDepositProduct() }
        this.recurringDepositProductId = formData.id;
        if (formData.tenors && formData.tenors.length > 0) {
            this.tenors = [...formData.tenors];
        }
        if (formData.installmentSizes && formData.installmentSizes.length > 0) {
            this.installmentSizes = [...formData.installmentSizes];
        }

        if (formData.tenorType) { this.datatableTenorType = formData.tenorType; }
        this.recurringDepositProductForm = this.formBuilder.group({
            name: [formData.name, [Validators.required, Validators.pattern(ValidatorConstants.PRODUCT_NAME)]],
            code: [formData.code, [Validators.required, Validators.maxLength(3), Validators.minLength(3)]],
            description: [formData.description, [Validators.pattern(ValidatorConstants.PRODUCT_NAME)]],
            currencyRestriction: [formData.currencyRestriction, [Validators.required]],
            currencies: [formData.currencies],
            minimumDepositAmount: [formData.minimumDepositAmount],
            maximumDepositAmount: [formData.maximumDepositAmount],
            depositAmountMultiplier: [formData.depositAmountMultiplier],
            isPensionScheme: [formData.isPensionScheme],
            isAdvanceInstallAllowed: [formData.isAdvanceInstallAllowed],
            isCalculateProfitOnAdvance: [formData.isCalculateProfitOnAdvance],
            isTenorRequired: [formData.isTenorRequired],
            tenorType: [formData.tenorType],
            tenor: [''],
            isCompoundingBeforeMaturityAllowed: [formData.isCompoundingBeforeMaturityAllowed],
            isWithdrawProfitBeforeMaturityAllowed: [formData.isWithdrawProfitBeforeMaturityAllowed],
            isProfitAppliedBeforeMaturity: [formData.isProfitAppliedBeforeMaturity],
            daysInYear: [formData.daysInYear, [Validators.required]],
            profitPostingPeriod: [formData.profitPostingPeriod],
            profitPostingPeriodType: [formData.profitPostingPeriodType],
            isLinkAccountRequired: [formData.isLinkAccountRequired],
            isLienAllowed: [formData.isLienAllowed],
            lienPercentage: [formData.lienPercentage],
            noOfOverDueAllowed: [formData.noOfOverDueAllowed],
            noOfOverDueAllowedBetweenSlab: [formData.noOfOverDueAllowedBetweenSlab],
            isInitialDepositAllowed: [formData.isInitialDepositAllowed],
            initialDeposit: [formData.initialDeposit],
            installmentSizes: [''],
            isInstallmentFixed: [formData.isInstallmentFixed]
        });


        //currency //edit
        if (CurrencyRestriction[2].value === formData.currencyRestriction) { //multi currency
            this.recurringDepositProductForm.get('currencies').setValidators(Validators.required);
            this.recurringDepositProductForm.get('currencies').updateValueAndValidity();
            this.multipleCurrency = true;
        }


        if (formData.isInstallmentFixed) {
            this.isInstallmentFixed = true;
        } else {
            this.isInstallmentFixed = false;
        }

        //currency
        this.recurringDepositProductForm.get('currencyRestriction').valueChanges.subscribe(val => {
            this.recurringDepositProductForm.get('currencies').reset();
            if (CurrencyRestriction[2].value === val) { //multi currency
                this.recurringDepositProductForm.get('currencies').setValidators(Validators.required);
                this.recurringDepositProductForm.get('currencies').updateValueAndValidity();
            } else {
                this.recurringDepositProductForm.get('currencies').clearValidators();
            }
        });

        if (formData.isInitialDepositAllowed) {
            this.disableInitialDeposit = false;
            this.recurringDepositProductForm.get('initialDeposit').setValidators([Validators.required]);
            this.recurringDepositProductForm.get('initialDeposit').updateValueAndValidity();
        }

        //lien percentage
        this.recurringDepositProductForm.get('isInitialDepositAllowed').valueChanges
            .subscribe(val => {
                if (val) {
                    this.disableInitialDeposit = false;
                    this.recurringDepositProductForm.get('initialDeposit').setValidators([Validators.required]);
                    this.recurringDepositProductForm.get('initialDeposit').updateValueAndValidity();
                } else {

                    this.recurringDepositProductForm.get('initialDeposit').reset();
                    this.recurringDepositProductForm.get('initialDeposit').setValue(null);
                    this.recurringDepositProductForm.get('initialDeposit').clearValidators();
                    this.recurringDepositProductForm.get('initialDeposit').updateValueAndValidity();
                    this.disableInitialDeposit = true;
                }
            });

    
    
        this.recurringDepositProductForm.get('isInitialDepositAllowed').valueChanges.subscribe(
            val => {
                if (val) {
                    this.disableInitialDeposit = false;
                    this.recurringDepositProductForm.get('initialDeposit').reset();

                    this.recurringDepositProductForm.get('initialDeposit').enable();
                    this.recurringDepositProductForm.get('initialDeposit').updateValueAndValidity();


                } else {
                    this.disableInitialDeposit = true;
                    this.recurringDepositProductForm.get('initialDeposit').setValue(null);
                    this.recurringDepositProductForm.get('initialDeposit').disable();
                    this.recurringDepositProductForm.get('initialDeposit').updateValueAndValidity();
                }
            });
        this.recurringDepositProductForm.get('isInstallmentFixed').valueChanges.subscribe(
            val => {
                if (val) {
                    this.isInstallmentFixed = true;
                    this.recurringDepositProductForm.get('minimumDepositAmount').reset();
                    this.recurringDepositProductForm.get('maximumDepositAmount').reset();
                    this.recurringDepositProductForm.get('depositAmountMultiplier').reset();
                    this.recurringDepositProductForm.get('minimumDepositAmount').disable();
                    this.recurringDepositProductForm.get('maximumDepositAmount').disable();
                    this.recurringDepositProductForm.get('depositAmountMultiplier').disable();
                    this.recurringDepositProductForm.get('installmentSizes').enable();
                    this.recurringDepositProductForm.updateValueAndValidity();

                } else {
                    this.isInstallmentFixed = false;
                    this.installmentSizes = [];
                    this.recurringDepositProductForm.get('installmentSizes').reset();
                    this.recurringDepositProductForm.get('installmentSizes').disable();
                    this.recurringDepositProductForm.get('minimumDepositAmount').enable();
                    this.recurringDepositProductForm.get('maximumDepositAmount').enable();
                    this.recurringDepositProductForm.get('depositAmountMultiplier').enable();
                    this.recurringDepositProductForm.updateValueAndValidity();


                }
            });

        //amount edit
        if (formData) {
            this.ammountArray[0] = formData.minimumDepositAmount;
            this.ammountArray[1] = formData.maximumDepositAmount;
            this.ammountArray[2] = formData.depositAmountMultiplier;
        }

        // /minimumDepositAmount
        this.recurringDepositProductForm.get('minimumDepositAmount').valueChanges
            .subscribe(val => {
                this.recurringDepositProductForm.get('maximumDepositAmount').setValidators([
                    Validators.min(this.recurringDepositProductForm.get('minimumDepositAmount').value)]);
                this.recurringDepositProductForm.get('maximumDepositAmount').updateValueAndValidity();
                this.ammountArray[0] = val;
                this.isAmountValid();
            });
        //maximumDepositAmount
        this.recurringDepositProductForm.get('maximumDepositAmount').valueChanges
            .subscribe(val => {

                this.ammountArray[1] = val;
                this.isAmountValid();
            });

        //depositAmountMultiplier
        this.recurringDepositProductForm.get('depositAmountMultiplier').valueChanges
            .subscribe(val => {
                this.ammountArray[2] = val;
                this.isAmountValid();
            });

        // //over due //noOfTotalOverDueAllowed //edit
        // if (formData.noOfOverDueAllowed) {
        //     this.recurringDepositProductForm.get('noOfTotalOverDueAllowed').setValidators([
        //         Validators.min(this.recurringDepositProductForm.get('noOfYearlyOverDueAllowed').value)
        //     ]);
        //     this.recurringDepositProductForm.get('noOfTotalOverDueAllowed').updateValueAndValidity();
        // }

        // //over due //noOfTotalOverDueAllowed
        // this.recurringDepositProductForm.get('noOfYearlyOverDueAllowed').valueChanges
        //     .subscribe(val => {
        //         if (val) {
        //             this.recurringDepositProductForm.get('noOfTotalOverDueAllowed').setValidators([
        //                 Validators.min(this.recurringDepositProductForm.get('noOfYearlyOverDueAllowed').value)
        //             ]);
        //             this.recurringDepositProductForm.get('noOfTotalOverDueAllowed').updateValueAndValidity();
        //         }
        //     });

        this.recurringDepositProductForm.get('isCompoundingBeforeMaturityAllowed').valueChanges
            .subscribe(val => {
                if (val) {
                    this.withdrawProfitBeforeMaturityAllowed = true;
                } else {
                    this.withdrawProfitBeforeMaturityAllowed = false;
                }
            });

        this.recurringDepositProductForm.get('isWithdrawProfitBeforeMaturityAllowed').valueChanges
            .subscribe(val => {
                if (val) {
                    this.compoundingBeforeMaturityAllowed = true;
                } else {
                    this.compoundingBeforeMaturityAllowed = false;
                }
            });

        //product calculation //edit
        if (formData.isProfitAppliedBeforeMaturity) {
            this.disableProfitAppliedBeforeMaturity = false;
            this.recurringDepositProductForm.get('profitPostingPeriod').setValidators([Validators.required]);
            this.recurringDepositProductForm.get('profitPostingPeriod').updateValueAndValidity();
            this.recurringDepositProductForm.get('profitPostingPeriodType').setValidators([Validators.required]);
            this.recurringDepositProductForm.get('profitPostingPeriodType').updateValueAndValidity();
            this.compoundingBeforeMaturityAllowed = false;
            this.withdrawProfitBeforeMaturityAllowed = false;
        }

        //product calculation
        this.recurringDepositProductForm.get('isProfitAppliedBeforeMaturity').valueChanges
            .subscribe(val => {
                if (val) {
                    this.disableProfitAppliedBeforeMaturity = false;
                    this.recurringDepositProductForm.get('profitPostingPeriod').setValidators([Validators.required]);
                    this.recurringDepositProductForm.get('profitPostingPeriod').updateValueAndValidity();
                    this.recurringDepositProductForm.get('profitPostingPeriodType').setValidators([Validators.required]);
                    this.recurringDepositProductForm.get('profitPostingPeriodType').updateValueAndValidity();
                    this.withdrawProfitBeforeMaturityAllowed = false;
                    this.compoundingBeforeMaturityAllowed = false;
                } else {
                    this.recurringDepositProductForm.get('isCompoundingBeforeMaturityAllowed').reset();
                    this.recurringDepositProductForm.get('isWithdrawProfitBeforeMaturityAllowed').reset();
                    this.recurringDepositProductForm.get('profitPostingPeriod').reset();
                    this.recurringDepositProductForm.get('profitPostingPeriod').clearValidators();
                    this.recurringDepositProductForm.get('profitPostingPeriod').updateValueAndValidity();
                    this.recurringDepositProductForm.get('profitPostingPeriodType').reset();
                    this.recurringDepositProductForm.get('profitPostingPeriodType').clearValidators();
                    this.recurringDepositProductForm.get('profitPostingPeriodType').updateValueAndValidity();
                    this.disableProfitAppliedBeforeMaturity = true;
                    this.withdrawProfitBeforeMaturityAllowed = true;
                    this.compoundingBeforeMaturityAllowed = true;
                }
            });

        // isTenorRequired
        this.recurringDepositProductForm.get('isTenorRequired').valueChanges
            .subscribe(val => {
                if (val) {
                    this.disableTenorType = false;
                    this.recurringDepositProductForm.get('tenorType').setValidators([Validators.required]);
                    this.recurringDepositProductForm.get('tenorType').updateValueAndValidity();
                } else {
                    this.recurringDepositProductForm.get('tenorType').reset();
                    this.recurringDepositProductForm.get('tenorType').clearValidators();
                    this.recurringDepositProductForm.get('tenorType').updateValueAndValidity();
                    this.recurringDepositProductForm.get('tenor').reset();
                    this.tenors = [];
                    this.disableTenorType = true;
                }
            })

        // disable tenor //edit
        if (formData.tenorType) {
            this.disableTenor = false;
        }

        // disable tenor
        this.recurringDepositProductForm.get('tenorType').valueChanges
            .subscribe(val => {
                this.disableTenor = val ? false : true;
            });

        // disable tenor type  //edit
        if (formData.tenors && formData.tenors.length > 0) {
            this.disableTenorType = true;
        }

        // disable tenor type
        this.recurringDepositProductForm.get('tenor').valueChanges
            .subscribe(val => {
                this.disableAddTenorButton = (val && (!this.recurringDepositProductForm.get('tenor').errors)) ? false : true;
                if (this.tenors.includes(Number(this.recurringDepositProductForm.get('tenor').value))) {
                    this.recurringDepositProductForm.get('tenor').setErrors({ 'duplicateTenor': true });
                    this.disableAddTenorButton = true;
                }

            });

        this.recurringDepositProductForm.get('installmentSizes').valueChanges
            .subscribe(val => {
                this.disableAddFixedInstallmentSizeButton = (val && (!this.recurringDepositProductForm.get('installmentSizes').errors)) ? false : true;
                if (this.installmentSizes.includes(Number(this.recurringDepositProductForm.get('installmentSizes').value))) {
                    this.recurringDepositProductForm.get('installmentSizes').setErrors({ 'duplicateTenor': true });
                    this.disableAddFixedInstallmentSizeButton = true;
                }

            });

        //lien percentage //edit
        if (formData.isLienAllowed) {
            this.disableLienPercentage = false;
            this.recurringDepositProductForm.get('lienPercentage').setValidators([Validators.required, Validators.max(100)]);
            this.recurringDepositProductForm.get('lienPercentage').updateValueAndValidity();
        }

        //lien percentage
        this.recurringDepositProductForm.get('isLienAllowed').valueChanges
            .subscribe(val => {
                if (val) {
                    this.disableLienPercentage = false;
                    this.recurringDepositProductForm.get('lienPercentage').setValidators([Validators.required, Validators.max(100), Validators.min(0)]);
                    this.recurringDepositProductForm.get('lienPercentage').updateValueAndValidity();
                } else {
                    this.recurringDepositProductForm.get('lienPercentage').reset();
                    this.recurringDepositProductForm.get('lienPercentage').clearValidators();
                    this.recurringDepositProductForm.get('lienPercentage').updateValueAndValidity();
                    this.disableLienPercentage = true;
                }
            });
    }


    submit() {
        if (!this.taskId) {
            this.showVerifierSelectionModal = of(true);
        } else {
            this.emitSaveEvent({ verifier: null, approvalFlowRequired: null }, this.taskId);
        }
    }

    onVerifierSelect(selectEvent: VerifierSelectionEvent) {
        this.emitSaveEvent(selectEvent, null);
    }
    emitSaveEvent(selectEvent: VerifierSelectionEvent, taskid: string) {
        this.markFormGroupAsTouched(this.recurringDepositProductForm);

        if (this.formInvalid()) {
            return;
        }
        let recurringDepositProduct = this.recurringDepositProductForm.value;
        recurringDepositProduct.tenors = [...this.tenors];
        recurringDepositProduct.installmentSizes = [...this.installmentSizes];

        this.onSave.emit({
            recurringDepositProductForm: recurringDepositProduct,
            verifier: selectEvent.verifier,
            taskId: this.taskId,
            approvalFlowRequired: selectEvent.approvalFlowRequired
        });
    }
    // save() {
    //     this.markFormGroupAsTouched(this.recurringDepositProductForm);

    //     if (this.formInvalid()) { return }

    //     let recurringDepositProduct = new RecurringDepositProduct();
    //     recurringDepositProduct = this.recurringDepositProductForm.value;
    //     recurringDepositProduct.tenors = [...this.tenors];
    //     this.onSave.emit(recurringDepositProduct);
    // }

    cancel() {
        this.onCancel.emit();
    }

    fetchCurrencies() {
        this.subscribers.fetchCurrenciesSub = this.currencyService.fetchCurrencies(new Map())
            .subscribe(data => {
                this.currencies = data.content.map(currency => {
                    return { label: currency.name, value: currency.code }
                });
            });
    }

    onCurrencyChange() {
        if (CurrencyRestriction[2].value === this.recurringDepositProductForm.get('currencyRestriction').value) {  //multiple currency
            this.multipleCurrency = true;
        } else {
            this.recurringDepositProductForm.get('currencies').setValue(null);
            this.multipleCurrency = false;
        }
    }

    addTenor() {
        let tempTenor: number;
        tempTenor = this.recurringDepositProductForm.get('tenor').value;
        this.datatableTenorType = this.recurringDepositProductForm.get('tenorType').value;
        this.tenors = [Number(tempTenor), ...this.tenors];
        this.recurringDepositProductForm.get('tenor').reset();
        this.checkAvailityOfTenorType();
    }

    addInstallmentSize() {
        let tempInstallmentSize: number;
        tempInstallmentSize = this.recurringDepositProductForm.get('installmentSizes').value;
        this.installmentSizes = [Number(tempInstallmentSize), ...this.installmentSizes];
        this.recurringDepositProductForm.get('installmentSizes').reset();
        this.checkIfFixedInstallment();
    }

    checkAvailityOfTenorType() {
        this.disableTenorType = (this.tenors && this.tenors.length <= 0) ? false : true;
    }
    checkIfFixedInstallment() {
        this.disableFixedInstallments = (this.installmentSizes && this.installmentSizes.length <= 0) ? false : true;
    }
    deleteTenor(index) {
        let temp = Object.assign([], this.tenors);
        temp.splice(index, 1);
        this.tenors = Object.assign([], temp);
        this.checkAvailityOfTenorType();
    }

    deleteInstallmentSize(index) {
        let temp = Object.assign([], this.installmentSizes);
        temp.splice(index, 1);
        this.installmentSizes = Object.assign([], temp);
        this.checkIfFixedInstallment();
    }

    formInvalid() {
        return this.recurringDepositProductForm.invalid || !this.isAmountValid();
    }

    isAmountValid() {
        if (!this.isInstallmentFixed) {
            if (this.ammountArray.includes(null) || this.ammountArray.includes(undefined)) return false;
            if (this.ammountArray.length < 2) return true;

            if (this.ammountArray[0] <= this.ammountArray[1] && (this.ammountArray[0] % this.ammountArray[2] == 0 && this.ammountArray[1] % this.ammountArray[2] == 0)) {
                this.displayAmountErrorMessage = false;
                return true;
            } else {
                this.displayAmountErrorMessage = true;
                return false;
            }
        } else {
            return true;
        }
    }
}