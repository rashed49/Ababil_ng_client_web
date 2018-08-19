import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChequeBook, Cheque } from '../../../../../../../services/cheque/domain/cheque.models';

import { ChequeService } from '../../../../../../../services/cheque/service-api/cheque.service';
import { Observable, of } from 'rxjs';
import { Subscriber } from 'rxjs';
import { PathParameters } from '../../../../../../../services/base.service';
import { NotificationService, NotificationType } from '../../../../../../../common/notification/notification.service';
import { BaseComponent } from '../../../../../../../common/components/base.component';
import { VerifierSelectionEvent } from '../../../../../../../common/components/verifier-selection/verifier.selection.component';
import * as commandConstants from '../../../../../../../common/constants/app.command.constants';
import * as urlSearchParameterConstants from '../../../../../../../common/constants/app.search.parameter.constants';
import { Location } from '@angular/common';
import { DemandDepositAccount } from '../../../../../../../services/demand-deposit-account/domain/demand.deposit.account.models';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
  selector: 'app-cheque-detail',
  templateUrl: './cheque.detail.component.html',
  styleUrls: ['./cheque.detail.component.scss']
})
export class ChequeDetailComponent extends BaseComponent implements OnInit, OnDestroy {

  private selectedChequeBookId: number;
  private selectedAccountId: number;
  chequeBook: ChequeBook = { accountId: null, chequePrefix: null, startLeafNumber: null, endLeafNumber: null, chequeBookStatus: null };
  cheques: Cheque[];
  demandDepositAccount: DemandDepositAccount = new DemandDepositAccount();
  command: string;
  queryParams: any = {};
  totalRecords: number;
  totalPages: number;
  chequePrefixPresent: boolean = true;
  urlSearchMap: Map<string, any> = new Map();

  verifierSelectionModalVisible: Observable<boolean>;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private chequeService: ChequeService,
    private location: Location,
    private notificationService: NotificationService) {
    super();
  }

  ngOnInit(): void {
    this.command = commandConstants.CHEQUE_BOOK_CORRECTION_COMMAND;
    this.verifierSelectionModalVisible = of(false);

    this.subscribers.routeSub = this.route.params.subscribe(params => {
      this.selectedChequeBookId = +params['bookId'];
      this.selectedAccountId = +params['id'];
      this.fetchChequeBookById();
      this.fetchChequeByBookId(this.urlSearchMap);
      this.fetchAccountDetailsByAccountId();
    });

    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
    });
  }

  fetchChequeBookById() {
    this.subscribers.chequeBookSub = this.chequeService
      .fetchChequeBookByBookId({ 'chequeBookId': this.selectedChequeBookId + '', 'accountId': this.selectedAccountId + '' })
      .subscribe(data => {
        this.chequeBook = data;//should not be paged result
      });
  }

  fetchChequeByBookId(urlSearchMap: Map<string, any>) {
    this.subscribers.chequehSub = this.chequeService
      .fetchChequeByBookId({ 'chequeBookId': this.selectedChequeBookId + '', 'accountId': this.selectedAccountId + '' }, urlSearchMap)
      .subscribe(data => {
        this.cheques = data.content;
        if (this.cheques.length < 1) return;
        this.chequePrefixPresent = (this.cheques[0].chequePrefix != null);
        this.totalRecords = (data.pageSize * data.pageCount);
        this.totalPages = data.pageCount;
      });
  }

  loadChequesLazily(event: LazyLoadEvent) {
    this.urlSearchMap.set("page", (event.first / 20));
    this.fetchChequeByBookId(this.urlSearchMap);
  }

  fetchAccountDetailsByAccountId() {
    this.subscribers.depositAccountSub = this.chequeService
      .fetchAccountDetailsByAccountId({ 'id': this.selectedAccountId + '' })
      .subscribe(data => this.demandDepositAccount = data);
  }

  correctChequeBookbyBookId(urlSearchMap) {
    this.subscribers.chequeSub = this.chequeService
      .correctChequeBookbyBookId({ 'chequeBookId': this.selectedChequeBookId + "", 'accountId': this.selectedAccountId + "" }, urlSearchMap)
      .subscribe(data => {
        this.notificationService.sendSuccessMsg('Cheque Book Corrected');
        this.navigateAway();
      });
  }

  cancel() {
    this.navigateAway();
  }

  correct() {
    this.verifierSelectionModalVisible = of(true);
  }

  onVerifierSelect(selectEvent: VerifierSelectionEvent) {
    let urlSearchMap = new Map();
    if (selectEvent.verifier != null) urlSearchMap.set(urlSearchParameterConstants.VERIFIER, selectEvent.verifier);
    this.correctChequeBookbyBookId(urlSearchMap);
  }

  navigateAway(): void {
    this.router.navigate(['../../'], {
      relativeTo: this.route,
      queryParamsHandling: "merge"
    });
  }

}
