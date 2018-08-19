import { BaseComponent } from './../base.component';
import { Customer } from './../../../services/cis/domain/customer.model';
import { templateJitUrl } from '@angular/compiler';
import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'customer-details',
    templateUrl: './customer-details.component.html'
})
export class CustomerDetailsComponent {

    customerDetails: Customer;

    constructor() {
    }

    @Input('customer') set setCustomer(customer: Customer) {
        this.customerDetails = customer ? customer : new Customer();
    };

}