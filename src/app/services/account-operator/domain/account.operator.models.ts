export class AccountOperatorInformation {
    id?: number;
    instruction?: string;
    accountId?: number;
}

export class AccountSignatory {
    id?: number;
    uuid?: string;
    signatoryType?: string;
    signatoryName?: string;
    mobileNumber?: string;
    individualId?: number;
    remarks?: string;
    dateFrom?: Date;
    dateTo?: Date;
    signature?:any;
    accountOperatorInformationId?: number;

    constructor(){
        this.uuid=null;
        this.signatoryType=null;
        this.signatoryName=null;
        this.id=null;
        this.remarks=null;
        this.dateFrom=new Date();
        this.dateTo=new Date();
        this.accountOperatorInformationId=null;
        this.mobileNumber = null;
        this.individualId = null;
        this.signature = null;

    }

    
}

export let SignatoryType = [
    {label:"Select Signatory Type",value:null},
    {label:"Owner",value:"OWNER"},
    {label:"Nominated",value:"NOMINATED"}
]