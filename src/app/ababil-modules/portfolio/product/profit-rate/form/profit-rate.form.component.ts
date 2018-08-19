import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfitRate, DemandDepositRateSlabs } from '../../../../../services/demand-deposit-product/domain/profit-rate.model';
import { of } from 'rxjs';
import { BaseComponent } from '../../../../../common/components/base.component';
import { Observable } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { ProductService } from '../../../../../services/product/service-api/product.service';
import { NotificationService } from '../../../../../common/notification/notification.service';
import { Product } from '../../../../../services/product/domain/product.models';
import { Currency } from '../../../../../services/currency/domain/currency.models';
import { VerifierSelectionEvent } from '../../../../../common/components/verifier-selection/verifier.selection.component';
import * as urlSearchParameterConstants from '../../../../../common/constants/app.search.parameter.constants';
import { TenorType } from '../../../../../common/domain/time.deposit.product.enum.model';
import { map } from 'rxjs/operators';



@Component({
    selector: 'profit-rate-form',
    templateUrl: './profit-rate.form.component.html'
})

export class ProfitRateFormComponent extends BaseComponent implements OnInit {

    constructor(private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private productService: ProductService,
        private notificationService: NotificationService) { super() }

    queryParams: any;
    profitRateForm: FormGroup;
    selectedProductId: number;
    profitRateId: number;
    currencyCode: string;
    slabApplicable: boolean = false;
    initialProfitRateFormData: ProfitRate = new ProfitRate();
    tenorTypes: SelectItem[] = TenorType;
    productType: string;
    notDemandDepositType: boolean;

    ddProfitSlabs: DemandDepositRateSlabs[];
    profitRates: any;
    profitformData: ProfitRate;

    productDetails: Product = new Product();
    currencies: SelectItem[] = [];
    currencyRestriction: string;
    currency: Currency;
    multipleCurrency: boolean;
    urlSearchParam: Map<string, string>;
    subscription: any;
    type: string;
    psr: boolean = false;
    apr: boolean = false;
    weightage: boolean = false;
    addButton: boolean = true;
    saveButton: boolean = true;
    rowIndex: number;
    errorSet = new Set([]);
    rate: number;
    selectedType: string;

    verifierSelectionModalVisible: Observable<boolean> = of(false);

    command: string = "CreateProductProfitRateCommand";


    ngOnInit() {
        this.subscribers.routeSub = this.route.params.subscribe(
            params => {
                this.selectedProductId = +params['id'];
                this.prepareProfitForm(null);
                this.fetchDemandDepositProductDetails();
                this.fetchDemandDepositProductConfiguration();
            });

        this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(
            queryParams => {
                this.queryParams = queryParams;
                this.profitRateId = queryParams['profitRateId'] ? +queryParams['profitRateId'] : null;
                if (this.profitRateId) {
                    this.command = "UpdateProductProfitRateCommand";
                    this.fetchProfitRate();
                }
            }
        )
    }

    fetchProfitRate() {
        this.subscribers.fetchprofitSub = this.productService.
            fetchProfitRate({ 'productId': this.selectedProductId + '', 'profitRateId': this.profitRateId + '' })
            .subscribe(profitRate => {
                this.profitformData = profitRate;
                this.prepareProfitForm(this.profitformData);
            });
    }


