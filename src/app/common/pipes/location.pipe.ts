import { Pipe,PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ApplicantType } from '../../services/cis/domain/applicant.type.model';
import { Country } from '../../services/location/domain/country.models';

@Pipe({ name: 'countryPipe' })
export class CountryPipe implements PipeTransform {

  public transform(countries: any[]): SelectItem[] {
    if (!countries) return undefined;
    let transformedResult=[];
    transformedResult.push({label:"Choose a country",value: null});
    return transformedResult.concat(countries.map(country => ({ label: country.name, value: country.id })));
  }
}


@Pipe({ name: 'fatcaCountryPipe' })
export class FatcaCountryPipe implements PipeTransform {

  public transform(countries: Country[]): SelectItem[] {
    if (!countries) return undefined;
    let transformedResult=[];
    transformedResult.push({label:"Choose a country",value: null});
    return transformedResult.concat(countries.map(country => ({ label: country.name, value: country.isoAlpha2Code })));
  }
}


@Pipe({ name: 'divisionPipe' })
export class DivisionPipe implements PipeTransform {

  public transform(divisions: any[]): SelectItem[] {
    if (!divisions) return undefined;
    let transformedResult=[];
    transformedResult.push({label:"Choose a division",value: null});
    return transformedResult.concat(divisions.map(division => ({ label: division.name, value: division.id })));
  }

}

@Pipe({ name: 'districtPipe' })
export class DistrictPipe implements PipeTransform {

  public transform(districts: any[]): SelectItem[] {
    if (!districts) return undefined;
    let transformedResult=[];
    transformedResult.push({label:"Choose a district",value: null});
    return transformedResult.concat(districts.map(district => ({ label: district.name, value: district.id })));
  }

}

@Pipe({ name: 'upazillaPipe' })
export class UpazillaPipe implements PipeTransform {

  public transform(upazillas: any[]): SelectItem[] {
    if (!upazillas) return undefined;
    let transformedResult=[];
    transformedResult.push({label:"Choose a upazilla",value: null});
    return transformedResult.concat(upazillas.map(upazilla => ({ label: upazilla.name, value: upazilla.id })));
  }
}
  
@Pipe({ name: 'nationalityPipe' })
export class NationalityPipe implements PipeTransform {

  public transform(countries: any[]): SelectItem[] {
    if (!countries) return undefined;
    let transformedResult=[];
    transformedResult.push({label:"Choose a nationality",value: null});
    return transformedResult.concat(countries.map(country => ({ label: country.nationality, value: country.nationality })));
  }
}

  @Pipe({ name: 'postCodePipe' })
export class PostCodePipe implements PipeTransform {

  public transform(postCodes: any[]): SelectItem[] {
    if (!postCodes) return undefined;
    let transformedResult=[];
    transformedResult.push({label:"Choose a post code",value: null});
    return transformedResult.concat(postCodes.map(postCode => ({ label: postCode.code, value: postCode.id })));
  }
}



