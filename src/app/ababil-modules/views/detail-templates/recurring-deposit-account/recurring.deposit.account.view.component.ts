import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ViewsBaseComponent } from "../../view.base.component";
import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';
import { MenuItem } from 'primeng/components/common/menuitem';
import { RecurringDepositAccountService } from '../../../../services/recurring-deposit-account/service-api/recurring.deposit.account.service';
import { RecurringDepositProduct } from './../../../../services/recurring-deposit-product/domain/recurring.deposit.product.model';
import { RecurringDepositProductService } from '../../../../services/recurring-deposit-product/service-api/recurring.deposit.product.service';
import { NomineeService } from '../../../../services/nominee/service-api/nominee.service';
import { AccountNominee } from '../../../../services/nominee/domain/nominee.model';
import { CISService } from './../../../../services/cis/service-api/cis.service';
import { IndividualInformation } from '../../../../services/cis/domain/individual.model';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import * as commandConstants from '../../../../common/constants/app.command.constants';
import { NotificationService } from '../../../../common/notification/notification.service';
import { RecurringDepositAccount } from '../../../../services/recurring-deposit-account/domain/recurring.deposit.account.model';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { DemandDepositAccount } from "../../../../services/demand-deposit-account/domain/demand.deposit.account.models";
import { ContactInformation } from '../../../../services/cis/domain/contact.information.model';
import { AccountService } from './../../../../services/account/service-api/account.service';
import { Address } from '../../../../services/cis/domain/address.model';
import { AbabilLocationService } from '../../../../services/location/service-api/location.service';
import { Country } from '../../../../services/location/domain/country.models';
import { Division } from '../../../../services/location/domain/division.models';
import { District } from '../../../../services/location/domain/district.models';
import { Upazilla } from '../../../../services/location/domain/upazilla.models';
import { AccountOpeningChannels } from '../../../../services/account/domain/account.opening.channels';
import { Product } from '../../../../services/product/domain/product.models';
import { ProductService } from '../../../../services/product/service-api/product.service';

export const DETAILS_UI: string = "views/recurring-deposit-account";

@Component({
    selector: 'recurring-deposit-account-view',
    templateUrl: './recurring.deposit.account.view.component.html'
})


export class RecurringDepositAccountViewComponent extends ViewsBaseComponent implements OnInit {

    otherMenuItems: MenuItem[];
    queryParams: any = {};
    recurringDepositAccountId: number;
    recurringDepositProductId: number;
    recurringDepositAccount: RecurringDepositAccount = new RecurringDepositAccount();
    recurringDepositProduct: RecurringDepositProduct = new RecurringDepositProduct();

    contactInformation: ContactInformation = new ContactInformation();
    address: Address = new Address();


    introducerDetail: DemandDepositAccount = new DemandDepositAccount();
    linkAccountDetail: DemandDepositAccount = new DemandDepositAccount();



    nominees: AccountNominee[] = [];
    totalSharePercentage: number;
    individuals: IndividualInformation[] = [];
    selectedNominee: AccountNominee;
    verifierSelectionModalVisible: Observable<boolean>;
    command: string = commandConstants.ACTIVATE_RECURRING_DEPOSIT_ACCOUNT_COMMAND;
    country: Country = new Country();
    division: Division = new Division();
    district: District = new District();
    upazilla: Upazilla = new Upazilla();
    accountDataChanged: Subject<RecurringDepositAccount> = new Subject<RecurringDepositAccount>();
    productDetails: Product = new Product();
    productId: number;

    constructor(private cisService: CISService,
        private confirmationService: ConfirmationService,
        protected router: Router,
        protected location: Location,
        private route: ActivatedRoute,
        private nomineeService: NomineeService,
        protected notificationService: NotificationService,
        private accountService: AccountService,
        private recurringDepositAccountService: RecurringDepositAccountService,
        private locationService: AbabilLocationService,
        private productService: ProductService,
        private recurringDepositProductService: RecurringDepositProductService, protected workflowService: ApprovalflowService) {
        super(location, router, workflowService, notificationService);
    }

