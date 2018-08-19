import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from './../../../../common/components/base.component';
import { AvailablePercentage, AccountNominee } from '../../../../services/nominee/domain/nominee.model';
import { Account } from '../../../../services/account/domain/account.model';
import { IndividualInformation } from '../../../../services/cis/domain/individual.model';
import { CISService } from '../../../../services/cis/service-api/cis.service';
import { AccountService } from '../../../../services/account/service-api/account.service';
import { NomineeService } from '../../../../services/nominee/service-api/nominee.service';
import { NotificationService } from './../../../../common/notification/notification.service';
import { FixedDepositAccountService } from '../../../../services/fixed-deposit-account/service-api/fixed.deposit.account.service';
import { map, switchMap } from 'rxjs/operators';

@Component({
    selector: 'nominee-edit',
    templateUrl: './nominee.edit.component.html'
})
export class NomineeEditComponent extends BaseComponent implements OnInit {

    headerLabel: string = "";
    params: any;
    queryParams: any;
    nomineeId: number;
    sharePercentage: number;
    availablePercentage: AvailablePercentage = new AvailablePercentage();
    accountDetails: Account = new Account();
    individualDetails: IndividualInformation = new IndividualInformation();
    guardianDetails: IndividualInformation = new IndividualInformation();
    nominee: AccountNominee = new AccountNominee();
    individualsFullName: string = " ";
    guardiansFullName: string = " ";
    nomineeIsMinor: boolean = false;
    relationWithAccountHolder: string = null;
    relationWithGuardian: string = null;
    @ViewChild('nomineeForm') nomineeForm : any;

