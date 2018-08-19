import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { MenuItem } from 'primeng/components/common/menuitem';
import { RecurringDepositAccountService } from '../../../../services/recurring-deposit-account/service-api/recurring.deposit.account.service';
import { RecurringDepositProduct } from '../../../../services/recurring-deposit-product/domain/recurring.deposit.product.model';
import { IndividualInformation } from '../../../../services/cis/domain/individual.model';
import { RecurringDepositAccount } from '../../../../services/recurring-deposit-account/domain/recurring.deposit.account.model';
import { ContactInformation } from '../../../../services/cis/domain/contact.information.model';
import { Address } from '../../../../services/cis/domain/address.model';
import { Upazilla } from '../../../../services/location/domain/upazilla.models'
import { District } from '../../../../services/location/domain/district.models';
import { Division } from '../../../../services/location/domain/division.models';
import { Country } from '../../../../services/location/domain/country.models';
import { AbabilLocationService } from '../../../../services/location/service-api/location.service';
import { BaseComponent } from '../../base.component';
import { map } from 'rxjs/operators'

export const DETAILS_UI: string = "views/recurring-deposit-account";

@Component({
    selector: 'common-recurring-deposit-account-details',
    templateUrl: './recurring.deposit.details.component.html'
})


export class CommonRecurringDepositAccountDetailsComponent extends BaseComponent implements OnInit, OnChanges {

    otherMenuItems: MenuItem[];
    queryParams: any;

    // introducerDetail: DemandDepositAccount = new DemandDepositAccount();
    // linkAccountDetail: DemandDepositAccount = new DemandDepositAccount();

    @Input('recurringDepositAccountId') recurringDepositAccountId: number;
    recurringDepositProductId: number;
    recurringDepositAccount: RecurringDepositAccount = new RecurringDepositAccount();
    recurringDepositProduct: RecurringDepositProduct = new RecurringDepositProduct();
    individuals: IndividualInformation[] = [];
    contactInformation: ContactInformation = new ContactInformation();
    address: Address = new Address();
    country: Country = new Country();
    division: Division = new Division();
    district: District = new District();
    upazilla: Upazilla = new Upazilla();

    accountId: number;
    customerInputId: number;
    constructor(
        private locationService: AbabilLocationService,
        private recurringDepositAccountService: RecurringDepositAccountService,
    ) {
        super();
    }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.recurringDepositAccountId.currentValue) {
            this.recurringDepositAccountId = changes.recurringDepositAccountId.currentValue;
            this.fetchRecurringDepositAccountDetails();
            this.accountId = changes.recurringDepositAccountId.currentValue;
        }
    }


    fetchRecurringDepositAccountDetails() {
        this.subscribers.fetchRecurringDepositAccountDetailsSub = this.recurringDepositAccountService
            .fetchRecurringDepositAccountDetails({ recurringDepositAccountId: this.recurringDepositAccountId })
            .pipe(map(data => {
                this.recurringDepositAccount = data;
                this.recurringDepositProductId = this.recurringDepositAccount.productId;
                this.contactInformation = this.recurringDepositAccount.contactInformation;
                this.address = this.recurringDepositAccount.contactAddress;
                if (this.recurringDepositAccount.contactAddress.countryId) this.fetchCountryDetail();
                if (this.recurringDepositAccount.contactAddress.divisionId) this.fetchDivisionDetail();
                if (this.recurringDepositAccount.contactAddress.districtId) this.fetchDistrictDetail();
                if (this.recurringDepositAccount.contactAddress.upazillaId) this.fetchUpazillaDetail();
            })).subscribe();
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


    // fetchLinkAccountDetails(linkAccountId: number) {
    //     this.subscribers.fetchLinkAccountDetailsSub = this.accountService
    //         .fetchAccountDetails({ accountId: linkAccountId + "" })
    //         .map(data => {
    //             this.linkAccountDetail = data;
    //         }).subscribe();
    // }
    // fetchIntroducerDetails(introducerAccountId: number) {
    //     this.subscribers.fetchIntroducerDetailsSub = this.accountService
    //         .fetchAccountDetails({ accountId: introducerAccountId + "" })
    //         .map(data => {
    //             this.introducerDetail = data;
    //         }).subscribe();
    // }

}