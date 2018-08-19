import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '../base.component';
import { CISLookupService } from './../../../services/cis/service-api/cis.lookup.service';
import { IndividualInformation } from '../../../services/cis/domain/individual.model';
import { environment } from "../../../../environments/environment";


@Component({
    selector: 'individual-lookup',
    templateUrl: './individual.lookup.component.html',
    providers: [CISLookupService]
})
export class IndividualLookupComponent extends BaseComponent implements OnInit {

    display: boolean = false;
    hideDataList: boolean = true;
    individualId: number;

    searchIndividualForm: FormGroup;
    urlSearchMap: Map<string, any>;

    individuals: IndividualInformation[] = [];
    totalRecords: number;
    totalPages: number;
    imageApiUrl: any;
    @Output('onSelect') onSelect = new EventEmitter<number>();

    constructor(private formBuilder: FormBuilder,
        private cisLookupService: CISLookupService) {
        super();
    }

    ngOnInit(): void {
        this.imageApiUrl = environment.serviceapiurl;
        this.prepareIndividualSearchForm()
    }

    prepareIndividualSearchForm() {
        this.searchIndividualForm = this.formBuilder.group({
            name: ['', [Validators.maxLength(32)]],
            email: ['', [Validators.maxLength(32)]],
            drivingLicense: ['', [Validators.maxLength(32)]],
            mobileNumber: ['', [Validators.maxLength(32)]],
            nid: ['', [Validators.maxLength(17)]],
            tin: ['', [Validators.maxLength(20)]]
        });
    }

    search() {
        this.urlSearchMap = new Map<string, any>();
        for (let control in this.searchIndividualForm.controls) {
            let formControlValue = this.searchIndividualForm.get(control).value.trim();
            if (formControlValue != '') {
                this.urlSearchMap.set(control, this.searchIndividualForm.get(control).value);
            }
        }

        this.subscribers.searchIndividualSub = this.cisLookupService
            .searchIndividual(this.urlSearchMap)
            .subscribe(data => {
                this.individuals = data.content;
                this.totalRecords = (data.pageSize * data.pageCount);
                this.totalPages = data.pageCount;
            });
    }

    selectIndividual(individualId: number) {
        this.onSelect.emit(individualId);
        this.display = false;
    }

    getFullName(firstName: string, middleName: string, lastName: string): string {
        let name: string = '';
        (firstName === undefined || firstName === null) ? name : name = firstName;
        (middleName === undefined || firstName === null) ? name : name += ' ' + middleName;
        (lastName === undefined || firstName === null) ? name : name += ' ' + lastName;
        return name;
    }
}