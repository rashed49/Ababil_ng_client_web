import { Component, OnInit, SimpleChanges, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { BaseComponent } from "../../../components/base.component";
import { CISService } from "../../../../services/cis/service-api/cis.service";
import { DemandDepositAccountService } from '../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { ProductService } from "../../../../services/product/service-api/product.service";
import * as commandConstants from '../../../constants/app.command.constants';
import { Customer } from "../../../../services/cis/domain/cis.models";
import { DemandDepositAccount } from '../../../../services/demand-deposit-account/domain/demand.deposit.account.models';
import { AccountNominee } from "../../../../services/nominee/domain/nominee.model";
import { Product } from '../../../../services/product/domain/product.models';
import { MenuItem } from 'primeng/primeng';
import { Observable } from "rxjs";
import { AbabilLocationService } from "../../../../services/location/service-api/location.service";
import { Address } from "../../../../services/cis/domain/address.model";
import { Country } from "../../../../services/location/domain/country.models";
import { Division } from "../../../../services/location/domain/division.models";
import { District } from "../../../../services/location/domain/district.models";
import { Upazilla } from "../../../../services/location/domain/upazilla.models";
import { ContactInformation } from "../../../../services/cis/domain/contact.information.model";
import { DemandDepositProductService } from "../../../../services/demand-deposit-product/service-api/demand-deposit-product.service";
import { DemandDepositProduct } from "../../../../services/demand-deposit-product/domain/demand-deposit-product.model";
import { map } from 'rxjs/operators';

@Component({
  selector: 'deposit-account-detail',
  templateUrl: './demand.deposit.details.component.html'
})
export class CommonDemandDepositAccountDetailComponent extends BaseComponent implements OnInit {

  constructor(
    private cisService: CISService,
    private demandDepositAccountService: DemandDepositAccountService,
    private location: Location,
    private locationService: AbabilLocationService,
    private productService: ProductService,
    private demandDepositProductService: DemandDepositProductService,
    private route: ActivatedRoute,
    private router: Router) {
    super();
  }

  otherMenuItems: MenuItem[];
  verifierSelectionModalVisible: Observable<boolean>;
  command: string = commandConstants.ACTIVATE_DEMAND_DEPOSIT_ACCOUNT_COMMAND;
  demandDepositAccount: DemandDepositAccount = new DemandDepositAccount();
  customer: Customer = new Customer();
  productDetails: Product = new Product();
  productId: number;
  queryParams: any = {};
  transactionDetails: any[] = [];
  nominees: AccountNominee[];
  selectedNominee: AccountNominee;
  individuals: any[] = [];
  totalSharePercentage: number;
  urlSearchMap: Map<string, any>;
  totalRecords: number;
  totalPages: number;
  contactInformation: ContactInformation = new ContactInformation();
  demandDepositProductDetail: DemandDepositProduct = new DemandDepositProduct();
  routeBack: string;
  address: Address = new Address();
  country: Country = new Country();
  division: Division = new Division();
  district: District = new District();
  upazilla: Upazilla = new Upazilla();
  accountId: number;

  @Input('demandDepositAccountId') demandDepositAccountId: number;
  @Input('customerId') customerId: number;

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.demandDepositAccountId.currentValue) {
      this.demandDepositAccountId = changes.demandDepositAccountId.currentValue;
      this.fetchDemandDepositAccountDetails();
      this.accountId = changes.demandDepositAccountId.currentValue;
    }
  }


  fetchDemandDepositAccountDetails() {
    this.subscribers.fetchDemandDepositAccountDetailsSub = this.demandDepositAccountService
      .fetchDemandDepositAccountDetails({ id: this.demandDepositAccountId + "" })
      .pipe(map(account => {
        this.demandDepositAccount = account;
        this.customerId = this.demandDepositAccount.customerId;
        this.productId = this.demandDepositAccount.productId;
        this.contactInformation = this.demandDepositAccount.contactInformation ? this.demandDepositAccount.contactInformation : new ContactInformation();
        this.address = this.demandDepositAccount.contactAddress;

        if (this.demandDepositAccount.contactAddress.countryId) this.fetchCountryDetail();
        if (this.demandDepositAccount.contactAddress.divisionId) this.fetchDivisionDetail();
        if (this.demandDepositAccount.contactAddress.districtId) this.fetchDistrictDetail();
        if (this.demandDepositAccount.contactAddress.upazillaId) this.fetchUpazillaDetail();

        this.fetchAccountCustomer();
        this.fetchProductDetails();
      })).subscribe();
  }

  fetchAccountCustomer() {
    this.subscribers.fetchCustomerSub = this.cisService
      .fetchCustomer({ id: this.customerId + "" })
      .subscribe(data => this.customer = data);
  }

  fetchCountryDetail() {
    this.subscribers.fetchCountrySub = this.locationService
      .fetchCountryDetail({ countryId: this.demandDepositAccount.contactAddress.countryId })
      .subscribe(data => this.country = data);
  }

  fetchDivisionDetail() {
    this.subscribers.fetchDivisionDetailSub = this.locationService
      .fetchDivisionDetail({
        countryId: this.demandDepositAccount.contactAddress.countryId,
        divisionId: this.demandDepositAccount.contactAddress.divisionId
      }).subscribe(data => this.division = data);
  }

  fetchDistrictDetail() {
    this.subscribers.fetchDistrictDetailSub = this.locationService
      .fetchDistrictDetail({
        countryId: this.demandDepositAccount.contactAddress.countryId,
        divisionId: this.demandDepositAccount.contactAddress.divisionId,
        districtId: this.demandDepositAccount.contactAddress.districtId
      }).subscribe(data => this.district = data);
  }

  fetchUpazillaDetail() {
    this.subscribers.fetchUpazillaDetailSub = this.locationService
      .fetchUpazillaDetail({
        countryId: this.demandDepositAccount.contactAddress.countryId,
        divisionId: this.demandDepositAccount.contactAddress.divisionId,
        districtId: this.demandDepositAccount.contactAddress.districtId,
        upazillaId: this.demandDepositAccount.contactAddress.upazillaId
      }).subscribe(data => this.upazilla = data);
  }

  fetchProductDetails() {
    this.subscribers.fetchProductDetailsSub = this.productService
      .fetchProductDetails({ id: this.productId + "" })
      .subscribe(product => this.productDetails = product);
  }

}