    constructor(
        private cISService: CISService,
        private accountService: AccountService,
        private fixedDepositAccountService: FixedDepositAccountService,
        private location: Location,
        private nomineeService: NomineeService,
        private notificationService: NotificationService,
        private route: ActivatedRoute,
        private router: Router,
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
                this.onQueryParams();
            });
    }

    onQueryParams() {
        if (this.queryParams.accountId !== undefined) {
            this.loadAccountDetails(this.queryParams.accountId);
        }

        if (this.queryParams.individualId !== undefined &&
            this.queryParams.individualId !== 'null') {
            this.fetchIndividualDetails(this.queryParams.individualId);
        }

        // if (this.queryParams.guardianId) {
        //     this.fetchGuardianDetails(this.queryParams.guardianId);
        // }

        if (this.nomineeId !== undefined) {
            this.headerLabel = "Edit Nominee";
            this.fetchAvailableSharePercentage(this.queryParams.accountId, this.nomineeId);
        } else {
            this.loadAvailableSharePercentage(this.queryParams.accountId);
            this.headerLabel = "Create Nominee";
        }
    }

    onSelect(individualId) {
        this.fetchIndividualDetails(individualId);
    }

    // onGuardianSelect(guardianId) {
    //     this.fetchGuardianDetails(guardianId);
    // }

    loadAccountDetails(accountId) {
        this.subscribers.fetchAccountDetails = this.accountService
            .fetchAccountDetails({ accountId: accountId + "" })
            .pipe(map(account => this.accountDetails = account))
            .subscribe();
    }


    fetchAvailableSharePercentage(accountId: number, nomineeId: number) {
        let urlQueryMap = new Map();
        urlQueryMap.set("accountId", accountId);
        if (this.nomineeId != null) urlQueryMap.set('nomineeId', nomineeId);
        this.subscribers.fetchAvailablePercentageSub = this.nomineeService
            .fetchAvailablePercentage(urlQueryMap)
            .subscribe((data) => {
                this.availablePercentage = data;
                this.loadExistingNominee(nomineeId);
            })
    }

    loadExistingNominee(nomineeId: number) {
        this.subscribers.fetchNominee = this.nomineeService
            .fetchAccountNomineeDetails({ nomineeId: nomineeId })
            .subscribe((nomineeDetail) => {
                this.nominee = nomineeDetail;
                this.sharePercentage = this.nominee.sharePercentage;
                this.relationWithAccountHolder = nomineeDetail.relationWithAccountHolder;
                this.loadAccountDetails(this.queryParams.accountId);
                this.fetchIndividualDetails(this.nominee.individualId);
                // if (this.nominee.guardianId) {
                //  this.relationWithGuardian = nomineeDetail.relationWithGuardian;
                // this.fetchGuardianDetails(this.nominee.guardianId);

                // }
            });
    }

    fetchIndividualDetails(individualId: number) {
        this.subscribers.fetchIndividualDetails = this.cISService
            .fetchIindividualInformationDetails({ id: individualId + "" })
            .pipe(map(individual => {
                this.individualDetails = individual;
                this.individualsFullName = this.getFullName(this.individualDetails.firstName, this.individualDetails.middleName, this.individualDetails.lastName);
                // this.isMinor(this.individualDetails.id);
            })).subscribe();
    }

    // fetchGuardianDetails(guardianId: number) {
    //     this.subscribers.fetchGuardianDetails = this.cISService
    //         .fetchIindividualInformationDetails({ id: guardianId + "" })
    //         .pipe(map(guardian => {
    //             this.guardianDetails = guardian;
    //             this.guardiansFullName = this.getFullName(this.guardianDetails.firstName, this.guardianDetails.middleName, this.guardianDetails.lastName);
    //         })).subscribe();
    // }

    loadAvailableSharePercentage(accountId: number) {
        let urlQueryMap = new Map();
        urlQueryMap.set("accountId", accountId);
        this.subscribers.fetchAvailablePercentage = this.nomineeService
            .fetchAvailablePercentage(urlQueryMap)
            .subscribe((data) => {
                this.availablePercentage = data;
                this.sharePercentage = this.availablePercentage.upperLimit;
            })
    }

    getFullName(firstName: string, middleName: string, lastName: string): string {
        let name: string = '';
        name = name + (firstName ? firstName : "") + " " + (middleName ? middleName : "") + " " + (lastName ? lastName : "");
        name = name.trim();
        return name;
    }

    addNominee() {
        this.router.navigate(['/customer/short-individual'],
            {
                queryParams: {
                    nominee: this.currentPath(this.location),
                    type: "nominee",
                    individualId: this.individualDetails ? this.individualDetails.id : null
                },
                queryParamsHandling: 'merge'
            });
    }

    // addGuardian() {
    //     this.router.navigate(['/customer/short-individual'],
    //         {
    //             queryParams: {
    //                 nominee: this.currentPath(this.location),
    //                 type: "guardian",
    //                 guardianId: this.guardianDetails ? this.guardianDetails.id : null
    //             },
    //             queryParamsHandling: 'merge'
    //         });
    // }

    saveNominee() {
        this.markFormGroupAsTouched(this.nomineeForm);
        if(this.nomineeForm.invalid || this.individualDetails.id==null || ((this.nominee.guardianId || (!this.nominee.id && this.nomineeIsMinor)) && this.guardianDetails.id==null)){
            return;
        }

        this.nominee.sharePercentage = this.sharePercentage;
        this.nominee.relationWithAccountHolder = this.relationWithAccountHolder;
        if (this.nominee.guardianId || (!this.nominee.id && this.nomineeIsMinor)) {
            this.nominee.relationWithGuardian = this.relationWithGuardian;
            this.nominee.guardianId = this.guardianDetails.id;
        } else {
            this.nominee.relationWithGuardian = null;
            this.nominee.guardianId = null;
        }
        if (this.nominee.id) {
            this.updateNominee(this.nominee);
        } else {
            this.nominee.accountId = this.queryParams['accountId'];
            this.nominee.individualId = this.individualDetails.id;
            this.createNominee(this.nominee);
        }
    }

    createNominee(nominee: AccountNominee) {
        this.subscribers.saveNominee = this.nomineeService
            .createAccountNominee(nominee)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("nominee.create.success");
                this.cancel();
            });
    }

    updateNominee(nominee: AccountNominee) {
        this.subscribers.updateNominee = this.nomineeService
            .updateAccountNominee(nominee, { nomineeId: nominee.id })
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("nominee.update.success");
                this.cancel();
            });
    }

    cancel() {
        this.navigateAway();
    }

    navigateAway() {
        if (this.queryParams.taskId && this.queryParams['account']) {
            this.router.navigate([this.queryParams['account']], {
                relativeTo: this.route,
                queryParams: {
                    taskId: this.queryParams.taskId,
                    command: this.queryParams.command,
                    commandReference: this.queryParams.commandReference,
                    cus: this.queryParams['cus']
                }
            });
        } else {
            this.router.navigate([this.queryParams['account']], {
                queryParams: { cus: this.queryParams['cus'] }
            });
        }

    }

    // isMinor(individualId: number) {
    //     let queryParamMap = new Map();
    //     queryParamMap.set("individualId", individualId);
    //     this.subscribers.nomineeSub = this.nomineeService.isMinor(queryParamMap)
    //         .subscribe(data => {
    //             this.nomineeIsMinor = data;
    //         });
    // }

    editShortInduvidual() {
        this.router.navigate(['customer/short-individual-edit'],
            {
                queryParams: {
                    individualId: this.nominee.individualId,
                    nomineeEdit: this.currentPath(this.location)
                },
                queryParamsHandling: 'merge'
            });
    }
}