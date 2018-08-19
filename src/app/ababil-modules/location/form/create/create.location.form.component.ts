import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { AbabilLocationService } from "../../../../services/location/service-api/location.service";
import { Country } from "../../../../services/location/domain/country.models";
import { FormGroup, FormBuilder } from "@angular/forms";
import { BaseComponent } from "../../../../common/components/base.component";
import { NotificationService } from "../../../../common/notification/notification.service";


@Component({
    selector: 'app-create-location-form',
    templateUrl: './create.location.form.component.html'
})
export class CreateLocationFormComponent extends BaseComponent implements OnInit {

    country: Country = new Country();
    countryForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
        private locationService: AbabilLocationService,
        private router: Router, private route: ActivatedRoute,
        private notificationService: NotificationService) {
        super();

    }

    ngOnInit(): void {
        this.prepareCountryForm(this.country);
    }

    prepareCountryForm(formData: Country) {
        this.countryForm = this.formBuilder.group({
            name: [formData.name],
            isoAlpha2Code: [formData.isoAlpha2Code],
            isoAlpha3Code: [formData.isoAlpha3Code],
            isoNumericCode: [formData.isoNumericCode]
        });
    }

    save() {
        let countryToSave = new Country();
        countryToSave = this.countryForm.value;
        this.createCountry(countryToSave);
    }

    createCountry(country) {
        this.subscribers.createCountrySub = this.locationService
            .createCountry(country)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("country.createtion.success");
            });
    }

    close() {
        this.router.navigate(['../'], { relativeTo: this.route });
    }
}