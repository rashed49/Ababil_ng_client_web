import { element } from 'protractor';
import { FatcaCisIndividualInformation } from './../../../../services/cis/domain/fatca.cis.individual.information';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, Input, SimpleChanges } from '@angular/core';
import { BaseComponent } from './../../../../common/components/base.component';
import { FatcaDescriptionService } from '../../../../services/cis/service-api/fatca.description.service';
import { FatcaDescription } from '../../../../services/cis/domain/fatca.description';
import { ContactInformation } from '../../../../services/cis/domain/contact.information.model';
import { AbabilLocationService } from '../../../../services/location/service-api/location.service';
import { Country } from '../../../../services/location/domain/country.models';
import { Occupation } from '../../../../services/cis/domain/individual.model';
import { CISMiscellaneousService } from '../../../../services/cis/service-api/cis.misc.service';
import { SelectItem } from 'primeng/api';
import { CISService } from '../../../../services/cis/service-api/cis.service';
import { ForeignResidentialAddress } from '../../../../services/cis/domain/foreign.residential.address';
import { UsaTinInformation } from '../../../../services/cis/domain/usa.tin.information';
import { PassportAndVisaInformation } from '../../../../services/cis/domain/passport.and.visa.information';

@Component({
    selector: 'fatca-form',
    templateUrl: './fatca.form.component.html'
})
export class FatcaFormComponent extends BaseComponent implements OnInit {

    fatcaDescriptions: FatcaDescription[] = [];
    fatcaForm: FormGroup;
    contactInformation: ContactInformation = new ContactInformation();
    countries: Country[];
    entityTypes: any[];
    occupationTypes: any[];
    fatcaIdOnGet: number;
    @ViewChild('occupationComponent') occupationComponent: any;
    @ViewChild('contactInformationComponent') contactInformationComponent: any;
    @Input('fatcaCisIndividualInformation') fatcaCisIndividualInformation: any;
    @Input('foreignAccountTaxComplianceActs') foreignAccountTaxComplianceActs: number[];

    constructor(private formBuilder: FormBuilder,
        private fatcaDescriptionService: FatcaDescriptionService, private ababilLocationService: AbabilLocationService,
        private cisMiscService: CISMiscellaneousService,
        private cisService: CISService) {
        super();
    }

    ngOnInit(): void {
        this.fetchOccupations();
        this.ababilLocationService.fetchCountries().subscribe(data => {
            this.countries = data;
        })

        this.cisMiscService.fetchFatcaEntityTypes().subscribe(data =>
            this.entityTypes = data.content
        )
        this.fetchFatcaDescriptions();

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.fatcaCisIndividualInformation) {
            this.prepareFatcaForm(changes.fatcaCisIndividualInformation.currentValue);
        }

