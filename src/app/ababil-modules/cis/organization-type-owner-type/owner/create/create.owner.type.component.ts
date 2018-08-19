import { Component, OnInit, SimpleChanges, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SelectItem } from "primeng/components/common/selectitem";
import { BaseComponent } from "../../../../../common/components/base.component";
import { OwnerType } from "../../../../../services/cis/domain/owner.type.model";
import { ActivatedRoute, Router } from "../../../../../../../node_modules/@angular/router";


@Component({
    selector: 'owner-type-create',
    templateUrl: './create.owner.type.component.html'
})

export class CreateOwnerTypeComponent extends BaseComponent implements OnInit {
    display: boolean = false;
    queryParams: any;
    ownerTypeForm: FormGroup;
    ownerType: OwnerType = new OwnerType();
    organizationTypeId: number;
    id: number;


    constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router, ) {
        super();
    }

    ngOnInit(): void {
        this.prepareOwnerTypeForm(this.ownerType);
    }

    prepareOwnerTypeForm(formData: OwnerType) {
        if (!formData) { formData = new OwnerType(); }
        this.ownerTypeForm = this.formBuilder.group({
            ownerTypeName: [formData.name, [Validators.required, Validators.min(1)]]
        });
        this.organizationTypeId = formData.organizationTypeId;
    }

    setOwnerTypeData(data) {
        if (data.id) {
            this.id = data.id;
        } else {
            this.ownerTypeForm.reset();
        }
        this.prepareOwnerTypeForm(data);
    }

    extractOwnerTypeData() {
        let ownType: any;
        ownType = this.ownerTypeForm.value;
        this.ownerType.id = this.id
        this.ownerType.name = ownType.ownerTypeName;
        this.ownerType.organizationTypeId = this.organizationTypeId;
        this.id = null;

        return this.ownerType;
    }
}