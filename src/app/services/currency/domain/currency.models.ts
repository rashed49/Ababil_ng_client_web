export class Currency {
    id: number;
    name: string;
    code: string;
    numericCode: number;
    country:string;
    minorUnits:string;
    iso4217publishDate:Date;
    
    constructor() {
 
    }
}

export class ExchangeRateType {
    id: number;
    typeName: string;
    typeShortName: string;
}

export class ExchangeRate {
    id: number;
    rateTypeId: number;
    rateTypeName: string;
    currencyCode: string;
    rate: number;
    effectiveDate: Date;
}