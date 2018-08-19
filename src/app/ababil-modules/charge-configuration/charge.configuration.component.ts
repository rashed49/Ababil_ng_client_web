import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: 'charge-configuration-list',
    templateUrl: './charge.configuration.component.html'
})
export class ChargeConfigurationComponent {

    constructor(private router: Router,
        private route: ActivatedRoute) {
    }

    createNewChargeConfiguration() {
        this.router.navigate(['charge-configuration-form'], { relativeTo: this.route });
    }

}