    prepareProfitForm(formData: ProfitRate) {
        formData = (formData == null) ? this.initialProfitRateFormData : formData;

        this.profitRateForm = this.formBuilder.group({
            fromDate: [formData.fromDate ? new Date(formData.fromDate) : null, [Validators.required]],
            description: [formData.description],
            endDate: [formData.endDate ? new Date(formData.endDate) : null, [Validators.required]],
            slabApplicable: [formData.slabApplicable],
            currencyCode: [formData.currencyCode],
        });
        this.addDemandDepositProductConfigurationFormControls();

        this.profitRateForm.get('fromDate').valueChanges.subscribe(
            value => {
                if (!value) {
                    this.profitRateForm.get('fromDate').setValue(new Date());
                    this.profitRateForm.get('fromDate').updateValueAndValidity();
                }
                if (this.profitRateForm.get('endDate').value < value) {
                    this.profitRateForm.get('endDate').setValue(value);
                    this.profitRateForm.get('endDate').updateValueAndValidity();
                }
            }
        );

        this.profitRateForm.get('endDate').valueChanges.subscribe(
            value => {
                if (!value || value < this.profitRateForm.get('fromDate').value) {
                    this.profitRateForm.get('endDate').setValue(this.profitRateForm.get('fromDate').value);
                    this.profitRateForm.get('endDate').updateValueAndValidity();
                }
            }
        );

        if (!this.profitRateForm.get('fromDate').value) {
            this.profitRateForm.get('fromDate').setValue(new Date());
            this.profitRateForm.get('fromDate').updateValueAndValidity();
        }
        if (this.profitRateForm.get('endDate').value < this.profitRateForm.get('fromDate').value) {
            this.profitRateForm.get('endDate').setValue(this.profitRateForm.get('fromDate').value);
            this.profitRateForm.get('endDate').updateValueAndValidity();
        }
        if (!this.profitRateForm.get('endDate').value) {
            this.profitRateForm.get('endDate').setValue(this.profitRateForm.get('fromDate').value);
            this.profitRateForm.get('endDate').updateValueAndValidity();
        }

        this.ddProfitSlabs = formData.productProfitRateSlabs;
        this.slabApplicable = formData.slabApplicable;

        this.profitRateForm.controls['slabApplicable'].valueChanges.subscribe(val => {
            this.errorSet = new Set([]);
            this.slabApplicable = val;
            this.ddProfitSlabs = [];
            if (!this.slabApplicable) {
                let slab = new DemandDepositRateSlabs();
                slab.amountRangeFrom = 0;
                slab.amountRangeTo = 0;
                slab.fromTenor = 0;
                slab.toTenor = 0;
                slab.tenorType = null;
                slab.annualProvisionalRate = 0;
                slab.psr = 0;
                slab.weightage = 0;
                this.ddProfitSlabs = [...this.ddProfitSlabs, slab];
                this.profitRateForm.get('endDate').setValue(null);
                this.addDemandDepositProductConfigurationFormControls();
                this.saveButton = true;
            } else {
                this.profitRateForm.get('endDate').setValue(this.profitRateForm.get('fromDate').value);
                this.removeDemandDepositProductConfigurationFormControls();
                this.saveButton = false;
            }
            this.addButton = true;
        });

        if (!this.slabApplicable && !formData.id) {
            let slab = new DemandDepositRateSlabs();
            slab.amountRangeFrom = 0;
            slab.amountRangeTo = 0;
            slab.fromTenor = 0;
            slab.toTenor = 0;
            slab.tenorType = null;
            slab.annualProvisionalRate = 0;
            slab.psr = 0;
            slab.weightage = 0;
            this.ddProfitSlabs = [...this.ddProfitSlabs, slab];
            this.addDemandDepositProductConfigurationFormControls();
        }
    }

    addDemandDepositProductConfigurationFormControls() {
        if (this.psr) {
            this.profitRateForm.addControl('psr', new FormControl(this.profitformData ? this.profitformData.productProfitRateSlabs[0].psr : null, [Validators.required, Validators.min(0), Validators.max(1)]));
        }
        if (this.apr) {
            this.profitRateForm.addControl('annualProvisionalRate', new FormControl(this.profitformData ? this.profitformData.productProfitRateSlabs[0].annualProvisionalRate : null, [Validators.required, Validators.min(0), Validators.max(100)]));
        }
        if (this.weightage) {
            this.profitRateForm.addControl('weightage', new FormControl(this.profitformData ? this.profitformData.productProfitRateSlabs[0].weightage : null, [Validators.required, Validators.min(0), Validators.max(1)]));
        }
        this.profitRateForm.updateValueAndValidity();
    }

    removeDemandDepositProductConfigurationFormControls() {
        if (this.psr) {
            this.profitRateForm.removeControl('psr');
        }
        if (this.apr) {
            this.profitRateForm.removeControl('annualProvisionalRate');
        }
        if (this.weightage) {
            this.profitRateForm.removeControl('weightage');
        }
    }


