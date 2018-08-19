import { IdentityInformation } from './identity.information.model';

export class Subject {
    id              : number;
    applicantTypeId   : number;
    jsonType         : string; 
    identityInformations : IdentityInformation[];
    active:boolean;
    sourceOfFunds : SubjectSourceOfFund[];

    constructor(){
        this.active =  false;
        this.identityInformations=[];
    }
}

export class SubjectSourceOfFund {
	sourceId:number; 
    description:string;
}

export class SourceOfFund {
	id:number;
    description:string;
    customDescriptionRequired:boolean;
}


