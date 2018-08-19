import { ValidatorFn, Validators } from '@angular/forms';
export class ValidatorConstants {
    static MINIMUM_AMOUNT = 0;
    static MAXIMUM_AMOUNT = 9999999999999.99;
    static PRODUCT_NAME = new RegExp(/^[a-z ,.'-]+$/i);
    static MAXIMUM_NUMBER_OF_TRANSACTIONS = 1000;
}

export const phoneNumberValidator: ValidatorFn = Validators.pattern(new RegExp(/^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i));
export const personNameValidator: ValidatorFn = Validators.pattern(new RegExp(/^[a-z ,.'-]{2,50} ?$/i));
export const emailValidator: ValidatorFn = Validators.pattern(new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/));
export const faxValidator: ValidatorFn = Validators.pattern(new RegExp(/^\+?[0-9]+$/));
export const maximumAmount = 99999999999999999.99;
export const minimumAmount = 1;
export const accountNameValidator: ValidatorFn = Validators.pattern(new RegExp(/^[a-z ,.'-]+$/i));
export const companyNameValidator: ValidatorFn = Validators.pattern(new RegExp(/^[a-z ,.'-]{2,50} ?$/i));
export const balanceLength = 20; //actual= 15. ',' and '.' takes one length each
export const chargeNameValidator: ValidatorFn = Validators.pattern(new RegExp(/^[a-z ,.'-]{2,50} ?$/i));
export const ababilBalanceLength = 16;