import { ContactInformation } from './../../../services/cis/domain/contact.information.model';
import { FormGroup } from '@angular/forms/src/model';
import { BaseComponent } from './../base.component';
import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as abbabilValidators from '../../constants/app.validator.constants';


@Component({
    selector: 'contact-information',
    templateUrl: './contact.information.component.html'
})
export class ContactInformationComponent extends BaseComponent {

    contactInformation: ContactInformation;
    contactInformationForm: FormGroup;

    @Input('contactInformation') set setContactInformation(contactInformation: ContactInformation) {
        this.contactInformation = contactInformation ? contactInformation : new ContactInformation();
        this.prepareContactInformationForm();
    };

    constructor(private formBuilder: FormBuilder) {
        super();
    }

    prepareContactInformationForm() {
        this.contactInformationForm = this.formBuilder.group({
            phoneNumber: [this.contactInformation.phoneNumber, [abbabilValidators.phoneNumberValidator]],
            mobileNumber: [this.contactInformation.mobileNumber, [Validators.required, abbabilValidators.phoneNumberValidator]],
            alternateMobileNumber: [this.contactInformation.alternateMobileNumber, [abbabilValidators.phoneNumberValidator]],
            email: [this.contactInformation.email, [abbabilValidators.emailValidator]],
            fax: [this.contactInformation.fax, [abbabilValidators.faxValidator]]
        });
    }

    extractData() {
        return this.contactInformationForm.value;
    }

    isInvalid() {
        if (!this.contactInformationForm) return true;
        return this.contactInformationForm.invalid;
    }
    markAsTouched() {
        this.markFormGroupAsTouched(this.contactInformationForm);
    }
}