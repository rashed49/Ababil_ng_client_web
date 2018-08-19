import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import * as _ from "lodash";
import { AccountService } from '../../../services/account/service-api/account.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'signature',
    templateUrl: './account.operator.component.html',
    styleUrls: ['./account.operator.component.scss']
})
export class AccountOperatorComponent extends BaseComponent implements OnInit {
    accountOperatorInformation: AccountOperatorInformation = new AccountOperatorInformation();
    operatorId: number;
    menuItems: MenuItem[];
    queryParams: any;
    demandDepositAccount: Account = new Account();
    productDetails: Product = new Product();
    uuid: string;
    individual: IndividualInformation;
    individualName: string;
    imageApiUrl: any;
    accountId: number;
    customerId: number;
    signatories: AccountSignatory[];
    routeBack: string;
    disableOwnerAdd: boolean;
    owners: number[] = [];
    subjects: number[] = [];

    @ViewChild('lookup') lookup: any;

    constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router,
        private cisService: CISService,
        private accountService: AccountService,
        private accountOperatorService: AccountOperatorService, private notificationService: NotificationService) {
        super();
    }

    ngOnInit(): void {
        this.imageApiUrl = environment.serviceapiurl;
        this.route.queryParams.subscribe(queryParams => {
            this.queryParams = queryParams;
            this.fetchAccountDetails(this.queryParams['accountId']);
            this.accountId = this.queryParams['accountId'];
            this.routeBack = this.queryParams['routeBack'];
            this.customerId = this.queryParams['customerId'];
            this.fetchAccountOperatorInfo(this.queryParams['accountId']);
        });
        this.fetchSingleCustomerSubject(this.customerId);
    }
    fetchAccountDetails(demandDepositAccountId: number) {
        this.subscribers.fetchAccountDetailsSub = this.accountService
            .fetchAccountDetails({ accountId: demandDepositAccountId })
            .pipe(map(account => this.demandDepositAccount = account))
            .subscribe();
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

    saveOperator() {
        if (this.operatorId) {
            this.updateOperator(this.accountOperatorInformation);
            this.operatorId = this.operatorId;
        } else {
            let operatorInformation = new AccountOperatorInformation();
            operatorInformation.accountId = this.accountId;
            operatorInformation.instruction = this.accountOperatorInformation.instruction;
            this.operatorId = operatorInformation.id;
            this.subscribers.addOperator = this.accountOperatorService.addAccountOperatorInfo(operatorInformation, { id: this.accountId }).subscribe(
                data => {
                    this.notificationService.sendSuccessMsg("operator.information.save.success");
                    this.operatorId = data.content;
                });
        }
    }
    updateOperator(operator: AccountOperatorInformation) {
        this.subscribers.updateOperator = this.accountOperatorService.updateAccountOperatorInformation(operator, { id: this.accountId, operatorId: this.operatorId })
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("operatorinformation.update.success");
            });
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

    ngDoCheck() {
        let missing = _.difference(this.subjects, this.owners);
        this.disableOwnerAdd = (missing.length === 0) ? true : false;
        this.initialNominatedMenus();
    }


    initialNominatedMenus() {
        if (this.disableOwnerAdd) {
            this.menuItems = [
                {
                    label: 'Nominated', icon: 'ui-icon-group-add', command: () => {
                        this.addNominatedSignature();
                    }
                }
            ];
        } else {
            this.menuItems = [
                {
                    label: "Account owner", icon: "ui-icon-group", command: () => {
                        this.addOwnerSignature();
                    }
                },
                {
                    label: 'Nominated', icon: 'ui-icon-group-add', command: () => {
                        this.addNominatedSignature();
                    }
                }
            ];
        }

    }

    addNominatedSignature() {
        this.router.navigate(['signatories/create'], {
            relativeTo: this.route,
            queryParams: {
                operatorId: this.operatorId,
                signatoryType: "NOMINATED"
            },
            queryParamsHandling: 'merge'
        });
    }
    addOwnerSignature() {
        this.router.navigate(['signatories/create'], {
            relativeTo: this.route,
            queryParams: {
                operatorId: this.operatorId,
                customerId: this.demandDepositAccount.customerId,
                signatoryType: "OWNER"
            },
            queryParamsHandling: 'merge'
        });
    }

    onSignatoryCardSelect(signatoryId: number) {
        this.router.navigate(['signatories/detail', signatoryId], {
            relativeTo: this.route,
            queryParams: {
                accountId: this.queryParams.accountId,
                operatorId: this.operatorId,
                signatoryId: signatoryId,
                customerId: this.queryParams.customerId
            },
            queryParamsHandling: 'merge'
        });
    }

    close() {
        this.navigateAway();
    }

    navigateAway() {
        if (this.queryParams.taskId) {
            this.router.navigate([this.routeBack], {
                relativeTo: this.route,
                queryParams: {
                    taskId: this.queryParams.taskId,
                    command: this.queryParams.command,
                    commandReference: this.queryParams.commandReference,
                    accountId: this.queryParams.accountId,
                    inactive: this.queryParams.inactive
                }
            });
        }
        if (this.queryParams.command != undefined && this.queryParams.command === "DeactivateDemandDepositAccountCommand") {
            this.router.navigate([this.routeBack], {
                queryParams: {
                    command: this.queryParams.command,
                    cus: this.queryParams.cus,
                    demandDeposit: this.queryParams.demandDeposit

                },
                queryParamsHandling: 'merge'
            });
        }
        else {
            this.router.navigate([this.routeBack], {
                queryParams: { cus: this.queryParams.cus }
            });
        }

    }

}