import { AbabilCustomValidators } from './../../../../common/validators/ababil.custom.validators';
import { phoneNumberValidator } from './../../../../common/constants/app.validator.constants';
import { CustomerClassificationType } from './../../../../services/cis/domain/type.of.business.model';
import { SubjectSourceOfFund, SourceOfFund } from './../../../../services/cis/domain/subject.model';
import { CISMiscellaneousService } from './../../../../services/cis/service-api/cis.misc.service';
import { element } from 'protractor';
import { CISService } from './../../../../services/cis/service-api/cis.service';
import { AddressSubmitEvent } from './../../../../common/components/address/address.component';
import { Address } from './../../../../services/cis/domain/address.model';
import { AbabilLocationService } from './../../../../services/location/service-api/location.service';
import { ViewChild, Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BaseComponent } from '../../../../common/components/base.component';
import { IndividualInformation, Occupation, OtherBankAccountInformation, CreditCardInformation, ForeignerInformation, OtherInformation } from '../../../../services/cis/domain/individual.model';
import { IdentityInformation } from '../../../../services/cis/domain/identity.information.model';
import { MaritalStatus, Gender, ResidentStatus, OtherBankAccountType, CreditCardType, VisaType } from '../../../../common/domain/cis.enum.model';
import { SelectItem } from 'primeng/api';
import { NotificationService } from '../../../../common/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactInformation } from '../../../../services/cis/domain/contact.information.model';
import { CustomValidators } from 'ng2-validation';
import { DocumentComponent } from '../../../../common/components/document/document.component';
import { ImageUploadService } from '../../../../services/cis/service-api/image.upload.service';
import { environment } from '../../../../../environments/environment';
import * as abbabilValidators from '../../../../common/constants/app.validator.constants';
import { Division } from '../../../../services/location/domain/division.models';
import { Country } from '../../../../services/location/domain/country.models';
import value from '*.json';
import { Location } from '@angular/common';
import { District } from '../../../../services/location/domain/district.models';
import { OtherInformationTopics } from '../../../../services/cis/domain/other.information.topics.model';
import { findIndex } from 'lodash';

export let initialIndividualInfo = new IndividualInformation();

@Component({
    selector: 'individual-form-view',
    templateUrl: './individual.form.view.component.html',
    styleUrls: ['./individual.form.view.component.scss']
})
export class IndividualFormViewComponent extends BaseComponent implements OnInit, OnChanges {
    imageApiUrl: string;
    uuid: string;
    individualId: number;
    maritalStatuses: SelectItem[] = MaritalStatus;
    genders: SelectItem[] = Gender;
    residentStatuses: SelectItem[] = ResidentStatus;
    occupations: any[];
    occupationMap: Map<number, string> = new Map();
    sourceOfundDescriptionMap: Map<number, string> = new Map();
    sourceOfundRequireConditionMap: Map<number, boolean> = new Map();
    individualForm: FormGroup;
    customerSourceOfFunds: SourceOfFund[];
    selectedSourceOfFund: SubjectSourceOfFund;
    selectedSourceOfFunds: SubjectSourceOfFund[] = [];
    mergedSourceofFund: SelectItem;
    mergedSourceOfFunds: SelectItem[] = [];
    customerClassificationTypes: CustomerClassificationType[] = [];
    divisions: Division[];
    countries: Country[];
    // nationality: string[] = [];
    nrbBirthPlace = false;
    nrbTypes: SelectItem[];
    nrbFieldsDisabled: boolean = true;
    visaTypes: SelectItem[] = VisaType;

    //occupation
    addedOccupations: Occupation[] = [];

    //otherbankinfo
    otherBankInformations: OtherBankAccountInformation[] = [];
    otherBankInformation: OtherBankAccountInformation;
    otherBankAccountTypes: SelectItem[] = OtherBankAccountType;

    //creditcardinfo
    creditCardInformations: CreditCardInformation[] = [];
    creditCardInformation: CreditCardInformation;
    creditCardTypes: SelectItem[] = CreditCardType;

