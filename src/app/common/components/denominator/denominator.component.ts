import { Component, OnInit, Input, OnChanges, SimpleChanges } from "@angular/core";
import { TellerDenominationTransaction, TellerDenominationTransactionTable } from "../../../services/teller/domain/teller.domain.model";
import { NotificationService } from "../../notification/notification.service";

@Component({
    selector: 'denominatorComponent',
    templateUrl: './denominator.component.html',
    styleUrls: ['./denominator.component.css']
})

export class DenominatorComponent implements OnInit, OnChanges {

    @Input('tellerDenominationBalances') tellerDenominationBalances: any[];
    @Input('denominationStatus') denominationStatus;
    @Input('tellerCurrencyCode') tellerCurrencyCode;
    @Input('previousTransactionDenominations') previousTransactionDenominations;

    DenominationBalances: TellerDenominationTransactionTable[] = [];
    DenominationNotes: TellerDenominationTransactionTable[] = [];
    DenominationCoins: TellerDenominationTransactionTable[] = [];
    outputDenominationTellerTransactionBalances: TellerDenominationTransaction[] = [];
    noteTotal: number = 0;
    coinTotal: number = 0
    totalAmount: number = 0;
    debitChecker = false;
    creditChecker = false;
    receiveChecker = false;
    denominationRequird = true;

    constructor(private notficationService: NotificationService) { }

