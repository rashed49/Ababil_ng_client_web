import {CustomerType} from "./customer.type.model";
import {Subject} from "./subject.model";

export class Customer {
    id              : number;
    branchId        : number;
    name            : string;
    // subjects        : Subject[];
    customerType    : CustomerType;
    active          : boolean;
}


export type CustomerStatus = 'OPEN' | 'ACTIVE' | 'FREEZ' | 'BLACKLISTED' | 'DECEASED';

