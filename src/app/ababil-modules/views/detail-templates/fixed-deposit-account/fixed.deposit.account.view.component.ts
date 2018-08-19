import { ApprovalflowService } from './../../../../services/approvalflow/service-api/approval.flow.service';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { MenuItem } from 'primeng/primeng';
import { of } from "rxjs";
import { CISService } from '../../../../services/cis/service-api/cis.service';
import { FixedDepositAccountService } from '../../../../services/fixed-deposit-account/service-api/fixed.deposit.account.service';
import { NomineeService } from '../../../../services/nominee/service-api/nominee.service';
import { ProductService } from '../../../../services/product/service-api/product.service';
import { FixedDepositAccount } from '../../../../services/fixed-deposit-account/domain/fixed.deposit.account.models';
import { Customer } from '../../../../services/cis/domain/cis.models';
import { Product } from '../../../../services/product/domain/product.models';
import { AccountNominee } from '../../../../services/nominee/domain/nominee.model';
import { NotificationService } from './../../../../common/notification/notification.service';
import { ViewsBaseComponent } from "../../view.base.component";
import { ContactInformation } from '../../../../services/cis/domain/contact.information.model';
import { AccountService } from './../../../../services/account/service-api/account.service';
import { Address } from '../../../../services/cis/domain/address.model';
import { DemandDepositAccount } from "../../../../services/demand-deposit-account/domain/demand.deposit.account.models";
import { Country } from '../../../../services/location/domain/country.models';
import { Division } from '../../../../services/location/domain/division.models';
import { District } from '../../../../services/location/domain/district.models';
import { Upazilla } from '../../../../services/location/domain/upazilla.models';
import { AbabilLocationService } from '../../../../services/location/service-api/location.service';
import { AccountOpeningChannels } from '../../../../services/account/domain/account.opening.channels';
import { map } from 'rxjs/operators';

@Component({
  selector: 'fixed.deposit.account.view',
  templateUrl: './fixed.deposit.account.view.component.html'
})
export class FixedDepositAccountViewComponent extends ViewsBaseComponent implements OnInit {

  constructor(
    private cisService: CISService,
    private fixedDepositAccountService: FixedDepositAccountService,
    protected location: Location,
    private locationService: AbabilLocationService,
    private nomineeService: NomineeService,
    protected notificationService: NotificationService,
    private productService: ProductService,
    private route: ActivatedRoute,
    protected router: Router,
    private accountService: AccountService,
    protected workflowService: ApprovalflowService) {
    super(location, router, workflowService, notificationService);
  }

