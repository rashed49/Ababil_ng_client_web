import { Component, OnInit, OnDestroy } from '@angular/core';
import { TellerService } from '../../../../services/teller/service-api/teller.service';
import { Teller, TellerLimit } from '../../../../services/teller/domain/teller.models';
import { Router, ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';
import { BaseComponent } from '../../../../common/components/base.component';


@Component({
  selector: 'ababil-teller',
  templateUrl: './teller.component.html',
  styleUrls: ['./teller.component.scss']
})

export class TellerComponent extends BaseComponent implements OnInit, OnDestroy {

  constructor(private tellerService: TellerService, private route: ActivatedRoute, private router: Router) {
    super();
  }

  subscription: any;

  tellers: Teller[] = [];
  pageSize: number = 20;
  totalRecords: number;
  pageCount: number;

  urlSearchParam: Map<string, number>;

  ngOnInit() {
    this.fetchTellers(null, null);
  }

  fetchTellers(page: number, branchId: number) {

    this.urlSearchParam = new Map();
    if (page != null) this.urlSearchParam.set("page", page);
    if (branchId != null) this.urlSearchParam.set("branchId", branchId);

    this.subscribers.fetchTellerSub = this.tellerService.fetchTellers(this.urlSearchParam).subscribe(
      profiles => {
        this.tellers = [...profiles.content];
        this.pageSize = profiles.pageSize;
        this.pageCount = profiles.pageCount;
        this.totalRecords = (profiles.pageSize * profiles.pageCount)
      }
    );
  }

  loadTellersLazily(event: LazyLoadEvent) {
    if (event.first != 0) {
      this.fetchTellers(event.first / this.pageSize, null);
    }

  }

  create() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  onRowSelect(event) {
    this.router.navigate(['detail', event.data.id], { relativeTo: this.route });
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
