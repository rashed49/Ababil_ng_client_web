import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { ApprovalflowService } from './../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from './../../../common/components/base.form.component';
import { GlAccountService } from '../../../services/glaccount/service-api/gl.account.service';
import { SubLedger } from '../../../services/glaccount/domain/sub.ledger.model';
@Component({
  templateUrl: './sub.ledger.component.html',

})


export class GlSubLedgerComponent extends FormBaseComponent implements OnInit, OnDestroy {

  queryParams: any;

  generalLedgerAccountId: number;
  glAccountLookUpDisplay: boolean = false;
  glAccountLookUpMode: string = 'GL_ACCOUNT';
  generalLedgerAccountName: string;
  generalLedgerAccountCode: string;

  subLedgers: SubLedger[];
  totalRecords: number;
  totalPages: number;
  verifierSelectionModalVisible: boolean = true;
  display = false;
  urlSearchMap: Map<string, any> = new Map();

  today: Date;
  constructor(
    protected location: Location,
    private route: ActivatedRoute,
    private glAccountService: GlAccountService, private router: Router,
    protected approvalFlowService: ApprovalflowService) {
    super(location, approvalFlowService);
  }
  @ViewChild('form') form: any;

  ngOnInit() {
    this.today = new Date();

    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
      this.generalLedgerAccountId = params['generalLedgerAccountId'];
      this.taskId = params['taskId'];

      if (this.taskId && this.generalLedgerAccountId) {
        this.taskId = params['taskId'];
        this.display = true;
        this.fetchGlAccountDetails();
      }
      
      this.commandReference = params['commandReference'];

      if (this.generalLedgerAccountId) {
        this.fetchGlAccountDetails();
      }
    });

  }

  fetchSubLedgers(urlSearchMap: Map<string, any>) {
    urlSearchMap.set('generalLedgerAccountId', this.generalLedgerAccountId + "")
    this.subscribers.fetchSubs = this.glAccountService.fetchSubGls(urlSearchMap).subscribe(
      profiles => {
        this.subLedgers = profiles.content;
        this.totalRecords = (profiles.pageSize * profiles.pageCount);
        this.totalPages = profiles.pageCount;
      }

    );
  }


  loadSubLedgerLazy(event: LazyLoadEvent) {
    this.urlSearchMap.set('page', (event.first / 20));

    if (this.generalLedgerAccountId) {
      this.fetchSubLedgers(this.urlSearchMap);
    }

  }

  fetchGlAccountDetails() {
    this.subscribers.fetchGlAccountDetailsSub = this.glAccountService
      .fetchGlAccountDetails({ 'id': this.generalLedgerAccountId })
      .subscribe(data => {
        this.generalLedgerAccountName = data.name;
        this.generalLedgerAccountId = data.id;
        this.generalLedgerAccountCode = data.code;

        if (!this.taskId) {
          this.fetchSubLedgers(this.urlSearchMap);
        }


      });
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

  createSubLedger() {
    this.display = true;
  }

  save() {
    this.form.submit();
    if (this.form.formInvalid()) {
      this.display = true;
    }

    this.display = false;
    this.fetchSubLedgers(this.urlSearchMap);
  }

  onProfitRateSaved(event) {
    this.display = false;
    this.form.subLedgerForm.reset();
  }

  dialogcancel() {
    this.form.subLedgerForm.reset();
    this.display = false;
  }


  cancel() {
    this.navigateAway();
  }

  navigateAway() {
    this.router.navigate(['glaccount']);
  }

  onRowSelect(event) {
    this.router.navigate(['details', event.data.id], { relativeTo: this.route });
  }


  searchGlAccount() {
    this.glAccountLookUpDisplay = true;
  }
  onSearchModalClose(event) {
    this.glAccountLookUpDisplay = false;
  }

  onSearchResult(event) {
    let gl = event.data;
    this.generalLedgerAccountId = gl.id;
    this.generalLedgerAccountName = gl.name;
    this.generalLedgerAccountCode = gl.code

    this.fetchSubLedgers(this.urlSearchMap);

  }
  onSubGlSearchResult(event) {
    let gl = event;
    this.generalLedgerAccountId = gl.id;
    this.generalLedgerAccountName = gl.name;
    this.generalLedgerAccountCode = gl.code

  }


}