import { Component, OnInit } from "@angular/core";
import { AbabilLocationService } from "../../../../services/location/service-api/location.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationService } from "../../../../common/notification/notification.service";
import { BaseComponent } from "../../../../common/components/base.component";

@Component({
    selector: 'location-edit',
    templateUrl: './location.detail.edit.component.html'
})
export class LocationDetailEditComponent extends BaseComponent implements OnInit {


    constructor(
        private locationService: AbabilLocationService,
        private router: Router, private route: ActivatedRoute,
        private notificationService: NotificationService) {
        super();
    }
    ngOnInit(): void {

    }
    close() {
        this.router.navigate(['../'], { relativeTo: this.route });
    }
}