    ngOnInit(): void {

        this.showVerifierSelectionModal = of(false);
        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.command = this.queryParams.command;
            this.taskId = this.queryParams.taskId;
            this.processId = this.queryParams.taskId;
            this.recurringDepositAccountId = this.queryParams.recurringDepositAccountId;

            if ((this.queryParams.inactive) && (this.queryParams.command === "ActivateRecurringDepositAccountCommand")) {
                this.fetchRecurringDepositAccountDetails();
            } else {
                this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                    .subscribe(data => {
                        this.recurringDepositAccount = data;
                        this.accountDataChanged.next(data);
                    });
            }
        });

        this.accountDataChanged
            .pipe(debounceTime(1500), distinctUntilChanged())
            .subscribe(model => {
                this.recurringDepositAccount = model;
                this.contactInformation = model.contactInformation;
                this.address = model.contactAddress;
                this.fetchLinkAccountDetails(this.recurringDepositAccount.linkAccountId);
                if (this.recurringDepositAccount.introducerAccountId) this.fetchIntroducerDetails(this.recurringDepositAccount.introducerAccountId);
                if (this.recurringDepositAccount.accountOpeningChannelId) this.fetchAccountOpeningChannelDetail(this.recurringDepositAccount.accountOpeningChannelId);
                if (this.recurringDepositAccount.contactAddress.countryId) this.fetchCountryDetail();
                if (this.recurringDepositAccount.contactAddress.divisionId) this.fetchDivisionDetail();
                if (this.recurringDepositAccount.contactAddress.districtId) this.fetchDistrictDetail();
                if (this.recurringDepositAccount.contactAddress.upazillaId) this.fetchUpazillaDetail();

                this.fetchRecurringDepositProductDetails(model.productId);
                this.fetchNominees();
            });

    }
    fetchProductDetails() {
        this.subscribers.fetchProductDetailsSub = this.productService
            .fetchProductDetails({ id: this.productId + "" })
            .subscribe(product => this.productDetails = product);
    }
    accountOpeningChannel: AccountOpeningChannels = new AccountOpeningChannels();
    fetchAccountOpeningChannelDetail(accountOpeningChannelId: number) {
        this.subscribers.fetchChannelSub = this.accountService.fetchAccountOpeningChannelDetail({ id: accountOpeningChannelId }).subscribe(
            data => {
                this.accountOpeningChannel = data;
                console.log(data);
            }
        )
    }

    initialOtherMenus() {
        this.otherMenuItems = [
            { label: 'Signature', icon: 'ui-icon-gesture', command: () => this.goToSignature() }
        ];
    }

    goToSignature() {
        this.router.navigate(['signature/'], {
            relativeTo: this.route,
            queryParams: {
                accountId: this.recurringDepositAccountId,
                routeBack: this.currentPath(this.location),
                cus: this.queryParams.cus,
                customerId: this.recurringDepositAccount.customerId
            }
        });
    }

    fetchRecurringDepositAccountDetails() {
        this.subscribers.fetchRecurringDepositAccountDetailsSub = this.recurringDepositAccountService
            .fetchRecurringDepositAccountDetails({ recurringDepositAccountId: this.recurringDepositAccountId })
            .pipe(map(data => {
                this.recurringDepositAccount = data;
                this.accountDataChanged.next(data);
                // this.recurringDepositProductId = this.recurringDepositAccount.productId;
                // this.contactInformation = this.recurringDepositAccount.contactInformation;
                // this.address = this.recurringDepositAccount.contactAddress;
                // this.fetchLinkAccountDetails(this.recurringDepositAccount.linkAccountId);
                // this.fetchIntroducerDetails(this.recurringDepositAccount.introducerAccountId);
                // if (this.recurringDepositAccount.contactAddress.countryId) this.fetchCountryDetail();
                // if (this.recurringDepositAccount.contactAddress.divisionId) this.fetchDivisionDetail();
                // if (this.recurringDepositAccount.contactAddress.districtId) this.fetchDistrictDetail();
                // if (this.recurringDepositAccount.contactAddress.upazillaId) this.fetchUpazillaDetail();

                // this.fetchRecurringDepositProductDetails();
                // this.fetchNominees();
            })).subscribe();
    }

    fetchRecurringDepositProductDetails(productId: number) {
        this.subscribers.fetchRecurringDepositProductDetailsSub = this.recurringDepositProductService
            .fetchRecurringDepositProductDetails({ recurringDepositProductId: productId })
            .subscribe(data => {
                this.recurringDepositProduct = data;
                console.log(this.recurringDepositProduct)
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

    goToNomineeDetail() {
        this.router.navigate(['nominee/', this.selectedNominee.id], {
            relativeTo: this.route,
            queryParams: {
                accountId: this.recurringDepositAccountId,
                nomineeId: this.selectedNominee.id
            }
        });
    }

    cancel() {
        this.location.back();
    }

    navigateAway() {
        this.router.navigate([this.queryParams.cus]);
    }

    fetchLinkAccountDetails(linkAccountId: number) {
        this.subscribers.fetchLinkAccountDetailsSub = this.accountService
            .fetchAccountDetails({ accountId: linkAccountId + "" })
            .subscribe(data => this.linkAccountDetail = data);
    }

    fetchIntroducerDetails(introducerAccountId: number) {
        this.subscribers.fetchIntroducerDetailsSub = this.accountService
            .fetchAccountDetails({ accountId: introducerAccountId + "" })
            .subscribe(data => this.introducerDetail = data);
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
}