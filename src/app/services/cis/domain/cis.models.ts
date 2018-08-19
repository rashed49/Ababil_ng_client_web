export let CustomerTypes =[{label: 'Single', value: 'INDIVIDUAL_SINGLE'},
{label: 'Joint', value: 'INDIVIDUAL_JOINT'},
{label: 'Organization', value: 'ORGANIZATION'}];


export class Customer{
    id?:number;
    name?:string;
    customerType?:string;
    active?:boolean;
    applicantId?: number;
    relationshipOfficer?: string;
   
    constructor(){
       
    }  

}
