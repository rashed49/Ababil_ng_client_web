import { ApprovalflowService } from './../../../../services/approvalflow/service-api/approval.flow.service';
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import * as commandConstants from '../../../../common/constants/app.command.constants';
import { MenuItem } from 'primeng/primeng';
import { Observable, of } from "rxjs";
import { CISService } from '../../../../services/cis/service-api/cis.service';
import { CurrencyService } from '../../../../services/currency/service-api/currency.service';
import { DemandDepositAccountService } from '../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { NomineeService } from '../../../../services/nominee/service-api/nominee.service';
import { ProductService } from '../../../../services/product/service-api/product.service';
import { DemandDepositAccount } from '../../../../services/demand-deposit-account/domain/demand.deposit.account.models';
import { Customer } from '../../../../services/cis/domain/cis.models';
import { Product } from '../../../../services/product/domain/product.models';
import { Currency } from '../../../../services/currency/domain/currency.models';
import { AccountNominee } from '../../../../services/nominee/domain/nominee.model';
import { NotificationService } from './../../../../common/notification/notification.service';
import { ViewsBaseComponent } from "../../view.base.component";
import { ContactInformation } from '../../../../services/cis/domain/contact.information.model';
import { Address } from '../../../../services/cis/domain/address.model';
import { AbabilLocationService } from '../../../../services/location/service-api/location.service';
import { Country } from '../../../../services/location/domain/country.models';
import { Division } from '../../../../services/location/domain/division.models';
import { District } from '../../../../services/location/domain/district.models';
import { Upazilla } from '../../../../services/location/domain/upazilla.models';
import { AccountService } from '../../../../services/account/service-api/account.service';
import { AccountOpeningChannels } from '../../../../services/account/domain/account.opening.channels';
import { DemandDepositChargeInformation } from '../../../../services/demand-deposit-account/domain/demand.deposit.account.charge.models';
import { map } from 'rxjs/operators';
@Component({
  selector: 'demand.deposit.account.view',
  templateUrl: './demand.deposit.account.view.component.html'
})
export class DemandDepositAccountViewComponent extends ViewsBaseComponent implements OnInit {

  constructor(
    private cisService: CISService,
    private currencyService: CurrencyService,
    private demandDepositAccountService: DemandDepositAccountService,
    private accountService: AccountService,
    protected location: Location,
    private nomineeService: NomineeService,
    protected notificationService: NotificationService,
    private productService: ProductService,
    private route: ActivatedRoute,
    protected router: Router,
    protected workflowService: ApprovalflowService,
    private locationService: AbabilLocationService) {
    super(location, router, workflowService, notificationService);
  }

  otherMenuItems: MenuItem[];
  verifierSelectionModalVisible: Observable<boolean>;
  command: string = commandConstants.ACTIVATE_DEMAND_DEPOSIT_ACCOUNT_COMMAND;

  demandDepositAccount: DemandDepositAccount = new DemandDepositAccount();
  demandDepositAccountId: number;

  demandDepositAccountCustomerDetails: Customer = new Customer();
  demandDepositAccountCustomerId: number;

  productDetails: Product = new Product();
  productId: number;

  currencyDetails: Currency = new Currency();
  currencyId: number;
  currencyCode: string;
  queryParams: any = {};
  transactionDetails: any[] = [];

  nominees: AccountNominee[];
  selectedNominee: AccountNominee;
  individuals: any[] = [];
  totalSharePercentage: number;
  editView: boolean = true;
  urlSearchMap: Map<string, any>;
  totalRecords: number;
  totalPages: number;
  contactInformation: ContactInformation = new ContactInformation();
  address: Address = new Address();
  country: Country = new Country();
  division: Division = new Division();
  district: District = new District();
  upazilla: Upazilla = new Upazilla();
  charges: DemandDepositChargeInformation[] = [];
  @ViewChild('chargeTable') chargeTable: any;