    addSlab() {
        let slab = new DemandDepositRateSlabs();
        // this.ddProfitSlabs.length == 0 ? slab.amountRangeFrom = 1 : slab.amountRangeFrom = +this.ddProfitSlabs[this.ddProfitSlabs.length - 1].amountRangeTo + 1, ,slab.fromTenor= +this.ddProfitSlabs[this.ddProfitSlabs.length-1].fromTenor;

        if (this.ddProfitSlabs.length == 0) {
            slab.amountRangeFrom = 0;
        } else {
            slab.amountRangeFrom = +this.ddProfitSlabs[this.ddProfitSlabs.length - 1].amountRangeTo;
            slab.toTenor = +this.ddProfitSlabs[this.ddProfitSlabs.length - 1].toTenor;
            slab.fromTenor = +this.ddProfitSlabs[this.ddProfitSlabs.length - 1].fromTenor;
            slab.tenorType = this.ddProfitSlabs[this.ddProfitSlabs.length - 1].tenorType;
        }


        if (this.ddProfitSlabs.length != 0 && this.ddProfitSlabs[this.ddProfitSlabs.length - 1].amountRangeTo == null) {
            slab.toTenor = null;
            slab.fromTenor = +this.ddProfitSlabs[this.ddProfitSlabs.length - 1].fromTenor;
        }

        slab.amountRangeTo = null;
        slab.annualProvisionalRate = 0;
        slab.psr = 0;
        slab.weightage = 0;
        this.ddProfitSlabs = [...this.ddProfitSlabs, slab];
        this.addButton = false;
        this.saveButton = true;
    }

    fetchDemandDepositProductDetails() {
        this.subscribers.fetchSub = this.productService
            .fetchProductDetails({ id: this.selectedProductId + '' })
            .pipe(map(demandDepositProduct => {
                this.productDetails = demandDepositProduct;
                this.currencyRestriction = this.productDetails.currencyRestriction;
                if (this.currencyRestriction == 'LOCAL_CURRENCY') {
                    this.multipleCurrency = false;
                    this.currencyCode = this.productDetails.currencies[0];
                    this.productType = this.productDetails.type;
                } else {
                    this.multipleCurrency = true;
                    this.currencies = [{ label: 'Choose currency', value: null }]
                        .concat(this.productDetails.currencies.map(currency => {
                            return { label: currency, value: currency }
                        }));
                    this.productType = this.productDetails.type;
                }
                this.notDemandDepositType = (this.productType == 'DEMAND_DEPOSIT') ? false : true;
            })).subscribe();
    }

    cancel() {
        this.navigateAway();
    }

    submit() {
        this.verifierSelectionModalVisible = of(true);
    }

    onVerifierSelect(selectEvent: VerifierSelectionEvent) {

        let urlSearchMap = new Map();
        if (selectEvent.verifier != null) urlSearchMap.set(urlSearchParameterConstants.VERIFIER, selectEvent.verifier);
        this.save(urlSearchMap);
    }

    save(urlSearchMap) {

        if (!this.profitRateId) {
            let profitRate = this.profitRateForm.value;
            profitRate.productProfitRateSlabs = this.ddProfitSlabs;
            profitRate.slabApplicable = this.slabApplicable;


            if (!this.slabApplicable && this.psr) {
                profitRate.productProfitRateSlabs[0].psr = profitRate.psr;
            }
            if (!this.slabApplicable && this.apr) {
                profitRate.productProfitRateSlabs[0].annualProvisionalRate = profitRate.annualProvisionalRate;
            }
            if (!this.slabApplicable && this.weightage) {
                profitRate.productProfitRateSlabs[0].weightage = profitRate.weightage;
            }
            if (!this.multipleCurrency) {
                profitRate.currencyCode = this.productDetails.currencies[0];
            }
            profitRate.productId = this.selectedProductId;


            this.productService.createProfitRate(profitRate, { "productId": this.selectedProductId }, urlSearchMap).

                subscribe((data) => {
                    if (urlSearchMap.has(urlSearchParameterConstants.VERIFIER)) {
                        this.notificationService.sendSuccessMsg("workflow.task.verify.send");
                    } else {
                        this.notificationService.sendSuccessMsg("Profit rate created");
                    }
                    this.navigateAway()
                });


        } else {

            let profitRate = this.profitRateForm.value
            profitRate.id = this.profitRateId;
            profitRate.slabApplicable = this.slabApplicable;
            profitRate.productId = this.selectedProductId;
            if (!this.multipleCurrency) {
                profitRate.currencyCode = this.productDetails.currencies[0];
            }
            profitRate.productProfitRateSlabs = this.ddProfitSlabs;
            if (!this.slabApplicable && this.psr) {
                profitRate.productProfitRateSlabs[0].psr = profitRate.psr;
            }
            if (!this.slabApplicable && this.apr) {
                profitRate.productProfitRateSlabs[0].annualProvisionalRate = profitRate.annualProvisionalRate;
            }
            if (!this.slabApplicable && this.weightage) {
                profitRate.productProfitRateSlabs[0].weightage = profitRate.weightage;
            }


            this.productService.updateProfitRate(profitRate, { 'productId': this.selectedProductId + '', 'profitRateId': this.profitRateId + '' }, urlSearchMap).
                subscribe(data => {
                    if (urlSearchMap.has(urlSearchParameterConstants.VERIFIER)) {
                        this.notificationService.sendSuccessMsg("workflow.task.verify.send");
                    } else {
                        this.notificationService.sendSuccessMsg("Profit rate updated");
                    }
                    this.navigateAway();
                });
        }
    }

