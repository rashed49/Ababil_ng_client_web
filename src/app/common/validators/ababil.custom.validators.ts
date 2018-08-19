import { AbstractControl, ValidationErrors } from '@angular/forms';

export class AbabilCustomValidators {


    static isNumber(control: AbstractControl): ValidationErrors | null {
        if (isNaN(control.value) || typeof control.value !== 'number') {
            return {
                isNumber: true
            };
        }   
    }



}