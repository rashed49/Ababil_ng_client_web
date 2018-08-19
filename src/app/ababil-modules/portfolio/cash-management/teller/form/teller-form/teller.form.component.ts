import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Teller, TellerLimit, TellerStatus } from '../../../../../../services/teller/domain/teller.models';
import { GlAccountService } from '../../../../../../services/glaccount/service-api/gl.account.service';
import { GlAccount } from '../../../../../../services/glaccount/domain/gl.account.model';
import { CurrencyService } from '../../../../../../services/currency/service-api/currency.service';
import { Currency } from '../../../../../../services/currency/domain/currency.models';
import { CurrencyRestriction, TellerType } from '../../../../../../common/domain/teller.enum.model';
import { SelectItem, LazyLoadEvent } from 'primeng/primeng';
import * as commandConstants from '../../../../../../common/constants/app.command.constants';
import { Subscriber, Observable, of } from 'rxjs';
import { VerifierSelectionEvent } from '../../../../../../common/components/verifier-selection/verifier.selection.component';
import { ApprovalflowService } from '../../../../../../services/approvalflow/service-api/approval.flow.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBaseComponent } from '../../../../../../common/components/base.form.component';
import { Location } from '@angular/common';
import { TellerService } from '../../../../../../services/teller/service-api/teller.service';
import { BankService } from '../../../../../../services/bank/service-api/bank.service';
import { Branch } from '../../../../../../services/bank/domain/bank.models';

export let initialTellerFormData: Teller = new Teller();


export interface TellerSaveEvent {
    tellerForm: Teller,
    verifier: string,
    taskId: string,
    approvalFlowRequired: boolean
}
@Component({
    selector: 'app-teller-form',
    templateUrl: './teller.form.component.html',
    styleUrls: ['./teller.form.component.scss']
})
export class TellerFormComponent extends FormBaseComponent implements OnInit {
    branches: Branch[];
    currencyRestrictions: SelectItem[] = CurrencyRestriction;
    selectedCurrency: string;
    tellerForm: FormGroup;
    teller: Teller = new Teller();
    tellerTypes: SelectItem[] = TellerType;
    tellerLimitForm: FormGroup;
    tellerLimits: TellerLimit[] = [];
    currencies: Currency[];
    glId: number;
    glAccounts: GlAccount[];
    glAccountMap: Map<number, string>;
    allowedGlTransaction: boolean = false;
    allowedClientTransaction: boolean = false;
    denominationRequired: boolean = false;
    forceLimit: boolean = false;
    selectedCurrencyType: string;
    selectedTellerLimit: TellerLimit;
    urlSearchParam: Map<string, string>;
    subscription: any;
    selectedIndex: number;
    id: number;
    multipleCurrencyLimit: boolean = false;
    tellers: Teller[] = [];
    glAccountLookUpMode: string = 'GL_ACCOUNT_PATH';
    glAccountLookUpDisplay: boolean = false;
    selectedGLAccount: GlAccount = new GlAccount();
    formNameGl: string;
    tellerError: boolean = true;
    commandReference: string;

    oldCurrencyRestriction: string;


    currencyMap: Map<string, string> = new Map();

    @Input('formData') set formData(formData: Teller) {
        this.prepareTellerForm(formData);
    }

