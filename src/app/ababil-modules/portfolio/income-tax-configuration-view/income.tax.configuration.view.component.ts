import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from './../../../common/components/base.component';
import { IncomeTaxConfigurationService } from '../../../services/income-tax/service-api/income.tax.service';
import { SpecialTaxRate, TaxWaiverRule, TaxSlabConfiguration } from '../../../services/income-tax/domain/income.tax.model';
import { NotificationService } from '../../../common/notification/notification.service';
import { FormGroup, FormBuilder, Validators } from '../../../../../node_modules/@angular/forms';
import { ConfirmationService, LazyLoadEvent } from "primeng/api";
import { AccountService } from '../../../services/account/service-api/account.service';
import { Account } from '../../../services/account/domain/account.model';
import { map } from 'rxjs/operators';
@Component({
    selector: 'income-tax-configuration-view',
    templateUrl: './income.tax.configuration.view.component.html'
})
export class IncomeTaxConfigurationViewComponent extends BaseComponent implements OnInit {

    specialTaxRateList: SpecialTaxRate[] = [];
    waiverRuleDataTable: TaxWaiverRule[] = [];
    slabs: TaxSlabConfiguration[] = [];
    specialTaxRateForm: FormGroup;
    accountNumberLength = 13;
    accountNumber: string = '';
    totalRecords: number;
    totalPages: number;
    demandDepositAccountId: number;
    customerId: number;
    demandDepositDisplay: boolean = false;
    fixedDepositAccountId: number;
    fixedDepositDisplay: boolean = false;
    recurringDepositAccountId: number;
    recurringDepositdisplay: boolean = false;
    showAccountDetailsButton: boolean = false;
    accountDetail: Account = new Account();
    selectedAccountNumber: string;
    searchedAccountNumber: string;
    urlSearchMap: Map<string, any>;
    @ViewChild('op1') form: any;
    @ViewChild('op2') searchPanel: any;

    constructor(private route: ActivatedRoute, private renderer: Renderer2, private router: Router, private formBuilder: FormBuilder, private notificationService: NotificationService, private incomeTaxConfigurationService: IncomeTaxConfigurationService, private confirmationService: ConfirmationService, private accountService: AccountService) {
        super();
        this.renderer.listen('window', 'scroll', (evt) => {
            this.searchPanel.hide();
            this.form.hide();
        });
    }


    ngOnInit() {
        this.fetchIncomeTaxSlabs();
        this.fetchWaiverRules();
        this.fetchSpecialTaxRates(null);
        this.prepareSpecialTaxRate(new SpecialTaxRate());
    }

    prepareSpecialTaxRate(formData: SpecialTaxRate) {
        formData = (formData == null ? new SpecialTaxRate : formData);
        this.specialTaxRateForm = this.formBuilder.group({
            accountId: [formData.accountId, [Validators.required]],
            taxRate: [formData.taxRate, [Validators.required, Validators.max(100)]]
        });

    }

    fetchIncomeTaxSlabs() {
        this.subscribers.fetchSlabsSub = this.incomeTaxConfigurationService.fetchTaxSlabConfigurations().subscribe(
            data => {
                this.slabs = data.content;
            }
        )
    }
    fetchWaiverRules() {
        this.subscribers.fetchWaiverRulesSub = this.incomeTaxConfigurationService.fetchTaxWaiverRules().subscribe(
            data => {
                this.waiverRuleDataTable = data.content;
            }
        )
    }
    fetchSpecialTaxRates(urlSearchMap) {
        if (urlSearchMap === null) {
            urlSearchMap = new Map();
        }
        this.subscribers.fetchSpecialTaxRatesSub = this.incomeTaxConfigurationService.fetchSpecialTaxRate(urlSearchMap).subscribe(
            data => {
                this.specialTaxRateList = data.content;
                this.totalRecords = (data.pageSize * data.pageCount);
                this.totalPages = data.pageCount;
            }
        )
    }

