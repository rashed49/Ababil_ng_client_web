import { AccountNominee } from './../../../../services/nominee/domain/nominee.model';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from './../../../../common/components/base.component';
import { map } from 'rxjs/operators';
import { Account } from '../../../../services/account/domain/account.model';
import { IndividualInformation } from '../../../../services/cis/domain/individual.model';
import { Location } from '@angular/common';
import { CISService } from '../../../../services/cis/service-api/cis.service';
import { AccountService } from '../../../../services/account/service-api/account.service';
import { NomineeService } from '../../../../services/nominee/service-api/nominee.service';

@Component({
    selector: 'nominee-view',
    templateUrl: './nominee.view.component.html'
})
export class NomineeViewComponent extends BaseComponent implements OnInit {

    nomineeId: number;
    queryParams: any;
    accountDetails: Account = new Account();
    individualDetails: IndividualInformation = new IndividualInformation();
    guardianDetails: IndividualInformation = new IndividualInformation();
    nominee: AccountNominee = new AccountNominee();
    individualsFullName: string = " ";
    guardiansFullName: string = " ";
    nomineeIsMinor: boolean = true;

    constructor(
        private cISService: CISService,
        private accountService: AccountService,
        private nomineeService: NomineeService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location
    ) {
        super();
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.nomineeId = params.nomineeId;
            this.loadNominee(this.nomineeId, this.queryParams.accountId);
            console.log(this.queryParams.accountId);
            console.log(this.queryParams.nomineeId);

        });
    }

    loadNominee(nomineeId, accountId) {
        if (nomineeId != undefined && accountId != undefined) {
            this.fetchExistingNominee(this.queryParams.accountId);
        }
    }

    fetchExistingNominee(accountId) {
        if (accountId !== undefined) {
            this.subscribers.fetchNominee = this.nomineeService
                .fetchAccountNomineeDetails({ nomineeId: this.nomineeId })
                .subscribe(data => {
                    this.nominee = data;
                    this.loadAccountDetails(this.queryParams.accountId);
                    this.fetchIndividualDetails(this.nominee.individualId);
                    if (this.nominee.guardianId) {
                        this.fetchGuardianDetails(this.nominee.guardianId);
                    }
                    //
                });
        }
    }

    loadAccountDetails(accountId) {
        this.subscribers.fetchAccountDetails = this.accountService
            .fetchAccountDetails({ accountId: accountId + "" })
            .pipe(map(account => this.accountDetails = account))
            .subscribe();
    }

    fetchIndividualDetails(individualId: number) {
        this.subscribers.fetchIndividualDetails = this.cISService
            .fetchIindividualInformationDetails({ id: individualId + "" })
            .pipe(map(individual => {
                this.individualDetails = individual;
                this.individualsFullName = this.getFullName(this.individualDetails.firstName, this.individualDetails.middleName, this.individualDetails.lastName);
                this.isMinor(this.individualDetails.id);
            })).subscribe();
    }

    fetchGuardianDetails(guardianId: number) {
        this.subscribers.fetchGuardianDetails = this.cISService
            .fetchIindividualInformationDetails({ id: guardianId + "" })
            .pipe(map(guardian => {
                this.guardianDetails = guardian;
                this.guardiansFullName = this.getFullName(this.guardianDetails.firstName, this.guardianDetails.middleName, this.guardianDetails.lastName);
            })).subscribe();
    }

    getFullName(firstName: string, middleName: string, lastName: string): string {
        let name: string = '';
        name = name + (firstName ? firstName : "") + " " + (middleName ? middleName : "") + " " + (lastName ? lastName : "");
        name = name.trim();
        return name;
    }

    cancel() {
        this.location.back();
    }

    isMinor(individualId: number) {
        let queryParamMap = new Map();
        queryParamMap.set("individualId", individualId);
        this.subscribers.nomineeSub = this.nomineeService.isMinor(queryParamMap)
            .subscribe(data => this.nomineeIsMinor = data);
    }
}
