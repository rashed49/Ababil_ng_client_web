import { Component, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

export const CUSTOM_ACCOUNT_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AccountNumberComponent),
    multi: true
};

@Component({
    selector: 'acc-number',
    templateUrl: 'account.number.component.html',
    providers: [
        CUSTOM_ACCOUNT_INPUT_CONTROL_VALUE_ACCESSOR
    ],    
})
export class AccountNumberComponent implements ControlValueAccessor{

    //The internal data model
    branchCode: string = '';
    accNumber : string = '';

    //Placeholders for the callbacks which are later provided
    //by the Control Value Accessor
    private onTouchedCallback: () => void = () => {};
    private onChangeCallback: (_: any) => void = () => {};

    //get accessor
    get value(): any {
        return this.branchCode + this.accNumber;
    };

    //set accessor including call the onchange callback
    set value(v: any) {
        // if (v !== this.innerValue) {
        //     this.innerValue = v;
        //     this.onChangeCallback(v);
        // }
        if( v !== null){
            if(v.length>3){
                this.branchCode = v.substr(0,3);
                this.accNumber = v.substr(3,v.length-1);
            }else{
                this.branchCode = v.substr(0,v.length-1);
            }
            
        }

        this.onChangeCallback(this.value);
         
    }

    //Set touched on blur
    onBlur() {
        this.onTouchedCallback();
    }

    //From ControlValueAccessor interface
    writeValue(v: any) {
        // if (value !== this.innerValue) {
        //     this.innerValue = value;
        // }

        if(v){
            if(v.length>3){
                this.branchCode = v.substr(0,3);
                this.accNumber = v.substr(3,v.length-1);
            }else{
                this.branchCode = v.substr(0,v.length-1);
            }
            
        }

        this.onChangeCallback(this.branchCode+this.accNumber);
        
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    onInput(){
        if(this.branchCode.length>=3){
            this.branchCode= this.branchCode.substr(0,3);
            document.getElementById('accNumber').focus();
        }

        this.onChangeCallback(this.branchCode+this.accNumber);
    }

}