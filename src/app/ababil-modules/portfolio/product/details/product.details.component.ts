import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BaseComponent } from '../../../../common/components/base.component';
import { Product } from '../../../../services/product/domain/product.models';
import { ProductService } from '../../../../services/product/service-api/product.service';
import { NotificationService } from './../../../../common/notification/notification.service';
import { map }from 'rxjs/operators';

@Component({
    templateUrl: './product.details.component.html'
})
export class  ProductDetailComponent extends BaseComponent implements OnInit {

    constructor(private location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private  productService:  ProductService,
        private notificationService:NotificationService) {
        super();
    }

    productDetails:  Product = new  Product();
    productId: number;

    ngOnInit() {
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this. productId = +params['id'];
            this.fetchProductDetails();
        });
    }

    cancel() {
        this.navigateAway();
    }

    navigateAway() {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }

    private fetchProductDetails() {
        this.subscribers.fetchSub = this. productService.fetchProductDetails({ id: this. productId + '' })
            .pipe(map( product => this. productDetails =  product))
            .subscribe();
    }
}
