import { Pipe,PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { SpecialInstructionType } from '../../services/special-instruction/domain/special.instruction.models';

@Pipe({ name: 'instructionTypePipe' })
export class InstructionTypePipe implements PipeTransform {

  public transform(specialInstructionTypes: SpecialInstructionType[]): SelectItem[] {
    if (!specialInstructionTypes) return undefined;
    let transformedResult=[];
     transformedResult.push({label:"Select Special Instruction Type",value:null});
 return transformedResult.concat(specialInstructionTypes.map(specialInstructionType => ({ label: specialInstructionType.name, value:specialInstructionType  })));
}

}