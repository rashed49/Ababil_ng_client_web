import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SelectItem } from 'primeng/api';
import { MenuItem, TreeNode } from 'primeng/primeng';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { NotificationService } from '../../../common/notification/notification.service';
import { ApprovalflowService } from './../../../services/approvalflow/service-api/approval.flow.service';
import { BaseComponent } from '../../../common/components/base.component';
import { FormBaseComponent } from './../../../common/components/base.form.component';
import { GlAccount } from '../../../services/glaccount/domain/gl.account.model';
import { GlAccountService } from '../../../services/glaccount/service-api/gl.account.service';
import { GeneralLedgerAccountProfitRate } from '../../../services/glaccount/domain/gl.account.model';
import { GLAccountProfitRateMerged } from '../../../services/glaccount/domain/gl.account.model';
import { VerifierSelectionEvent } from './../../../common/components/verifier-selection/verifier.selection.component';
import { GlProfitRateFormComponent } from './form/gl.profit.rate.form.component';
@Component({
  templateUrl: './gl.profit.rate.configuration.html',

})


export class GlProfitRateConfigurationComponent extends FormBaseComponent implements OnInit {

  queryParams: any;
  urlSearchParams: Map<string, string>;
  generalLedgerAccountId: number;
  profitRates: GeneralLedgerAccountProfitRate[];
  profitRateMergedFull: GLAccountProfitRateMerged[] = [];
  profitRateMergedTotal: GLAccountProfitRateMerged[];
  len: number;
  totalRecords: number;
  totalPages: number;
  verifierSelectionModalVisible: boolean = true;
  interBranchGlAccounts: GlAccount[] = [];
  display = false;
  incomeGlName: string;
  expenseGlName: string;
  incomeGeneralLedgerAccount: GlAccount[] = [];
  expenseGeneralLedgerAccount: GlAccount[] = [];
  interbranchGeneralLedgerAccount: GlAccount[] = [];
  incomeGlAccounts: Map<number, string> = new Map();
  expenseGlAccounts: Map<number, string> = new Map();
  isSlabApplicable: boolean;
  productProfitRateSlabs = [];
  generalLedgerAccountProfitRateId: number;
  today: Date;
  constructor(
    protected location: Location,
    private route: ActivatedRoute,
    private glAcountService: GlAccountService, private router: Router,
    protected approvalFlowService: ApprovalflowService) {
    super(location, approvalFlowService);
  }
  @ViewChild('form') form: any;

  ngOnInit() {
    this.fetchIncomeGeneralLedgerAccount();
    this.fetchExpenseGeneralLedgerAccount();
    this.fetchInterbranchGeneralLedgerAccount();
    this.today = new Date();
  }


  fetchIncomeGeneralLedgerAccount() {
    let incomeUrlSearchParam: Map<string, string> = new Map();
    incomeUrlSearchParam.set("leaf-type", "NODE");
    incomeUrlSearchParam.set("account-nature", "INCOME");
    this.subscribers.fetchIncomeGeneralLedgerSub = this.glAcountService
      .fetchGeneralLedgerAccountsWithType(incomeUrlSearchParam)
      .subscribe(data => {
        this.incomeGeneralLedgerAccount = [...data]
        this.incomeGeneralLedgerAccount.map(account =>
          this.incomeGlAccounts.set(account.id, account.name)
        )
      }
      );
  }

  fetchExpenseGeneralLedgerAccount() {
    let expenseUrlSearchParam: Map<string, string> = new Map();
    expenseUrlSearchParam.set("leaf-type", "NODE");
    expenseUrlSearchParam.set("account-nature", "EXPENDITURE");
    this.subscribers.fetchExpenseGeneralLedgerSub = this.glAcountService
      .fetchGeneralLedgerAccountsWithType(expenseUrlSearchParam)
      .subscribe(data => {
        this.expenseGeneralLedgerAccount = [...data]
        this.expenseGeneralLedgerAccount.map(eaccount =>
          this.expenseGlAccounts.set(eaccount.id, eaccount.name)
        )
      }
      );
  }
  fetchProfitRates(searchMap: Map<string, any>) {
    if (searchMap == null) searchMap = new Map();
    this.fetchGlAccountDetails();

    this.subscribers.fetchSubs = this.glAcountService.fetchProfitRates({ 'generalLedgerAccountId': this.generalLedgerAccountId + '' }, searchMap).subscribe(
      data => {
        this.profitRates = data.content;
        this.totalRecords = (data.pageSize * data.pageCount);
        this.totalPages = data.pageCount;
        this.len = this.profitRates.length;
        this.profitRateMergedTotal = [...this.profitRateMergedFull];
      }
    );
  }

  loadProfitRateLazy(event: LazyLoadEvent) {
    const searchMap = this.getSearchMap();
    searchMap.set('page', (event.first / 20));
    this.fetchProfitRates(searchMap);
  }

  fetchGlAccountDetails() {
    this.subscribers.fetchGlAccountDetailsSub = this.glAcountService
      .fetchGlAccountDetails({ id: this.generalLedgerAccountId })
      .subscribe();
  }
  fetchInterbranchGeneralLedgerAccount() {
    let interbranchUrlSearchParam: Map<string, string> = new Map();
    interbranchUrlSearchParam.set("subtype", "INTER_BRANCH");
    interbranchUrlSearchParam.set("roots", "false");
    this.subscribers.fetchIncomeGeneralLedgerSub = this.glAcountService
      .fetchGeneralLedgerAccountsWithType(interbranchUrlSearchParam)
      .subscribe(data => this.interBranchGlAccounts = [...data]);
  }

  isPast(data) {
    if (new Date(data) < new Date()) {
      return false;
    }
    else return true;
  }


  getSearchMap(): Map<string, any> {
    const searchMap = new Map();
    return searchMap;
  }

  createProfitRate() {
    this.display = true;
    this.generalLedgerAccountProfitRateId = null;
  }

  save() {
    this.form.save();
    if (this.form.formInvalid()) {
      this.display = true;
    } 
  }

  onProfitRateSaved(event){
    this.display = false;
    this.form.profitRateForm.reset();
  } 

  dialogcancel() {
    this.form.profitRateForm.reset();
    this.display = false;
  }

  edit(profitRateId) {
    this.generalLedgerAccountProfitRateId = profitRateId;
    this.display = true;
  }


  cancel() {
    this.navigateAway();
  }

  navigateAway() {
    this.router.navigate(['glaccount']);
  }

}