  ngOnInit() {
    this.showVerifierSelectionModal = of(false);
    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
      this.command = this.queryParams.command;
      this.processId = this.queryParams.taskId;
      this.taskId = this.queryParams.taskId;
      this.demandDepositAccountId = this.queryParams.accountId;
      if ((this.queryParams.command === "ActivateDemandDepositAccountCommand") || (this.queryParams.command === "ReactivateDemandDepositAccountCommand")) {
        this.fetchAccountDetails();
        this.editView = false;
      } else {
        this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
          .subscribe(data => {
            this.editView = true;
            this.demandDepositAccount = data;
            this.demandDepositAccountCustomerId = data.customerId;
            this.productId = data.productId;
            this.currencyCode = data.currencyCode;
            this.contactInformation = data.contactInformation;
            this.address = data.contactAddress;
            if (data.charges.length > 0) {
              this.charges = data.charges;
              // this.chargeTable.totalChargeCalculation();
            }
            if (this.demandDepositAccount.introducerAccountId) this.fetchIntroducerDetails(this.demandDepositAccount.introducerAccountId);
            if (this.demandDepositAccount.accountOpeningChannelId) this.fetchAccountOpeningChannelDetail(this.demandDepositAccount.accountOpeningChannelId);
            if (this.demandDepositAccount.contactAddress.countryId) this.fetchCountryDetail();
            if (this.demandDepositAccount.contactAddress.divisionId) this.fetchDivisionDetail();
            if (this.demandDepositAccount.contactAddress.districtId) this.fetchDistrictDetail();
            if (this.demandDepositAccount.contactAddress.upazillaId) this.fetchUpazillaDetail();

            this.fetchAccountCustomer();
            this.fetchProductDetails();
            this.fetchNominees();
          });
      }
    });

    this.initialOtherMenus();
  }

  initialOtherMenus() {
    this.otherMenuItems = [
      {
        label: 'Transaction profile', icon: 'ui-icon-near-me', command: () => {
          this.viewTransactionProfile();
        }
      },
      {
        label: 'Signature', icon: 'ui-icon-gesture', command: () => {
          this.goToSignature();
        }
      }
    ];
  }

  fetchAccountDetails() {
    this.subscribers.fetchAccountDetailsSub = this.demandDepositAccountService
      .fetchDemandDepositAccountDetails({ id: this.demandDepositAccountId + "" })
      .pipe(map(account => {
        this.demandDepositAccount = account;
        this.demandDepositAccountCustomerId = this.demandDepositAccount.customerId;
        this.productId = this.demandDepositAccount.productId;
        this.currencyCode = this.demandDepositAccount.currencyCode;
        this.contactInformation = this.demandDepositAccount.contactInformation;
        this.address = this.demandDepositAccount.contactAddress;
        if (this.demandDepositAccount.introducerAccountId) this.fetchIntroducerDetails(this.demandDepositAccount.introducerAccountId);
        if (this.demandDepositAccount.accountOpeningChannelId) this.fetchAccountOpeningChannelDetail(this.demandDepositAccount.accountOpeningChannelId);
        if (this.demandDepositAccount.contactAddress.countryId) this.fetchCountryDetail();
        if (this.demandDepositAccount.contactAddress.divisionId) this.fetchDivisionDetail();
        if (this.demandDepositAccount.contactAddress.districtId) this.fetchDistrictDetail();
        if (this.demandDepositAccount.contactAddress.upazillaId) this.fetchUpazillaDetail();

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
      .fetchCustomer({ id: this.demandDepositAccountCustomerId + "" })
      .pipe(map(accountCustomer => this.demandDepositAccountCustomerDetails = accountCustomer))
      .subscribe();
  }

  fetchProductDetails() {
    this.subscribers.fetchProductDetailsSub = this.productService
      .fetchProductDetails({ id: this.productId + "" })
      .pipe(map(product => this.productDetails = product))
      .subscribe();
  }
  introducerDetail: DemandDepositAccount = new DemandDepositAccount();
  fetchIntroducerDetails(introducerAccountId: number) {
    this.subscribers.fetchIntroducerDetailsSub = this.accountService
      .fetchAccountDetails({ accountId: introducerAccountId + "" })
      .pipe(map(data => this.introducerDetail = data))
      .subscribe();
  }

  // getCurrency(currencyId: number) {
  //   if (currencyId != 0) {
  //     this.fetchCurrencyDetails();
  //   }
  // }

  // fetchCurrencyDetails() {
  //   this.subscribers.fetchCurrencyDetailsSub = this.currencyService
  //     .fetchCurrencyDetails({ id: this.currencyId + "" }).map((currency) => {
  //       this.currencyDetails = currency;
  //     }).subscribe();
  // }

  fetchNominees() {
    let queryParams = new Map();
    queryParams.set("accountId", this.demandDepositAccountId);
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
        accountId: this.demandDepositAccountId,
        routeBack: this.currentPath(this.location),
        cus: this.queryParams.cus,
        customerId: this.demandDepositAccount.customerId
      }
    });
  }
  viewTransactionProfile() {
    this.router.navigate(['transaction-profile/', this.demandDepositAccountId], {
      relativeTo: this.route,
      queryParams: { accountId: this.demandDepositAccountId }
    });
  }

  cancel() {
    this.navigateAway();
  }

  navigateAway() {
    if (this.queryParams['cus'] != undefined) {
      this.router.navigate([this.queryParams.cus]);
    } else {
      this.router.navigate(['../../', 'approval-flow', 'pendingtasks']);
    }
  }

  navigateToNomineeDetail() {
    this.router.navigate(['nominee', this.selectedNominee.id, 'details'], {
      queryParams: {
        demandDeposit: this.currentPath(this.location),
        accountId: this.demandDepositAccountId
      },
      queryParamsHandling: 'merge'
    });
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

}