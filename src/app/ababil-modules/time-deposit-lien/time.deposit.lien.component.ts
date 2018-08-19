import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { DataTable } from "primeng/datatable";
import { Router, ActivatedRoute } from "@angular/router";
import { NgSsoService } from "../../services/security/ngoauth/ngsso.service";
import { Account } from "../../services/account/domain/account.model";
import { BaseComponent } from "../../common/components/base.component";
import { TimeDepositLienService } from "../../services/time-deposit-lien/service-api/time.deposit.lien.service";
import { TimeDepositLien } from "../../services/time-deposit-lien/domain/time.deposit.lien.model";
import { ReferenceType } from "../../services/time-deposit-lien-reference-type/domain/time.deposit.lien.reference.type.model";
import { TimeDepositLienReferenceTypeService } from "../../services/time-deposit-lien-reference-type/service-api/time.deposit.lien.reference.type.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Customer } from "../../services/cis/domain/customer.model";
import { AccountService } from "../../services/account/service-api/account.service";
import { NotificationService } from "../../common/notification/notification.service";
import { LazyLoadEvent } from "primeng/components/common/lazyloadevent";

@Component({
    selector: 'lien-dashboard',
    templateUrl: './time.deposit.lien.component.html'
})
export class TimeDepositLienComponent extends BaseComponent implements OnInit {
    timeDepositLienSearchForm: FormGroup;
    timeDepositLien: TimeDepositLien = new TimeDepositLien();
    referenceType: ReferenceType = new ReferenceType()
    referenceTypeMap: Map<number, string> = new Map();
    accountDetail: Account = new Account();
    urlSearchMap: Map<string, any> = new Map();
    urlSearchParams: Map<string, string>;
    timeDepositLiens: TimeDepositLien[] = [];
    referenceTypes: any[] = [];
    userName$: String;
    userActiveBranch$: number;
    accountId: number;
    userHomeBranch$: number;
    referenceTypeId: number;
    selectedLien: TimeDepositLien;
    accountNumber: number;
    totalRecords: number;
    totalPages: number;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private ngSsoService: NgSsoService,
        private timeDepositLienService: TimeDepositLienService,
        private notificationService: NotificationService,
        private timeDepositLienReferenceTypeService: TimeDepositLienReferenceTypeService,
        private formBuilder: FormBuilder,
        private accountService: AccountService) {
        super();

    }
    ngOnInit(): void {
        this.ngSsoService.account().subscribe(account => {
            //this.userName$ = account.username;
            // this.userHomeBranch$ = account.homeBranch;
            this.userActiveBranch$ = account.activeBranch;
            this.fatchTimeDepositLienList(new Map());

        });

        this.fetchReferenceTypes();
        this.prepareTimeDepositLienSearchForm();

    }
    createImpose() {
        this.router.navigate(['lien-impose'], { relativeTo: this.route });
    }

    fatchTimeDepositLienList(urlQueryParamMap) {
        //let urlQueryParamMap = new Map();
        urlQueryParamMap.set("branchId", this.userActiveBranch$);
        this.subscribers.timeDepositLienSub = this.timeDepositLienService.fetchTimeDepositLienList(urlQueryParamMap)
            .subscribe(data => {
                this.timeDepositLiens = data.content;
                this.timeDepositLiens.map(lien => lien.referenceTypeId)
                    .map(referenceTypeId => {
                        this.fetchReferencetype(referenceTypeId);
                    });
            });
    }

    loadInlandRemittanceLotLazily(event: LazyLoadEvent) {
        if (event.first != 0) {
            if (this.urlSearchMap == null) {
                this.urlSearchMap = new Map();
            }
            this.urlSearchMap.set("page", (event.first / 20));
            this.fatchTimeDepositLienList(this.urlSearchMap);
        }
    }
    fetchReferencetype(referenceTypeId) {
        this.subscribers.referenceTypeSub = this.timeDepositLienReferenceTypeService.fetchReferencetype({ referenceTypeId: referenceTypeId })
            .subscribe(data => {
                this.referenceType = data;
                this.referenceTypeMap.set(this.referenceType.id, this.referenceType.referenceType);
            })
    }
    navigateToTimeDepositLienDetail() {
        this.router.navigate(['detail', this.selectedLien.id], { relativeTo: this.route });
    }

    prepareTimeDepositLienSearchForm() {
        this.timeDepositLienSearchForm = this.formBuilder.group({
            referenceNumber: [null],
            referenceTypeId: [null],
            customerId: [null],
            accountId: [null]
        });
    }
    searchAccountByAccountNumber(accountNumber) {
        this.urlSearchParams = new Map([['accountNumber', accountNumber]]);
        this.subscribers.searchAccountSub = this.accountService
            .fetchAccounts(this.urlSearchParams)
            .subscribe(data => {
                this.accountDetail = data.content[0];
                if (this.accountDetail && this.accountDetail.id) {
                    this.accountId = this.accountDetail.id;
                } else {
                    this.notificationService.sendErrorMsg("invalid.account.number");
                }
            });
    }
    fetchReferenceTypes() {
        this.timeDepositLienReferenceTypeService.fetchReferenceTypes()
            .subscribe(data => {
                this.referenceTypes = [{ label: 'Choose Reference Type', value: null }].concat(data.map(element => {
                    return { label: element.referenceType, value: element.id }
                }));
            });
    }
    timeDepositLiensearch(searchMap: Map<string, any>) {
        let urlQueryParamMap = new Map();
        if (this.timeDepositLienSearchForm.get('referenceNumber').value || this.timeDepositLienSearchForm.get('referenceTypeId').value || this.timeDepositLienSearchForm.get('customerId').value || this.accountId) {
            urlQueryParamMap.set("branchId", this.userActiveBranch$);
            urlQueryParamMap.set("accountId", this.accountId);
            urlQueryParamMap.set("customerId", this.timeDepositLienSearchForm.get('customerId').value);
            urlQueryParamMap.set("referenceNumber", this.timeDepositLienSearchForm.get('referenceNumber').value);
            urlQueryParamMap.set("referenceTypeId", this.timeDepositLienSearchForm.get('referenceTypeId').value);
            this.subscribers.timeDepositLienSub = this.timeDepositLienService.fetchTimeDepositLienList(urlQueryParamMap)
                .subscribe(data => {
                    this.timeDepositLiens = data.content;
                });
        } else {
            this.fatchTimeDepositLienList(new Map());
        }

    }
    refreash(dt: DataTable) {
        dt.reset();
        this.fatchTimeDepositLienList(new Map());
    }
    back() {
        this.router.navigate(['../'], { relativeTo: this.route });
    }

}