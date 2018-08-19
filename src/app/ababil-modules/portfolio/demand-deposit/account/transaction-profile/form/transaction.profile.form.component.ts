import { FormBuilder } from '@angular/forms';
import { Component, Input, OnInit, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../../../../../common/components/base.component';
import { DemandDepositAccountTransactionProfile } from '../../../../../../services/transaction-profile/domain/transaction-profile.models';
import { TransactionProfileService } from '../../../../../../services/transaction-profile/service-api/transaction-profile.service';
import { FormGroup } from '@angular/forms';
import { AccountService } from '../../../../../../services/account/service-api/account.service';
import { Account } from '../../../../../../services/account/domain/account.model';
import { map }from 'rxjs/operators';

@Component({
    selector: 'transaction-profile',
    templateUrl: './transaction.profile.form.component.html'
})
export class TransactionProfileFormComponent extends BaseComponent implements OnInit {

    selectedTransactionProfile: DemandDepositAccountTransactionProfile;
    displayDepositDialog: boolean;
    displayWithdrawalDialog: boolean;
    transactionProfile: DemandDepositAccountTransactionProfile = new DemandDepositAccountTransactionProfile();
    selectedIndex: number;
    transactionProfileDepositForm: FormGroup;
    transactionProfileWithdrawalForm: FormGroup;
    account: Account = new Account();
    queryParams: any;
    errorSet = new Set([]);


    @Input('accountTransactionProfile') accountTransactionProfile: DemandDepositAccountTransactionProfile[];
    @Output('onSave') onSave = new EventEmitter<any>();
    @Output('onCancel') onCancel = new EventEmitter<void>();

    constructor(private route: ActivatedRoute, private formBuilder: FormBuilder,
        private accountService: AccountService,
        private transactionProfileService: TransactionProfileService) {
        super();
    }

    ngOnInit(): void {
        this.subscribers.routeSub = this.route.queryParams
            .subscribe(queryParams => {
                this.queryParams = queryParams;
                this.fetchAccountDetails();
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.accountTransactionProfile.currentValue && changes.accountTransactionProfile.currentValue.length > 0) {
            this.checkFromValidity();
        }
    }

    checkFromValidity() {
        let isGraterThanOrEqualZero = true;
        for (let i = 0; i < this.accountTransactionProfile.length; i++) {
            if (this.accountTransactionProfile[i].transactionLimitMandatory) {
                Object.keys(this.accountTransactionProfile[i]).forEach(key => {
                    if (key != 'id' && this.accountTransactionProfile[i][key] == null) {
                        isGraterThanOrEqualZero = false;
                        if (!this.errorSet.has(i)) this.errorSet.add(i);
                    }
                });
            }
        }
    }

    save() {
        this.onSave.emit();
    }

    cancel(): void {
        this.onCancel.emit();
    }

    fetchAccountDetails() {
        this.subscribers.fetchAccountDetailsSub = this.accountService
            .fetchAccountDetails({ accountId: this.queryParams.accountId })
            .pipe(map(account => this.account = account))
            .subscribe();
    }

    onEditValidation(rowData: DemandDepositAccountTransactionProfile, index, colName) {
        let isGraterThanOrEqualZero = true;
        if (rowData.transactionLimitMandatory) {
            Object.keys(rowData).forEach(key => {
                if (key != 'id' && (rowData[key] == null || rowData[key] < 0)) {
                    isGraterThanOrEqualZero = false;
                    if (!this.errorSet.has(index)) {
                        this.errorSet.add(index);
                    }
                }
            });
        }

        if (isGraterThanOrEqualZero && this.errorSet.has(index)) {
            this.errorSet.delete(index);
        }

        if (colName !== "monthlyTotalDebitTxnAmount") {
            this.setMonthlyTotalDebitTxnAmount(index);
        } else {
            this.setMonthlyTotalDebitTxnAmountValidation(index);
        }

        if (colName !== "monthlyTotalCreditTxnAmount") {
            this.setmonthlyTotalCreditTxnAmount(index);
        }else{
            this.setMonthlyTotalCreditTxnAmountValidation(index);
        }

        if (!rowData.transactionLimitMandatory) {
            if (rowData.monthlyTotalDebitTxnCount || rowData.monthlyTotalDebitTxnAmount || rowData.maxDebitAmountPerTransaction) {
                let count = 0;
                if (rowData.monthlyTotalDebitTxnCount && rowData.monthlyTotalDebitTxnCount >= 0) {
                    count += 1;
                }

                if (rowData.monthlyTotalDebitTxnAmount && rowData.monthlyTotalDebitTxnAmount >= 0) {
                    count += 1;
                }

                if (rowData.maxDebitAmountPerTransaction && rowData.maxDebitAmountPerTransaction >= 0) {
                    count += 1;
                }

                if (count === 3) {
                    if (this.errorSet.has(index)) {
                        this.errorSet.delete(index);
                    }
                } else {
                    if (!this.errorSet.has(index)) {
                        this.errorSet.add(index);
                        isGraterThanOrEqualZero = false;
                    }
                }
            }


            if (rowData.monthlyTotalCreditTxnCount || rowData.maxCreditAmountPerTransaction || rowData.monthlyTotalCreditTxnAmount) {
                let count = 0;
                if (rowData.monthlyTotalCreditTxnCount && rowData.monthlyTotalCreditTxnCount >= 0) {
                    count += 1;
                }

                if (rowData.maxCreditAmountPerTransaction && rowData.maxCreditAmountPerTransaction >= 0) {
                    count += 1;
                }

                if (rowData.monthlyTotalCreditTxnAmount && rowData.monthlyTotalCreditTxnAmount >= 0) {
                    count += 1;
                }

                if (count === 3) {
                    if (this.errorSet.has(index)) {
                        this.errorSet.delete(index);
                    }
                } else {
                    if (!this.errorSet.has(index)) {
                        this.errorSet.add(index);
                    }
                }
            }
        }

    }

    setMonthlyTotalDebitTxnAmount(index) {
        if (this.accountTransactionProfile[index].monthlyTotalDebitTxnCount && this.accountTransactionProfile[index].maxDebitAmountPerTransaction) {
            this.accountTransactionProfile[index].monthlyTotalDebitTxnAmount =
                this.accountTransactionProfile[index].monthlyTotalDebitTxnCount
                * this.accountTransactionProfile[index].maxDebitAmountPerTransaction;
        }
    }

    setmonthlyTotalCreditTxnAmount(index) {
        if (this.accountTransactionProfile[index].monthlyTotalCreditTxnCount && this.accountTransactionProfile[index].maxCreditAmountPerTransaction) {
            this.accountTransactionProfile[index].monthlyTotalCreditTxnAmount =
                this.accountTransactionProfile[index].monthlyTotalCreditTxnCount
                * this.accountTransactionProfile[index].maxCreditAmountPerTransaction;
        }
    }

    setMonthlyTotalDebitTxnAmountValidation(index) {
        let monthlyTotalDebitTxnAmount =
            this.accountTransactionProfile[index].monthlyTotalDebitTxnCount
            * this.accountTransactionProfile[index].maxDebitAmountPerTransaction;

        if (this.accountTransactionProfile[index].monthlyTotalDebitTxnAmount < this.accountTransactionProfile[index].maxDebitAmountPerTransaction
            || this.accountTransactionProfile[index].monthlyTotalDebitTxnAmount > monthlyTotalDebitTxnAmount) {
            if (!this.errorSet.has(index)) {
                this.errorSet.add(index);
            }
        }
    }

    setMonthlyTotalCreditTxnAmountValidation(index){
        let monthlyTotalCreditTxnAmount =
            this.accountTransactionProfile[index].monthlyTotalCreditTxnCount
            * this.accountTransactionProfile[index].maxCreditAmountPerTransaction;

        if (this.accountTransactionProfile[index].monthlyTotalCreditTxnAmount < this.accountTransactionProfile[index].maxCreditAmountPerTransaction
            || this.accountTransactionProfile[index].monthlyTotalCreditTxnAmount > monthlyTotalCreditTxnAmount) {
            if (!this.errorSet.has(index)) {
                this.errorSet.add(index);
            }
        }
    }
}