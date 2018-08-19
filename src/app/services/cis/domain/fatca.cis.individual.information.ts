import { Occupation } from '../../../services/cis/domain/individual.model';
import { ContactInformation } from './contact.information.model';
import { PassportAndVisaInformation } from './passport.and.visa.information';
import { UsaTinInformation } from './usa.tin.information';
import { ForeignResidentialAddress } from './foreign.residential.address';

export class FatcaCisIndividualInformation {
    id: number;
    hostBranchId: number;
    individualId: number;
    residentialAddress: ForeignResidentialAddress;
    contactInformation: ContactInformation;
    passportAndVisaInfo: PassportAndVisaInformation;
    dateOfBirth: Date;
    birthCountry: String;
    permanentResidenceOrGreenCardNo: String;
    occupationId: number;
    fatcaId: number;
    usTinInformation: UsaTinInformation;

    constructor() {
        this.contactInformation = new ContactInformation();
        this.passportAndVisaInfo = new PassportAndVisaInformation();
        this.usTinInformation = new UsaTinInformation();
        this.residentialAddress = new ForeignResidentialAddress();
    }
}
