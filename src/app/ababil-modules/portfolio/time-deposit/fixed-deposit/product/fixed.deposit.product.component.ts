import { Component, OnInit, OnDestroy } from '@angular/core';
import { TooltipModule } from 'primeng/primeng';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../../../common/components/base.component';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Location } from '@angular/common';
import { FixedDepositProductService } from '../../../../../services/fixed-deposit-product/service-api/fixed.deposit.product.service';

@Component({
  selector: 'fixed.deposit.product',
  templateUrl: './fixed.deposit.product.component.html'
})




export class FixedDepositProductComponent extends BaseComponent implements OnInit {
 
  fixedDepositProducts: any[];
  totalRecords: number;
  totalPages: number;

  constructor(private route: ActivatedRoute, private router: Router, private location:Location, private fixedDepositService:FixedDepositProductService ) {
    super();
  }

  ngOnInit() {
    this.fetchProducts(this.getSearchMap());
  }

  create() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }
  cancel(){
    this.router.navigate(['../'], { relativeTo: this.route });
  }



  fetchProducts(searchMap: Map<string, any>) {
    if(searchMap==null) searchMap = new Map();
    this.subscribers.fetchFixedDepositProductSub = this.fixedDepositService.fetchFixedDepositProducts(searchMap).subscribe(
      data => {
        this.fixedDepositProducts = data.content;
        this.totalRecords = (data.pageSize * data.pageCount);
        this.totalPages = data.pageCount;
      }
    );
  }

  onRowSelect(event:any) {
    this.router.navigate(['detail', event.data.id], { relativeTo: this.route });
  }


  loadCommandMappingsLazy(event: LazyLoadEvent) {
    const searchMap = this.getSearchMap();
    searchMap.set('page', (event.first / 20));
    console.log(event);
    this.fetchProducts(searchMap);
  }

  getSearchMap(): Map<string, any> {
    const searchMap = new Map();
    return searchMap;
  }

}