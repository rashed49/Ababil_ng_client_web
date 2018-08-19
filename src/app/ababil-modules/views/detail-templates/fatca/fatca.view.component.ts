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
    selector: 'fatca-view',
    templateUrl: './fatca.view.component.html'
})
export class FatcaViewComponent extends BaseComponent implements OnInit {

    fatcaDescriptions: FatcaDescription[] = [];
    contactInformation: ContactInformation = new ContactInformation();
    countries: Country[];
    entityTypes: any[];
    occupationTypes: any[];
    fatcaIdOnGet: number;
    @ViewChild('occupationComponent') occupationComponent: any;
    @ViewChild('contactInformationComponent') contactInformationComponent: any;
    @Input('fatcaCisIndividualInformation') fatcaCisIndividualInformation: FatcaCisIndividualInformation;
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
        });
        this.cisMiscService.fetchFatcaEntityTypes().subscribe(data =>
            this.entityTypes = data.content
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.fatcaCisIndividualInformation) {
            if (changes.fatcaCisIndividualInformation.currentValue.passportAndVisaInfo && changes.fatcaCisIndividualInformation.currentValue.dateOfBirth) {

                let fatcaFromChange = changes.fatcaCisIndividualInformation.currentValue;
                fatcaFromChange.passportAndVisaInfo.issuanceDateOfPassport == null ? fatcaFromChange.passportAndVisaInfo.issuanceDateOfPassport = null : fatcaFromChange.passportAndVisaInfo.issuanceDateOfPassport = new Date(fatcaFromChange.passportAndVisaInfo.issuanceDateOfPassport);
                fatcaFromChange.passportAndVisaInfo.issuanceDateOfVisa == null ? fatcaFromChange.passportAndVisaInfo.issuanceDateOfVisa = null : fatcaFromChange.passportAndVisaInfo.issuanceDateOfVisa = new Date(fatcaFromChange.passportAndVisaInfo.issuanceDateOfVisa);
                fatcaFromChange.passportAndVisaInfo.expiryDateOfVisa == null ? fatcaFromChange.passportAndVisaInfo.expiryDateOfVisa = null : fatcaFromChange.passportAndVisaInfo.expiryDateOfVisa = new Date(fatcaFromChange.passportAndVisaInfo.expiryDateOfVisa);
                fatcaFromChange.dateOfBirth == null ? fatcaFromChange.dateOfBirth = null : fatcaFromChange.dateOfBirth = new Date(fatcaFromChange.dateOfBirth);

                this.fatcaCisIndividualInformation = fatcaFromChange;
            }
            changes.fatcaCisIndividualInformation.currentValue.residentialAddress = changes.fatcaCisIndividualInformation.currentValue.residentialAddress ? changes.fatcaCisIndividualInformation.currentValue.residentialAddress : new ForeignResidentialAddress();
            changes.fatcaCisIndividualInformation.currentValue.usTinInformation = changes.fatcaCisIndividualInformation.currentValue.usTinInformation ? changes.fatcaCisIndividualInformation.currentValue.usTinInformation : new UsaTinInformation();
            changes.fatcaCisIndividualInformation.currentValue.passportAndVisaInfo = changes.fatcaCisIndividualInformation.currentValue.passportAndVisaInfo ? changes.fatcaCisIndividualInformation.currentValue.passportAndVisaInfo : new PassportAndVisaInformation();


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
            });
    }

    extractforeignAccountTaxComplianceActs() {
        let tempForeignAccountTaxComplianceActs = [];
        this.fatcaDescriptions.forEach(element => {
            if (element.isChecked) {
                tempForeignAccountTaxComplianceActs.push(element.id);
            }
        });
        this.foreignAccountTaxComplianceActs = [...tempForeignAccountTaxComplianceActs];
        return [...this.foreignAccountTaxComplianceActs];
    }

    displayFatcaForm() {
        if (this.fatcaDescriptions.filter(fatca => fatca.isChecked).length > 0) {
            return true;
        } else {
            this.contactInformation = new ContactInformation();
            return false;
        }
    }

}