    ngOnInit() { }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.tellerDenominationBalances) {

            this.DenominationBalances = changes.tellerDenominationBalances.currentValue;
            this.DenominationBalances.sort(function (a, b) { return (a.denomination.denominationValue < b.denomination.denominationValue) ? 1 : ((b.denomination.denominationValue < a.denomination.denominationValue) ? -1 : 0); });
            this.DenominationNotes = this.DenominationBalances.filter(data => data.denomination.denominationType == 'NOTE');
            this.DenominationNotes.map(data => data.quantity = data.quantity ? data.quantity : 0);
            this.DenominationNotes.map(data => data.balanceQuantity = data.quantity);
            this.DenominationNotes.map(data => {
                data.netBalance = data.denomination.denominationValue * data.quantity;
                this.noteTotal = this.noteTotal + data.netBalance;
            });
            this.DenominationCoins = this.DenominationBalances.filter(data => data.denomination.denominationType == 'COIN');
            this.DenominationCoins.map(data => data.quantity = data.quantity ? data.quantity : 0);
            this.DenominationCoins.map(data => data.balanceQuantity = data.quantity);
            this.DenominationCoins.map(data => {
                data.netBalance = data.denomination.denominationValue * data.quantity;
                this.coinTotal = this.coinTotal + data.netBalance;
            });
        }

        if (changes.denominationStatus) {
            if (changes.denominationStatus.currentValue === 'DEBIT') { this.debitChecker = true }
            else if (changes.denominationStatus.currentValue === 'CREDIT' || changes.denominationStatus.currentValue === 'SEND') { this.creditChecker = true; this.receiveChecker = false; this.debitChecker = false; }
            else if (changes.denominationStatus.currentValue === 'RECEIVE') { this.debitChecker = true; this.receiveChecker = true; this.creditChecker = false; }
        }

        if (changes.previousTransactionDenominations) {
            if (changes.previousTransactionDenominations.currentValue.length > 0) {
                this.outputDenominationTellerTransactionBalances = [...changes.previousTransactionDenominations.currentValue]
            }

            if (this.DenominationNotes.length > 0) {
                changes.previousTransactionDenominations.currentValue.map(
                    data => {
                        let index = this.DenominationNotes.indexOf(this.DenominationNotes.filter(element => element.denomination.id == data.denominationId)[0]);
                        if (index >= 0) {
                            if (this.debitChecker) {
                                this.DenominationNotes[index].debitQuantity = data.quantity;
                                this.DenominationNotes[index].balanceQuantity = (+this.DenominationNotes[index].quantity) + (+data.quantity);
                                this.DenominationNotes[index].netBalance = this.DenominationNotes[index].balanceQuantity * (+this.DenominationNotes[index].denomination.denominationValue);
                                this.noteTotal = this.noteTotal + this.DenominationNotes[index].netBalance;
                            }
                            else if (this.creditChecker) {
                                this.DenominationNotes[index].creditQuantity = data.quantity;
                                this.DenominationNotes[index].balanceQuantity = (+this.DenominationNotes[index].quantity) - (+data.quantity);
                                this.DenominationNotes[index].netBalance = this.DenominationNotes[index].balanceQuantity * (+this.DenominationNotes[index].denomination.denominationValue);
                                this.noteTotal = this.coinTotal + this.DenominationNotes[index].netBalance;
                            }
                        }
                    }
                )
            }
            if (this.DenominationCoins.length > 0) {
                changes.previousTransactionDenominations.currentValue.map(
                    data => {
                        let index = this.DenominationCoins.indexOf(this.DenominationCoins.filter(element => element.denomination.id == data.denominationId)[0]);
                        if (index >= 0) {
                            if (this.debitChecker) {
                                this.DenominationCoins[index].debitQuantity = data.quantity;
                                this.DenominationCoins[index].balanceQuantity = (+this.DenominationCoins[index].quantity) + (+data.quantity);
                                this.DenominationCoins[index].netBalance = this.DenominationCoins[index].balanceQuantity * (+this.DenominationCoins[index].denomination.denominationValue);
                                this.coinTotal = this.coinTotal + this.DenominationCoins[index].netBalance;

                            }
                            else if (this.creditChecker) {
                                this.DenominationCoins[index].creditQuantity = data.quantity;
                                this.DenominationCoins[index].balanceQuantity = (+this.DenominationCoins[index].quantity) - (+data.quantity);
                                this.DenominationCoins[index].netBalance = this.DenominationCoins[index].balanceQuantity * (+this.DenominationCoins[index].denomination.denominationValue);
                                this.coinTotal = this.coinTotal + this.DenominationCoins[index].netBalance;
                            }
                        }
                    }
                )
            }
        }

    }
    update(currentValue, data, i) {
        if (this.denominationRequird) {
            if (currentValue && currentValue != 0) {
                if (this.creditChecker && (data.quantity <= 0 || data.quantity < currentValue)) {
                    this.notficationService.sendErrorMsg('no.note.available');
                }

                let indexOfPreviousData = this.outputDenominationTellerTransactionBalances.indexOf(this.outputDenominationTellerTransactionBalances.filter(element => element.denominationId == data.denomination.id)[0]);

                if (indexOfPreviousData >= 0) {
                    this.outputDenominationTellerTransactionBalances[indexOfPreviousData].quantity = currentValue;
                }
                else {
                    let newDenomination: TellerDenominationTransaction = new TellerDenominationTransaction();
                    newDenomination.denominationId = data.denomination.id;
                    newDenomination.quantity = (+currentValue);
                    this.outputDenominationTellerTransactionBalances = [...this.outputDenominationTellerTransactionBalances, newDenomination];
                }

                if (this.debitChecker) {
                    this.DenominationNotes[i].balanceQuantity = (+data.quantity) + (+currentValue);
                    this.noteTotal = this.noteTotal + (+currentValue * (+data.denomination.denominationValue));
                    // this.totalAmount = this.totalAmount + (+currentValue * (+data.denomination.denominationValue));

                }

                else if (this.creditChecker && this.noteTotal > 0 && data.quantity > 0 && data.quantity >= currentValue) {
                    // let newDenomination: TellerDenominationTransaction = new TellerDenominationTransaction();
                    // newDenomination.denominationId = data.denomination.id;
                    // newDenomination.quantity = (+currentValue);
                    this.DenominationNotes[i].balanceQuantity = (+data.quantity) - (+currentValue);
                    this.noteTotal = this.noteTotal - (+currentValue * (+data.denomination.denominationValue));
                    // this.totalAmount = this.totalAmount + (+currentValue * (+data.denomination.denominationValue));
                    // this.outputDenominationTellerTransactionBalances = [...this.outputDenominationTellerTransactionBalances, newDenomination];

                }
                this.DenominationNotes[i].netBalance = (this.DenominationNotes[i].balanceQuantity) * (+data.denomination.denominationValue);
            }
            else {
                let indexOfPreviousData = this.outputDenominationTellerTransactionBalances.indexOf(this.outputDenominationTellerTransactionBalances.filter(element => element.denominationId == data.denomination.id)[0]);

                if (indexOfPreviousData >= 0) {
                    let previousQuantity = this.outputDenominationTellerTransactionBalances[indexOfPreviousData].quantity;
                    this.outputDenominationTellerTransactionBalances.splice(indexOfPreviousData, 1);
                    if (data.quantity > 0 && data.quantity >= (+currentValue)) {
                        this.DenominationNotes[i].balanceQuantity = (+this.DenominationNotes[i].balanceQuantity) - (+previousQuantity);
                        this.DenominationNotes[i].netBalance = (+this.DenominationNotes[i].netBalance) - (+previousQuantity * +data.denomination.denominationValue);
                    }
                    this.noteTotal = this.noteTotal - (+previousQuantity * (+data.denomination.denominationValue));
                }
            }
        }
        else {
            if (currentValue && currentValue != 0) {
                let newDenomination: TellerDenominationTransaction = new TellerDenominationTransaction();
                newDenomination.denominationId = data.denomination.id;
                newDenomination.quantity = (+currentValue);
                this.outputDenominationTellerTransactionBalances = [...this.outputDenominationTellerTransactionBalances, newDenomination];
                this.DenominationNotes[i].netBalance = (+this.DenominationNotes[i].netBalance) + (+currentValue * data.denomination.denominationValue);
                this.noteTotal = this.noteTotal + (+currentValue * data.denomination.denominationValue)
            }
        }
    }

    updateCoin(currentValue, data, i) {
        if (this.denominationRequird) {
            if (currentValue && currentValue != 0) {
                if (this.creditChecker && (data.quantity <= 0 || data.quantity < currentValue)) {
                    this.notficationService.sendErrorMsg('no.note.available');
                }

                let indexOfPreviousData = this.outputDenominationTellerTransactionBalances.indexOf(this.outputDenominationTellerTransactionBalances.filter(element => element.denominationId == data.denomination.id)[0]);

                if (indexOfPreviousData >= 0) {
                    this.outputDenominationTellerTransactionBalances[indexOfPreviousData].quantity = currentValue;
                }
                else {
                    let newDenomination: TellerDenominationTransaction = new TellerDenominationTransaction();
                    newDenomination.denominationId = data.denomination.id;
                    newDenomination.quantity = (+currentValue);
                    this.outputDenominationTellerTransactionBalances = [...this.outputDenominationTellerTransactionBalances, newDenomination];
                }

                if (this.debitChecker) {
                    this.DenominationNotes[i].balanceQuantity = (+data.quantity) + (+currentValue);
                    this.coinTotal = this.coinTotal + (+currentValue * (+data.denomination.denominationValue));
                    // this.totalAmount = this.totalAmount + (+currentValue * (+data.denomination.denominationValue));

                }

                else if (this.creditChecker && this.coinTotal > 0 && data.quantity > 0 && data.quantity >= currentValue) {
                    // let newDenomination: TellerDenominationTransaction = new TellerDenominationTransaction();
                    // newDenomination.denominationId = data.denomination.id;
                    // newDenomination.quantity = (+currentValue);
                    this.DenominationNotes[i].balanceQuantity = (+data.quantity) - (+currentValue);
                    this.coinTotal = this.coinTotal - (+currentValue * (+data.denomination.denominationValue));
                    // this.totalAmount = this.totalAmount + (+currentValue * (+data.denomination.denominationValue));
                    // this.outputDenominationTellerTransactionBalances = [...this.outputDenominationTellerTransactionBalances, newDenomination];

                }
                this.DenominationCoins[i].netBalance = (this.DenominationCoins[i].balanceQuantity) * (+data.denomination.denominationValue);
            }
            else {
                let indexOfPreviousData = this.outputDenominationTellerTransactionBalances.indexOf(this.outputDenominationTellerTransactionBalances.filter(element => element.denominationId == data.denomination.id)[0]);

                if (indexOfPreviousData >= 0) {
                    let previousQuantity = this.outputDenominationTellerTransactionBalances[indexOfPreviousData].quantity;
                    this.outputDenominationTellerTransactionBalances.splice(indexOfPreviousData, 1);
                    if (data.quantity > 0 && data.quantity >= (+currentValue)) {
                        this.DenominationCoins[i].balanceQuantity = (+this.DenominationCoins[i].balanceQuantity) - (+previousQuantity);
                        this.DenominationCoins[i].netBalance = (+this.DenominationCoins[i].netBalance) - (+previousQuantity * +data.denomination.denominationValue);
                    }
                    this.noteTotal = this.noteTotal - (+previousQuantity * (+data.denomination.denominationValue));
                }
            }
        }
        else {
            if (currentValue && currentValue != 0) {
                let newDenomination: TellerDenominationTransaction = new TellerDenominationTransaction();
                newDenomination.denominationId = data.denomination.id;
                newDenomination.quantity = (+currentValue);
                this.outputDenominationTellerTransactionBalances = [...this.outputDenominationTellerTransactionBalances, newDenomination];
                this.DenominationCoins[i].netBalance = (+this.DenominationCoins[i].netBalance) + (+currentValue * data.denomination.denominationValue);
                this.noteTotal = this.noteTotal + (+currentValue * data.denomination.denominationValue)
            }
        }

    }


    extractData() {
        return this.outputDenominationTellerTransactionBalances;
    }

    extractTotal() {
        this.totalAmount = 0;
        this.outputDenominationTellerTransactionBalances.map(data => {
            let indexOfPreviousData = this.DenominationBalances.indexOf(this.DenominationBalances.filter(element => element.denomination.id == data.denominationId)[0]);
            let value = this.DenominationBalances[indexOfPreviousData].denomination.denominationValue;
            this.totalAmount = this.totalAmount + data.quantity * value;

        })
        return this.totalAmount;
    }
    clearBalance() {
        this.totalAmount = 0;
    }

    clearArrays(){
        this.outputDenominationTellerTransactionBalances = [];
        
    }

    changeDenominationRequiredStatus(){
        this.denominationRequird = false; 
    }

}

