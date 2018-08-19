import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { BaseComponent } from './../../../common/components/base.component';
import { Account } from '../../../services/account/domain/account.model';
import { Product } from '../../../services/product/domain/product.models';
import { MenuItem } from 'primeng/primeng';
import { AccountOperatorService } from '../../../services/account-operator/service-api/account.operator.service';
import { AccountOperatorInformation, AccountSignatory } from '../../../services/account-operator/domain/account.operator.models';
import { CISService } from '../../../services/cis/service-api/cis.service';
import { IndividualInformation } from '../../../services/cis/domain/individual.model';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../../common/notification/notification.service';
import { AccountService } from '../../../services/account/service-api/account.service';


@Component({
    selector: 'common-signature',
    templateUrl: './account.signature.details.component.html',
    // styleUrls: ['./account.operator.component.scss']
})
export class AccountSignatureDetailsComponent extends BaseComponent implements OnInit, OnChanges {
    accountOperatorInformation: AccountOperatorInformation = new AccountOperatorInformation();
    operatorId: number;
    menuItems: MenuItem[];
    demandDepositAccount: Account = new Account();
    productDetails: Product = new Product();
    uuid: string;
    individual: IndividualInformation;
    individualName: string;
    imageApiUrl: any;
    signatories: AccountSignatory[];
    disableOwnerAdd: boolean;
    owners: number[] = [];
    subjects: number[] = [];
    @Input('accountId') accountId: number;
    @Input('customerId') customerId: number;

    constructor(private sanitizer: DomSanitizer,
        private cisService: CISService,
        private accountService: AccountService,
        private accountOperatorService: AccountOperatorService,
        private notificationService: NotificationService) {
        super();
    }

    ngOnInit(): void {
        this.imageApiUrl = environment.serviceapiurl;

    }


    ngOnChanges(changes: SimpleChanges) {
        if (changes.accountId.currentValue) {
            this.fetchAccountOperatorInfo(changes.accountId.currentValue);
            this.fetchAccountDetails(changes.accountId.currentValue);
        }
        if (changes.customerId.currentValue) {
            this.fetchSingleCustomerSubject(changes.customerId.currentValue);
        }
    }


    fetchAccountDetails(demandDepositAccountId: number) {
        this.subscribers.fetchAccountDetailsSub = this.accountService
            .fetchAccountDetails({ accountId: demandDepositAccountId })
            .subscribe(account => this.demandDepositAccount = account);
    }
    fetchAccountOperatorInfo(accountId: number) {
        this.subscribers.fetchOpInfo = this.accountOperatorService.fetchAccountOperatorInformation({ id: accountId })
            .subscribe(accountOperatorInfo => {
                this.accountOperatorInformation = accountOperatorInfo;
                this.operatorId = this.accountOperatorInformation.id;
                this.fetchAccountOperatorSignatures(this.accountId, this.operatorId);

            }, err => {
                this.notificationService.sendErrorMsg("operator.information.not.found");

            });
    }

    fetchAccountOperatorSignatures(accountId: number, operatorId: number) {
        if (operatorId) {
            this.subscribers.fetchSig = this.accountOperatorService.fetchAccountSignatories({ id: accountId, operatorId: operatorId }).subscribe(
                signatories => {
                    this.signatories = signatories.content;
                    this.signatories.forEach(element => {
                        element.signature = this.sanitizer.bypassSecurityTrustUrl(
                            this.imageApiUrl + "/accounts/" + this.accountId + "/operator-information/" + this.operatorId + "/signatories/" + element.id + "/signature?t=" + new Date().getTime());
                        if (element.signatoryType === "OWNER") {
                            this.owners.push(element.individualId);
                        }
                    });
                });
        }
    }



    fetchSingleCustomerSubject(customerId: number) {
        this.subscribers.fetchSingleCustomerSubjectSub = this.cisService.fetchSubjects({ id: customerId }).subscribe(
            subjects => {
                let owners = subjects;
                owners.forEach(element => {
                    this.subjects.push(element.id);
                });
            });
    }

    // ngDoCheck() {
    //     let missing = _.difference(this.subjects, this.owners);
    //     this.disableOwnerAdd = (missing.length === 0) ? true : false;
    //     this.initialNominatedMenus();
    // }


}