import { Component, OnInit, OnDestroy } from '@angular/core';
import { BankService } from '../../services/bank/service-api/bank.service';
import { Bank } from '../../services/bank/domain/bank.models';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../common/components/base.component';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent extends BaseComponent implements OnInit {

  constructor(private bankService: BankService,
              private route: ActivatedRoute,
              private router: Router) { super(); }
  
  
  Banks: Bank[];
  urlSearchParams: Map<string, string>;

  ngOnInit() {
    this.fetchBanks();
  }


  fetchBanks() {
  //  this.urlSearchParams = new Map([['all', 'true']]);
    this.subscribers.fetchSubs = this.bankService.fetchBanks().subscribe(
      profiles => {
        this.Banks = profiles.content;
      }
    );
  }

  

  create() {
    this.router.navigate(['create'], { relativeTo: this.route});
  }
  onRowSelect(event) {
    this.router.navigate(['detail', event.data.id], {relativeTo: this.route});
  }
}
