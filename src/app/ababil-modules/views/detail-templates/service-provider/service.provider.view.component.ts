import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { ViewsBaseComponent } from "../../view.base.component";
import { ApprovalflowService } from "../../../../services/approvalflow/service-api/approval.flow.service";
import { NotificationService } from "../../../../common/notification/notification.service";
import { ServiceProvider } from "../../../../services/teller/domain/service.provider.model";
import { of } from "rxjs";

@Component({
    selector: 'service-provider-detail',
    templateUrl: './service.provider.view.component.html'
}
)

export class ServiceProviderViewComponent extends ViewsBaseComponent implements OnInit {

    branchLookupDisplay = false;
    branches: any[] = [];
    billCollectionId: number;
    taskId: number;
    providerDetail: ServiceProvider = new ServiceProvider();
    queryParams: any;

    constructor(
        protected location: Location,
        protected router: Router,
        protected route: ActivatedRoute,
        protected approvalflowService: ApprovalflowService,
        protected notificationService: NotificationService
    ) {
        super(location, router, approvalflowService, notificationService);
    }

    ngOnInit() {
        this.showVerifierSelectionModal = of(false);
        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.command = this.queryParams.command;
            this.taskId = this.queryParams.taskId;
            this.processId = this.queryParams.taskId;
        });
        this.subscribers.fetchCashDepositSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
            data => this.providerDetail = data
        )
    }

    cancel() {
        this.router.navigate(['service-provider']);
    }

    edit() {
        this.router.navigate(['service-provider/edit', this.providerDetail.id]);
    }

}