import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BaseComponent } from "../../../../../common/components/base.component";
import { OrganizationType } from "../../../../../services/cis/domain/organization.model";


@Component({
    selector: 'organization-type-create',
    templateUrl: './create.organization.type.component.html'
})

export class CreateOrganizationTypeComponent extends BaseComponent implements OnInit {
    display: boolean = false;
    organizationTypeForm: FormGroup;
    organizationType: OrganizationType = new OrganizationType();
    id: number;


    constructor(private formBuilder: FormBuilder) {
        super();
    }

    ngOnInit(): void {
        this.prepareOrganizationTypeForm(this.organizationType);
    }

    prepareOrganizationTypeForm(formData: OrganizationType) {
        if (!formData) { formData = new OrganizationType(); }
        this.organizationTypeForm = this.formBuilder.group({
            typeName: [formData.typeName, [Validators.required, Validators.min(1)]]
        });
    }
    setOrganizationTypeData(data) {
        if (data.id) {
            this.id = data.id;
        } else {
            this.organizationTypeForm.reset();
        }
        this.prepareOrganizationTypeForm(data);
    }

    extractOrganizationTypeData() {
        let orgType: any;
        orgType = this.organizationTypeForm.value;
        this.organizationType.id = this.id;
        this.organizationType.typeName = orgType.typeName;

        return this.organizationType;
    }
}