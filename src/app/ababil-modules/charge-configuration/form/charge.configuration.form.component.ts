import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: 'charge-configuration-form',
    templateUrl: './charge.configuration.form.component.html'
})
export class ChargeConfigurationFormComponent {

    check: boolean = false;
    fixed: boolean = false;
   // addButton: boolean = true;

    constructor(private router: Router,
        private route: ActivatedRoute) {
    }

    cancel() {
        this.router.navigate(['../'], { relativeTo: this.route });
    }
}