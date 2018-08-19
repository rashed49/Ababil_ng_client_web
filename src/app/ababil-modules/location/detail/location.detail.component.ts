import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../../common/components/base.component";



import { ActivatedRoute, Router } from "@angular/router";
import { Division } from "../../../services/location/domain/division.models";
import { AbabilLocationService } from "../../../services/location/service-api/location.service";
import { Country } from "../../../services/location/domain/country.models";

@Component({
    selector: 'location-detail',
    templateUrl: './location.detail.component.html'
})
export class LocationDetailComponent extends BaseComponent implements OnInit {
    countries: Country[];
    selectedCountry: Country;
    selectedDivision:Division;


    divisions: Division[];
    countryId: number;

    constructor(private locationService: AbabilLocationService,
        private route: ActivatedRoute, private router: Router) {
        super();
    }

    ngOnInit(): void {
        this.subscribers.routerSub = this.route.params
            .subscribe(params => {
                this.countryId = +params['id'];
                this.fetchDivisionsByCountry();
            });

           
    }

    fetchDivisionsByCountry() {
        this.subscribers.fetchDivisionsSub = this.locationService
            .fetchDivisionsByCountry({ countryId: this.countryId })
            .subscribe(data => {
                this.divisions = data;
            });
           // this.fetchAllCuntrie();
    }

    close() {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }
    create() {
        this.router.navigate(['create'], { relativeTo: this.route });
    }

    navigateToDivisionDetails() {
        this.router.navigate(['division', this.selectedDivision.id], { relativeTo: this.route });
    }

    // fetchAllCuntrie() {
    //     this.subscribers.fetchCuntrySub = this.locationService
    //         .fetchCountries()
    //         .subscribe(res => {
    //             this.countries = res;
    //         });
    // }

    edit(){
        this.router.navigate(['edit'],{relativeTo:this.route})
    }
}
