import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBaseComponent } from './../../../../../../common/components/base.form.component';
import { ApprovalflowService } from '../../../../../../services/approvalflow/service-api/approval.flow.service';
import { MenuItem } from 'primeng/components/common/menuitem';
import { RecurringDepositAccountService } from '../../../../../../services/recurring-deposit-account/service-api/recurring.deposit.account.service';
import { RecurringDepositProduct } from './../../../../../../services/recurring-deposit-product/domain/recurring.deposit.product.model';
import { RecurringDepositProductService } from '../../../../../../services/recurring-deposit-product/service-api/recurring.deposit.product.service';
import { NomineeService } from '../../../../../../services/nominee/service-api/nominee.service';
import { AccountNominee } from '../../../../../../services/nominee/domain/nominee.model';
import { CISService } from './../../../../../../services/cis/service-api/cis.service';
import { IndividualInformation } from '../../../../../../services/cis/domain/individual.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as commandConstants from '../../../../../../common/constants/app.command.constants';
import { NotificationService } from '../../../../../../common/notification/notification.service';
import { VerifierSelectionEvent } from '../../../../../../common/components/verifier-selection/verifier.selection.component';
import { RecurringDepositAccount } from '../../../../../../services/recurring-deposit-account/domain/recurring.deposit.account.model';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { DemandDepositAccount } from "../../../../../../services/demand-deposit-account/domain/demand.deposit.account.models";
import { ContactInformation } from '../../../../../../services/cis/domain/contact.information.model';
import { AccountService } from './../../../../../../services/account/service-api/account.service';
import { Address } from '../../../../../../services/cis/domain/address.model';
import { Country } from '../../../../../../services/location/domain/country.models';
import { Division } from '../../../../../../services/location/domain/division.models';
import { District } from '../../../../../../services/location/domain/district.models';
import { Upazilla } from '../../../../../../services/location/domain/upazilla.models';
import { AbabilLocationService } from '../../../../../../services/location/service-api/location.service';
import { AccountOpeningChannels } from '../../../../../../services/account/domain/account.opening.channels';
import { KycService } from '../../../../../../services/kyc/service-api/kyc.service';

export const DETAILS_UI: string = "views/recurring-deposit-account";

@Component({
    selector: 'recurring-deposit-account-details',
    templateUrl: './recurring.deposit.account.details.component.html'
})


export class RecurringDepositAccountDetailsComponent extends FormBaseComponent implements OnInit {

    otherMenuItems: MenuItem[];
    queryParams: any;

    introducerDetail: DemandDepositAccount = new DemandDepositAccount();
    linkAccountDetail: DemandDepositAccount = new DemandDepositAccount();

    recurringDepositAccountId: number;
    recurringDepositProductId: number;
    recurringDepositAccount: RecurringDepositAccount = new RecurringDepositAccount();
    recurringDepositProduct: RecurringDepositProduct = new RecurringDepositProduct();
    nominees: AccountNominee[] = [];
    totalSharePercentage: number;
    individuals: IndividualInformation[] = [];
    selectedNominee: AccountNominee;
    isProductPensionScheme: boolean = false;
    isTenorRequired: boolean = false;
    verifierSelectionModalVisible: Observable<boolean>;
    command: string = commandConstants.ACTIVATE_RECURRING_DEPOSIT_ACCOUNT_COMMAND;
    contactInformation: ContactInformation = new ContactInformation();
    address: Address = new Address();
    country: Country = new Country();
    division: Division = new Division();
    district: District = new District();
    upazilla: Upazilla = new Upazilla();


