export class ActivateCustomerCommand {
    action: string;
    constructor(public customerId) {
        this.action = "ACTIVATE";
    }
}
