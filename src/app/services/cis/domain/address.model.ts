export class Address {
    addressLine    : string;
    districtId      : number;
    upazillaId      : number;
    postCodeId      : number;
    countryId       : number;
    divisionId      : number;

    constructor(){
        this.addressLine=null;
        this.postCodeId=0;
        this.districtId=0;
        this.upazillaId=0;
        this.countryId=0;
        this.divisionId=0;
    }
}

export class PostCode {
    id: number;
    code: string;
    name: string;
    upazilla: any;

}