    constructor(private cisService: CISService,
        private confirmationService: ConfirmationService,
        private router: Router,
        protected location: Location,
        private locationService: AbabilLocationService,
        private route: ActivatedRoute,
        private nomineeService: NomineeService,
        private accountService: AccountService,
        private kycService: KycService,
        private notificationService: NotificationService,
        private recurringDepositAccountService: RecurringDepositAccountService,
        private recurringDepositProductService: RecurringDepositProductService,
        protected approvalFlowService: ApprovalflowService) {
        super(location, approvalFlowService);
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);
        this.initialOtherMenus();

        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.recurringDepositAccountId = +params['id'];
            this.fetchRecurringDepositAccountDetails();
        });

        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.taskId = params['taskId'];
            this.commandReference = params['commandReference'];
        });
    }

    initialOtherMenus() {
        this.otherMenuItems = [
            { label: 'KYC', icon: 'ui-icon-accessibility', command: () => this.goToKyc() },
            { label: 'Signature', icon: 'ui-icon-gesture', command: () => this.goToSignature() },
            { label: 'Pension scheduler', icon: 'ui-icon-date-range', command: () => this.goToPensionScheduler() }
        ];
    }

    goToPensionScheduler() {
        const url = this.router.createUrlTree(['/pension-scheduler', 'form'], {
            relativeTo: this.route,
            queryParams: {
                account: this.currentPath(this.location),
                accountId: this.recurringDepositAccountId
            },
            queryParamsHandling: "merge"
        });

        this.router.navigateByUrl(url);
    }

    goToSignature() {
        const url = this.router.createUrlTree(['/account-operator'], {
            relativeTo: this.route,
            queryParams: {
                accountId: this.recurringDepositAccountId,
                routeBack: this.currentPath(this.location),
                cus: this.queryParams.cus,
                customerId: this.recurringDepositAccount.customerId
            },
            queryParamsHandling: "merge"
        });
        this.router.navigateByUrl(url);
    }
    closeAccount() {
        this.router.navigate(['../', 'close-account'], {
            relativeTo: this.route,
            queryParams: {
                recurringDeposit: this.currentPath(this.location),
                command: "RecurringDepositAccountCloseCommand",
                customerId: this.recurringDepositAccount.customerId
            },
            queryParamsHandling: "merge"
        });
    }

    goToKyc() {
        let searchParam = new Map<string, string>();
        searchParam.set('accountNumber', this.recurringDepositAccount.number + '');
        this.subscribers.fetchKycesDetailsSub = this.kycService.fetchKyces(searchParam)
            .subscribe(data => {
                let routePath: string;
                if (".KycIndividual" == data.type) { routePath = '/kyc/individual'; }
                else if (".KycInstitute" == data.type) { routePath = '/kyc/institute'; }

                routePath = (data.id && data.id != 0) ? routePath.concat('/details') : routePath.concat('/edit');
                const url = this.router.createUrlTree([routePath], {
                    queryParams: {
                        account: this.currentPath(this.location),
                        accountNumber: this.recurringDepositAccount.number
                    },
                    queryParamsHandling: "merge"
                });
                this.router.navigateByUrl(url);
            });
    }

    fetchRecurringDepositAccountDetails() {
        this.subscribers.fetchRecurringDepositAccountDetailsSub = this.recurringDepositAccountService
            .fetchRecurringDepositAccountDetails({ recurringDepositAccountId: this.recurringDepositAccountId })
            .pipe(map(data => {
                this.recurringDepositAccount = data;
                this.recurringDepositProductId = this.recurringDepositAccount.productId;
                this.contactInformation = this.recurringDepositAccount.contactInformation;
                this.address = this.recurringDepositAccount.contactAddress;
                if (this.recurringDepositAccount.linkAccountId) this.fetchLinkAccountDetails(this.recurringDepositAccount.linkAccountId);
                if (this.recurringDepositAccount.introducerAccountId) this.fetchIntroducerDetails(this.recurringDepositAccount.introducerAccountId);
                if (this.recurringDepositAccount.accountOpeningChannelId) this.fetchAccountOpeningChannelDetail(this.recurringDepositAccount.accountOpeningChannelId);
                if (this.recurringDepositAccount.contactAddress.countryId) this.fetchCountryDetail();
                if (this.recurringDepositAccount.contactAddress.divisionId) this.fetchDivisionDetail();
                if (this.recurringDepositAccount.contactAddress.districtId) this.fetchDistrictDetail();
                if (this.recurringDepositAccount.contactAddress.upazillaId) this.fetchUpazillaDetail();
                this.fetchRecurringDepositProductDetails();
                this.fetchNominees();
                if (this.recurringDepositAccount.status === "ACTIVATED") {
                    this.command = "ReactivateRecurringDepositAccountCommand";
                } else {
                    this.command = commandConstants.ACTIVATE_RECURRING_DEPOSIT_ACCOUNT_COMMAND;
                }
            })).subscribe();
    }

    accountOpeningChannel: AccountOpeningChannels = new AccountOpeningChannels();
    fetchAccountOpeningChannelDetail(accountOpeningChannelId: number) {
        this.subscribers.fetchChannelSub = this.accountService.fetchAccountOpeningChannelDetail({ id: accountOpeningChannelId }).subscribe(
            data => {
                this.accountOpeningChannel = data;
            }
        )
    }

    fetchCountryDetail() {
        this.subscribers.fetchCountrySub = this.locationService
            .fetchCountryDetail({ countryId: this.recurringDepositAccount.contactAddress.countryId })
            .subscribe(data => this.country = data);
    }

    fetchDivisionDetail() {
        this.subscribers.fetchDivisionDetailSub = this.locationService
            .fetchDivisionDetail({
                countryId: this.recurringDepositAccount.contactAddress.countryId,
                divisionId: this.recurringDepositAccount.contactAddress.divisionId
            }).subscribe(data => this.division = data);
    }

    fetchDistrictDetail() {
        this.subscribers.fetchDistrictDetailSub = this.locationService
            .fetchDistrictDetail({
                countryId: this.recurringDepositAccount.contactAddress.countryId,
                divisionId: this.recurringDepositAccount.contactAddress.divisionId,
                districtId: this.recurringDepositAccount.contactAddress.districtId
            }).subscribe(data => this.district = data);
    }

    fetchUpazillaDetail() {
        this.subscribers.fetchUpazillaDetailSub = this.locationService
            .fetchUpazillaDetail({
                countryId: this.recurringDepositAccount.contactAddress.countryId,
                divisionId: this.recurringDepositAccount.contactAddress.divisionId,
                districtId: this.recurringDepositAccount.contactAddress.districtId,
                upazillaId: this.recurringDepositAccount.contactAddress.upazillaId
            }).subscribe(data => this.upazilla = data);
    }

    fetchRecurringDepositProductDetails() {
        this.subscribers.fetchRecurringDepositProductDetailsSub = this.recurringDepositProductService
            .fetchRecurringDepositProductDetails({ recurringDepositProductId: this.recurringDepositProductId })
            .subscribe(data => {
                this.recurringDepositProduct = data;
                this.addSpecialProfitRate();
                this.addAccountCloseButton();

                this.isProductPensionScheme = data.isPensionScheme ? true : false;
                this.isTenorRequired = data.isTenorRequired ? true : false;
            });
    }

    fetchNominees() {
        let queryParams = new Map();
        queryParams.set("accountId", this.recurringDepositAccountId);
        this.subscribers.fetchNomineesSub = this.nomineeService
            .fetchAccountNominees(queryParams)
            .pipe(map(data => {
                this.nominees = data.content;
                this.sumOfSharePencentage(this.nominees);
                this.fetchNomineeNames();
            })).subscribe();
    }

    fetchNomineeNames() {
        let ids = this.nominees.map(nominee => nominee.individualId);
        this.nominees.forEach(nominee => {
            this.cisService.fetchIindividualInformations({ id: ids })
                .subscribe(data => {
                    this.individuals = data.content;
                });
        });
    }

    //should be cached somewhere like in a map
    nomineeName(individualId: number): string {
        for (let i = 0; i < this.individuals.length; i++) {
            if (this.individuals[i].id == individualId)
                return this.individuals[i].firstName ? this.individuals[i].firstName : '' + ' ' +
                    this.individuals[i].middleName ? this.individuals[i].middleName : '' + ' ' +
                        this.individuals[i].lastName ? this.individuals[i].lastName : '';
        }
        return '';
    }

    sumOfSharePencentage(nominees: AccountNominee[]) {
        this.totalSharePercentage = 0;
        for (let nominee of this.nominees) {
            this.totalSharePercentage += nominee.sharePercentage;
        }
        this.addNomineeButton(this.totalSharePercentage);
    }

    addNomineeButton(totalSharePercentage) {
        this.initialOtherMenus();
        if (totalSharePercentage < 100) {
            this.otherMenuItems.push({ label: 'Add nominee', icon: 'ui-icon-face', command: () => this.addNominee() })
        }
    }
    addSpecialProfitRate() {
        if (this.recurringDepositAccount.status === 'ACTIVATED') {
            this.otherMenuItems.push(
                { label: 'Special profit rate', icon: 'ui-icon-attach-money', command: () => this.goToSpecialProfitRate() }
            );
        }

    }
    addAccountCloseButton() {
        if ((this.recurringDepositAccount.status === "ACTIVATED" || this.recurringDepositAccount.status === "MATURED") && (this.recurringDepositAccount.freeze === false)) {
            this.otherMenuItems.push(
                { label: 'Close account', icon: 'ui-icon-cancel', command: () => this.closeAccount() }
            );
        }
    }


    addNominee() {
        const url = this.router.createUrlTree(['/nominee', 'create'], {
            relativeTo: this.route,
            queryParams: {
                account: this.currentPath(this.location),
                accountId: this.recurringDepositAccountId,
                individualId: null
            },
            queryParamsHandling: "merge"
        });
        this.router.navigateByUrl(url);
    }
    goToSpecialProfitRate() {
        const url = this.router.createUrlTree(['/special-profit-rate', 'form'], {
            relativeTo: this.route,
            queryParams: {
                account: this.currentPath(this.location),
                accountId: this.recurringDepositAccountId
            },
            queryParamsHandling: "merge"
        });

        this.router.navigateByUrl(url);
    }


    navigateToNomineeDetail() {
        this.router.navigate(['nominee', this.selectedNominee.id, 'details'], {
            queryParams: {
                account: this.currentPath(this.location),
                accountId: this.recurringDepositAccountId
            },
            queryParamsHandling: 'merge'
        });
    }

    edit() {

        this.router.navigate(['../', 'edit', { customerId: this.recurringDepositAccount.customerId }], {
            relativeTo: this.route,
            queryParams: { account: this.currentPath(this.location), accountStatus: this.recurringDepositAccount.status },
            queryParamsHandling: "merge"
        });
    }

    activate() {
        this.showVerifierSelectionModal = of(true);
    }
    
    reactivate() {
        this.showVerifierSelectionModal = of(true);
    }

    onVerifierSelect(event: VerifierSelectionEvent) {

        if (this.recurringDepositAccount.status !== "ACTIVATED") {
            let view_ui = DETAILS_UI.concat("?recurringDepositAccountId=").concat(this.recurringDepositAccountId.toString()).concat("&").concat("inactive=true&");
            let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));
            this.recurringDepositAccountService.activateRecurringDepositAccount(this.recurringDepositAccountId, urlSearchParams)
                .subscribe(data => {
                    this.notificationService.sendSuccessMsg("approval.requst.success");
                    this.navigateAway();
                });
        }
        else {
            let view_ui = DETAILS_UI.concat("?accountId=").concat(this.recurringDepositAccountId.toString()).concat("&");
            let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));
            // let reactivationDetail = new ReactivateDemandDepositAccountCommandDetails();
            // this.demandDepositAccountService.reactivateAccount(this.demandDepositAccountId, reactivationDetail, urlSearchParams)
            //   .subscribe(data => {
            //     this.notificationService.sendSuccessMsg(REACTIVATION_SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
            //     this.navigateAway();
            //   });
        }
    }


    cancel() {
        this.navigateAway();
    }

    navigateAway() {
        this.router.navigate([this.queryParams.cus]);
    }

    reload() {
        this.fetchRecurringDepositAccountDetails();
    }

    deleteNominee(nominee: AccountNominee) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this nominee?',
            accept: () => {
                this.deleterecurringDepositAccountNominee(nominee);
            }
        });
    }

    deleterecurringDepositAccountNominee(nominee: AccountNominee) {
        this.subscribers.deleteNominee = this.nomineeService
            .deleteAccountNominee({ nomineeId: nominee.id })
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("nominee.delete.success");
                this.fetchNominees();
            })
    }

    fetchLinkAccountDetails(linkAccountId: number) {
        this.subscribers.fetchLinkAccountDetailsSub = this.accountService
            .fetchAccountDetails({ accountId: linkAccountId + "" })
            .pipe(map(data => this.linkAccountDetail = data))
            .subscribe();
    }
    fetchIntroducerDetails(introducerAccountId: number) {
        this.subscribers.fetchIntroducerDetailsSub = this.accountService
            .fetchAccountDetails({ accountId: introducerAccountId + "" })
            .pipe(map(data => this.introducerDetail = data))
            .subscribe();
    }

}