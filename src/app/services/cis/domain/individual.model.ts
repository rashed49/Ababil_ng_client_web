import { ContactInformation } from './contact.information.model';
import { Address } from './address.model';
import { Subject } from './subject.model';
import { OtherInformationTopics } from './other.information.topics.model';

import { Document } from '../../document/domain/document.models';

import { FatcaCisIndividualInformation } from './fatca.cis.individual.information';


export class IndividualInformation extends Subject {
    firstName?: string;
    middleName?: string;
    lastName?: string;

    fathersFirstName?: string;
    fathersMiddleName?: string;
    fathersLastName?: string;

    mothersFirstName?: string;
    mothersMiddleName?: string;
    mothersLastName?: string;

    maritalStatus?: string;
    spouseName?: string;
    dateOfBirth?: Date;
    gender?: string;
    nationality?: string;
    birthCountryId: number;
    birthPlaceId: number;
    foreignBirthPlace: string;

    guardianId: number;
    relationWithGuardian: string;

    contactInformation?: ContactInformation;
    presentAddress?: Address;
    permanentAddress?: Address;
    professionalAddress?: Address;
    residenceStatus?: string;

    foreignerInformation?: ForeignerInformation;

    uuid?: string;
    occupations: Occupation[];
    classificationId?: number;
    monthlyIncome?: number;

    otherBankAccountInformation: OtherBankAccountInformation[];
    creditCardInformation: CreditCardInformation[];

    otherInformation: OtherInformation[];

    documents: Document[];


    fatcaCisIndividualInformation: FatcaCisIndividualInformation;
    foreignAccountTaxComplianceActIds: number[];

    constructor() {
        super();
        this.jsonType = "individual";
        this.birthCountryId=null;
        this.contactInformation = new ContactInformation();
        this.presentAddress = new Address();
        this.permanentAddress = new Address();
        this.professionalAddress = new Address();
        this.foreignerInformation = new ForeignerInformation();
        //this.documents = new Document();
        this.fatcaCisIndividualInformation = new FatcaCisIndividualInformation();

    }

}

export class Occupation {
    description: string;
    id: number;
    individualId: number;
    occupationTypeId: number;
}
export class OtherBankAccountInformation {
    accountNumber: string;
    bank: string;
    branch: string;
    id: number;
    otherBankAccountType: string;
}

export class CreditCardInformation {
    bank: string;
    creditCardNumber: string;
    creditCardType: string;
    id: number;
}

export class ForeignerInformation {
    id:number;
    countryId: number;
    foreignAddress: string;
    passportNumber: string;
    visaType: string;
    visaValidity: string;
    workPermitObtained: boolean;
    constructor() {
        this.id = null;
        this.countryId = null;
        this.foreignAddress = null;
        this.passportNumber = null;
        this.visaType = null;
        this.visaValidity = null;
     
    }

}

export class OtherInformation {
    id?: number;
    status?: boolean;
    permissionGranted?: boolean;
    customerInterviewed?: boolean;
    individualId?: number;
    otherInformationTopic?: OtherInformationTopics;

    constructor() {
        this.otherInformationTopic = new OtherInformationTopics();
    }
}


