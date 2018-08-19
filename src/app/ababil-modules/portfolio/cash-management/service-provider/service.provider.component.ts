import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../../../common/components/base.component";
import { Router, ActivatedRoute } from "@angular/router";
import { ServiceProviderService } from "../../../../services/teller/service-api/service.provider.service";
import { ServiceProvider } from "../../../../services/teller/domain/service.provider.model";
import { LazyLoadEvent } from "primeng/api";

@Component({
    selector: 'service-provider',
    templateUrl: './service.provider.component.html',
})

export class ServiceProviderComponent extends BaseComponent implements OnInit {

    providers: any[];
    formData: ServiceProvider = new ServiceProvider();
    pageSize = 20;
    totalRecords: number;

    ngOnInit(): void {
        this.fetchProviders(new Map());
    }

    constructor(private router: Router,
        private route: ActivatedRoute,
        private serviceProviderService: ServiceProviderService) {
        super();
    }

    fetchProviders(urlSearchMap) {
        this.subscribers.fetchProvidersSub = this.serviceProviderService.fetchServiceProviders(urlSearchMap)
            .subscribe(
                data => {
                    this.providers = data.content;
                    this.pageSize = data.pageSize;
                    this.totalRecords = (data.pageSize * data.pageCount)
                }
            )
    }

    loadProvidersLazily(event: LazyLoadEvent) {
        if (event.first != 0) {
            this.fetchProviders(new Map().set('page', event.first / this.pageSize));
        }

    }

    create() {
        this.router.navigate(['create'], { relativeTo: this.route });
    }

    onRowSelect(event) {
        this.router.navigate(['detail', event.data.id], { relativeTo: this.route });
    }

}
