import { Component, OnInit, Input, SimpleChanges, OnChanges, ViewChild } from "@angular/core";
import { FormBaseComponent } from "../../../common/components/base.form.component";
import { Location } from "@angular/common";
import { ApprovalflowService } from "../../../services/approvalflow/service-api/approval.flow.service";
import { BearerInfo } from "../../../services/teller/domain/teller.domain.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ContactInformation } from "../../../services/cis/domain/contact.information.model";
import * as abbabilValidators from '../../../common/constants/app.validator.constants';
import { NotificationService } from "../../../common/notification/notification.service";


@Component({
    selector: 'bearer-information',
    templateUrl: './bearer.information.component.html'
})



export class BearerInformationComponent extends FormBaseComponent implements OnInit, OnChanges {

    @Input('bearerInfo') beareInfo: BearerInfo;
    bearerForm: FormGroup;
    contactInformation: ContactInformation;
    bearerId: number;

    @ViewChild('contactInformationComponent') contactInformationComponent: any;


    ngOnInit() { }
    constructor(
        protected location: Location,
        protected approvalFlowService: ApprovalflowService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService
    ) { super(location, approvalFlowService); }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.beareInfo.currentValue) {
            this.prepareBearerInfoForm(changes.beareInfo.currentValue);
        }
    }


    prepareBearerInfoForm(formData: BearerInfo) {
        formData = formData ? formData : new BearerInfo();
        this.bearerId = formData.id;
        this.contactInformation = formData.contactInformation ? formData.contactInformation : new ContactInformation();

        this.bearerForm = this.formBuilder.group({
            fatherName: [formData.fatherName, abbabilValidators.personNameValidator],
            motherName: [formData.motherName, abbabilValidators.personNameValidator],
            name: [formData.name, [Validators.required, abbabilValidators.personNameValidator]],
            nid: [formData.nid, [Validators.required]],
            relationship: [formData.relationship],
            address: [formData.address, [Validators.required]]
        })

    }

    extractData() {
        this.markAsTouched();
        if (this.formInvalid()) return;

        let extractedBearerInfo: BearerInfo = this.bearerForm.value;
        extractedBearerInfo.id = this.bearerId;
        extractedBearerInfo.contactInformation = this.contactInformationComponent.extractData();

        return extractedBearerInfo;

    }

    formInvalid() {
        if(this.bearerForm.invalid){
            this.notificationService.sendErrorMsg('Bearer.form.invalid')
        }
        return (this.bearerForm.invalid);
    }

    markAsTouched() {
        this.markFormGroupAsTouched(this.bearerForm);
        this.contactInformationComponent.markAsTouched();
    }
}