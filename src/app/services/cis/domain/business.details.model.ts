import { TypeOfBusiness } from './type.of.business.model';

export class BusinessDetails{
    typeOfBusinesses              : TypeOfBusiness[];
    typeOfProductAndService     : string;
    permanentManpower           : number;
    contractualManpower         : number;
    yearlyTurnover              : number;
    netWorth                    : number;
    monthlyTurnover             : number;
    otherInformation            : string;

    constructor(){
        this.permanentManpower=null;
        this.contractualManpower=null;
        this.netWorth=null;
        this.yearlyTurnover=null;
        this.otherInformation=null;
        this.typeOfBusinesses = [];
    }
}