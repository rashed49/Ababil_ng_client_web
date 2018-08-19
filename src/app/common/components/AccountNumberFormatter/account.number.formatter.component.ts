import { BaseComponent } from "../base.component";
import { Component } from "@angular/core";
import { AccountService } from "../../../services/account/service-api/account.service";
import { FormBaseComponent } from "../base.form.component";
import { ApprovalflowService } from "../../../services/approvalflow/service-api/approval.flow.service";
import { Location } from "@angular/common";



@Component({
    selector: 'account.number.formatter.component.ts',
    template: 'account.number.formatter.component.html'
})

export class AccountNumberFormatter extends FormBaseComponent {

    constructor(protected accountService: AccountService, protected location: Location, protected approvalFlowService: ApprovalflowService) {
        super(location, approvalFlowService);
    }

    //(Account) Number Formatting 

    public formatAccountNumberWithBranchCode(branchCode, accountNumberWithProductCode, accountNumberLengthWithProductCode, fn) {
        let accountNumberLength;

        this.subscribers.fetchProductCodeLengthSub = this.accountService.fetchProductCodeLengthConfiguration().subscribe(
            productCodeLength => {
                accountNumberLength = (+accountNumberLengthWithProductCode) - (+productCodeLength);
                fn(branchCode.concat(accountNumberWithProductCode.substring(0, productCodeLength) + accountNumberWithProductCode.substring(productCodeLength, accountNumberWithProductCode.length).padStart(accountNumberLength, 0)))
            })
    }

    public formattedAccountNumberWithProductCode(accountNumberWithProductCode, accountNumberLengthWithProductCode, fn) {
        let accountNumberLength;
        this.subscribers.fetchProductCodeLengthSub = this.accountService.fetchProductCodeLengthConfiguration().subscribe(
            productCodeLength => {
                accountNumberLength = (+accountNumberLengthWithProductCode) - (+productCodeLength);
                fn(accountNumberWithProductCode.substring(0, productCodeLength) + accountNumberWithProductCode.substring(productCodeLength, accountNumberWithProductCode.length).padStart(accountNumberLength, 0)
                )
            })
    }

    public formatBranchCode(branchCode, fn) {
        this.subscribers.fetchBranchCodeLengthSub = this.accountService.fetchBranchCodeLength().subscribe(
            branchCodeLength => fn(branchCode.padStart(branchCodeLength, 0))
        )
    }

    ///SUBGL Code Formatting

    public formatSUBGLCodeWithBranchCode(branchCode, subGlCodeWithId, SubGlCodeLengthWithId) {
        return branchCode.concat(subGlCodeWithId.substring(0, 1) + subGlCodeWithId.substring(1, subGlCodeWithId.length).padStart(+SubGlCodeLengthWithId - 1, 0))
    }

    public formattedSUBGLCodeWithProductCode(subGlCodeWithId, SubGlCodeLengthWithId) {
        return subGlCodeWithId.substring(0, 1) + subGlCodeWithId.substring(1, subGlCodeWithId.length).padStart(+SubGlCodeLengthWithId - 1, 0)
    }


}