    fetchDemandDepositProductConfiguration() {
        this.urlSearchParam = new Map([['name', 'profit-calculation']]);
        this.subscription = this.productService.fetchProductConfiguration(this.urlSearchParam).subscribe(
            profiles => {
                this.type = profiles.type;
                if (this.type == 'PSR') {
                    this.psr = true;
                }
                else {
                    if (this.type == 'RATE') {
                        this.apr = true;
                    } else {
                        this.weightage = true;
                    }
                }
                this.addDemandDepositProductConfigurationFormControls();
            }
        );
    }

    isNumber(value) {
        return (!isNaN(parseFloat(value)) && isFinite(value));
    }
    //set is not needed any more. will update this code
    onEditValidation(data, index) {
        let amountFrom = data.amountRangeFrom;
        let amountTo = data.amountRangeTo;
        let amountToIsNumber = this.isNumber(amountTo);
        let rateValid = true;
        let amountToValid = true;
        this.rowIndex = index;
        if (this.psr) {
            this.rate = +data.psr;
            if (this.rate == null || this.rate < 0 || this.rate > 1) {
                rateValid = false;
            } else {
                rateValid = true;
            }
        }
        if (this.apr) {
            this.rate = +data.annualProvisionalRate;
            if (this.rate == null || this.rate < 0 || this.rate > 100) {
                rateValid = false;
            } else {
                rateValid = true;
            }
        }
        if (this.weightage) {
            this.rate = +data.weightage;
            if (this.rate == null || this.rate < 0 || this.rate > 1) {
                rateValid = false;
            } else {
                rateValid = true;
            }
        }

        if (!amountToIsNumber && amountTo != null) {
            amountToValid = false;
        }
        if (amountToIsNumber && amountFrom > amountTo) {
            amountToValid = false;
        }
        if (amountToIsNumber && amountFrom < amountTo) {
            amountToValid = true;
        }
        if (amountTo == null) {
            amountToValid = true;
        }
        if (rateValid && amountToValid) {
            console.log(rateValid);
            if (this.errorSet.has(this.rowIndex)) {
                this.errorSet.delete(this.rowIndex);
            }
        } else {
            if (!this.errorSet.has(this.rowIndex)) {
                this.errorSet.add(this.rowIndex);
            }
        }
        if (this.errorSet.size == 0) {
            this.saveButton = true;
            amountTo == null ? this.addButton = true : this.addButton = true;
        }
        if (this.errorSet.size > 0) {
            this.saveButton = false;
            this.addButton = false;
        }
    }


    onDeleteRow() {
        let deleteIndex = this.ddProfitSlabs.length - 1;
        this.ddProfitSlabs.splice(deleteIndex, 1);
        this.ddProfitSlabs = [...this.ddProfitSlabs];
        if (this.errorSet.has(deleteIndex)) {
            this.errorSet.delete(deleteIndex);
        }
        if (this.errorSet.size == 0) {
            this.addButton = true;
            this.saveButton = true;
        } else {
            this.addButton = false;
            this.saveButton = false;
        }
    }


    isFormInvalid() {
        return (this.profitRateForm.invalid || !this.saveButton);
    }

    navigateAway() {
        this.router.navigate(['../'], {
            relativeTo: this.route,
            queryParams: { product: this.queryParams.product },
            queryParamsHandling: 'merge'
        });
    }
}
