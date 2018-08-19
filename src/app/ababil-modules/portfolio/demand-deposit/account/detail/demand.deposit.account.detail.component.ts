import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { CISService } from "../../../../../services/cis/service-api/cis.service";
import { DemandDepositAccountService } from '../../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { NomineeService } from "../../../../../services/nominee/service-api/nominee.service";
import { NotificationService } from '../../../../../common/notification/notification.service';
import { ProductService } from "../../../../../services/product/service-api/product.service";
import * as commandConstants from '../../../../../common/constants/app.command.constants';
import { Customer } from "../../../../../services/cis/domain/cis.models";
import { DemandDepositAccount, ReactivateDemandDepositAccountCommandDetails } from '../../../../../services/demand-deposit-account/domain/demand.deposit.account.models';
import { AccountNominee } from "../../../../../services/nominee/domain/nominee.model";
import { Product } from '../../../../../services/product/domain/product.models';
import { VerifierSelectionEvent } from '../../../../../common/components/verifier-selection/verifier.selection.component';
import { LazyLoadEvent, ConfirmationService, MenuItem } from 'primeng/primeng';
import { Observable, of } from "rxjs";
import { map } from 'rxjs/operators';
import { AbabilLocationService } from "../../../../../services/location/service-api/location.service";
import { Address } from "../../../../../services/cis/domain/address.model";
import { Country } from "../../../../../services/location/domain/country.models";
import { Division } from "../../../../../services/location/domain/division.models";
import { District } from "../../../../../services/location/domain/district.models";
import { Upazilla } from "../../../../../services/location/domain/upazilla.models";
import { ContactInformation } from "../../../../../services/cis/domain/contact.information.model";
import { DemandDepositProductService } from "../../../../../services/demand-deposit-product/service-api/demand-deposit-product.service";
import { DemandDepositProduct } from "../../../../../services/demand-deposit-product/domain/demand-deposit-product.model";
import { FormBaseComponent } from "../../../../../common/components/base.form.component";
import { ApprovalflowService } from "../../../../../services/approvalflow/service-api/approval.flow.service";
import { AccountService } from "../../../../../services/account/service-api/account.service";
import { AccountOpeningChannels } from "../../../../../services/account/domain/account.opening.channels";
import { KycService } from "../../../../../services/kyc/service-api/kyc.service";
import { CommonConfigurationService } from "../../../../../services/common-configurations/service-api/common.configurations.service";
import { IndividualInformation } from './../../../../../services/cis/domain/individual.model';

