
export class Notice{

    chequeNumber:string;
    demandDepositAccountId:number;
    description:string;
    expireDate:Date;
    id:number;
    noticeAmount:number;
    noticeDate:Date;
    startDate:Date;

    constructor(){
        this.chequeNumber=null;
        this.demandDepositAccountId=null;
        this.description=null;
        this.id=null;
        this.noticeDate=null;
        this.startDate=new Date();
        this.expireDate=new Date();
        this.chequeNumber=null;

    }

}