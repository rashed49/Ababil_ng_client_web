import { Component, OnInit, SimpleChanges, Input, OnChanges, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { ConfirmationService, MenuItem } from 'primeng/primeng';
import { Observable } from "rxjs";
import { BaseComponent } from "../base.component";
import { DemandDepositAccountService } from "../../../services/demand-deposit-account/service-api/demand.deposit.account.service";
import { DemandDepositChargeInformation } from "../../../services/demand-deposit-account/domain/demand.deposit.account.charge.models";
import { DemandDepositAccount } from "../../../services/demand-deposit-account/domain/demand.deposit.account.models";


@Component({
    selector: 'common-charge-table',
    templateUrl: './charge.component.html'
})
export class ChargeTableComponent extends BaseComponent implements OnInit, OnChanges {
   
    @Output('onChargeChange') onChargeChange = new EventEmitter<void>();
    @Input('charges') set setCharges(charges: DemandDepositChargeInformation[]) {
        this.charges = charges ? charges : [];
        this.totalChargeCalculation();
    };
   currencyCode: string;
    @Input('editable') set setEditable(editable: boolean){
        this.editable = editable;
    }
    editable: boolean;
    charges: DemandDepositChargeInformation[] = [];
    constructor(
        private demandDepositAccountService: DemandDepositAccountService,
        private location: Location,
        private route: ActivatedRoute,
        private router: Router) {
        super();
    }
    demandDepositAccount: DemandDepositAccount = new DemandDepositAccount();
    totalChargeAmount: number =0;

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        // if (changes.editable.currentValue) {
        //     console.log(changes.editable.currentValue);
        //     // this.editable = changes.editable.currentValue;
        // }
    }
    totalChargeCalculation() {
        this.totalChargeAmount = Number(this.charges.map(charge => {
            return {
                chargeAmount: charge.modifiedChargeAmount,
                vatAmount: charge.modifiedVatAmount
            }
        }).reduce(function (amount, charge) {
            return amount + Number(charge.chargeAmount) + Number(charge.vatAmount);
        }, 0));
        this.onChargeChange.emit();
    }

    onEditValidation(colField, modifiedAmount: any, index: number): void {
        // let vatPercentage = .15;
        // this.charges[index].modifiedVatAmount = Number(this.charges[index].modifiedChargeAmount * vatPercentage);
        this.charges = [...this.charges];
        this.totalChargeCalculation();
        this.onChargeChange.emit();
    }

    extractData() {
        return  (this.totalChargeAmount !== undefined) ?  this.totalChargeAmount : 0;
    }


    // fetchDemandDepositAccountDetails() {
    //     this.subscribers.fetchDemandDepositAccountDetailsSub = this.demandDepositAccountService
    //         .fetchDemandDepositAccountDetails({ id: this.accountId + "" }).map((account) => {
    //             this.demandDepositAccount = account;
    //             this.fetchCharges(account.balance.currentBalance);
    //         }).subscribe();
    // }

}