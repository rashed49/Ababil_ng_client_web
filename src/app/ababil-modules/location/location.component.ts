

import { Component } from '@angular/core';
import { AbabilLocationService } from '../../services/location/service-api/location.service';
import { BaseComponent } from '../../common/components/base.component';

import { OnInit } from '@angular/core';
import { Country } from '../../services/location/domain/country.models';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationComponent extends BaseComponent implements OnInit {

    countries: Country[];
    selectedCountry: Country;

    constructor(private locationService: AbabilLocationService,
        private route: ActivatedRoute,
        private router: Router) {
        super();
    }

    ngOnInit(): void {
        this.fetchAllCuntrie()
    }

    fetchAllCuntrie() {
        this.subscribers.fetchCuntrySub = this.locationService
            .fetchCountries()
            .subscribe(res => {
                this.countries = res;
            });
    }

    create() {
        this.router.navigate(['create'], { relativeTo: this.route });
    }

    navigateToCountryDetails() {
        this.router.navigate(['country', this.selectedCountry.id], { relativeTo: this.route });
    }

}


