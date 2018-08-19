import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AbabilLocationService } from "../../../../../../services/location/service-api/location.service";
import { ActivatedRoute } from "@angular/router";
import { BaseComponent } from "../../../../../../common/components/base.component";
import { Upazilla } from "../../../../../../services/location/domain/upazilla.models";



@Component({
    selector: 'upazilla-details',
    templateUrl: './location.division.district.upazilla.component.html'
})

export class UpazillaDetailComponent extends BaseComponent implements OnInit {
    districtId: number;
    upazillas: Upazilla[];
   selectedUpazilla:Upazilla;


    ngOnInit(): void {
        this.subscribers.routerSub = this.route.params
        .subscribe(params => {
        this.districtId= +params['districtId'];
        this.fetchUpazillasByDistrict();
        });
    }

    constructor(
        private router: Router,
        private locationservice: AbabilLocationService,
        private route: ActivatedRoute) {
        super();
    }

    fetchUpazillasByDistrict() {
        this.subscribers.fatchUpazillaSub = this.locationservice
            .fetchUpazillasByDistrict({ districtId: this.districtId })
            .subscribe(data => {
                this.upazillas = data;
            });

    }

    close(){
        this.router.navigate(['../../'],{relativeTo:this.route});
    }
    edit(){
        this.router.navigate(['edit'],{relativeTo:this.route})
    }
    create(){
        this.router.navigate(['create'],{relativeTo:this.route})
    }

}