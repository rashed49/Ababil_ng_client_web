import { Component, OnInit, OnDestroy } from '@angular/core';
import { TooltipModule } from 'primeng/primeng';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../common/components/base.component';
import { ProductService } from '../../../services/product/service-api/product.service';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';

@Component({
  selector: 'product',
  templateUrl: './product.component.html'
})
export class ProductComponent extends BaseComponent implements OnInit {

    products: any[];
  totalRecords: number;
  totalPages: number;

  constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit() {
    this.fetchProducts(this.getSearchMap());
  }

  fetchProducts(searchMap: Map<string, any>) {
    if(searchMap==null) searchMap = new Map();
    this.subscribers.fetchsub = this.productService.fetchProducts(searchMap).subscribe(
      data => {
        this.products = data.content;
        this.totalRecords = (data.pageSize * data.pageCount);
        this.totalPages = data.pageCount;
      }
    );
  }

  onRowSelect(event:any) {
    this.router.navigate(['detail', event.data.id], { relativeTo: this.route });
  }

  create() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  loadCommandMappingsLazy(event: LazyLoadEvent) {
    const searchMap = this.getSearchMap();
    searchMap.set('page', (event.first / 20));
    this.fetchProducts(searchMap);
  }

  getSearchMap(): Map<string, any> {
    const searchMap = new Map();
    return searchMap;
  }
}
