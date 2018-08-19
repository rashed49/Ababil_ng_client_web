import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { BaseComponent } from "../../../common/components/base.component";
import { TimeDepositLienService } from "../../../services/time-deposit-lien/service-api/time.deposit.lien.service";
import { TimeDepositLien } from "../../../services/time-deposit-lien/domain/time.deposit.lien.model";
import { TimeDepositLienDetail } from "../../../services/time-deposit-lien/domain/time.deposit.lien.detail.model";
import { AccountService } from "../../../services/account/service-api/account.service";
import { Account } from "../../../services/account/domain/account.model";
import { ReferenceType } from "../../../services/time-deposit-lien-reference-type/domain/time.deposit.lien.reference.type.model";
import { TimeDepositLienReferenceTypeService } from "../../../services/time-deposit-lien-reference-type/service-api/time.deposit.lien.reference.type.service";

@Component({
    selector: 'lien-detail',
    templateUrl: './detail.time.deposit.lien.component.html'
})
export class DetailTimeDepositLienComponent extends BaseComponent implements OnInit {

    lienId: number;
    timeDepositLien: TimeDepositLien = new TimeDepositLien();
    referenceType: ReferenceType = new ReferenceType();
    timeDepositLienDetails: TimeDepositLienDetail[] = [];
    accountDetails: Account = new Account();
    accountTypeMap: Map<number, string> = new Map();
    referenceTypeId: number;


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private timeDepositLienService: TimeDepositLienService,
        private accountService: AccountService,
        private timeDepositLienReferenceTypeService: TimeDepositLienReferenceTypeService) {
        super();
    }

    ngOnInit(): void {
        this.subscribers.routerSub = this.route.params.subscribe(params => {
            this.lienId = params['id'];
            this.fetchLienDetail();
        });
    }

    fetchLienDetail() {
        this.subscribers.fatchLienDetailSub = this.timeDepositLienService.fetchTimeDepositLien({ lienId: this.lienId })
            .subscribe(data => {
                this.timeDepositLien = data;
                this.referenceTypeId = this.timeDepositLien.referenceTypeId;
                this.timeDepositLienDetails = this.timeDepositLien.timeDepositLienDetails;

                this.timeDepositLienDetails.map(accountDetail => accountDetail.accountId)
                    .map(accountId => {
                        this.fetchAccountDetail(accountId);
                    });

                this.fetchReferencetype();
            });
    }
    fetchReferencetype() {
        this.subscribers.referenceTypeSub = this.timeDepositLienReferenceTypeService.fetchReferencetype({ referenceTypeId: this.referenceTypeId })
            .subscribe(data => {
                this.referenceType = data.referenceType;

            });
    }

    fetchAccountDetail(accountId) {
        this.subscribers.AccountDetailSub = this.accountService.fetchAccountDetails({ accountId: accountId })
            .subscribe(data => {
                this.accountDetails = data;
                this.accountTypeMap.set(this.accountDetails.id, this.accountDetails.number);
            });
    }

    editTimeDepositLien() {
        this.router.navigate(['edit'], { relativeTo: this.route });
    }

    back() {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }

}