  otherMenuItems: MenuItem[];
  fixedDepositProductId: number;
  fixedDepositAccount: FixedDepositAccount = new FixedDepositAccount();
  fixedDepositAccountId: number;
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
  introducerDetail: DemandDepositAccount = new DemandDepositAccount();
  linkAccountDetail: DemandDepositAccount = new DemandDepositAccount();
  contactInformation: ContactInformation = new ContactInformation();
  address: Address = new Address();
  country: Country = new Country();
  division: Division = new Division();
  district: District = new District();
  upazilla: Upazilla = new Upazilla();
  editView: boolean = false;
  ngOnInit() {
    this.showVerifierSelectionModal = of(false);
    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
      this.command = this.queryParams.command;
      this.processId = this.queryParams.taskId;
      this.taskId = this.queryParams.taskId;
      this.fixedDepositAccountId = this.queryParams.accountId;
      if ((this.queryParams.inactive) && (this.queryParams.command === "ActivateFixedDepositAccountCommand")) {
        this.fetchAccountDetails();
        this.editView = false;
      } else {
        this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
          .subscribe(data => {
            this.editView = true;
            this.fixedDepositAccount = data;
            this.productId = this.fixedDepositAccount.productId;
            this.contactInformation = this.fixedDepositAccount.contactInformation;
            this.address = this.fixedDepositAccount.contactAddress;
            if (this.fixedDepositAccount.linkAccountId) this.fetchLinkAccountDetails(this.fixedDepositAccount.linkAccountId);
            if (this.fixedDepositAccount.introducerAccountId) this.fetchIntroducerDetails(this.fixedDepositAccount.introducerAccountId);
            if (this.fixedDepositAccount.accountOpeningChannelId) this.fetchAccountOpeningChannelDetail(this.fixedDepositAccount.accountOpeningChannelId);
            if (this.fixedDepositAccount.contactAddress.countryId) this.fetchCountryDetail();
            if (this.fixedDepositAccount.contactAddress.divisionId) this.fetchDivisionDetail();
            if (this.fixedDepositAccount.contactAddress.districtId) this.fetchDistrictDetail();
            if (this.fixedDepositAccount.contactAddress.upazillaId) this.fetchUpazillaDetail();

            this.fetchAccountCustomer();
            this.fetchProductDetails();
            this.fetchNominees();
          });
      }
    });

  }

  fetchAccountDetails() {
    this.subscribers.fetchAccountDetailsSub = this.fixedDepositAccountService
      .fetchFixedDepositAccountDetails({ fixedDepositAccountId: this.fixedDepositAccountId + "" })
      .pipe(map(account => {
        this.fixedDepositAccount = account;
        this.productId = this.fixedDepositAccount.productId;
        this.contactInformation = this.fixedDepositAccount.contactInformation;
        this.address = this.fixedDepositAccount.contactAddress;
        if (this.fixedDepositAccount.linkAccountId) this.fetchLinkAccountDetails(this.fixedDepositAccount.linkAccountId);
        if (this.fixedDepositAccount.introducerAccountId) this.fetchIntroducerDetails(this.fixedDepositAccount.introducerAccountId);
        if (this.fixedDepositAccount.accountOpeningChannelId) this.fetchAccountOpeningChannelDetail(this.fixedDepositAccount.accountOpeningChannelId);
        if (this.fixedDepositAccount.contactAddress.countryId) this.fetchCountryDetail();
        if (this.fixedDepositAccount.contactAddress.divisionId) this.fetchDivisionDetail();
        if (this.fixedDepositAccount.contactAddress.districtId) this.fetchDistrictDetail();
        if (this.fixedDepositAccount.contactAddress.upazillaId) this.fetchUpazillaDetail();
        this.fetchAccountCustomer();
        this.fetchProductDetails();
        this.fetchNominees();
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

  fetchAccountCustomer() {
    this.subscribers.fetchCustomerSub = this.cisService
      .fetchCustomer({ id: this.fixedDepositAccount.customerId + "" })
      .pipe(map(data => this.customer = data))
      .subscribe();
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
      .pipe(map(product => this.productDetails = product))
      .subscribe();
  }


  fetchNominees() {
    let queryParams = new Map();
    queryParams.set("accountId", this.fixedDepositAccountId);
    this.subscribers.fetchNomineesSub = this.nomineeService
      .fetchAccountNominees(queryParams)
      .pipe(map(response => {
        this.nominees = response.content;
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


  goToSignature() {
    this.router.navigate(['signature/'], {
      relativeTo: this.route,
      queryParams: {
        accountId: this.fixedDepositAccountId,
        routeBack: this.currentPath(this.location),
        cus: this.queryParams.cus,
        customerId: this.fixedDepositAccount.customerId
      }
    });
  }

  viewTransactionProfile() {
    this.router.navigate(['transaction-profile/', this.fixedDepositAccountId], {
      relativeTo: this.route,
      queryParams: { accountId: this.fixedDepositAccountId }
    });
  }

  cancel() {
    this.location.back();
  }

  navigateAway() {
    if (this.queryParams['cus'] != undefined) {
      this.router.navigate([this.queryParams.cus]);
    } else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  goToNomineeDetail() {
    this.router.navigate(['nominee/', this.selectedNominee.id], {
      relativeTo: this.route,
      queryParams: {
        accountId: this.fixedDepositAccountId,
        nomineeId: this.selectedNominee.id
      }
    });
  }

  fetchLinkAccountDetails(linkAccountId: number) {
    this.subscribers.fetchLinkAccountDetailsSub = this.accountService
      .fetchAccountDetails({ accountId: linkAccountId + "" })
      .pipe(map(data => this.linkAccountDetail = data)).subscribe();
  }

  fetchIntroducerDetails(introducerAccountId: number) {
    this.subscribers.fetchIntroducerDetailsSub = this.accountService
      .fetchAccountDetails({ accountId: introducerAccountId + "" })
      .pipe(map(data => this.introducerDetail = data)).subscribe();
  }

}