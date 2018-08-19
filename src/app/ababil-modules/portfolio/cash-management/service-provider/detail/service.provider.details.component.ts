import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../../../../common/components/base.component";
import { ServiceProvider } from "../../../../../services/teller/domain/service.provider.model";
import { ActivatedRoute, Router } from "@angular/router";
import { ServiceProviderService } from "../../../../../services/teller/service-api/service.provider.service";
import { Location } from "@angular/common";

@Component({
    selector: 'service-provider-detail',
    templateUrl: './service.provider.details.component.html'
}
)

export class ServiceProviderDetailComponent extends BaseComponent implements OnInit {

    branchLookupDisplay = false;
    branches: any[] = [];
    billCollectionId: number;
    taskId: number;
    providerDetail: ServiceProvider = new ServiceProvider();

    constructor(
        protected location: Location,
        private router: Router,
        private route: ActivatedRoute,
        private serviceProviderService: ServiceProviderService
    ) {
        super();
    }

    ngOnInit() {

        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.billCollectionId = +params['billCollectionId'];
        });

        if (this.billCollectionId) {
            this.serviceProviderService.fetchServiceProviderDetail({ billCollectionId: this.billCollectionId })
                .subscribe(
                    data => this.providerDetail = data
                )
        }
    }

    cancel() {
        this.router.navigate(['service-provider']);
    }

    edit() {
        this.router.navigate(['service-provider/edit', this.providerDetail.id]);
    }

}