import { Subject } from "./subject.model"
import { ContactInformation } from "./contact.information.model"
import { Address } from "./address.model"
import { BusinessDetails } from "./business.details.model"
import { InstituteOwnerInformation } from "./institute.owner.information.model"
import { Document } from "../../document/domain/document.models";


export class Organization extends Subject {
  name: string;
  organizationTypeId: number;
  contactInformation: ContactInformation;
  businessAddress: Address;
  factoryAddress: Address;
  registeredAddress: Address;
  businessDetails: BusinessDetails;
  // instituteOwnerInformations  : InstituteOwnerInformation[];
  uuid: string;
  documents: Document[];

  constructor() {
    super();
    this.name = null;
    this.factoryAddress = new Address();
    this.businessAddress = new Address();
    this.registeredAddress = new Address();

    this.businessDetails = new BusinessDetails();
    this.contactInformation = new ContactInformation();
    this.jsonType = "organization";
    this.identityInformations = [];
    this.documents = [];
  }
  transformServerModel() {
    if (this.factoryAddress == null) {
      this.factoryAddress = new Address();
    }
    if (this.businessAddress == null) {
      this.businessAddress = new Address();
    }
    if (this.businessDetails == null) {
      this.businessDetails = new BusinessDetails();
    }
    if (this.contactInformation == null) {
      this.contactInformation = new ContactInformation();
    }
    // return this;
  }

}

export class OrganizationType {
  id: number;
  typeName: string;
}