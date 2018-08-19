

export class Error{
   
   private status:number;
   private statusText:string;
   private message:string;
   private i18nCode:string;

   constructor(status:number,i18nCode:string,statusText:string,message:string){
      this.status=status;
      this.i18nCode=i18nCode;
      this.message=message;
      this.statusText=statusText;      
   }



}