export const SUCCESS_MSG: string[] = ["demand.deposit.account.save.success", "workflow.task.verify.send"];
export const REACTIVATION_SUCCESS_MSG: string[] = ["demand.deposit.account.reactivation.success", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/demand-deposit-account";


@Component({
  selector: 'app-deposit-account-detail',
  templateUrl: './demand.deposit.account.detail.component.html'
})
export class DemandDepositAccountDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    private cisService: CISService,
    private confirmationService: ConfirmationService,
    private demandDepositAccountService: DemandDepositAccountService,
    protected location: Location,
    protected approvalFlowService: ApprovalflowService,
    private locationService: AbabilLocationService,
    private nomineeService: NomineeService,
    private notificationService: NotificationService,
    private productService: ProductService,
    private demandDepositProductService: DemandDepositProductService,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private kycService: KycService,
    private commonConfigurationService: CommonConfigurationService) {
    super(location, approvalFlowService);
    this.fetchApplicationDate();
  }
  dateToday: any;
  otherMenuItems: MenuItem[];
  verifierSelectionModalVisible: Observable<boolean>;
  demandDepositAccount: DemandDepositAccount = new DemandDepositAccount();
  demandDepositAccountId: number;
  customer: Customer = new Customer();
  customerId: number;
  productDetails: Product = new Product();
  productId: number;
  queryParams: any = {};
  transactionDetails: any[] = [];
  nominees: AccountNominee[];
  selectedNominee: AccountNominee;
  individuals: IndividualInformation[] = [];
  totalSharePercentage: number;
  urlSearchMap: Map<string, any>;
  totalRecords: number;
  totalPages: number;
  contactInformation: ContactInformation = new ContactInformation();
  demandDepositProductDetail: DemandDepositProduct = new DemandDepositProduct();
  showReactivateButton: boolean = false;
  address: Address = new Address();
  country: Country = new Country();
  division: Division = new Division();
  district: District = new District();
  upazilla: Upazilla = new Upazilla();
  introducerDetail: DemandDepositAccount = new DemandDepositAccount();
  accountOpeningChannel: AccountOpeningChannels = new AccountOpeningChannels();
  nomineeNames: Map<number, string> = new Map();
  command: string;

  ngOnInit() {
    this.initialOtherMenus();

    this.showVerifierSelectionModal = of(false);
    this.subscribers.routeSub = this.route.params.subscribe(params => {
      this.demandDepositAccountId = +params['id'];
      this.fetchDemandDepositAccountDetails();
    });
    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
      this.taskId = params['taskId'];
      this.commandReference = params['commandReference'];
    });
  }

  initialOtherMenus() {
    this.otherMenuItems = [
      { label: 'Transaction profile', icon: 'ui-icon-near-me', command: () => this.goToTransactionProfile() },
      { label: 'KYC', icon: 'ui-icon-accessibility', command: () => this.goToKyc() },
      { label: 'Signature', icon: 'ui-icon-gesture', command: () => this.goToSignature() }];

    if ((this.demandDepositAccount.status == 'ACTIVATED' || this.demandDepositAccount.status == 'DORMANT') && this.demandDepositAccount.freeze == false) {
      this.otherMenuItems.push(
        { label: 'Freeze account', icon: 'ui-icon-alarm-off', command: () => this.setAccountFreezeStatus() }
      );
    }
    // if (this.demandDepositAccount.status === "INACTIVE") {
    //   this.otherMenuItems.push({ label: 'Add nominee', icon: 'ui-icon-face', command: () => this.addNominee() });
    // }
    if (this.demandDepositAccount.freeze == true) {
      this.otherMenuItems = [];
      this.otherMenuItems.push(
        { label: 'Unfreeze account', icon: 'ui-icon-alarm-on', command: () => this.setAccountFreezeStatus() }
      );
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
        if (this.demandDepositAccount.introducerAccountId) this.fetchIntroducerDetails(this.demandDepositAccount.introducerAccountId);
        if (this.demandDepositAccount.accountOpeningChannelId) this.fetchAccountOpeningChannelDetail(this.demandDepositAccount.accountOpeningChannelId);
        if (this.demandDepositAccount.contactAddress.countryId) this.fetchCountryDetail();
        if (this.demandDepositAccount.contactAddress.divisionId) this.fetchDivisionDetail();
        if (this.demandDepositAccount.contactAddress.districtId) this.fetchDistrictDetail();
        if (this.demandDepositAccount.contactAddress.upazillaId) this.fetchUpazillaDetail();
        if (this.demandDepositAccount.closingDate && this.demandDepositAccount.closingDate === this.dateToday) {
          this.showReactivateButton = true;
        } else {
          this.showReactivateButton = false;
        }
        // if (account.status === "INACTIVE") {
        //   this.otherMenuItems.push({ label: 'Add nominee', icon: 'ui-icon-face', command: () => this.addNominee() });
        // }
        this.fetchAccountCustomer();
        this.fetchProductDetails();
        this.fetchDemandDepositProduct();
        this.fetchNominees();
        this.displayExtraFacilityToActiveAccount();
        if (this.demandDepositAccount.status !== "INACTIVE") {
          this.command = "ReactivateDemandDepositAccountCommand";
        } else {
          this.command = commandConstants.ACTIVATE_DEMAND_DEPOSIT_ACCOUNT_COMMAND;
        }
      })).subscribe();
  }

  fetchIntroducerDetails(introducerAccountId: number) {
    this.subscribers.fetchIntroducerDetailsSub = this.accountService
      .fetchAccountDetails({ accountId: introducerAccountId + "" })
      .pipe(map(data => this.introducerDetail = data))
      .subscribe();
  }

  fetchAccountOpeningChannelDetail(accountOpeningChannelId: number) {
    this.subscribers.fetchChannelSub = this.accountService.fetchAccountOpeningChannelDetail({ id: accountOpeningChannelId }).subscribe(
      data => {
        this.accountOpeningChannel = data;
      }
    )
  }

  displayToDormantAccount() {
    this.otherMenuItems.push({ label: 'Reactivate account', icon: 'ui-icon-near-me', command: () => this.reactivateDormantAccount() });
  }


  fetchAccountCustomer() {
    this.subscribers.fetchCustomerSub = this.cisService
      .fetchCustomer({ id: this.customerId + "" })
      .pipe(map(data => this.customer = data))
      .subscribe();
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
      .fetchProductDetails({ productId: this.productId + "" })
      .subscribe(product => this.productDetails = product);
  }

  fetchDemandDepositProduct() {
    this.subscribers.ddproductSub = this.demandDepositProductService.fetchDemandDepositProductDetails({ id: this.productId })
      .subscribe(data => {
        this.demandDepositProductDetail = data;
        this.displayExtraFacilityToActiveAccount();
        if (this.demandDepositAccount.status === "DORMANT") this.displayToDormantAccount();
      });
  }

  fetchNominees() {
    let queryParams = new Map();
    queryParams.set("accountId", this.demandDepositAccountId);
    this.subscribers.fetchNomineesSub = this.nomineeService
      .fetchAccountNominees(queryParams)
      .pipe(map(response => {
        this.nominees = response.content;
        this.sumOfSharePencentage();
        this.fetchNomineeNames();
      })).subscribe();
  }

  fetchNomineeNames() {
    let ids = this.nominees.map(nominee => nominee.individualId);
    this.nominees.forEach(nominee => {
      this.cisService.fetchIindividualInformations({ id: ids })
        .pipe(map(data => {
          this.individuals = data.content;
          this.individuals.map(individual => {
            let name = individual.firstName ? individual.firstName : '' + ' ' +
              individual.middleName ? individual.middleName : '' + ' ' +
                individual.lastName ? individual.lastName : '';
            this.nomineeNames.set(individual.id, name);
          });
        })).subscribe();
    });
  }

  sumOfSharePencentage() {
    this.totalSharePercentage = 0;
    for (let nominee of this.nominees) {
      this.totalSharePercentage += nominee.sharePercentage;
    }
    this.displayExtraFacilityToActiveAccount();
  }

  displayExtraFacilityToActiveAccount() {
    this.initialOtherMenus();

    if (this.totalSharePercentage < 100) {
      this.otherMenuItems.push({ label: 'Add nominee', icon: 'ui-icon-face', command: () => this.addNominee() })
    }

    if (!this.demandDepositAccount.freeze) {
      if (this.demandDepositAccount.status == 'ACTIVATED') {
        this.otherMenuItems.push(
          { label: 'Cheque', icon: 'ui-icon-library-books', command: () => this.goToCheque() },
          { label: 'Bank notice', icon: 'ui-icon-info-outline', command: () => this.goToBankNotice() },
          { label: 'Special instruction', icon: 'ui-icon-work', command: () => this.goToInstruction() }
        );
      }
      if ((this.demandDepositAccount.status === "ACTIVATED" || this.demandDepositAccount.status === "MATURED") && !this.demandDepositAccount.freeze) {
        this.otherMenuItems.push(
          { label: 'Close account', icon: 'ui-icon-cancel', command: () => this.closeAccount() }
        );
      }
      if (this.demandDepositAccount.status == 'ACTIVATED' && this.demandDepositProductDetail.isProfitBearing) {
        this.otherMenuItems.push(
          { label: 'Special profit rate', icon: 'ui-icon-attach-money', command: () => this.goToSpecialProfitRate() }
        );
      }
      if (this.demandDepositAccount.status == 'ACTIVATED' && this.demandDepositProductDetail.isMinimumBalanceOverridable) {
        this.otherMenuItems.push(
          { label: 'Minimum balance', icon: 'ui-icon-attach-money', command: () => this.goToMinimumBalanceOverride() }
        );
      }
    }
  }

  fetchTransactions(searchMap: Map<string, any>) {
    this.subscribers.transactionsSub = this.demandDepositAccountService
      .fetchDemandDepositAccountTransactions(searchMap, this.demandDepositAccountId)
      .subscribe(data => {
        this.transactionDetails = data.content;
        this.totalRecords = (data.pageSize * data.pageCount);
        this.totalPages = data.pageCount;
      });
  }

  loadTransactionDetailsLazily(event: LazyLoadEvent) {
    if (this.urlSearchMap == null) {
      this.urlSearchMap = new Map();
    }
    this.urlSearchMap.set("page", (event.first / 20));
    this.fetchTransactions(this.urlSearchMap);
  }

  edit() {
    this.router.navigate(['../', 'edit', { customerId: this.demandDepositAccount.customerId }], {
      relativeTo: this.route,
      queryParams: { demandDeposit: this.currentPath(this.location), accountStatus: this.demandDepositAccount.status },
      queryParamsHandling: "merge"
    });
  }

  goToInstruction() {
    this.router.navigate(['../', 'instructions'], {
      relativeTo: this.route,
      queryParams: { demandDeposit: this.currentPath(this.location) },
      queryParamsHandling: "merge"
    });
  }

  goToCheque() {
    this.router.navigate(['../', 'chequebooks'], {
      relativeTo: this.route,
      queryParams: { demandDeposit: this.currentPath(this.location) },
      queryParamsHandling: "merge"
    });
  }

  goToBankNotice() {
    this.router.navigate(['../', 'bank-notice'], {
      relativeTo: this.route,
      queryParams: { demandDeposit: this.currentPath(this.location) },
      queryParamsHandling: "merge"
    });
  }

  reactivateDormantAccount() {
    this.router.navigate(['../', 'reactivate-dormant-account'], {
      relativeTo: this.route,
      queryParams: { demandDeposit: this.currentPath(this.location) },
      queryParamsHandling: "merge"
    });
  }

  goToSignature() {
    const url = this.router.createUrlTree(['/account-operator'], {
      relativeTo: this.route,
      queryParams: {
        accountId: this.demandDepositAccountId,
        routeBack: this.currentPath(this.location),
        cus: this.queryParams.cus,
        customerId: this.demandDepositAccount.customerId
      },
      queryParamsHandling: "merge"
    });

    this.router.navigateByUrl(url);
  }

  goToKyc() {
    let searchParam = new Map<string, string>();
    searchParam.set('accountNumber', this.demandDepositAccount.number + '');
    this.subscribers.fetchKycesDetailsSub = this.kycService.fetchKyces(searchParam)
      .subscribe(data => {
        let routePath: string;
        if (".KycIndividual" == data.type) { routePath = '/kyc/individual'; }
        else if (".KycInstitute" == data.type) { routePath = '/kyc/institute'; }

        routePath = (data.id && data.id != 0) ? routePath.concat('/details') : routePath.concat('/edit');
        const url = this.router.createUrlTree([routePath], {
          queryParams: {
            account: this.currentPath(this.location),
            accountNumber: this.demandDepositAccount.number
          },
          queryParamsHandling: "merge"
        });
        this.router.navigateByUrl(url);
      });
  }

  goToTransactionProfile() {
    const url = this.router.createUrlTree(['/transaction-profile', this.demandDepositAccountId, 'details'], {
      queryParams: {
        demandDeposit: this.currentPath(this.location),
        accountId: this.demandDepositAccountId
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
        accountId: this.demandDepositAccountId,
        isProfitBearing: this.demandDepositProductDetail.isProfitBearing
      },
      queryParamsHandling: "merge"
    });

    this.router.navigateByUrl(url);
  }

  goToMinimumBalanceOverride() {
    this.router.navigate(['../', 'minimum-balance', 'form'], {
      relativeTo: this.route,
      queryParams: {
        demandDeposit: this.currentPath(this.location),
        isMinimumBalanceOverridable: this.demandDepositProductDetail.isMinimumBalanceOverridable
      },
      queryParamsHandling: "merge"
    });
  }

  closeAccount() {
    this.router.navigate(['../'], {
      relativeTo: this.route,
      queryParams: {
        demandDeposit: this.currentPath(this.location),
        command: "DemandDepositAccountCloseCommand",
        customerId: this.customerId
      },
      queryParamsHandling: "merge"
    });
  }

  setAccountFreezeStatus() {
    this.router.navigate(['account/account-freeze'], {
      queryParams: {
        accountId: this.demandDepositAccountId,
        routeBack: this.currentPath(this.location),
        isFreeze: this.demandDepositAccount.freeze
      },
      queryParamsHandling: "merge"
    });
  }

  addNominee() {
    const url = this.router.createUrlTree(['/nominee', 'create'], {
      relativeTo: this.route,
      queryParams: {
        account: this.currentPath(this.location),
        accountId: this.demandDepositAccountId,
        individualId: null
      },
      queryParamsHandling: "merge"
    });

    this.router.navigateByUrl(url);
  }

  deleteNominee(nominee: AccountNominee) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this nominee?',
      accept: () => {
        this.deleteDemanDepositAccountNominee(nominee);
      }
    });
  }

  deleteDemanDepositAccountNominee(nominee: AccountNominee) {
    this.subscribers.deleteNominee = this.nomineeService
      .deleteAccountNominee({ nomineeId: nominee.id })
      .subscribe((data) => {
        this.notificationService.sendSuccessMsg("nominee.delete.success");
        this.fetchNominees();
      })
  }

  activate() {
    this.showVerifierSelectionModal = of(true);
  }

  reactivate() {
    this.showVerifierSelectionModal = of(true);
  }

  onVerifierSelect(event: VerifierSelectionEvent) {
    if (this.demandDepositAccount.status === "INACTIVE") {
      this.command = commandConstants.ACTIVATE_DEMAND_DEPOSIT_ACCOUNT_COMMAND;
      let view_ui = DETAILS_UI.concat("?accountId=").concat(this.demandDepositAccountId.toString()).concat("&").concat("inactive=true").concat("&");
      let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));
      this.demandDepositAccountService.activateAccount(this.demandDepositAccountId, urlSearchParams)
        .subscribe(data => {
          if (event.approvalFlowRequired) {
            this.notificationService.sendSuccessMsg("approval.request.success");
            this.navigateAway();
          } else {
            this.notificationService.sendSuccessMsg("demand.deposit.account.activation.success");
            this.navigateAway();
          }

        });
    } else {
      this.command = "ReactivateDemandDepositAccountCommand";
      let view_ui = DETAILS_UI.concat("?accountId=").concat(this.demandDepositAccountId.toString()).concat("&");
      let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));
      let reactivationDetail = new ReactivateDemandDepositAccountCommandDetails();
      this.demandDepositAccountService.reactivateAccount(this.demandDepositAccountId, reactivationDetail, urlSearchParams)
        .subscribe(data => {
          this.notificationService.sendSuccessMsg(REACTIVATION_SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
          this.navigateAway();
        });
    }
  }

  reload() {
    this.fetchDemandDepositAccountDetails();
  }

  cancel() {
    this.navigateAway();
  }

  navigateAway() {
    if (this.taskId) {
      this.router.navigate(['../../', 'approval-flow', 'pendingtasks']);
    } else {
      if (this.queryParams['cus'] != undefined) {
        this.router.navigate([this.queryParams.cus]);
      } else {
        this.router.navigate(['../'], { relativeTo: this.route });
      }
    }
  }

  navigateToNomineeDetail() {
    this.router.navigate(['nominee', this.selectedNominee.id, 'details'], {
      queryParams: {
        account: this.currentPath(this.location),
        accountId: this.demandDepositAccountId
      },
      queryParamsHandling: 'merge'
    });
  }

  fetchApplicationDate() {
    let urlSearchParam = new Map();
    urlSearchParam.set("name", "application-date");
    this.commonConfigurationService.fetchApplicationDate(urlSearchParam)
      .subscribe(data => this.dateToday = new Date(data));
  }

}