    presentAddressCheckerStatus = false;
    permanenetAddressCheckerStaus = false;
    baseCountryId: number;
    baseCountryDistricts: District[] = [];
    sourceOfFundDescriptionRequired = false;

    //otherInformation
    otherInformationTopics: OtherInformationTopics[] = [];
    otherInformationTopic: OtherInformationTopics;
    otherInformation: OtherInformation;
    otherInformations: OtherInformation[] = [];
    viewMode = true;
    today: Date;
    sourceOfFundRequired = false;
    @Input('visible') visible: boolean;
    @Input('formData') set formData(formData: IndividualInformation) {
        this.prepareIndividualForm(formData);
    }
    @Input('index') index: number;
    @Output('onAgeCheck') onAgeCheck = new EventEmitter<number>();
    @ViewChild('individualFormContainer') individualFormContainer: any;
    @ViewChild('addressComponent') addressComponent: any;
    @ViewChild('ababilImage') ababilImage: any;

    presentAddress: Address = new Address();
    permanentAddress: Address = new Address();
    professionalAddress: Address = new Address();

    @ViewChild('presentAddressComponent') presentAddressComponent: any;
    @ViewChild('permanentAddressComponent') permanentAddressComponent: any;
    @ViewChild('professionalAddressComponent') professionalAddressComponent: any;
    @ViewChild('individualImage') individualImageComponent: any;
    @ViewChild('occupationComponent') occupationComponent: any;

    individualImageSrc: string;

    maxBirthdayDate: Date = new Date();

