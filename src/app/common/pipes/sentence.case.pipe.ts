import { Pipe,PipeTransform } from '@angular/core';

@Pipe({ name: 'sentenceCasePipe'})
export class SentenceCasePipe implements PipeTransform {
    public transform(inputString:string):string{

        if(inputString){
            let outputString:string;
            outputString=inputString.replace(/_/g," ");
            outputString=outputString.toLowerCase();
            outputString=outputString.charAt(0).toUpperCase() + outputString.slice(1);
            return outputString; 
        }
        

    }

}