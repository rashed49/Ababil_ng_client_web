import { SelectItem } from 'primeng/api';
import { Organization, OrganizationType } from './../../../services/cis/domain/organization.model';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '../base.component';
import { CISService } from './../../../services/cis/service-api/cis.service';
import { CISLookupService } from './../../../services/cis/service-api/cis.lookup.service';


@Component({
    selector: 'organization-lookup',
    templateUrl: './organization.lookup.component.html',
    providers: [CISLookupService]
})
export class OrganizationLookupComponent extends BaseComponent implements OnInit {

    display: boolean = false;
    hideDataList: boolean = true;
    organizationId: number;

    organizationSearchForm: FormGroup;
    urlSearchMap: Map<string, any>;
    organizationTypes: OrganizationType[] = [];
    organizations: Organization[] = [];
    totalRecords: number;
    totalPages: number;

    @Output('onSelect') onSelect = new EventEmitter<number>();

    constructor(private formBuilder: FormBuilder,
        private cisService: CISService,
        private cisLookupService: CISLookupService) {
        super();
    }

    ngOnInit(): void {
        this.prepareOrganizationSearchForm();
        this.fetchOrganizationTypes();
    }

    prepareOrganizationSearchForm() {
        this.organizationSearchForm = this.formBuilder.group({
            name: ['', [Validators.maxLength(32), Validators.required]],
            organizationTypeId: ['', [Validators.maxLength(32), Validators.required]],
            mobileNumber: ['', [Validators.maxLength(32)]],
            phoneNumber: ['', [Validators.maxLength(32)]],
            email: ['', [Validators.maxLength(32)]]
        });
    }

    fetchOrganizationTypes() {
        this.subscribers.fetchOrganizationTypesSub = this.cisService.fetchOrganizationTypes()
            .subscribe(data => this.organizationTypes = data);
    }

    search() {
        this.markFormGroupAsTouched(this.organizationSearchForm);
        if (this.organizationSearchForm.invalid) { return }

        this.urlSearchMap = new Map<string, any>();
        for (let control in this.organizationSearchForm.controls) {
            let formControlValue = this.organizationSearchForm.get(control).value;
            if (this.isString(formControlValue)) { formControlValue = formControlValue.trim() }
            if (formControlValue != '') {
                this.urlSearchMap.set(control, this.organizationSearchForm.get(control).value);
            }
        }

        this.subscribers.searchOrganizationSub = this.cisLookupService
            .searchOrganization(this.urlSearchMap)
            .subscribe(data => {
                this.organizations = data.content;
                this.totalRecords = (data.pageSize * data.pageCount);
                this.totalPages = data.pageCount;
            });
    }

    selectOrganization(organizationId: number) {
        this.onSelect.emit(organizationId);
        this.display = false;
    }

}