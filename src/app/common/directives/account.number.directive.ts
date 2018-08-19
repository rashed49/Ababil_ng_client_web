import { Directive, ElementRef, HostListener, Output, EventEmitter } from "@angular/core";

@Directive({
    selector: '[account-number]'
})
export class AccountNumberDirective {

    constructor(public el: ElementRef) { }

    @Output() ngModelChange = new EventEmitter();

    @HostListener('focusout',['$event'])
    onFocusOut(e:any){

        if(this.el.nativeElement.value.length<=3){
            this.el.nativeElement.value = this.el.nativeElement.value.substr(0,this.el.nativeElement.value.length-1)
                                          + '0'.repeat(12-this.el.nativeElement.value.length);

        } else if(this.el.nativeElement.value.length>3){
            this.el.nativeElement.value = this.el.nativeElement.value.substr(0,3)
                                          + '0'.repeat(12-this.el.nativeElement.value.length)+this.el.nativeElement.value.substr(3,this.el.nativeElement.value.length-1);
        }

        this.ngModelChange.emit(this.el.nativeElement.value);

    }

}