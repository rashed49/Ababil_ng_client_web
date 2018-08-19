import { Upazilla } from '../../../../services/location/domain/upazilla.models'
import { District } from '../../../../services/location/domain/district.models';
import { Division } from '../../../../services/location/domain/division.models';
import { Country } from '../../../../services/location/domain/country.models';
import { Component, OnInit, OnChanges, SimpleChanges, Input } from "@angular/core";
import { ProductService } from "../../../../services/product/service-api/product.service";
import { Customer } from "../../../../services/cis/domain/cis.models";
import { FixedDepositAccount } from '../../../../services/fixed-deposit-account/domain/fixed.deposit.account.models';
import { Product } from '../../../../services/product/domain/product.models';
import { FixedDepositAccountService } from '../../../../services/fixed-deposit-account/service-api/fixed.deposit.account.service';
import { ContactInformation } from '../../../../services/cis/domain/contact.information.model';
import { Address } from '../../../../services/cis/domain/address.model';
import { AbabilLocationService } from '../../../../services/location/service-api/location.service';
import { FixedDepositProduct } from '../../../../services/fixed-deposit-product/domain/fixed.deposit.product.model';
import { BaseComponent } from '../../base.component';
import { map } from 'rxjs/operators';

@Component({
    selector: 'common-fixed-account-detail',
    templateUrl: './fixed.deposit.details.component.html'
})
export class CommonFixedDepositAccountDetailComponent extends BaseComponent implements OnInit, OnChanges {

    constructor(
        private fixedDepositAccountService: FixedDepositAccountService,
        private locationService: AbabilLocationService,
        private productService: ProductService,
    ) {
        super();
    }

    fixedDepositAccount: FixedDepositAccount = new FixedDepositAccount();
    @Input('fixedDepositAccountId') fixedDepositAccountId: number;

    accountId: number;
    customerInputId: number;

    fixedDepositAccountCustomerDetails: Customer = new Customer();
    fixedDepositAccountCustomerId: number;

    productDetails: Product = new Product();
    productId: number;

    queryParams: any = {};
    transactionDetails: any[] = [];

    individuals: any[] = [];

    totalRecords: number;
    totalPages: number;
    fixedDepositProduct: FixedDepositProduct = new FixedDepositProduct();

    contactInformation: ContactInformation = new ContactInformation();
    address: Address = new Address();
    country: Country = new Country();
    division: Division = new Division();
    district: District = new District();
    upazilla: Upazilla = new Upazilla();

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.fixedDepositAccountId.currentValue) {
            this.fixedDepositAccountId = changes.fixedDepositAccountId.currentValue;
            this.fetchFixedDepositAccountDetails();
            this.accountId = this.fixedDepositAccountId;
        }
    }

    fetchFixedDepositAccountDetails() {
        this.subscribers.fetchFixedDepositAccountDetailsSub = this.fixedDepositAccountService
            .fetchFixedDepositAccountDetails({ fixedDepositAccountId: this.fixedDepositAccountId + "" })
            .pipe(map(data => {
                this.fixedDepositAccount = data;
                this.fixedDepositAccountCustomerId = this.fixedDepositAccount.customerId;
                this.productId = this.fixedDepositAccount.productId;
                this.contactInformation = this.fixedDepositAccount.contactInformation;
                this.address = this.fixedDepositAccount.contactAddress;

                if (this.fixedDepositAccount.contactAddress.countryId) this.fetchCountryDetail();
                if (this.fixedDepositAccount.contactAddress.divisionId) this.fetchDivisionDetail();
                if (this.fixedDepositAccount.contactAddress.districtId) this.fetchDistrictDetail();
                if (this.fixedDepositAccount.contactAddress.upazillaId) this.fetchUpazillaDetail();
                this.fetchProductDetails();
            })).subscribe();
    }

    fetchCountryDetail() {
        this.subscribers.fetchCountrySub = this.locationService
            .fetchCountryDetail({ countryId: this.fixedDepositAccount.contactAddress.countryId })
            .subscribe(data => this.country = data);
    }

    fetchDivisionDetail() {
        this.subscribers.fetchDivisionDetailSub = this.locationService
            .fetchDivisionDetail({
                countryId: this.fixedDepositAccount.contactAddress.countryId,
                divisionId: this.fixedDepositAccount.contactAddress.divisionId
            }).subscribe(data => this.division = data);
    }

    fetchDistrictDetail() {
        this.subscribers.fetchDistrictDetailSub = this.locationService
            .fetchDistrictDetail({
                countryId: this.fixedDepositAccount.contactAddress.countryId,
                divisionId: this.fixedDepositAccount.contactAddress.divisionId,
                districtId: this.fixedDepositAccount.contactAddress.districtId
            }).subscribe(data => this.district = data);
    }

    fetchUpazillaDetail() {
        this.subscribers.fetchUpazillaDetailSub = this.locationService
            .fetchUpazillaDetail({
                countryId: this.fixedDepositAccount.contactAddress.countryId,
                divisionId: this.fixedDepositAccount.contactAddress.divisionId,
                districtId: this.fixedDepositAccount.contactAddress.districtId,
                upazillaId: this.fixedDepositAccount.contactAddress.upazillaId
            }).subscribe(data => this.upazilla = data);
    }

    fetchProductDetails() {
        this.subscribers.fetchProductDetailsSub = this.productService
            .fetchProductDetails({ id: this.productId + "" })
            .subscribe(product => this.productDetails = product);
    }

    reload() {
        this.fetchFixedDepositAccountDetails();
    }
}