import { IndividualInformation } from '../../../../services/cis/domain/individual.model'
import { Owner } from './organization.owner';

export class IndividualOwner extends IndividualInformation implements Owner {
    ownerTypeId: number;
    sharePercentage: number;

    public getOwnerTypeId(): number {
        return this.ownerTypeId;
    }
    public setOwnerTypeId(ownerTypeId: number) {
        this.ownerTypeId = ownerTypeId;
    }

    public getSharePercentage(): number {
        return this.sharePercentage;
    }

    public setSharePercentage(sharePercentage: number): void {
        this.sharePercentage = sharePercentage;
    }


    public getType(): string {
        return 'INDIVIDUAL';
    }
    constructor(individual: IndividualInformation) {
        super();

        this.firstName = individual.firstName;
        this.middleName = individual.middleName;
        this.lastName = individual.lastName;

        this.fathersFirstName = individual.fathersFirstName;
        this.fathersMiddleName = individual.fathersMiddleName;
        this.fathersLastName = individual.fathersLastName;

        this.mothersFirstName = individual.mothersFirstName;
        this.mothersMiddleName = individual.mothersMiddleName;
        this.mothersLastName = individual.mothersLastName;

        this.maritalStatus = individual.maritalStatus;
        this.spouseName = individual.spouseName;
        this.dateOfBirth = individual.dateOfBirth;
        this.gender = individual.gender;
        this.nationality = individual.nationality;
        this.birthCountryId = individual.birthCountryId;
        this.birthPlaceId = individual.birthPlaceId;
        this.foreignBirthPlace = individual.foreignBirthPlace;
        this.guardianId = individual.guardianId;
        this.relationWithGuardian = individual.relationWithGuardian;

        this.contactInformation = individual.contactInformation;
        this.presentAddress = individual.presentAddress;
        this.permanentAddress = individual.permanentAddress;
        this.professionalAddress = individual.professionalAddress;
        this.sourceOfFunds = individual.sourceOfFunds;

        this.residenceStatus = individual.residenceStatus;
        this.foreignerInformation = individual.foreignerInformation;
        this.uuid = individual.uuid;
        this.occupations = individual.occupations;
        this.classificationId = individual.classificationId;
        this.monthlyIncome = individual.monthlyIncome;
        this.otherBankAccountInformation = individual.otherBankAccountInformation;
        this.creditCardInformation = individual.creditCardInformation;
        this.otherInformation = individual.otherInformation;
        this.documents = individual.documents;
        this.fatcaCisIndividualInformation = individual.fatcaCisIndividualInformation;
        this.foreignAccountTaxComplianceActIds = individual.foreignAccountTaxComplianceActIds;
    }

    getId() {
        return this.id;
    }
}
