import { Pipe,PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { SpecialInstructionType } from '../../services/special-instruction/domain/special.instruction.models';

@Pipe({ name: 'occupationPipe' })
export class OccupationPipe implements PipeTransform {

  public transform(occupations: any[]): SelectItem[] {
    if (!occupations) return undefined;
    let transformedResult=[];
    transformedResult.push({label:"Select Occupation",value:null});
    return transformedResult.concat(occupations.map(occupation => ({ label: occupation.name, value:occupation.id})));
  }

}