    addSpecialTaxRate() {

        this.markFormGroupAsTouched(this.specialTaxRateForm);
        if (this.formInvalid()) { return };
        let specialTaxRate = this.specialTaxRateForm.value;
        this.subscribers.addSpecialTaxRateSub = this.incomeTaxConfigurationService.createSpecialTaxRate(specialTaxRate).subscribe(
            data => {
                this.notificationService.sendSuccessMsg("tax.specialTaxRate.save.success");
                this.fetchSpecialTaxRates(null);
                this.accountNumber = '';
                this.specialTaxRateForm.reset();
            }
        )
    }

    onPressDeleteButton(specialTaxRate: SpecialTaxRate) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this?',
            accept: () => this.deleteSpecialTaxRate(specialTaxRate.id)
        });
    }
    deleteSpecialTaxRate(specialTaxRateId) {
        this.subscribers.deleteSpecialTaxRateSub = this.incomeTaxConfigurationService.deleteSpecialTaxRate({ specialTaxRateId: specialTaxRateId }).subscribe(
            data => {
                this.notificationService.sendSuccessMsg("tax.specialTaxRate.delete.success");
                this.fetchSpecialTaxRates(null);
            });
    }

    fetchAccountDetail() {
        if (this.accountNumber) {
            let accountQueryParams = new Map<string, string>().set('accountNumber', this.accountNumber);
            this.subscribers.fetchAccountDetailSub = this.accountService.fetchAccounts(accountQueryParams).subscribe(
                account => {
                    if (account.content.length == 1) {
                        this.accountDetail = account.content[0];
                        this.specialTaxRateForm.get('accountId').setValue(this.accountDetail.id);
                        this.specialTaxRateForm.get('accountId').markAsTouched();
                        this.specialTaxRateForm.updateValueAndValidity();
                        this.showAccountDetailsButton = true;

                    } else {
                        this.showAccountDetailsButton = false;
                        this.notificationService.sendErrorMsg('no.account.found.error');
                    }
                }
            )
        }
    }


    showAccountDetails() {
        if (this.accountDetail.type) {
            if (this.accountDetail.type == "DEMAND_DEPOSIT") {
                this.demandDepositAccountId = this.accountDetail.id;
                this.customerId = this.accountDetail.customerId;
                if (this.demandDepositAccountId) {
                    this.demandDepositDisplay = true;
                }
            }

            else if (this.accountDetail.type == "FIXED_DEPOSIT") {
                this.fixedDepositAccountId = this.accountDetail.id;
                if (this.fixedDepositAccountId) {
                    this.fixedDepositDisplay = true;
                }
            }

            else if (this.accountDetail.type == "RECURRING_DEPOSIT") {
                this.recurringDepositAccountId = this.accountDetail.id;
                if (this.recurringDepositAccountId) {
                    this.recurringDepositdisplay = true;
                }
            }
        }
    }

    formInvalid() {
        return this.specialTaxRateForm.invalid;
    }

    loadSpecialTaxRateLazy(event: LazyLoadEvent) {
        let urlSearchMap = new Map();
        urlSearchMap.set("page", (event.first / 20));
        this.fetchSpecialTaxRates(urlSearchMap);
    }


    search(searchMap: Map<string, any>) {
        let urlSearchMap = new Map<string, any>();


        urlSearchMap.set("accountNumber", this.accountNumber);
        this.accountService.fetchAccounts(urlSearchMap).pipe(map(data =>

            this.incomeTaxConfigurationService.fetchSpecialTaxRate(new Map().set('accountId', data.content[0].id)).subscribe(
                data => {
                    this.specialTaxRateList = data.content;
                    this.totalRecords = (data.pageSize * data.pageCount);
                    this.totalPages = data.pageCount;
                })
        )).subscribe();

    }

    refresh() {
        this.specialTaxRateForm.reset();
        this.fetchSpecialTaxRates(null);
    }

}