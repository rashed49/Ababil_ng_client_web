import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IndividualInformation } from '../../../../../services/cis/domain/individual.model';
import { BaseComponent } from '../../../../../common/components/base.component';
import { CISService } from '../../../../../services/cis/service-api/cis.service';
import { Address } from '../../../../../services/cis/domain/address.model';
import { Document } from '../../../../../services/document/domain/document.models';


@Component({
    selector: 'edit-short-individual',
    templateUrl: './edit.short.individual.component.html'
})
export class EditShortIndividualComponent extends BaseComponent implements OnInit {

    @ViewChild('shortIndividualForm') individualShortComponent: any;
    individualInfoFormData: IndividualInformation;
    @ViewChild('addressComponent') addressComponent: any;

    presentAddress: Address = new Address();
    permanentAddress: Address = new Address();
    professionalAddress: Address = new Address();
    documents: Document[] = [];

    @ViewChild('presentAddressComponent') presentAddressComponent: any;
    @ViewChild('permanentAddressComponent') permanentAddressComponent: any;
    @ViewChild('professionalAddressComponent') professionalAddressComponent: any;
    @ViewChild('individualImage') individualImageComponent: any;
    @ViewChild('docComponent') docComponent: any;
    individualInformation: IndividualInformation = new IndividualInformation();
    queryParams: any;
    individualId: number;

    constructor(private cisService: CISService,
        private route: ActivatedRoute,
        private router: Router) {
        super();
    }

    ngOnInit(): void {
        this.subscribers.routeSub = this.route.queryParams.subscribe(params => {

            this.individualId = +params['individualId'];
            this.fetchIndividualInformation();
        });

    }

    fetchIndividualInformation() {
        this.subscribers.loadShortIndividualSub = this.cisService.fetchIindividualInformationDetails({ id: this.individualId })
            .subscribe(data => {
                this.individualInformation = data;
                this.presentAddress = this.individualInformation.presentAddress ? this.individualInformation.presentAddress : new Address();
                this.permanentAddress = this.individualInformation.permanentAddress ? this.individualInformation.permanentAddress : new Address();
                this.professionalAddress = this.individualInformation.professionalAddress ? this.individualInformation.professionalAddress : new Address();
                this.documents = this.individualInformation.documents ? this.individualInformation.documents : [];
            });
    }




}
