import { AccountNominee } from './../../../../services/nominee/domain/nominee.model';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from './../../../../common/components/base.component';
import { Account } from '../../../../services/account/domain/account.model';
import { IndividualInformation } from '../../../../services/cis/domain/individual.model';
import { CISService } from '../../../../services/cis/service-api/cis.service';
import { AccountService } from '../../../../services/account/service-api/account.service';
import { NomineeService } from '../../../../services/nominee/service-api/nominee.service';
import { Location } from '@angular/common';
import { map, switchMap }from 'rxjs/operators';

@Component({
    selector: 'nominee-details',
    templateUrl: './nominee.details.component.html'
})
export class NomineeDetailsComponent extends BaseComponent {

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
        this.route.params
            .pipe(switchMap(params => {
                this.nomineeId = params.nomineeId;
                return this.route.queryParams;
            })).subscribe(queryParams => {
                this.queryParams = queryParams;
                this.loadNominee(this.nomineeId, this.queryParams.accountId);
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

    edit() {
        this.router.navigate(['../', 'edit'], {
            relativeTo: this.route,
            queryParamsHandling: 'merge'
        });
    }

    cancel() {
        this.navigateAway();
    }

    navigateAway() {
        if (this.queryParams.account) {
            this.router.navigate([this.queryParams.account], {
                queryParams: { cus: this.queryParams.cus }
            });
        } else {
            this.router.navigate([this.queryParams.demandDeposit], {
                queryParams: { cus: this.queryParams.cus }
            });
        }
    }

    isMinor(individualId: number) {
        let queryParamMap = new Map();
        queryParamMap.set("individualId", individualId);
        this.subscribers.nomineeSub = this.nomineeService.isMinor(queryParamMap)
            .subscribe(data => {
                this.nomineeIsMinor = data;
            });
    }

    shortInduvidualDetails(individualId: number) {
        this.router.navigate(['customer/short-individual-details'],
            {
                queryParams: {
                    individualId: this.nominee.individualId,
                    nominee: this.currentPath(this.location)
                },
                queryParamsHandling: 'merge'
            });
    }
}
