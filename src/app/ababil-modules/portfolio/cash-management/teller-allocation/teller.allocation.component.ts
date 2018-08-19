import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { BaseComponent } from '../../../../common/components/base.component';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../../common/notification/notification.service';
import * as commandConstants from '../../../../common/constants/app.command.constants';
import { SelectItem, LazyLoadEvent, ConfirmationService } from 'primeng/primeng';
import { TellerAllocationService } from '../../../../services/teller/service-api/teller.allocation.service';
import { TellerAllocation } from '../../../../services/teller/domain/teller.models';
import { TellerService } from '../../../../services/teller/service-api/teller.service';
import { NgSsoService } from '../../../../services/security/ngoauth/ngsso.service';
import { environment } from '../../../..';



@Component({
  selector: 'app-teller-allocation',
  templateUrl: './teller.allocation.component.html',
  styleUrls: ['./teller.allocation.component.scss']
})
export class TellerAllocationComponent extends BaseComponent implements OnInit {

  tellerAllocations: TellerAllocation[];
  urlSearchParams: Map<string, any>;
  totalRecords: number;
  totalPages: number;
  userName$: String;
  userActiveBranch$: number;
  userHomeBranch$: number;
  auth: string = environment.auth;
  constructor(
    private tellerAllocationService: TellerAllocationService,
    private tellerService: TellerService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private ngSsoService: NgSsoService,
    private confirmationService: ConfirmationService
  ) { super(); }



  ngOnInit() {
    if (environment.auth === 'NGSSO') {
      this.ngSsoService.account().subscribe(account => {
        this.userName$ = account.username;
        this.userActiveBranch$ = account.activeBranch;
        this.userHomeBranch$ = account.homeBranch;
        this.fetchTellerAllocations();

      });
    }

  }

  fetchTellerAllocations() {
    // let instructionRequestOptions = [
    //   { value: "branchId", text: this.userActiveBranch$ },
    //   { value: "userId", text: this.userName$ },

    // ];
    // let instructionRequestOptionsMap = new Map(
    //     instructionRequestOptions.map<[string, string]>(x => [x.value, x.text])
    //   );
    let urlSearchMap = new Map();
    urlSearchMap.set('branchId', +this.userActiveBranch$);
    this.subscribers.fetchAllocs = this.tellerAllocationService.fetchTellerAllocations(urlSearchMap).subscribe(
      data => {
        this.tellerAllocations = data.content;
        this.totalRecords = (data.pageSize * data.pageCount);
        this.totalPages = data.pageCount;
      });
  }

  loadTellerAllocationsLazy(event: LazyLoadEvent) {
    let urlSearchParam = new Map([['page', (event.first / 20) + '']]);
    this.subscribers.fetchAllocs = this.tellerAllocationService.fetchTellerAllocations(urlSearchParam).subscribe(
      data => {
        this.tellerAllocations = data.content;
        this.totalRecords = (data.pageSize * data.pageCount);
        this.totalPages = data.pageCount;
      });
  }

  deleteTeller(data) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        this.tellerService.deleteAllocatedTeller({ id: data.id }).subscribe();
        this.fetchTellerAllocations();
      }
  });

  }

  refresh() {
    this.fetchTellerAllocations();
  }

  create(): void {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  onRowSelect(event) {
    this.router.navigate(['detail', event.data.id], { relativeTo: this.route });
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  navigateAway(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

}
