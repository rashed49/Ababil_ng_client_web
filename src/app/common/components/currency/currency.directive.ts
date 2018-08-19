import { Directive, HostListener, ElementRef, OnInit, Output, EventEmitter, AfterViewInit, Input, forwardRef } from '@angular/core';
import { AbabilCurrencyPipe } from './currency.pipe';
import { NgControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const CUSTOM_ABABIL_CURRENCY_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AbabilCurrencyDirective),
  multi: true
};

@Directive({
  selector: '[ababil-currency]',
  host: {
    "(input)": 'onInputChange($event)',
    "(change)": 'onInputChange($event)'
  },
  providers: [CUSTOM_ABABIL_CURRENCY_CONTROL_VALUE_ACCESSOR]
})
export class AbabilCurrencyDirective implements ControlValueAccessor {

  private el: any;

  @Input('fractionSize') fractionSize = 4;

  @Input('negativeAllowed') negativeAllowed = true;

  public onChange: any = (_) => { }

  public onTouched: any = () => { }

  constructor(
    private elementRef: ElementRef,
    private formatcurrencypipe: AbabilCurrencyPipe
  ) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.el.value = this.formatcurrencypipe.transform(this.el.value, this.fractionSize);
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.style.textAlign = 'right';
  }

  @HostListener("focus", ["$event.target.value", "$event"])
  onFocus(value, event) {

    this.el.value = this.formatcurrencypipe.parse(value, this.fractionSize);

    if (event.which == 9) {
      return false;
    }

    this.el.select();

  }

  //this life is full of ifs
  onInputChange($event) {

    if ($event.target.value.indexOf('-') > 0) {
      $event.target.value = $event.target.value.split("-").join("");
    }

    if ($event.target.value.split('.').length > 1) {
      if ($event.target.value.split('.')[1].length < this.fractionSize) return;
    }

    if (!this.negativeAllowed && $event.target.value < 0) {
      $event.target.value = (-1) * $event.target.value;
    }

    if ($event.target.value.indexOf('.') !== ($event.target.value.length - 1)) {
      $event.target.value = this.formatcurrencypipe.parse($event.target.value, this.fractionSize);
    }

    this.onChange(this.formatcurrencypipe.parse(this.el.value, this.fractionSize));

  }

  @HostListener("focusout", ["$event.target.value"])
  onFocusOut(value) {
    this.el.value = this.formatcurrencypipe.transform(value, this.fractionSize);
    this.onChange(this.formatcurrencypipe.parse(value, this.fractionSize));
  }


  @HostListener('document:keydown', ['$event', "$event.target.value"])
  onKeyDown(event: Event, eventTargetValue: any) {

    if (this.el.contains(event.target)) {
      let e = <KeyboardEvent>event;
      if (!this.negativeAllowed && (e.keyCode === 109 || e.keyCode === 189 || e.keyCode === 173)) {
        e.preventDefault();
      }

      if (this.formatcurrencypipe.parse(eventTargetValue, this.fractionSize).includes('-') && (e.keyCode === 109 || e.keyCode === 189 || e.keyCode === 173)) {
        e.preventDefault();
      }

      if (this.formatcurrencypipe.parse(eventTargetValue, this.fractionSize).includes('.') && e.keyCode === 190) {
        e.preventDefault();
      }

      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+V
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        return;
      }
      // Ensure that it is a number and stop the keypress(189 is excluded for minus)
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || (e.keyCode > 105 && e.keyCode !== 189))) {
        e.preventDefault();

      }
    }
  }

  get value(): any {
    return this.formatcurrencypipe.parse(this.el.value, this.fractionSize);
  };

  set value(v: any) {
    if (v !== this.el.value) {
      this.onChange(v);
    }
  }

  writeValue(val: string): void {
    this.el.value = this.formatcurrencypipe.transform(val, this.fractionSize);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

}