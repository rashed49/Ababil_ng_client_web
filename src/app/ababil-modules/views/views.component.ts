import { Component, OnInit, OnDestroy } from '@angular/core';
import { BankService } from '../../services/bank/service-api/bank.service';
import { Bank } from '../../services/bank/domain/bank.models';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../common/components/base.component';

@Component({
  selector: 'views-default',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.scss']
})
export class ViewsComponent extends BaseComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router) { super(); }

  ngOnInit() {

  }

}