    @Input('command') command: string;
    verifierSelectionModalVisible: Observable<boolean>;
    @Output('onSave') onSave = new EventEmitter<TellerSaveEvent>();
    @Output('onCancel') onCancel = new EventEmitter<void>();
    @Input('editMode') editMode: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private glAccountService: GlAccountService,
        private currencyService: CurrencyService,
        protected location: Location,
        private route: ActivatedRoute,
        private router: Router,
        protected approvalFlowService: ApprovalflowService,
        private tellerService: TellerService,
        private bankService: BankService) {
        super(location, approvalFlowService);
    }

    ngOnInit() {
        this.showVerifierSelectionModal = of(false);
        this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
            if (queryParams['taskId']) {
                this.taskId = queryParams['taskId'];
            }
            if (queryParams['commandReference']) {
                this.commandReference = queryParams['commandReference'];
            }
        });

        this.fetchGlAccounts();
        this.fetchCurrencies();
        this.fetchTellers();
        this.fetchBranches();

    }
    addCurrencyLimit() {
        let currencySlab = new TellerLimit();
        this.tellerLimits = [...this.tellerLimits, currencySlab];
    }
    prepareTellerForm(formData: Teller) {
        (formData == null) ? formData = initialTellerFormData : formData;
        this.id = formData.id;
        this.tellerForm = this.formBuilder.group({
            code: [formData.code, [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
            title: [formData.title, [Validators.required, Validators.minLength(1), Validators.maxLength(32)]],
            glId: [formData.glId, [Validators.required]],
            branchId: [formData.branchId, [Validators.required]],
            tellerType: [formData.tellerType, [Validators.required]],
            currencyRestriction: [formData.currencyRestriction, [Validators.required]],
            allowedGlTransaction: [formData.allowedGlTransaction],
            allowedClientTransaction: [formData.allowedClientTransaction],
            denominationRequired: [formData.denominationRequired],
            forceLimit: [formData.forceLimit],
            tellerStatus: [formData.tellerStatus]
        });

        if (!formData.id && !this.taskId) {
            this.addCurrencyLimit();
        }
        else {
            this.tellerLimits = formData.tellerLimits;
            this.fetchGLDetail(formData.glId);
        }
        // if (formData.currencyRestriction === "LOCAL_CURRENCY"){
        //     this.tellerLimitEditable = false;
        // }
        // if (formData.currencyRestriction === "MULTIPLE_CURRENCY"){
        //     this.tellerLimitEditable = true;
        // }


        if (this.tellerForm.get("currencyRestriction").value) {
            let currency_restriction = this.tellerForm.get("currencyRestriction").value;
            if (currency_restriction === "LOCAL_CURRENCY") {
                this.tellerLimits[0].currencyCode = "BDT";
                this.multipleCurrencyLimit = false;
                this.tellerLimitEditable = false;
            }
            if (currency_restriction === "MULTIPLE_CURRENCY") {
                this.multipleCurrencyLimit = true;
                this.tellerLimitEditable = true;
            }

            if ((this.tellerForm.get('glId').value) && (this.tellerForm.get("currencyRestriction").value)) {
                let glCurrencyRestriction = this.selectedGLAccount.currencyRestriction;
                console.log(glCurrencyRestriction, this.tellerForm.get('currencyRestriction').value, this.tellerForm.controls['glId'].value);
                if ((this.tellerForm.get('currencyRestriction').value) !== glCurrencyRestriction) {
                    this.tellerForm.get('currencyRestriction').setErrors({ 'currencyMismatch': true });
                }
            }
            if (this.tellerForm.get("currencyRestriction").value !== this.oldCurrencyRestriction) {
                if (this.tellerForm.get("currencyRestriction").value === "LOCAL_CURRENCY" && this.tellerLimits.length > 1) {
                    let deleteIndexes = this.tellerLimits.length - 1;
                    this.tellerLimits.splice(1, deleteIndexes);
                    this.tellerLimits = [...this.tellerLimits];
                }
            }
        }






        this.tellerForm.get("currencyRestriction").valueChanges.subscribe(
            val => {
                let currency_restriction = this.tellerForm.get("currencyRestriction").value;
                if (currency_restriction === "LOCAL_CURRENCY") {
                    this.tellerLimits[0].currencyCode = "BDT";
                    this.multipleCurrencyLimit = false;
                    this.tellerLimitEditable = false;
                }
                if (currency_restriction === "MULTIPLE_CURRENCY") {
                    this.multipleCurrencyLimit = true;
                    this.tellerLimitEditable = true;
                }

                if ((this.tellerForm.get('glId').value) && (this.tellerForm.get("currencyRestriction").value)) {
                    let glCurrencyRestriction = this.selectedGLAccount.currencyRestriction;
                    console.log(glCurrencyRestriction, this.tellerForm.get('currencyRestriction').value, this.tellerForm.controls['glId'].value);
                    if ((this.tellerForm.get('currencyRestriction').value) !== glCurrencyRestriction) {
                        this.tellerForm.get('currencyRestriction').setErrors({ 'currencyMismatch': true });
                    }
                    else {
                        this.tellerForm.get('glId').setErrors({ 'currencyMismatch': false });

                    }
                }
                if (this.tellerForm.get("currencyRestriction").value !== this.oldCurrencyRestriction) {
                    if (this.tellerForm.get("currencyRestriction").value === "LOCAL_CURRENCY" && this.tellerLimits.length > 1) {
                        let deleteIndexes = this.tellerLimits.length - 1;
                        this.tellerLimits.splice(1, deleteIndexes);
                        this.tellerLimits = [...this.tellerLimits];
                    }
                }
            });

        this.tellerForm.get('code').valueChanges.subscribe(
            val => {
                if (this.tellerForm.get('code').value) {
                    this.tellers.forEach(element => {
                        if (element.code === this.tellerForm.get('code').value) {
                            setTimeout(() => this.tellerForm.controls['code'].setErrors({ 'unique': true }));
                        }
                    });
                }
            });

        this.tellerForm.get('glId').valueChanges.subscribe(
            val => {
                if ((this.tellerForm.get('glId').value)) {
                    let glCurrencyRestriction = this.selectedGLAccount.currencyRestriction;
                    let tellerCurrencyRestriction = this.tellerForm.get('currencyRestriction').value;
                    if (tellerCurrencyRestriction !== glCurrencyRestriction) {
                        this.tellerForm.get('glId').setErrors({ 'currencyMismatch': true });
                    }
                }
            });
    }
    tellerLimitEditable: boolean = true;
    initTellerLimitForm() {
        this.tellerLimitForm = this.formBuilder.group({
            tellerLimitList: this.formBuilder.array(
                this.tellerLimits.map(tellerLimit => this.formBuilder.group({
                    currencyCode: [tellerLimit.currencyCode, [Validators.required]],
                    cashReceiveLimit: [tellerLimit.cashReceiveLimit, [Validators.required]],
                    cashWithdrawLimit: [tellerLimit.cashWithdrawLimit, [Validators.required]],
                    balanceLimit: [tellerLimit.balanceLimit, [Validators.required]]
                }))
            )
        });
    }

    submit() {
        this.markFormGroupAsTouched(this.tellerForm);
        if (this.formsInvalid()) {
            return;
        }

        else {
            if (!this.taskId) {
                this.showVerifierSelectionModal = of(true);
            } else {
                this.emitSaveEvent({ verifier: null, approvalFlowRequired: null }, this.taskId);
            }
        }
    }

    onVerifierSelect(selectEvent: VerifierSelectionEvent) {
        this.emitSaveEvent(selectEvent, null);
    }

    emitSaveEvent(selectEvent: VerifierSelectionEvent, taskid: string) {
        let teller = this.tellerForm.value;
        teller.id = this.teller.id;
        teller.tellerLimits = this.tellerLimits;
        this.onSave.emit({
            tellerForm: teller,
            verifier: selectEvent.verifier,
            taskId: this.taskId,
            approvalFlowRequired: selectEvent.approvalFlowRequired
        });
    }

    fetchGLDetail(glId: number) {
        this.glAccountService.fetchGlAccountDetails({ id: glId }).subscribe(
            GLDetail => {
                this.selectedGLAccount = GLDetail;
            }
        );
    }
    searchGlAccount(mode: string) {
        this.glAccountLookUpMode = mode;
        this.glAccountLookUpDisplay = true;
    }

    onSearchResult(event) {
        this.selectedGLAccount = event.data;
        this.tellerForm.controls['glId'].setValue(this.selectedGLAccount.id);
        this.formNameGl = this.selectedGLAccount.name + " " + "(" + this.selectedGLAccount.code + ")";

    }

    onSearchModalClose(event) {
        this.glAccountLookUpMode = 'GL_ACCOUNT';
        this.glAccountLookUpDisplay = false;
    }

    removeSelectedGL() {
        this.selectedGLAccount = null;
        this.selectedGLAccount = new GlAccount();
    }
    onChange(event) {
        this.selectedCurrency = event.value;
    }

    isAllowedGlTransaction(value) {
        if (value) {
            this.allowedGlTransaction = true;
        } else {
            this.allowedGlTransaction = false;
        }
    }
    isAllowedClientTransaction(value) {
        if (value) {
            this.allowedClientTransaction = true;
        } else {
            this.allowedClientTransaction = false;
        }
    }
    isDenominationRequired(value) {
        if (value) {
            this.denominationRequired = true;
        } else {
            this.denominationRequired = false;
        }
    }

    canForceLimit(value) {
        if (value) {
            this.forceLimit = true;
        } else {
            this.forceLimit = false;
        }
    }
    fetchGlAccounts() {
        let urlSearchParam = new Map([['roots', 'false'], ["aspage", "false"]]);
        this.glAccountService.fetchGlAccounts(urlSearchParam).subscribe(glAccounts => this.glAccounts = glAccounts);
    }
    fetchTellers() {
        this.urlSearchParam = new Map([['all', 'true']]);
        this.subscription = this.tellerService.fetchTellers(this.urlSearchParam).subscribe(
            profiles => {
                this.tellers = profiles.content;
            }
        );
    }

    private fetchCurrencies() {
        this.subscribers.fetchCurr = this.currencyService.fetchCurrencies(new Map())
            .subscribe(data => {
                this.currencies = data.content;

                for (let currency of this.currencies) {
                    this.currencyMap.set(currency.code, currency.name);
                }
            });
    }

    fetchBranches() {
        this.bankService.fetchOwnBranches(new Map()).subscribe(
            data => {
                this.branches = data.content;
            });
    }


    formsInvalid(): boolean {
        return this.tellerForm.invalid || this.tellerLimits.length < 1 || this.errorSet.size > 0;
    }
    cancel(): void {
        this.onCancel.emit();
    }
    onDeleteRow() {
        let deleteIndex = this.tellerLimits.length - 1;
        this.tellerLimits.splice(deleteIndex, 1);
        this.tellerLimits = [...this.tellerLimits];
    }
    errorSet = new Set([]);

    onEditValidation(data: any, index: number) {
        console.log(data);
        let isGraterThanOrEqualZero = true;
        // Object.keys(rowData).forEach(key => {
        //     if (key != 'id' && (rowData[key] == null || rowData[key] < 0 || rowData[key] == "")) {
        //         isGraterThanOrEqualZero = false;
        //         console.log(isGraterThanOrEqualZero);
        //         if (!this.errorSet.has(index)) {
        //             this.errorSet.add(index);
        //             console.log(this.errorSet);
        //         }
        //     }
        // });
        if (data == null || data < 0 || data == "") {
            isGraterThanOrEqualZero = false;
            if (!this.errorSet.has(index)) {
                this.errorSet.add(index);
                console.log(this.errorSet);
            }

        }
        if (isGraterThanOrEqualZero && this.errorSet.has(index)) {
            this.errorSet.delete(index);
        }

    }

}