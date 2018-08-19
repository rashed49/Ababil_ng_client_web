import { DomSanitizer } from '@angular/platform-browser';
import { element } from 'protractor';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from './../../../../common/components/base.component';
import { DemandDepositAccountService } from './../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { ProductService } from '../../../../services/product/service-api/product.service';
import { Account } from '../../../../services/account/domain/account.model';
import { Product } from '../../../../services/product/domain/product.models';
import { Location } from '@angular/common';
import { AccountOperatorService } from '../../../../services/account-operator/service-api/account.operator.service';
import { AccountOperatorInformation, AccountSignatory } from '../../../../services/account-operator/domain/account.operator.models';
import { CISService } from '../../../../services/cis/service-api/cis.service';
import { IndividualInformation } from '../../../../services/cis/domain/individual.model';
import { environment } from '../../../../../environments/environment';
import { NotificationService } from '../../../../common/notification/notification.service';
import * as _ from "lodash";
import { Observable, Subscriber } from 'rxjs';
import { AccountService } from '../../../../services/account/service-api/account.service';


@Component({
    selector: 'signature',
    templateUrl: './signature.view.component.html'
})
export class SignatureViewComponent extends BaseComponent implements OnInit {
    accountOperatorInformation: AccountOperatorInformation = new AccountOperatorInformation();
    operatorId: number;
    queryParams: any;
    demandDepositAccount: Account = new Account();
    productDetails: Product = new Product();
    uuid: string;
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
        private productService: ProductService, private accountOperatorService: AccountOperatorService, private location: Location, private notificationService: NotificationService) {
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

    close() {
        this.location.back();
    }


}