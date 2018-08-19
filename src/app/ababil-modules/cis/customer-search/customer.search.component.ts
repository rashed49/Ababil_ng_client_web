import { Component } from "@angular/core";

@Component({
    selector: 'customer-search',
    templateUrl: 'customer.search.component.html'
})
export class CustomerSearchComponent {
    CustomerType = [];
    IdentityType = [];
    search: boolean = false;

    constructor() {
        this.CustomerType = [];
        this.CustomerType.push({ label: "Select Customer Type", value: null });
        this.CustomerType.push({ label: 'SINGLE', value: 'SINGLE' });
        this.CustomerType.push({ label: 'JOINT', value: 'JOINT' });
        this.CustomerType.push({ label: 'ORGANIZATION', value: 'ORGANIZATION' });

        this.IdentityType = [];
        this.IdentityType.push({ label: "Select Identity Type", value: null });
        this.IdentityType.push({ label: 'National ID', value: 'National ID' });
        this.IdentityType.push({ label: 'Passport No', value: 'Passport No' });
        this.IdentityType.push({ label: 'Driving License', value: 'Driving License ' });
        this.IdentityType.push({ label: 'Birth Certificate', value: 'Birth Certificate' });
    }
    searchCustomer() {
        this.search = true;
    }
}