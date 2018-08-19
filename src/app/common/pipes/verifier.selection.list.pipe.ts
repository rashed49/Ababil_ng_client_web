import { Pipe,PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';


@Pipe({ name: 'verifierSelectionPipe' })
export class VerifierSelectionListPipe implements PipeTransform {

  public transform(verifiers: string[]): SelectItem[] {
    if (!verifiers) return undefined;
    let transformedResult=[];
    transformedResult.push({label:"Select Verifier",value:null});
    return transformedResult.concat(verifiers.map(verifier => ({ label: verifier, value: verifier })));
  }

}