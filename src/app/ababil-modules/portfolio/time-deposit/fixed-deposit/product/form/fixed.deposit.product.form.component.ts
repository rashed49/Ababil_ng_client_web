//---imports---//
//angular imports
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { Location } from '@angular/common';

//primeng imports
import { SelectItem } from 'primeng/api';
import { FieldsetModule } from 'primeng/primeng';
import { InputSwitchModule } from 'primeng/primeng';
import { InputTextareaModule } from 'primeng/primeng';
import { PaginatorModule } from 'primeng/primeng';

//rxjs imports
import { Subscriber, Observable, of } from 'rxjs';

//constants
import { ValidatorConstants } from './../../../../../../common/constants/app.validator.constants';
import * as searchParamConstants from '../../../../../../common/constants/app.search.parameter.constants';
import * as commandConstants from '../../../../../../common/constants/app.command.constants';

//other components
import { BaseComponent } from '../../../../../../common/components/base.component';
import { VerifierSelectionEvent } from '../../../../../../common/components/verifier-selection/verifier.selection.component';

//enum models, models
import { TenorType, ProfitCalculationBasedOn, DaysInYear, ProfitPostingPeriod, ProfitPostingPeriodType } from '../../../../../../common/domain/time.deposit.product.enum.model';
import { QuardType } from '../../../../../../common/domain/fixed.deposit.product.enum.model'
import { CurrencyRestriction } from '../../../../../../common/domain/currency.enum.model';
import { Currency } from '../../../../../../services/currency/domain/currency.models';

//services
import { CurrencyService } from '../../../../../../services/currency/service-api/currency.service';


//fixed deposit product imports
import { FixedDepositProduct } from '../../../../../../services/fixed-deposit-product/domain/fixed.deposit.product.model';
import { FixedDepositProductService } from '../../../../../../services/fixed-deposit-product/service-api/fixed.deposit.product.service';
import { assertNotNull } from '@angular/compiler/src/output/output_ast';
import { FormBaseComponent } from '../../../../../../common/components/base.form.component';
import { ApprovalflowService } from '../../../../../../services/approvalflow/service-api/approval.flow.service';

export let initialFixedDepositProduct : FixedDepositProduct = new FixedDepositProduct();


export interface FixedDepositProductSaveEvent {
    fixedDepositProductForm: FixedDepositProduct,
    verifier: string,
    taskId: string,
    approvalFlowRequired: boolean
}

@Component({
    selector: 'fixed-deposit-product-form',
    templateUrl: './fixed.deposit.product.form.component.html'
})


export class FixedDepositProductFormComponent extends FormBaseComponent implements OnInit {

    //---variables---//

    //product
    id: number;
    //selectitems
    daysInYear: SelectItem[] = DaysInYear;
    profitCalculationBasedOn: SelectItem[] = ProfitCalculationBasedOn;
    profitPostingPeriod: SelectItem[] = ProfitPostingPeriod;
    profitPostingPeriodType: SelectItem[] = ProfitPostingPeriodType;
    tenorType: SelectItem[] = TenorType;
    quardType: SelectItem[] = QuardType;

    //formgroup
    fixedDepositProductForm: FormGroup;

    //currency
    currencies: Currency[];
    currencyMap: Map<number, string>;
    currencyRestriction: SelectItem[] = CurrencyRestriction;
    multipleCurrency: boolean = false;

    //tenor
    tenors: number[] = [];
    disableTenorType: boolean = true;
    disableTenor: boolean = true;
    disableAddTenorButton: boolean = true;
    datatableTenorType: string = '';

    //profit
    profitchecker: boolean = true;
    withdrawProfitBeforeMaturityAllowed: boolean = true;
    compoundingBeforeMaturityAllowed: boolean = true;

    //auto renewal
    autorenewaloverridablechecker: boolean = true;

    //lien
    lienchecker: boolean = true;

    //quard
    quardchecker: boolean = true;

    withdrawalPercentageChecker: boolean = true;
    withdrawalBlockDisabled: boolean = false;
    quardBlockDisabled: boolean = false;

