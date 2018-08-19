import { Component, OnInit, OnDestroy } from '@angular/core';
import { TooltipModule } from 'primeng/primeng';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../../common/components/base.component';
import { DemandDepositProductService } from '../../../../services/demand-deposit-product/service-api/demand-deposit-product.service';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { DemandDepositProduct } from '../../../../services/demand-deposit-product/domain/demand-deposit-product.model';

@Component({
  selector: 'demand-deposit-product',
  templateUrl: './demand-deposit-product.component.html'
})
export class DemandDepositProductComponent extends BaseComponent implements OnInit {

  demanDepositProducts: DemandDepositProduct[]=[];
  totalRecords: number;
  totalPages: number;

  constructor(private demadDepositProductService: DemandDepositProductService, private route: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit() {
    this.fetchDemandDepositProducts(this.getSearchMap());
  }

  fetchDemandDepositProducts(searchMap: Map<string, any>) {
    if (searchMap == null) searchMap = new Map();
    this.subscribers.fetchsub = this.demadDepositProductService.fetchDemandDepositProducts(searchMap)
      .subscribe(data => {
        this.demanDepositProducts = data.content;
        this.totalRecords = (data.pageSize * data.pageCount);
        this.totalPages = data.pageCount;
      });
  }

  onRowSelect(event: any) {
    this.router.navigate(['detail', event.data.id], { relativeTo: this.route });
  }

  create() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  loadCommandMappingsLazy(event: LazyLoadEvent) {
    const searchMap = this.getSearchMap();
    searchMap.set('page', (event.first / 20));
    this.fetchDemandDepositProducts(searchMap);
  }

  getSearchMap(): Map<string, any> {
    const searchMap = new Map();
    return searchMap;
  }
}
