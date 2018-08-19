import {Organization} from '../../../../services/cis/domain/organization.model'


export function mapper(orgFormData : any) : Organization  {
    // let organization : Organization = {
    //     jsonType:'organization',
    //     name : orgFormData.name,
    //     organizationTypeId : orgFormData.organizationTypeId,
    //     contactInformation : {
    //         alternateMobileNumber   : orgFormData.contactAlternateMobileNumber,
    //         email                   : orgFormData.contactEmail,
    //         fax                     : orgFormData.contactFax,
    //         mobileNumber            : orgFormData.contactMobileNumber,
    //         phoneNumber             : orgFormData.contactPhoneNumber
    //     },

    //     businessAddress : {
    //         addressLine1    : orgFormData.businessAddressLine1,
    //         addressLine2    : orgFormData.businessAddressLine2,
    //         addressLine3    : orgFormData.businessAddressLine3,
    //         districtId      : orgFormData.businessAdressDistrictId,
    //         upazillaId      : orgFormData.businessAdressUpazillaId,
    //         postCodeId      : orgFormData.businessAdressPostCodeId,
    //         countryId       : orgFormData.businessAdressCountryId,
    //         divisionId      : null
    //     },

    //     factoryAddress : {
    //         addressLine1    : orgFormData.factoryAddressLine1,
    //         addressLine2    : orgFormData.factoryAddressLine2,
    //         addressLine3    : orgFormData.factoryAddressLine3,
    //         districtId      : orgFormData.factoryAdressDistrictId,
    //         upazillaId      : orgFormData.factoryAdressUpazillaId,
    //         postCodeId      : orgFormData.factoryAdressPostCodeId,
    //         countryId       : orgFormData.factoryAdressCountryId,
    //         divisionId      : null
    //     },

    //     registeredAddress : {
    //         addressLine1    : orgFormData.registeredAddressLine1,
    //         addressLine2    : orgFormData.registeredAddressLine2,
    //         addressLine3    : orgFormData.registeredAddressLine3,
    //         districtId      : orgFormData.registeredAdressDistrictId,
    //         upazillaId      : orgFormData.registeredAdressUpazillaId,
    //         postCodeId      : orgFormData.registeredAdressPostCodeId,
    //         countryId       : orgFormData.registeredAdressCountryId,
    //         divisionId      : null
    //     },

    //     businessDetails : {
    //         typeOfBusiness              : orgFormData.typeOfBusiness,
    //         typeOfProductAndService     : orgFormData.typeOfProductAndService,
    //         permanentManpower           : orgFormData.permanentManpower,
    //         contractualManpower         : orgFormData.contractualManpower,
    //         yearlyTurnover              : orgFormData.yearlyTurnover,
    //         netWorth                    : orgFormData.netWorth,
    //         otherInformation            : orgFormData.otherInformation
    //     },

    //     identityInformations:orgFormData.identityInformations,
    //     transformServerModel(): Organization {
    //         return this;
    //     }
    // }
    return null;
}