    //amount
    depositAmountMultiplierChecker: boolean = true;
    displayAmountErrorMessage: boolean = false;
    ammountArray: any[] = [];

    //validator
    required: boolean = true;
    verifierSelectionModalVisible: Observable<boolean>;

    taskId: string;
    //input from edit and create components
    @Input('formData') set formData(formData: FixedDepositProduct) {
        this.prepareFixedDepositProductForm(formData);
}
    @Input('command') command: string;

    //output to edit and create components
    @Output('onSave') onSave = new EventEmitter<FixedDepositProductSaveEvent>();
    @Output('onCancel') onCancel = new EventEmitter<void>();
    @Input('editMode') editMode: boolean;

    constructor(

        protected location: Location,
        private fb: FormBuilder,
        private fixedDepositProductService: FixedDepositProductService,
        private currencyService: CurrencyService,
        private route: ActivatedRoute,
        protected approvalFlowService: ApprovalflowService) {
        super(location, approvalFlowService);

    }
   
    ngOnInit() {
        this.showVerifierSelectionModal = of(false);
       this.prepareFixedDepositProductForm(null);
        
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

    //prepare the form
    prepareFixedDepositProductForm(formData: FixedDepositProduct) {
        (formData == null) ? formData = initialFixedDepositProduct : formData;
        this.id = formData.id;
        if (formData.tenors && formData.tenors.length > 0) {
            this.tenors = [...formData.tenors];
        }

        if (formData.tenorType) { this.datatableTenorType = formData.tenorType; }
    
        this.fixedDepositProductForm = this.fb.group({

            //basic info
            name: [formData.name, [Validators.required, Validators.pattern(ValidatorConstants.PRODUCT_NAME)]],
            code: [formData.code, [Validators.required, Validators.min(0), Validators.maxLength(3), Validators.minLength(3)]],
            description: [formData.description, [Validators.pattern(ValidatorConstants.PRODUCT_NAME)]],
            currencyRestriction: [formData.currencyRestriction, [Validators.required]],
            currencies: [formData.currencies],

            //amount
            minimumDepositAmount: [formData.minimumDepositAmount, [Validators.required]],
            maximumDepositAmount: [formData.maximumDepositAmount],
            depositAmountMultiplier: [formData.depositAmountMultiplier, [Validators.required]],

            //tenor
            isTenorRequired: [formData.isTenorRequired],
            tenorType: [formData.tenorType],
            tenor: [''],

            //profit
            profitCalculationBasedOn: [formData.profitCalculationBasedOn, [Validators.required]],
            profitPostingPeriod: [formData.profitPostingPeriod],
            profitPostingPeriodType: [formData.profitPostingPeriodType],
            isWithdrawProfitBeforeMaturityAllowed: [formData.isWithdrawProfitBeforeMaturityAllowed],
            isProfitAppliedBeforeMaturity: [formData.isProfitAppliedBeforeMaturity],
            isCompoundingBeforeMaturityAllowed: [formData.isCompoundingBeforeMaturityAllowed],
            daysInYear: [formData.daysInYear, [Validators.required]],

            //lien
            isLienAllowed: [formData.isLienAllowed],
            lienPercentage: [formData.lienPercentage,[Validators.min(0), Validators.max(100)] ],

            //quard
            isQuardAllowed: [formData.isQuardAllowed],
            quardPercentage: [formData.quardPercentage,[Validators.min(0), Validators.max(100)]],

            //withdrawal
            isWithdrawalAllowed: [formData.isWithdrawalAllowed],
            withdrawalPercentage: [formData.withdrawalPercentage, [Validators.min(0), Validators.max(100)]],

            //others
            isLinkAccountRequired: [formData.isLinkAccountRequired],
            isAutoRenewalAllowed: [formData.isAutoRenewalAllowed],
            isAutoRenewalOverridable: [formData.isAutoRenewalOverridable],

        });

        //setting the valuechange parameters
        this.statechange('isTenorRequired', 'tenorType', this.required = true);
        this.statechange('isAutoRenewalAllowed', 'isAutoRenewalOverridable', this.required = false)
        this.statechange('isLienAllowed', 'lienPercentage', this.required = true);
        this.statechange('isQuardAllowed', 'quardPercentage', this.required = true);
        this.statechange('isWithdrawalAllowed', 'withdrawalPercentage', this.required = true);
        this.statechange('isProfitAppliedBeforeMaturity', 'isCompoundingBeforeMaturityAllowed', this.required = false);
        this.statechange('isProfitAppliedBeforeMaturity', 'isWithdrawProfitBeforeMaturityAllowed', this.required = false);
        this.statechange('isProfitAppliedBeforeMaturity', 'profitPostingPeriodType', this.required = true);
        this.statechange('isProfitAppliedBeforeMaturity', 'profitPostingPeriod', this.required = true);

        //currency //edit
        if (CurrencyRestriction[2].value === formData.currencyRestriction) { //multi currency
            this.fixedDepositProductForm.get('currencies').setValidators(Validators.required);
            this.fixedDepositProductForm.get('currencies').updateValueAndValidity();
            this.multipleCurrency = true;
        }

        //currency
        this.fixedDepositProductForm.get('currencyRestriction').valueChanges.subscribe(val => {
            this.fixedDepositProductForm.get('currencies').reset();
            if (CurrencyRestriction[2].value === val) { //multi currency
                this.fixedDepositProductForm.get('currencies').setValidators(Validators.required);
                this.fixedDepositProductForm.get('currencies').updateValueAndValidity();
            } else {
                this.fixedDepositProductForm.get('currencies').reset();
                this.fixedDepositProductForm.get('currencies').clearValidators();
            }
        });

        //tenor
        //disable or enable tenortype
        this.fixedDepositProductForm.get('isCompoundingBeforeMaturityAllowed').valueChanges
            .subscribe(val => {
                if (val) {
                    this.withdrawProfitBeforeMaturityAllowed = true;
                } else {
                    this.withdrawProfitBeforeMaturityAllowed = false;
                }
            });

        this.fixedDepositProductForm.get('isWithdrawProfitBeforeMaturityAllowed').valueChanges
            .subscribe(val => {
                if (val) {
                    this.compoundingBeforeMaturityAllowed = true;
                } else {
                    this.compoundingBeforeMaturityAllowed = false;
                }
            });
        this.fixedDepositProductForm.get('isTenorRequired').valueChanges
            .subscribe(val => {
                if (val) {
                    this.disableTenorType = false;
                } else {

                    this.tenors = [];
                    this.disableTenorType = true;
                }
            });

        //disable or enable tenor 
        this.fixedDepositProductForm.get('tenorType').valueChanges
            .subscribe(val => {
                this.disableTenor = val ? false : true;
                if (val) {
                    this.fixedDepositProductForm.get('tenor').setValidators([Validators.required]);
                    this.fixedDepositProductForm.get('tenor').updateValueAndValidity();
                }

            });

        // disable or enable tenor add button
        this.fixedDepositProductForm.get('tenor').valueChanges
            .subscribe(val => {
                this.disableAddTenorButton = (val && (!this.fixedDepositProductForm.get('tenor').errors)) ? false : true;
                if (this.tenors.includes(Number(this.fixedDepositProductForm.get('tenor').value))) {
                    this.fixedDepositProductForm.get('tenor').setErrors({ 'duplicateTenor': true });
                    this.disableAddTenorButton = true;
                }

            });


        //----edit----//

        //autorenewal
        if (formData.isAutoRenewalAllowed) {
            this.autorenewaloverridablechecker = false;
        }

        //profit
        if (formData.isProfitAppliedBeforeMaturity) {
            this.fixedDepositProductForm.get('profitPostingPeriod').setValidators([Validators.required]);
            this.fixedDepositProductForm.get('profitPostingPeriod').updateValueAndValidity();
            this.fixedDepositProductForm.get('profitPostingPeriodType').setValidators([Validators.required]);
            this.fixedDepositProductForm.get('profitPostingPeriodType').updateValueAndValidity();
            this.profitchecker = false;
            this.compoundingBeforeMaturityAllowed = false;
            this.withdrawProfitBeforeMaturityAllowed = false;


        }


        //lien
        if (formData.isLienAllowed) {
            this.fixedDepositProductForm.get('lienPercentage').setValidators([Validators.required]);
            this.fixedDepositProductForm.get('lienPercentage').updateValueAndValidity();
            this.lienchecker = false;
        }

        //quard
        if (formData.isQuardAllowed) {
            this.fixedDepositProductForm.get('quardPercentage').setValidators([Validators.required]);
            this.fixedDepositProductForm.get('quardPercentage').updateValueAndValidity();
            this.quardchecker = false;
            this.withdrawalBlockDisabled = true;
        }

        if (formData.isWithdrawalAllowed) {
            this.fixedDepositProductForm.get('withdrawalPercentage').setValidators([Validators.required]);
            this.fixedDepositProductForm.get('withdrawalPercentage').updateValueAndValidity();
            this.withdrawalPercentageChecker = false;
            this.quardBlockDisabled = true;
        }

        this.fixedDepositProductForm.get('isWithdrawalAllowed').valueChanges.subscribe(
            val => {
                if (val) {
                    this.quardBlockDisabled = true;
                    this.withdrawalBlockDisabled = false;
                    this.fixedDepositProductForm.get('isQuardAllowed').setValue(false);
                }
                else {
                    this.quardBlockDisabled = false;
                    this.withdrawalBlockDisabled = true;
                }
            }
        );

        this.fixedDepositProductForm.get('isQuardAllowed').valueChanges.subscribe(
            val => {
                if (val) {
                    this.fixedDepositProductForm.get('isWithdrawalAllowed').setValue(false);
                    this.withdrawalBlockDisabled = true;
                    this.quardBlockDisabled = false;
                } else {
                    this.withdrawalBlockDisabled = false;
                    this.quardBlockDisabled = true;
                }
            }
        );



        //tenor
        // disable tenor 
        if (formData.tenorType) {
            this.disableTenor = false;
        }

        // disable tenor type //edit
        if (formData.tenors && formData.tenors.length > 0) {
            this.disableTenorType = true;
        }



        //---- amount validation----//
        if (formData) {
            this.ammountArray[0] = formData.minimumDepositAmount;
            this.ammountArray[1] = formData.maximumDepositAmount;
            this.ammountArray[2] = formData.depositAmountMultiplier;
        }

        // /minimumDepositAmount
        this.fixedDepositProductForm.get('minimumDepositAmount').valueChanges
            .subscribe(val => {
                this.fixedDepositProductForm.get('maximumDepositAmount').setValidators([
                    Validators.min(this.fixedDepositProductForm.get('minimumDepositAmount').value)]);
                this.fixedDepositProductForm.get('maximumDepositAmount').updateValueAndValidity();
                this.ammountArray[0] = val;
                this.isAmountValid();
            });

        //maximumDepositAmount
        this.fixedDepositProductForm.get('maximumDepositAmount').valueChanges
            .subscribe(val => {
                this.ammountArray[1] = val;
                this.isAmountValid();
            });

        //depositAmountMultiplier
        this.fixedDepositProductForm.get('depositAmountMultiplier').valueChanges
            .subscribe(val => {
                this.ammountArray[2] = val;
                this.isAmountValid();
            });

    }


    //---methods---///

    //go back
    cancel() {
        this.onCancel.emit();
    }

    //save method


    submit() {

            this.showVerifierSelectionModal = of(true);
       }

    onVerifierSelect(selectEvent: VerifierSelectionEvent) {
        this.emitSaveEvent(selectEvent, null);
    }
    emitSaveEvent(selectEvent: VerifierSelectionEvent, taskid: string) {
        this.markFormGroupAsTouched(this.fixedDepositProductForm);

        if (this.fixedDepositProductFormInvalid()) {
            return;
        }

        let fixedDepositProduct = this.fixedDepositProductForm.value;
        fixedDepositProduct.tenors = [...this.tenors];
        fixedDepositProduct.id = this.id;
        this.onSave.emit({
            fixedDepositProductForm: fixedDepositProduct,
            verifier: selectEvent.verifier,
            taskId: this.taskId,
            approvalFlowRequired: selectEvent.approvalFlowRequired
        });
    }

    //function to enable, disable and set required validator of 'changed' parameter 
    //on valuechange of checkmark parameter
    statechange(checkmark: string, changed: string, required: boolean) {
        this.fixedDepositProductForm.get(checkmark).valueChanges.subscribe(
            val => {
                if (val == true) {

                    this.fixedDepositProductForm.get(changed).enable();

                    if (checkmark === "isQuardAllowed" && changed === "quardPercentage") {
                        this.fixedDepositProductForm.get(changed).setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
                        this.fixedDepositProductForm.get(changed).updateValueAndValidity();
                    }
                    else if (checkmark === "isLienAllowed" && changed === "lienPercentage") {
                        this.fixedDepositProductForm.get(changed).setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
                        this.fixedDepositProductForm.get(changed).updateValueAndValidity();
                    } else if (checkmark === "isWithdrawalAllowed" && changed === "withdrawalPercentage") {
                        this.fixedDepositProductForm.get(changed).setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
                        this.fixedDepositProductForm.get(changed).updateValueAndValidity();
                    }

                    else {
                        if (required) {
                            this.fixedDepositProductForm.get(changed).setValidators(Validators.required);
                            this.fixedDepositProductForm.get(changed).updateValueAndValidity();
                        }
                    }
                }
                else {
                    this.fixedDepositProductForm.get(changed).reset();
                    this.fixedDepositProductForm.get(changed).disable();
                    this.fixedDepositProductForm.get(changed).clearValidators();
                    this.fixedDepositProductForm.get(changed).updateValueAndValidity();
                }

            }
        )
    }


    onCurrencyChange() {
        if (CurrencyRestriction[2].value === this.fixedDepositProductForm.get('currencyRestriction').value) {  //multiple currency
            this.multipleCurrency = true;

        } else {
            this.fixedDepositProductForm.get('currencies').setValue(null);
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

    //tenor
    addTenor() {
        let tempTenor: number;
        tempTenor = this.fixedDepositProductForm.get('tenor').value;
        this.datatableTenorType = this.fixedDepositProductForm.get('tenorType').value;

        this.tenors = [Number(tempTenor), ...this.tenors];
        this.fixedDepositProductForm.get('tenor').reset();
        this.fixedDepositProductForm.get('tenor').clearValidators();
        this.fixedDepositProductForm.get('tenor').updateValueAndValidity();
        this.checkAvailityOfTenorType();
    }

    checkAvailityOfTenorType() {
        this.disableTenorType = (this.tenors && this.tenors.length <= 0) ? false : true;
    }

    deleteTenor(index) {
        let temp = Object.assign([], this.tenors);
        temp.splice(index, 1);
        this.tenors = Object.assign([], temp);

        this.checkAvailityOfTenorType();
    }

    //amount validation
    isAmountValid() {
        // if (this.ammountArray.includes(null) || this.ammountArray.includes(undefined)) return false;
        if (this.ammountArray.length < 2) return true;

        if (this.ammountArray[0] != null && this.ammountArray[2] != null && (this.ammountArray[1] != null || this.ammountArray[1] != undefined)) {
            if (this.ammountArray[0] <= this.ammountArray[1] && this.ammountArray[1] % this.ammountArray[2] == 0) {
                this.displayAmountErrorMessage = false;
                return true;
            } else {
                this.displayAmountErrorMessage = true;
                return false;
            }
        }
        if (this.ammountArray[0] != null && this.ammountArray[2] != null && this.ammountArray[1] == null) {
            if ((this.ammountArray[0] % this.ammountArray[2] == 0)) {
                this.displayAmountErrorMessage = false;
                return true;
            } else {
                this.displayAmountErrorMessage = true;
                return false;
            }
        }




    }

    //form validation    

    fixedDepositProductFormInvalid() {
        return this.fixedDepositProductForm.invalid || !this.isAmountValid();
    }
}