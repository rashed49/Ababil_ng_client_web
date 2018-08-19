import { Component, OnInit } from "@angular/core";
import { AbabilLocationService } from "../../../../../services/location/service-api/location.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Division } from "../../../../../services/location/domain/division.models";
import { BaseComponent } from "../../../../../common/components/base.component";
import { District } from "../../../../../services/location/domain/district.models";
import { Country } from "../../../../../services/location/domain/country.models";


@Component({
    selector: 'district-detail',
    templateUrl: './location.division.district.component.html'
})
export class DistrictDetailComponent extends BaseComponent implements OnInit {
    selectedDistrict:District;
    countries: Country[];
    divisionId: number;
    districts: District[];
    divisions: Division[];



    constructor(private locationService: AbabilLocationService,
        private route: ActivatedRoute,
        private router: Router) {
        super();

    }

    ngOnInit(): void {
        this.subscribers.routerSub = this.route.params
            .subscribe(params => {
                this.divisionId = +params['divisionId'];
                this.fetchDistrictsByDivision();
            });
    }

    fetchDistrictsByDivision() {
        this.subscribers.fetchDistrictsSub = this.locationService
            .fetchDistrictsByDivision({ divisionId: this.divisionId })
            .subscribe(data => {
            this.districts = data;
            });
    }

    close() {
        this.router.navigate(['../../'], { relativeTo: this.route })
    }
    navigateToUpazillaDetails(){
        this.router.navigate(['district',this.selectedDistrict.id],{relativeTo:this.route})
    }

    edit(){
        this.router.navigate(['edit'],{relativeTo:this.route})
    }
    create(){
        this.router.navigate(['create'],{relativeTo:this.route})
    }
}