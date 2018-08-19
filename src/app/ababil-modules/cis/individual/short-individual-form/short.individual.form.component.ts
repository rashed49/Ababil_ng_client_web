import { ViewChild, Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as abbabilValidators from '../../../../common/constants/app.validator.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { IndividualInformation } from '../../../../services/cis/domain/individual.model';
import { BaseComponent } from '../../../../common/components/base.component';
import { MaritalStatus, Gender, ResidentStatus } from '../../../../common/domain/cis.enum.model';
import { Division } from '../../../../services/location/domain/division.models';
import { Country } from '../../../../services/location/domain/country.models';
import { Address } from '../../../../services/cis/domain/address.model';
import { CISService } from '../../../../services/cis/service-api/cis.service';
import { AbabilLocationService } from '../../../../services/location/service-api/location.service';
import { NotificationService } from '../../../../common/notification/notification.service';
import { ImageUploadService } from '../../../../services/cis/service-api/image.upload.service';
import { ContactInformation } from '../../../../services/cis/domain/contact.information.model';
import { Location } from '@angular/common';
import { CISMiscellaneousService } from '../../../../services/cis/service-api/cis.misc.service';
import { District } from '../../../../services/location/domain/district.models';
import * as profileCode from '../../../../common/constants/app.profile.code.constants';


export let initialIndividualInfo = new IndividualInformation();
@Component({
    selector: 'short-individual-form',
    templateUrl: './short.individual.form.component.html',
    styleUrls: ['./short.individual.form.component.scss']
})
export class ShortIndividualComponent extends BaseComponent implements OnInit {
    imageApiUrl: string;
    uuid: string;
    individualId: number;
    maritalStatuses: SelectItem[] = MaritalStatus;
    genders: SelectItem[] = Gender;
    residentStatuses: SelectItem[] = ResidentStatus;
    shortIndividualForm: FormGroup;
    divisions: Division[];
    countries: Country[];
    nationality: string[] = [];
    nrbBirthPlace = false;
    individualDetails: IndividualInformation = new IndividualInformation();
    individualsFullName: string = " ";
    guardianId: number = -1;
    guardianCheckerHidden: boolean;
    @Input('guardianFormData') set guardianFormData(guardianFormData: IndividualInformation) {
        this.prepareIndividualForm(guardianFormData);
        this.guardianCheckerHidden = true;
    }
    @Input('visible') visible: boolean;
    @Input('formData') set formData(formData: IndividualInformation) {
        this.prepareIndividualForm(formData);
    }
    @ViewChild('individualFormContainer') individualFormContainer: any;
    @ViewChild('addressComponent') addressComponent: any;
    @ViewChild('ababilImage') ababilImage: any;
    @ViewChild('subjectFormComponent') individualComponent: any;


    presentAddress: Address = new Address();
    permanentAddress: Address = new Address();
    professionalAddress: Address = new Address();


    @ViewChild('presentAddressComponent') presentAddressComponent: any;
    @ViewChild('permanentAddressComponent') permanentAddressComponent: any;
    @ViewChild('professionalAddressComponent') professionalAddressComponent: any;
    @ViewChild('individualImage') individualImageComponent: any;
    @ViewChild('docComponent') docComponent: any;
    @Output('onSave') onSave = new EventEmitter<number>();

    individualImageSrc: string;

    maxBirthdayDate: Date = new Date();
    queryParams: any;

    presentAddressCheckerStatus = false;
    permanenetAddressCheckerStaus = false;
    nrbFieldsDisabled: boolean = true;
    baseCountryId: number;
    baseCountryDistricts: District[] = [];

    clientId: string;
    profileCode: string = profileCode.INDIVIDUAL_PROFILE_CODE;

    constructor(private cisService: CISService,
        private ababilLocationService: AbabilLocationService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private imageUploadService: ImageUploadService,
        private cisMiscellaneousService: CISMiscellaneousService,
        private location: Location) {
        super();
    }

    ngOnInit() {
        this.initEnterNavigation("individual-form");
        this.maxBirthdayDate.setDate(this.maxBirthdayDate.getDate() - 1);
        this.ababilLocationService.fetchCountries().subscribe(data => {
            this.countries = data;
        }
        )
        this.prepareIndividualForm(this.formData);
        this.subscribers.queryParamSub = this.route.queryParams.subscribe(data => {
            this.queryParams = data;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.guardianFormData) {
            this.prepareIndividualForm(changes.guardianFormData.currentValue);
        }
    }

    prepareIndividualForm(formData: IndividualInformation) {
        if (!formData) formData = initialIndividualInfo;
        this.individualId = formData.id;
        this.uuid = formData.uuid;
        this.presentAddress = formData.presentAddress ? formData.presentAddress : new Address();
        this.permanentAddress = formData.permanentAddress ? formData.permanentAddress : new Address();
        this.professionalAddress = formData.professionalAddress ? formData.professionalAddress : new Address();

        this.clientId = formData.uuid;
        if (formData.birthCountryId && this.baseCountryId) {
            if (formData.birthCountryId === this.baseCountryId) {
                this.fetchBaseCountryDistricts();
            }
        }
        this.shortIndividualForm = this.formBuilder.group({
            firstName: [formData.firstName, [Validators.required, abbabilValidators.personNameValidator, Validators.maxLength(15)]],
            middleName: [formData.middleName, [abbabilValidators.personNameValidator, Validators.maxLength(15)]],
            lastName: [formData.lastName, [abbabilValidators.personNameValidator, Validators.maxLength(15)]],
            fathersFirstName: [formData.fathersFirstName, [Validators.required, abbabilValidators.personNameValidator, Validators.maxLength(15)]],
            fathersMiddleName: [formData.fathersMiddleName, [abbabilValidators.personNameValidator, Validators.maxLength(15)]],
            fathersLastName: [formData.fathersLastName, [abbabilValidators.personNameValidator, Validators.maxLength(15)]],
            mothersFirstName: [formData.mothersFirstName, [Validators.required, abbabilValidators.personNameValidator, Validators.maxLength(15)]],
            mothersMiddleName: [formData.mothersMiddleName, [abbabilValidators.personNameValidator, Validators.maxLength(15)]],
            mothersLastName: [formData.mothersLastName, [abbabilValidators.personNameValidator, Validators.maxLength(15)]],
            maritalStatus: [formData.maritalStatus, [Validators.required]],
            spouseName: [formData.spouseName, [abbabilValidators.personNameValidator, Validators.maxLength(40)]],
            gender: [formData.gender, [Validators.required]],
            nationality: [formData.nationality, [Validators.required]],
            birthCountryId: [formData.birthCountryId, [Validators.required]],
            birthPlaceId: [formData.birthPlaceId, [Validators.required]],
            residenceStatus: [formData.residenceStatus, [Validators.required]],
            dateOfBirth: [formData.dateOfBirth == null ? null : new Date(formData.dateOfBirth), [Validators.required]],
            phoneNumber: [formData.contactInformation.phoneNumber, [abbabilValidators.phoneNumberValidator]],
            mobileNumber: [formData.contactInformation.mobileNumber, [Validators.required, abbabilValidators.phoneNumberValidator]],
            alternateMobileNumber: [formData.contactInformation.alternateMobileNumber, [abbabilValidators.phoneNumberValidator]],
            email: [formData.contactInformation.email, [abbabilValidators.emailValidator]],
            fax: [formData.contactInformation.fax, [abbabilValidators.faxValidator]],
            foreignBirthPlace: [formData.foreignBirthPlace],
            permanentAdressaspresentChceker: [null],
            profAdressaspermanentChceker: [null],
            profAdressaspresentChceker: [null],

        });

        this.subscribers.fetchBaseCountryIdSub = this.cisMiscellaneousService.getConfiguration({ key: 'BASE_COUNTRY' }).subscribe(
            data => {
                this.baseCountryId = data.value;

                if (this.shortIndividualForm.get('birthCountryId').value == this.baseCountryId) {
                    this.nrbBirthPlace = false;
                    this.fetchBaseCountryDistricts();
                    this.shortIndividualForm.addControl('birthPlaceId', new FormControl('', [Validators.required]));
                    this.shortIndividualForm.removeControl('foreignBirthPlace');
                }
                else {
                    this.nrbBirthPlace = true;
                    this.shortIndividualForm.addControl('foreignBirthPlace', new FormControl('', [Validators.required]));
                    this.shortIndividualForm.removeControl('birthPlaceId');
                }
            }
        )


        this.shortIndividualForm.get('birthCountryId').valueChanges.subscribe(
            data => {
                if (this.shortIndividualForm.get('birthCountryId').value == this.baseCountryId) {
                    this.nrbBirthPlace = false;
                    this.fetchBaseCountryDistricts();
                    this.shortIndividualForm.addControl('birthPlaceId', new FormControl('', [Validators.required]));
                    this.shortIndividualForm.removeControl('foreignBirthPlace');
                }
                else {
                    this.nrbBirthPlace = true;
                    this.shortIndividualForm.addControl('foreignBirthPlace', new FormControl('', [Validators.required]));
                    this.shortIndividualForm.removeControl('birthPlaceId');
                }
            }
        )

        if (formData.residenceStatus === "RESIDENT") {
            this.nrbFieldsDisabled = true;
        }
        else if (formData.residenceStatus === "NON_RESIDENT") {
            this.nrbFieldsDisabled = false;
        }
        this.shortIndividualForm.get('residenceStatus').valueChanges
            .subscribe(data => this.nrbFieldsDisabled = data === "RESIDENT" ? true : false);

        if (formData.maritalStatus === 'MARRIED') {
            this.shortIndividualForm.addControl('spouseName', new FormControl(formData.spouseName, [Validators.required, Validators.pattern(new RegExp(/^[a-z ,.'-]+$/i))]));
        } else {
            this.shortIndividualForm.removeControl('spouseName');
        }
        this.shortIndividualForm.get('maritalStatus').valueChanges.subscribe(
            maritalStatus => {
                if (maritalStatus === 'MARRIED') {
                    this.shortIndividualForm.addControl('spouseName', new FormControl('', [Validators.required, Validators.pattern(new RegExp(/^[a-z ,.'-]+$/i))]));
                } else {
                    this.shortIndividualForm.removeControl('spouseName');
                }
                this.shortIndividualForm.updateValueAndValidity();
            }
        );
        this.shortIndividualForm.get('permanentAdressaspresentChceker').valueChanges.subscribe(
            permanentAdressaspresentChceker => {
                if (permanentAdressaspresentChceker) {
                    this.permanentAddress = this.presentAddressComponent.extractData();
                }
                else {
                    this.permanentAddress = new Address();
                }
            }
        )

        this.shortIndividualForm.get('profAdressaspermanentChceker').valueChanges.subscribe(
            profAdressaspermanentChceker => {
                if (profAdressaspermanentChceker) {
                    this.professionalAddress = this.permanentAddressComponent.extractData();
                    this.presentAddressCheckerStatus = true;
                }
                else {
                    this.professionalAddress = new Address();
                    this.presentAddressCheckerStatus = false;
                }
            }
        )

        this.shortIndividualForm.get('profAdressaspresentChceker').valueChanges.subscribe(
            profAdressaspresentChceker => {
                if (profAdressaspresentChceker) {
                    this.professionalAddress = this.presentAddressComponent.extractData();
                    this.permanenetAddressCheckerStaus = true;
                }
                else {
                    this.professionalAddress = new Address();
                    this.permanenetAddressCheckerStaus = false;
                }
            }
        )
    }

    save() {
        this.markAsTouched();
        if(this.docComponent.isFormInvalid()){
            this.notificationService.sendErrorMsg("Invalid document form");
        }
        if (this.shortIndividualForm.invalid || this.presentAddressComponent.isInvalid() || this.permanentAddressComponent.isInvalid() || this.docComponent.isFormInvalid()) {
            return;
        }
        let individualInformation = new IndividualInformation();

        individualInformation.firstName = this.shortIndividualForm.get('firstName').value;
        individualInformation.middleName = this.shortIndividualForm.get('middleName').value;
        individualInformation.lastName = this.shortIndividualForm.get('lastName').value;
        individualInformation.fathersFirstName = this.shortIndividualForm.get('fathersFirstName').value;
        individualInformation.fathersMiddleName = this.shortIndividualForm.get('fathersMiddleName').value;
        individualInformation.fathersLastName = this.shortIndividualForm.get('fathersLastName').value;
        individualInformation.mothersFirstName = this.shortIndividualForm.get('mothersFirstName').value;
        individualInformation.mothersMiddleName = this.shortIndividualForm.get('mothersMiddleName').value;
        individualInformation.mothersLastName = this.shortIndividualForm.get('mothersLastName').value;
        individualInformation.maritalStatus = this.shortIndividualForm.get('maritalStatus').value;
        if (individualInformation.maritalStatus === "MARRIED") {
            individualInformation.spouseName = this.shortIndividualForm.get('spouseName').value;
        }
        individualInformation.gender = this.shortIndividualForm.get('gender').value;
        individualInformation.nationality = this.shortIndividualForm.get('nationality').value;
        individualInformation.birthCountryId = this.shortIndividualForm.get('birthCountryId').value;
        if (this.shortIndividualForm.controls.birthPlaceId) {
            individualInformation.birthPlaceId = this.shortIndividualForm.get('birthPlaceId').value;
        }
        if (this.shortIndividualForm.controls.foreignBirthPlace) {
            individualInformation.foreignBirthPlace = this.shortIndividualForm.get('foreignBirthPlace').value;
        }
        individualInformation.dateOfBirth = this.shortIndividualForm.get('dateOfBirth').value;
        individualInformation.residenceStatus = this.shortIndividualForm.get('residenceStatus').value;
        individualInformation.contactInformation.phoneNumber = this.shortIndividualForm.get('phoneNumber').value;
        individualInformation.contactInformation.mobileNumber = this.shortIndividualForm.get('mobileNumber').value;
        individualInformation.contactInformation.alternateMobileNumber = this.shortIndividualForm.get('alternateMobileNumber').value;
        individualInformation.contactInformation.email = this.shortIndividualForm.get('email').value;
        individualInformation.contactInformation.fax = this.shortIndividualForm.get('fax').value;

        individualInformation.permanentAddress = this.permanentAddressComponent.extractData();
        individualInformation.presentAddress = this.presentAddressComponent.extractData();
        this.professionalAddressComponent.removeControl();
        individualInformation.professionalAddress = this.professionalAddressComponent.extractData();
        individualInformation.documents = this.docComponent.extractFormData();
        individualInformation.foreignerInformation = null;
        individualInformation.fatcaCisIndividualInformation = null;
        individualInformation.id = this.individualId;


        if (this.individualId) {
            this.updateIndividualInformation(individualInformation);
        } else {
            this.createIndividualInformation(individualInformation);
        }
    }

    fetchBaseCountryDistricts() {
        this.subscribers.fetchDistrictssSub = this.ababilLocationService.fetchDistrictsByCountry({ countryId: this.baseCountryId })
            .subscribe(data => {
                this.baseCountryDistricts = data;
            });
    }

    createIndividualInformation(formData: IndividualInformation) {
        this.subscribers.individualInformationSub = this.cisService
            .createIndividualInformation(formData)
            .subscribe(data => {
                console.log(JSON.stringify(formData));
                this.notificationService.sendSuccessMsg("individual.createtion.success");
                if (!this.guardianCheckerHidden) {
                    this.router.navigate([this.queryParams.nominee], {
                        queryParams: {
                            account: this.queryParams.account,
                            accountId: this.queryParams.accountId,
                            cus: this.queryParams.cus,
                            individualId: data.content
                        }
                    });
                }
                this.guardianId = data.content;
            });
    }

    updateIndividualInformation(individualInformation: IndividualInformation) {
        this.subscribers.individualInformationSub = this.cisService
            .updateIndividualInformation(individualInformation, { id: this.individualId })
            .subscribe(response => {
                this.notificationService.sendSuccessMsg("individual.update.success");

            });
    }

    markAsTouched() {
        this.markFormGroupAsTouched(this.shortIndividualForm);
        this.docComponent.markDocumentFormsAsTouched();
        this.permanentAddressComponent.markAsTouched();
        this.presentAddressComponent.markAsTouched();
        this.professionalAddressComponent.markAsTouched();
    }

    back() {
        if (this.guardianCheckerHidden) {
            this.onSave.emit(this.guardianId);
        }
        else {
            if (this.queryParams.nomineeEdit) {

                this.router.navigate([this.queryParams.nomineeEdit], {
                    queryParamsHandling: 'merge'
                });
            } else {
                this.router.navigate([this.queryParams.nominee], {
                    queryParamsHandling: 'merge'
                });
            }
        }
    }

}