        if (changes.foreignAccountTaxComplianceActs.currentValue.length > 0) {
            this.foreignAccountTaxComplianceActs = changes.foreignAccountTaxComplianceActs.currentValue;
            this.fetchFatcaDescriptions();
        }
    }

    fetchOccupations() {
        this.subscribers.fetchOccupationSub = this.cisService.fetchOccupations().subscribe(
            data => {
                this.occupationTypes = data.content;
            }
        );
    }

    fetchFatcaDescriptions() {
        this.subscribers.fetchFatcaDescriptionsSub = this.fatcaDescriptionService
            .fetchFatcaDescriptions()
            .subscribe(data => {
                if (data !== null && this.foreignAccountTaxComplianceActs !== null) {
                    data.map(element => {
                        element.isChecked = this.foreignAccountTaxComplianceActs
                            .filter(fatca => fatca === element.id)
                            .length > 0 ? true : false;
                    });
                }

                this.fatcaDescriptions = [...data];

                this.prepareFatcaForm(this.fatcaCisIndividualInformation);
            });
    }

    prepareFatcaForm(formData: FatcaCisIndividualInformation) {
        if (!formData) { formData = new FatcaCisIndividualInformation(); }
        this.contactInformation = formData.contactInformation ? formData.contactInformation : new ContactInformation();
        formData.residentialAddress = formData.residentialAddress ? formData.residentialAddress : new ForeignResidentialAddress();
        formData.usTinInformation = formData.usTinInformation ? formData.usTinInformation : new UsaTinInformation();
        formData.passportAndVisaInfo = formData.passportAndVisaInfo ? formData.passportAndVisaInfo : new PassportAndVisaInformation();
        if (formData.id) this.fatcaIdOnGet = formData.id;
        this.fatcaForm = this.formBuilder.group({

            hostBranchId: [formData.hostBranchId],
            individualId: [formData.individualId],
            street: [formData.residentialAddress.street,[Validators.required]],
            buildingIdentifier: [formData.residentialAddress.buildingIdentifier],
            suitIdentifier: [formData.residentialAddress.suitIdentifier],
            floorIdentifier: [formData.residentialAddress.floorIdentifier],
            districtName: [formData.residentialAddress.districtName],
            poBoxNumber: [formData.residentialAddress.poBoxNumber],
            postCode: [formData.residentialAddress.postCode,[Validators.required]],
            cityOrTown: [formData.residentialAddress.cityOrTown,[Validators.required]],
            stateOrProvince: [formData.residentialAddress.stateOrProvince],
            country: [formData.residentialAddress.country, [Validators.required]],
            passportNumber: [formData.passportAndVisaInfo.passportNumber, [Validators.required]],
            issuanceDateOfPassport: [formData.passportAndVisaInfo.issuanceDateOfPassport == null ? null: new Date(formData.passportAndVisaInfo.issuanceDateOfPassport), [Validators.required]],
            placeOfIssue: [formData.passportAndVisaInfo.placeOfIssue, [Validators.required]],
            visaIssuingAuthority: [formData.passportAndVisaInfo.visaIssuingAuthority, [Validators.required]],
            issuanceDateOfVisa: [formData.passportAndVisaInfo.issuanceDateOfVisa == null ? null : new Date(formData.passportAndVisaInfo.issuanceDateOfVisa), [Validators.required]],
            expiryDateOfVisa: [formData.passportAndVisaInfo.expiryDateOfVisa == null ? null : new Date(formData.passportAndVisaInfo.expiryDateOfVisa), [Validators.required]],
            dateOfBirth: [formData.dateOfBirth == null ? null : new Date(formData.dateOfBirth), [Validators.required]],
            birthCountry: [formData.birthCountry, [Validators.required]],
            permanentResidenceOrGreenCardNo: [formData.permanentResidenceOrGreenCardNo, [Validators.minLength(9)]],
            fatcaId: [formData.fatcaId],
            socialSecurityNumber: [formData.usTinInformation.socialSecurityNumber, [Validators.required, Validators.minLength(9)]],
            individualTaxpayerIdentificationNumber: [formData.usTinInformation.individualTaxpayerIdentificationNumber, [Validators.required, Validators.minLength(9)]],
            prepareTaxpayerIdentificationNumber: [formData.usTinInformation.prepareTaxpayerIdentificationNumber, [Validators.required, Validators.minLength(8)]],
            employerIdentificationNumber: [formData.usTinInformation.employerIdentificationNumber, [Validators.required, Validators.minLength(9)]],
            adoptionTaxpayerIdentificationNumber: [formData.usTinInformation.adoptionTaxpayerIdentificationNumber, [Validators.required, Validators.minLength(9)]],
            occupationId: [formData.occupationId]

        });
    }

    extractforeignAccountTaxComplianceActs() { //to get the list of fatcas
        let tempForeignAccountTaxComplianceActs = [];
        this.fatcaDescriptions.forEach(element => {
            if (element.isChecked) {
                tempForeignAccountTaxComplianceActs.push(element.id);
            }
        });
        this.foreignAccountTaxComplianceActs = [...tempForeignAccountTaxComplianceActs];
        return [...this.foreignAccountTaxComplianceActs];
    }

    extractFatcaCisIndividualInformation() { //to get fatca form data
        let fatcaToReturn = new FatcaCisIndividualInformation();
        fatcaToReturn = this.fatcaForm.value;

        fatcaToReturn.residentialAddress = new ForeignResidentialAddress();
        fatcaToReturn.residentialAddress.buildingIdentifier = this.fatcaForm.controls.buildingIdentifier.value;
        fatcaToReturn.residentialAddress.cityOrTown = this.fatcaForm.controls.cityOrTown.value;
        fatcaToReturn.residentialAddress.country = this.fatcaForm.controls.country.value;
        fatcaToReturn.residentialAddress.districtName = this.fatcaForm.controls.districtName.value;
        fatcaToReturn.residentialAddress.floorIdentifier = this.fatcaForm.controls.floorIdentifier.value;
        fatcaToReturn.residentialAddress.poBoxNumber = this.fatcaForm.controls.poBoxNumber.value;
        fatcaToReturn.residentialAddress.postCode = this.fatcaForm.controls.postCode.value;
        fatcaToReturn.residentialAddress.stateOrProvince = this.fatcaForm.controls.stateOrProvince.value;
        fatcaToReturn.residentialAddress.street = this.fatcaForm.controls.street.value;
        fatcaToReturn.residentialAddress.suitIdentifier = this.fatcaForm.controls.suitIdentifier.value;

        fatcaToReturn.passportAndVisaInfo = new PassportAndVisaInformation();
        fatcaToReturn.passportAndVisaInfo.expiryDateOfVisa = this.fatcaForm.controls.expiryDateOfVisa.value;
        fatcaToReturn.passportAndVisaInfo.issuanceDateOfPassport = this.fatcaForm.controls.issuanceDateOfPassport.value;
        fatcaToReturn.passportAndVisaInfo.issuanceDateOfVisa = this.fatcaForm.controls.issuanceDateOfVisa.value;
        fatcaToReturn.passportAndVisaInfo.passportNumber = this.fatcaForm.controls.passportNumber.value;
        fatcaToReturn.passportAndVisaInfo.placeOfIssue = this.fatcaForm.controls.placeOfIssue.value;
        fatcaToReturn.passportAndVisaInfo.visaIssuingAuthority = this.fatcaForm.controls.visaIssuingAuthority.value;

        fatcaToReturn.usTinInformation = new UsaTinInformation();
        fatcaToReturn.usTinInformation.adoptionTaxpayerIdentificationNumber = this.fatcaForm.controls.adoptionTaxpayerIdentificationNumber.value;
        fatcaToReturn.usTinInformation.employerIdentificationNumber = this.fatcaForm.controls.employerIdentificationNumber.value;
        fatcaToReturn.usTinInformation.individualTaxpayerIdentificationNumber = this.fatcaForm.controls.individualTaxpayerIdentificationNumber.value;
        fatcaToReturn.usTinInformation.prepareTaxpayerIdentificationNumber = this.fatcaForm.controls.prepareTaxpayerIdentificationNumber.value;
        fatcaToReturn.usTinInformation.socialSecurityNumber = this.fatcaForm.controls.socialSecurityNumber.value;

        fatcaToReturn.contactInformation = this.contactInformationComponent.extractData();

        if (this.fatcaIdOnGet) fatcaToReturn.id = this.fatcaIdOnGet;
        else fatcaToReturn.id = 0;

        fatcaToReturn = this.isEmpty(fatcaToReturn) ? null : fatcaToReturn;
        return fatcaToReturn;
    }

    displayFatcaForm() {
        if (this.fatcaDescriptions.filter(fatca => fatca.isChecked).length > 0) {
            return true;
        } else {
            this.fatcaForm.reset();
            this.contactInformation = new ContactInformation();
            return false;
        }
    }
    markAsTouched() {
        this.markFormGroupAsTouched(this.fatcaForm);
        this.contactInformationComponent.markAsTouched(this.contactInformation);
    }

    formInvalid() {
        if (!this.fatcaForm) return true;
        return ((this.fatcaForm.invalid || this.contactInformationComponent.isInvalid()) && this.fatcaDescriptions.filter(fatca => fatca.isChecked).length > 0);
    }

    formValid() {
        if (!this.fatcaForm) return false;
        return (this.fatcaForm.valid);
    }
}