    foreignerId:number;

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
        this.imageApiUrl = environment.serviceapiurl + "/individuals";
        this.ababilLocationService.fetchCountries().subscribe(data => {
            this.countries = data;
        }
        )
        this.fetchCustomerClassificationTypes();
        // this.fetchBaseCountryId();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.formData.currentValue) {
            let individualInfo: IndividualInformation = changes.formData.currentValue;
            this.prepareIndividualForm(individualInfo);
            this.initConditionalValidation();
        }
    }


    initConditionalValidation() {
        this.individualForm.controls.maritalStatus.valueChanges.subscribe(
            maritalStatus => {
                if (maritalStatus === 'MARRIED') {
                    this.individualForm.addControl('spouseName', new FormControl('', [Validators.required, Validators.pattern(new RegExp(/^[a-z ,.'-]+$/i))]));
                } else {
                    this.individualForm.removeControl('spouseName');
                }
                this.individualForm.updateValueAndValidity();
            }
        );
    }

    prepareIndividualForm(formData: IndividualInformation) {
        if (!formData) formData = initialIndividualInfo;
        this.individualId = formData.id;
        
        
        this.uuid = formData.uuid;
        if (!formData.foreignerInformation) formData.foreignerInformation = new ForeignerInformation();
        this.foreignerId = formData.foreignerInformation.id;
        this.presentAddress = formData.presentAddress ? formData.presentAddress : new Address();
        this.permanentAddress = formData.permanentAddress ? formData.permanentAddress : new Address();
        this.professionalAddress = formData.professionalAddress ? formData.professionalAddress : new Address();
        this.addedOccupations = formData.occupations;
        this.creditCardInformations = formData.creditCardInformation ? formData.creditCardInformation : [];
        this.otherBankInformations = formData.otherBankAccountInformation ? formData.otherBankAccountInformation : [];
        this.selectedSourceOfFunds = formData.sourceOfFunds ? formData.sourceOfFunds : [];
        if (formData.birthCountryId && this.baseCountryId) {
            if (formData.birthCountryId === this.baseCountryId) {
                this.fetchBaseCountryDistricts();
                this.nrbBirthPlace = false;
            }
        }
        if (formData.foreignBirthPlace) {
            this.nrbBirthPlace = true;
        }

        if (formData.dateOfBirth) {
            this.calculateAge();
        }

        this.otherInformations = formData.otherInformation ? formData.otherInformation : [];
        this.otherInformationMapping();
        if (formData.occupations) {
            this.occupationComponent.addedOccupations = formData.occupations;
        }

        this.individualForm = this.formBuilder.group({
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
            dateOfBirth: [formData.dateOfBirth == null ? null : new Date(formData.dateOfBirth), [Validators.required]],//hacky
            phoneNumber: [formData.contactInformation.phoneNumber, [abbabilValidators.phoneNumberValidator]],
            mobileNumber: [formData.contactInformation.mobileNumber, [Validators.required, abbabilValidators.phoneNumberValidator]],
            alternateMobileNumber: [formData.contactInformation.alternateMobileNumber, [abbabilValidators.phoneNumberValidator]],
            email: [formData.contactInformation.email, [abbabilValidators.emailValidator]],
            fax: [formData.contactInformation.fax, [abbabilValidators.faxValidator]],
            occupations: [formData.occupations],
            monthlyIncome: [formData.monthlyIncome, [Validators.required, AbabilCustomValidators.isNumber]],
            classificationId: [formData.classificationId, [Validators.required]],
            birthCountryId: [formData.birthCountryId, [Validators.required]],
            birthPlaceId: [formData.birthPlaceId],
            foreignBirthPlace: [formData.foreignBirthPlace],
            residenceStatus: [formData.residenceStatus, [Validators.required]],
            sourceOfFundDescription: null,
            otherBankAccountNumber: null,
            otherBankName: null,
            otherBankBranchName: null,
            otherBankAccountTypes: null,
            creditCardNumber: null,
            creditCardBankName: null,
            creditCardTypes: null,
            passportNumber: [formData.foreignerInformation.passportNumber],
            visaType: [formData.foreignerInformation.visaType],
            visaValidity: [formData.foreignerInformation.visaValidity],
            foreignCountry: [formData.foreignerInformation.countryId],
            foreignAddress: [formData.foreignerInformation.foreignAddress],
            workPermitObtained: [formData.foreignerInformation.workPermitObtained],
            //relationWithGuardian: [formData.relationWithGuardian],
            permanentAdressaspresentChceker: null,
            profAdressaspermanentChceker: null,
            profAdressaspresentChceker: null,
            sourceOfFunds: null,
        });

        this.subscribers.fetchBaseCountryIdSub = this.cisMiscellaneousService.getConfiguration({ key: 'BASE_COUNTRY' }).subscribe(
            data => {
                this.baseCountryId = data.value;

                if (this.individualForm.get('birthCountryId').value == this.baseCountryId) {
                    this.nrbBirthPlace = false;
                    this.fetchBaseCountryDistricts();
                    this.individualForm.addControl('birthPlaceId', new FormControl('', [Validators.required]));
                    this.individualForm.removeControl('foreignBirthPlace');
                }
                else {
                    this.nrbBirthPlace = true;
                    this.individualForm.addControl('foreignBirthPlace', new FormControl('', [Validators.required]));
                    this.individualForm.removeControl('birthPlaceId');
                }
            }
        )


        this.individualForm.get('birthCountryId').valueChanges.subscribe(
            data => {
                if (this.individualForm.get('birthCountryId').value == this.baseCountryId) {
                    this.nrbBirthPlace = false;
                    this.fetchBaseCountryDistricts();
                    this.individualForm.addControl('birthPlaceId', new FormControl('', [Validators.required]));
                    this.individualForm.removeControl('foreignBirthPlace');
                }
                else {
                    this.nrbBirthPlace = true;
                    this.individualForm.addControl('foreignBirthPlace', new FormControl('', [Validators.required]));
                    this.individualForm.removeControl('birthPlaceId');
                }
            }
        )

        if (formData.maritalStatus == 'MARRIED') {
            this.individualForm.addControl('spouseName', new FormControl(formData.spouseName, [Validators.required, Validators.pattern(new RegExp(/^[a-z ,.'-]+$/i))]));
        } else {
            this.individualForm.removeControl('spouseName');
        }

        if (formData.residenceStatus === "RESIDENT") {
            this.nrbFieldsDisabled = true;
        }
        else if (formData.residenceStatus === "NON_RESIDENT") {
            this.nrbFieldsDisabled = false;
        }

        this.individualForm.get('residenceStatus').valueChanges.subscribe(
            data => {
                if (data === "RESIDENT") {
                    this.nrbFieldsDisabled = true;
                }
                else {
                    this.nrbFieldsDisabled = false;
                }
            }
        );

        this.individualForm.get('permanentAdressaspresentChceker').valueChanges.subscribe(
            permanentAdressaspresentChceker => {
                if (permanentAdressaspresentChceker) {
                    this.permanentAddress = this.presentAddressComponent.extractData();
                }
                else {
                    this.permanentAddress = new Address();
                }
            }
        )


        this.individualForm.get('profAdressaspermanentChceker').valueChanges.subscribe(
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


        this.individualForm.get('profAdressaspresentChceker').valueChanges.subscribe(
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

        this.individualForm.get('dateOfBirth').valueChanges.subscribe(
            date => {
                if (date) {
                    this.calculateAge();
                }
            }
        )


        this.individualForm.updateValueAndValidity();
        this.fetchSourceofFunds();
        this.fetchOccupations();
    }

    formInvalid() {
        if (!this.individualForm) return true;
        return (this.individualForm.invalid || this.presentAddressComponent.isInvalid() || this.permanentAddressComponent.isInvalid() || this.professionalAddressComponent.isInvalid() || this.selectedSourceOfFunds.length < 1 || this.occupationComponent.addedOccupations.length < 1);
    }

    formValid() {
        if (!this.individualForm) return false;
        return (this.individualForm.valid && this.presentAddressComponent.isValid() && this.permanentAddressComponent.isValid() && this.professionalAddressComponent.isValid() && this.selectedSourceOfFunds.length > 0 || this.occupationComponent.addedOccupations.length > 0);
    }

    extractData(): IndividualInformation {
        let individualInformation: IndividualInformation = this.individualForm.value;
        individualInformation.otherInformation = this.otherInformations;
        individualInformation.id = this.individualId;
        individualInformation.uuid = this.uuid;
        individualInformation.jsonType = 'individual';
        individualInformation.presentAddress = this.presentAddressComponent.extractData();
        individualInformation.permanentAddress = this.permanentAddressComponent.extractData();
        individualInformation.professionalAddress = this.professionalAddressComponent.extractData();
        let contactInformation = new ContactInformation();
        contactInformation.alternateMobileNumber = this.individualForm.controls['alternateMobileNumber'].value;
        contactInformation.email = this.individualForm.controls['email'].value;
        contactInformation.mobileNumber = this.individualForm.controls['mobileNumber'].value;
        contactInformation.phoneNumber = this.individualForm.controls['phoneNumber'].value;
        contactInformation.fax = this.individualForm.controls['fax'].value;
        individualInformation.contactInformation = contactInformation;
        individualInformation.occupations = this.occupationComponent.addedOccupations;
        individualInformation.otherBankAccountInformation = this.otherBankInformations;
        individualInformation.creditCardInformation = this.creditCardInformations;
        individualInformation.sourceOfFunds = this.selectedSourceOfFunds;
        individualInformation.foreignerInformation = new ForeignerInformation();
        individualInformation.foreignerInformation.id = this.foreignerId;
        individualInformation.foreignerInformation.countryId = this.individualForm.get('foreignCountry').value;
        individualInformation.foreignerInformation.foreignAddress = this.individualForm.get('foreignAddress').value;
        individualInformation.foreignerInformation.passportNumber = this.individualForm.get('passportNumber').value;
        individualInformation.foreignerInformation.visaType = this.individualForm.get('visaType').value;
        individualInformation.foreignerInformation.visaValidity = this.individualForm.get('visaValidity').value;
        individualInformation.foreignerInformation.workPermitObtained = this.individualForm.get('workPermitObtained').value;
        individualInformation.foreignerInformation = this.isEmpty(individualInformation.foreignerInformation) ? null :individualInformation.foreignerInformation;
        return individualInformation;
    }
    otherInformationMapping() {

        this.subscribers.fetchOtherInformationTopicsSub = this.cisMiscellaneousService.fetchOtherInformationTopics().subscribe(
            otherTopics => {
                this.otherInformationTopics = otherTopics;
                this.otherInformations = [...this.otherInformations, ...this.otherInformationTopics.filter(topic => {
                    return findIndex(this.otherInformations, function (obj) {
                        return obj.otherInformationTopic.id === topic.id;
                    }) < 0;
                }).map(filteredTopic => {
                    return {
                        customerInterviewed: false,
                        otherInformationTopic: filteredTopic,
                        permissionGranted: false,
                        status: false
                    }
                })];
            }
        )
    }

    fetchBaseCountryId() {
        this.subscribers.fetchBaseCountryIdSub = this.cisMiscellaneousService.getConfiguration({ key: 'BASE_COUNTRY' }).subscribe(
            data => {
                this.baseCountryId = data.value;
            }
        )
    }

    fetchBaseCountryDistricts() {
        this.subscribers.fetchDistrictssSub = this.ababilLocationService.fetchDistrictsByCountry({ countryId: this.baseCountryId })
            .subscribe(data => {
                this.baseCountryDistricts = data;
            });
    }

    fetchOccupations() {
        this.subscribers.fetchOccupationSub = this.cisService.fetchOccupations().subscribe(
            data => {
                this.occupations = data.content;

                this.occupations.forEach(element => {
                    this.occupationMap.set(element.id, element.name);
                });
                this.individualForm.updateValueAndValidity();
            }
        );
    }

    //source of fund add delete
    fetchSourceofFunds() {
        this.subscribers.fetchCustomerSourceOfFundSub = this.cisMiscellaneousService.getCustomerSourceOfFunds().subscribe(
            data => {
                this.mergedSourceOfFunds = [];
                let tempSourceOfFund: SelectItem = { label: "Select source of funds", value: null };
                this.mergedSourceOfFunds = [tempSourceOfFund, ...this.mergedSourceOfFunds];
                this.mergedSourceOfFunds = [{ label: "Select source of funds", value: null }, ...data.map(element => {
                    return { label: element.description, value: element.id }
                })];
                data.forEach(element => {
                    this.sourceOfundDescriptionMap.set(element.id, element.description);
                    this.sourceOfundRequireConditionMap.set(element.id, element.customDescriptionRequired);
                });
            }
        )
    }
    addSourceOfFunds() {
        this.selectedSourceOfFund = new SubjectSourceOfFund();
        if (this.individualForm.get('sourceOfFunds').value) {
            if (this.sourceOfundRequireConditionMap.get(this.individualForm.get('sourceOfFunds').value)) {
                if (this.individualForm.get('sourceOfFundDescription').value) {
                    this.selectedSourceOfFund.sourceId = this.individualForm.get('sourceOfFunds').value;
                    this.selectedSourceOfFund.description = this.individualForm.get('sourceOfFundDescription').value;
                    this.selectedSourceOfFunds = [this.selectedSourceOfFund, ...this.selectedSourceOfFunds];
                    this.individualForm.get('sourceOfFunds').reset();
                    this.individualForm.get('sourceOfFundDescription').reset();
                    this.sourceOfFundRequired = false;
                    this.sourceOfFundDescriptionRequired = false;
                }
                else {
                    this.sourceOfFundDescriptionRequired = true;
                }
            }


            else {
                this.selectedSourceOfFund.sourceId = this.individualForm.get('sourceOfFunds').value;
                this.selectedSourceOfFund.description = this.individualForm.get('sourceOfFundDescription').value;
                this.selectedSourceOfFunds = [this.selectedSourceOfFund, ...this.selectedSourceOfFunds];
                this.individualForm.get('sourceOfFunds').reset();
                this.individualForm.get('sourceOfFundDescription').reset();
                this.sourceOfFundRequired = false;
            }
        }

    }
    deleteSourceOfFund(index) {
        let temp = Object.assign([], this.selectedSourceOfFunds);
        temp.splice(index, 1);
        this.selectedSourceOfFunds = Object.assign([], temp);
        if (this.selectedSourceOfFunds.length < 1) this.sourceOfFundRequired = true;
    }
    //bank info add delete
    addBank() {
        if (this.individualForm.get('otherBankAccountNumber').value && this.individualForm.get('otherBankName').value && this.individualForm.get('otherBankBranchName').value && this.individualForm.get('otherBankAccountTypes').value)
            this.otherBankInformation = new OtherBankAccountInformation();
        this.otherBankInformation.accountNumber = this.individualForm.get('otherBankAccountNumber').value;
        this.otherBankInformation.bank = this.individualForm.get('otherBankName').value;
        this.otherBankInformation.branch = this.individualForm.get('otherBankBranchName').value;
        this.otherBankInformation.otherBankAccountType = this.individualForm.get('otherBankAccountTypes').value;
        this.otherBankInformations = [this.otherBankInformation, ...this.otherBankInformations];
        this.individualForm.get('otherBankAccountTypes').reset();
        this.individualForm.get('otherBankBranchName').reset();
        this.individualForm.get('otherBankName').reset();
        this.individualForm.get('otherBankAccountNumber').reset();
    }
    deleteOtherBank(index) {
        let temp = Object.assign([], this.otherBankInformations);
        temp.splice(index, 1);
        this.otherBankInformations = Object.assign([], temp);
    }
    //credit card info add delete
    addCreditCard() {
        this.creditCardInformation = new CreditCardInformation();
        this.creditCardInformation.creditCardNumber = this.individualForm.get('creditCardNumber').value;
        this.creditCardInformation.bank = this.individualForm.get('creditCardBankName').value;
        this.creditCardInformation.creditCardType = this.individualForm.get('creditCardTypes').value;
        this.creditCardInformations = [this.creditCardInformation, ...this.creditCardInformations];
        this.individualForm.get('creditCardNumber').reset();
        this.individualForm.get('creditCardBankName').reset();
        this.individualForm.get('creditCardTypes').reset();
    }
    deleteCreditCard(index) {
        let temp = Object.assign([], this.creditCardInformations);
        temp.splice(index, 1);
        this.creditCardInformations = Object.assign([], temp);
    }

    markAsTouched() {
        this.markFormGroupAsTouched(this.individualForm);
        this.permanentAddressComponent.markAsTouched();
        this.presentAddressComponent.markAsTouched();
        this.professionalAddressComponent.removeControl();
        if (this.selectedSourceOfFunds.length < 1) this.sourceOfFundRequired = true;
        if (this.occupationComponent.addedOccupations.length < 1) this.occupationComponent.occupationRequired = true;
    }
    fetchCustomerClassificationTypes() {
        this.subscribers.fetchCustomerClassificationTypesSub = this.cisMiscellaneousService.getCustomerClassificationTypes().
            subscribe(data => {
                this.customerClassificationTypes = data;
            });
    }
    // onCountrySelected() {
    //     if (this.individualForm.get('birthCountryId').value === this.baseCountryId) {
    //         this.nrbBirthPlace = false;
    //         this.fetchBaseCountryDistricts();
    //         this.individualForm.addControl('birthPlaceId', new FormControl('', [Validators.required]));
    //         this.individualForm.removeControl('foreignBirthPlace');
    //     }
    //     else {
    //         this.nrbBirthPlace = true;
    //         this.individualForm.addControl('foreignBirthPlace', new FormControl('', [Validators.required]));
    //         this.individualForm.removeControl('birthPlaceId');
    //     }
    // }
    onOtherInfoChange(otherInfo) {
        if (!otherInfo.status) {
            otherInfo.permissionGranted = false;
            otherInfo.customerInterviewed = false;
        }
    }

    calculateAge() {
        var today = new Date();
        var birthDate = new Date(this.individualForm.get('dateOfBirth').value);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age = age - 1;
        }
        this.onAgeCheck.emit(age);
    }

}