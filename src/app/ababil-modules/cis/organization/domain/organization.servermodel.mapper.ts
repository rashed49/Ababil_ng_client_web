import {Organization} from '../../../../services/cis/domain/organization.model';
import {Address} from '../../../../services/cis/domain/address.model';
import {BusinessDetails} from '../../../../services/cis/domain/business.details.model';
import {ContactInformation} from '../../../../services/cis/domain/contact.information.model';
import {OrganizationOwner} from './organization.owner.model';

export function orgMapper(org: Organization): Organization  {
    if(org.businessAddress == null){
    org.businessAddress = new Address();
    }
    if(org.businessDetails == null ){
        org.businessDetails = new BusinessDetails();
    }
    if(org.contactInformation == null){
        org.contactInformation = new ContactInformation();
    }
    if(org.factoryAddress == null){
        org.factoryAddress = new Address();
    }
    if (org.registeredAddress == null){
        org.registeredAddress = new Address();
    }
    return org;
}


export function orgOwnerMapper(orgOwner: OrganizationOwner): OrganizationOwner  {
    if(orgOwner.businessAddress == null){
        orgOwner.businessAddress = new Address();
    }
    if(orgOwner.businessDetails == null ){
        orgOwner.businessDetails = new BusinessDetails();

    }
    if(orgOwner.contactInformation == null){
        orgOwner.contactInformation = new ContactInformation();
    }
    if(orgOwner.factoryAddress == null){
        orgOwner.factoryAddress = new Address();
    }
    if (orgOwner.registeredAddress == null){
        orgOwner. registeredAddress = new Address();
    }    
    return orgOwner;
}
