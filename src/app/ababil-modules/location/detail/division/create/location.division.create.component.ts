import { Component, OnInit } from "@angular/core";
import { templateJitUrl } from "@angular/compiler";
import { BaseComponent } from "../../../../../common/components/base.component";
import { FormGroup } from "@angular/forms/src/model";
import { NotificationService } from "../../../../../common/notification/notification.service";
import { FormBuilder } from "@angular/forms";
import { AbabilLocationService } from "../../../../../services/location/service-api/location.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Division } from "../../../../../services/location/domain/division.models";



@Component({
    selector: 'location-division-create',
    templateUrl: './location.division.create.component.html'

})
export class DivisionCreateLocationComponent extends BaseComponent implements OnInit {


    divisionfrom: FormGroup;
    division: Division = new Division();
    countryId: any;

    ngOnInit(): void {
        this.countryId = this.route.snapshot.paramMap.get('id');
        console.log(this.countryId);
        this.prepareDivisionform(this.division);

    }

    constructor(private formBuilder: FormBuilder,
        private locationService: AbabilLocationService,
        private router: Router, private route: ActivatedRoute,
        private notificationService: NotificationService) {
        super();
    }

    prepareDivisionform(formData: Division) {
        this.divisionfrom = this.formBuilder.group({
            //  id: [formData.id],
            name: [formData.name]
        });
    }

    close() {
        this.router.navigate(['../'], { relativeTo: this.route });
    }

    save() {
        let divisionToSave = new Division();
        divisionToSave = this.divisionfrom.value;
        divisionToSave.country.id = this.countryId;
        // console.log(divisionToSave.country.id);
        this.createDivision(divisionToSave);
        if (divisionToSave.id) {
            //update
        } else {
            //create
        }
    }

    createDivision(division) {
        this.subscribers.createCountrySub = this.locationService
            .createdivision(division).subscribe(data => {
                this.notificationService.sendSuccessMsg('successful');
            });
    }
}