import { Component, OnInit } from '@angular/core';
import { ChequeService } from '../../../../../services/cheque/service-api/cheque.service';
import { ChequeBook } from '../../../../../services/cheque/domain/cheque.models';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../../../../common/components/base.component';
import { ChequeBookStatus } from '../../../../../services/cheque/domain/cheque.models';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cheque',
  templateUrl: './cheque.component.html',
  styleUrls: ['./cheque.component.scss']
})
export class ChequeComponent extends BaseComponent implements OnInit {

  private selectedAccountedId: string;
  urlSearchParams: Map<string, string>;
  subscription: any;
  chequeBook: ChequeBook[];
  accountId: number;
  queryParams: any = {};
  chequePrefixPresent:boolean = true;


  constructor(private chequeService: ChequeService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router) {

    super();
  }

  ngOnInit() {
    this.subscribers.routeSub = this.route.params.subscribe(params => {
      this.accountId = +params['id'];
      this.fetchChequeBookByAccountId();
    });

    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
    });
  }

  fetchChequeBookByAccountId() {
    this.subscribers.fetchChequeBookByAccountIdSub = this.chequeService
      .fetchChequeBookByAccountId({ accountId: this.accountId }, new Map().set('chequeBookStatus', 'ISSUED'))
      .subscribe(data => {
        this.chequeBook = data.content;
        if(this.chequeBook.length<1) return;
        this.chequePrefixPresent = (this.chequeBook[0].chequePrefix!=null);
      });
  }

  create(event) {
    this.router.navigate(['create'], {
      relativeTo: this.route,
      queryParamsHandling: "merge"
    });
  }

  onRowSelect(event) {
    this.router.navigate([event.data.id, 'details'], {
      relativeTo: this.route,
      queryParamsHandling: "merge"
    });
  }

  cancel() {
    this.navigateAway();
  }

  navigateAway() {
    if (this.queryParams['demandDeposit'] != undefined) {
      this.router.navigate([this.queryParams['demandDeposit']], {
        queryParamsHandling: "merge"
      });
    } else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }
}
