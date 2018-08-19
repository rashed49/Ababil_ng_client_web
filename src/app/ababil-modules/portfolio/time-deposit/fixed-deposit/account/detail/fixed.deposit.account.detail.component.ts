import { Upazilla } from './../../../../../../services/location/domain/upazilla.models';
import { District } from './../../../../../../services/location/domain/district.models';
import { Division } from './../../../../../../services/location/domain/division.models';
import { Country } from './../../../../../../services/location/domain/country.models';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { FormBaseComponent } from '../../../../../../common/components/base.form.component';
import { ApprovalflowService } from '../../../../../../services/approvalflow/service-api/approval.flow.service';
import { CISService } from "../../../../../../services/cis/service-api/cis.service";
import { NomineeService } from "../../../../../../services/nominee/service-api/nominee.service";
import { NotificationService } from '../../../../../../common/notification/notification.service';
import { ProductService } from "../../../../../../services/product/service-api/product.service";
import * as commandConstants from '../../../../../../common/constants/app.command.constants';
import { Customer } from "../../../../../../services/cis/domain/cis.models";
import { FixedDepositAccount } from '../../../../../../services/fixed-deposit-account/domain/fixed.deposit.account.models';
import { AccountNominee } from "../../../../../../services/nominee/domain/nominee.model";
import { Product } from '../../../../../../services/product/domain/product.models';
import { VerifierSelectionEvent } from '../../../../../../common/components/verifier-selection/verifier.selection.component';
import { ConfirmationService, MenuItem } from 'primeng/primeng';
import { Observable, of } from "rxjs";
import { map } from 'rxjs/operators';
import { FixedDepositAccountService } from '../../../../../../services/fixed-deposit-account/service-api/fixed.deposit.account.service';
import { DemandDepositAccount } from "../../../../../../services/demand-deposit-account/domain/demand.deposit.account.models";
import { ContactInformation } from '../../../../../../services/cis/domain/contact.information.model';
import { AccountService } from './../../../../../../services/account/service-api/account.service';
import { Address } from '../../../../../../services/cis/domain/address.model';
import { AbabilLocationService } from '../../../../../../services/location/service-api/location.service';
import { FixedDepositProductService } from '../../../../../../services/fixed-deposit-product/service-api/fixed.deposit.product.service';
import { FixedDepositProduct } from '../../../../../../services/fixed-deposit-product/domain/fixed.deposit.product.model';
import { AccountOpeningChannels } from '../../../../../../services/account/domain/account.opening.channels';
import { FixedDepositPrincipalWithdrawalAdviceService } from '../../../../../../services/fixed-deposit-principal-withdrawal-advice/service-api/fixed.deposit.principal.withdrawal.advice.service';
import { WithdrawalAdvice } from '../../../../../../services/fixed-deposit-principal-withdrawal-advice/domain/fixed.deposit.principal.withdrawal.advice.model';
import { KycService } from '../../../../../../services/kyc/service-api/kyc.service';

export const DETAILS_UI: string = "views/fixed-deposit-account";

@Component({
  selector: 'app-fixed-account-detail',
  templateUrl: './fixed.deposit.account.detail.component.html',
  styleUrls: ['./fixed.deposit.account.detail.component.scss']
})
export class FixedDepositAccountDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    private cisService: CISService,
    private confirmationService: ConfirmationService,
    private fixedDepositAccountService: FixedDepositAccountService,
    protected location: Location,
    private locationService: AbabilLocationService,
    private nomineeService: NomineeService,
    private notificationService: NotificationService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private router: Router, protected approvalFlowService: ApprovalflowService,
    private fixedDepositProductService: FixedDepositProductService,
    private fixedDepositPrincipalWithdrawalAdviceService: FixedDepositPrincipalWithdrawalAdviceService,
    private kycService: KycService) {
    super(location, approvalFlowService);
  }

  otherMenuItems: MenuItem[];
  verifierSelectionModalVisible: Observable<boolean>;
  command: string = commandConstants.ACTIVATE_FIXED_DEPOSIT_ACCOUNT_COMMAND;

  fixedDepositAccount: FixedDepositAccount = new FixedDepositAccount();
  fixedDepositAccountId: number;

  fixedDepositAccountCustomerDetails: Customer = new Customer();
  fixedDepositAccountCustomerId: number;

  productDetails: Product = new Product();
  productId: number;
  status: string;

  introducerDetail: DemandDepositAccount = new DemandDepositAccount();
  linkAccountDetail: DemandDepositAccount = new DemandDepositAccount();

  queryParams: any = {};
  transactionDetails: any[] = [];

  nominees: AccountNominee[];
  selectedNominee: AccountNominee;
  individuals: any[] = [];
  totalSharePercentage: number;

  urlSearchMap: Map<string, any>;
  totalRecords: number;
  totalPages: number;
  fixedDepositProduct: FixedDepositProduct = new FixedDepositProduct();

  contactInformation: ContactInformation = new ContactInformation();
  address: Address = new Address();
  country: Country = new Country();
  division: Division = new Division();
  district: District = new District();
  upazilla: Upazilla = new Upazilla();

  selectedWithdrawalAdvice: WithdrawalAdvice = new WithdrawalAdvice();
  FixedDepositWithdrawalAdvices: WithdrawalAdvice[] = [];

  ngOnInit() {
    this.initialOtherMenus();
    this.showVerifierSelectionModal = of(false);
    this.subscribers.routeSub = this.route.params.subscribe(params => {
      this.fixedDepositAccountId = +params['id'];
      this.fetchFixedDepositAccountDetails();
    });

    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
      this.taskId = params['taskId'];
      this.commandReference = params['commandReference'];
    });
    // this.withdrawalTransaction();
    this.fetchFixedDepositWithdrawalAdvices();
  }

  initialOtherMenus() {
    this.otherMenuItems = [
      { label: 'KYC', icon: 'ui-icon-accessibility', command: () => this.goToKyc() },
      { label: 'Signature', icon: 'ui-icon-gesture', command: () => this.goToSignature() },
      { label: 'Pension scheduler', icon: 'ui-icon-date-range', command: () => this.goToPensionScheduler() }
    ];

    if ((this.fixedDepositAccount.status == 'ACTIVATED' || this.fixedDepositAccount.status == 'DORMANT') && this.fixedDepositAccount.freeze == false) {
      this.otherMenuItems.push(
        { label: 'Freeze account', icon: 'ui-icon-alarm-off', command: () => this.setAccountFreezeStatus() }
      );
    }
    if (this.fixedDepositAccount.freeze == true) {
      this.otherMenuItems.push(
        { label: 'Unfreeze account', icon: 'ui-icon-alarm-on', command: () => this.setAccountFreezeStatus() }
      );
    }
  }
  goToWithdrawalMapping() {
    const url = this.router.createUrlTree(['withdrawal-mapping'], {
      relativeTo: this.route,
      queryParams: {
        account: this.currentPath(this.location),
        accountId: this.fixedDepositAccountId,
        productId: this.productId
      },
      queryParamsHandling: "merge"
    });
    this.router.navigateByUrl(url);

  }
  withdrawalMapping() {
    if (this.status == "ACTIVATED") {
      this.otherMenuItems = [
        { label: 'Withdrawal Advice', icon: 'ui-icon-call-made', command: () => this.goToWithdrawalMapping() }
        // { label: 'Transaction', icon: 'ui-icon-monetization-on', command: () => this.goToWithdrawalTransaction() }
      ];
    }
  }
  // goToWithdrawalTransaction() {
  //   const url = this.router.createUrlTree(['withdrawal-transaction'], {
  //     relativeTo: this.route,
  //     queryParams: {
  //       account: this.currentPath(this.location),
  //       accountId: this.fixedDepositAccountId,
  //       productId: this.productId
  //     },
  //     queryParamsHandling: "merge"
  //   });
  //   this.router.navigateByUrl(url);
  // }

  fetchFixedDepositAccountDetails() {
    this.subscribers.fetchFixedDepositAccountDetailsSub = this.fixedDepositAccountService
      .fetchFixedDepositAccountDetails({ fixedDepositAccountId: this.fixedDepositAccountId + "" })
      .pipe(map(data => {
        this.fixedDepositAccount = data;
        this.initialOtherMenus();
        this.fixedDepositAccountCustomerId = this.fixedDepositAccount.customerId;
        this.productId = this.fixedDepositAccount.productId;
        this.contactInformation = this.fixedDepositAccount.contactInformation;
        this.address = this.fixedDepositAccount.contactAddress;
        this.productId = this.fixedDepositAccount.productId;
        this.status = this.fixedDepositAccount.status;


        this.addAccountCloseButton();
        if (this.fixedDepositAccount.linkAccountId) this.fetchLinkAccountDetails(this.fixedDepositAccount.linkAccountId);
        if (this.fixedDepositAccount.introducerAccountId) this.fetchIntroducerDetails(this.fixedDepositAccount.introducerAccountId);
        if (this.fixedDepositAccount.accountOpeningChannelId) this.fetchAccountOpeningChannelDetail(this.fixedDepositAccount.accountOpeningChannelId);
        if (this.fixedDepositAccount.contactAddress.countryId) this.fetchCountryDetail();
        if (this.fixedDepositAccount.contactAddress.divisionId) this.fetchDivisionDetail();
        if (this.fixedDepositAccount.contactAddress.districtId) this.fetchDistrictDetail();
        if (this.fixedDepositAccount.contactAddress.upazillaId) this.fetchUpazillaDetail();
        this.fetchProductDetails();
        this.fetchNominees();
        this.fetchFixedDepositProduct();
        if (this.fixedDepositAccount.status === "INACTIVE") {
          this.command = commandConstants.ACTIVATE_FIXED_DEPOSIT_ACCOUNT_COMMAND;
        } else {
          this.command = "ReactivateFixedDepositAccountCommand";

        }
        this.withdrawalMapping();
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
  fetchFixedDepositProduct() {
    this.subscribers.fixedDepositproductSub = this.fixedDepositProductService.fetchFixedDepositProductDetails({ id: this.productId }).subscribe(
      data => {
        this.fixedDepositProduct = data;
        this.addSpecialProfitRate();
      }
    )
  }

  fetchNominees() {
    let queryParams = new Map();
    queryParams.set("accountId", this.fixedDepositAccountId);
    this.subscribers.fetchNomineesSub = this.nomineeService
      .fetchAccountNominees(queryParams)
      .pipe(map(response => {
        this.nominees = response.content;
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
    if (totalSharePercentage < 100) {
      this.otherMenuItems.push({ label: 'Add nominee', icon: 'ui-icon-face', command: () => this.addNominee() })
    }
  }



  edit() {
    this.router.navigate(['../', 'edit', { customerId: this.fixedDepositAccount.customerId }], {
      relativeTo: this.route,
      queryParams: { account: this.currentPath(this.location), accountStatus: this.fixedDepositAccount.status },
      queryParamsHandling: "merge"
    });
  }

  goToInstruction() {
    this.router.navigate(['../', 'instructions'], {
      relativeTo: this.route,
      queryParams: { account: this.currentPath(this.location) },
      queryParamsHandling: "merge"
    });
  }

  goToCheque() {
    this.router.navigate(['../', 'chequebooks'], {
      relativeTo: this.route,
      queryParams: { account: this.currentPath(this.location) },
      queryParamsHandling: "merge"
    });
  }

  addSpecialProfitRate() {
    if (this.fixedDepositAccount.status === 'ACTIVATED') {
      this.otherMenuItems.push(
        { label: 'Special profit rate', icon: 'ui-icon-attach-money', command: () => this.goToSpecialProfitRate() }
      );
    }

  }

  addAccountCloseButton() {
    if ((this.fixedDepositAccount.status === "ACTIVATED" || this.fixedDepositAccount.status === "MATURED") && (!this.fixedDepositAccount.freeze)) {
      this.otherMenuItems.push(
        { label: 'Close account', icon: 'ui-icon-cancel', command: () => this.closeAccount() }
      );
    }
  }

  closeAccount() {
    this.router.navigate(['../', 'close-account'], {
      relativeTo: this.route,
      queryParams: {
        fixedDeposit: this.currentPath(this.location),
        command: "FixedDepositAccountCloseCommand",
        customerId: this.fixedDepositAccount.customerId
      },
      queryParamsHandling: "merge"
    });
  }

  goToBankNotice() {
    this.router.navigate(['../', 'bank-notice'], {
      relativeTo: this.route,
      queryParams: { account: this.currentPath(this.location) },
      queryParamsHandling: "merge"
    });
  }

  goToPensionScheduler() {
    const url = this.router.createUrlTree(['/pension-scheduler', 'form'], {
      relativeTo: this.route,
      queryParams: {
        account: this.currentPath(this.location),
        accountId: this.fixedDepositAccountId
      },
      queryParamsHandling: "merge"
    });

    this.router.navigateByUrl(url);
  }


  goToSignature() {
    const url = this.router.createUrlTree(['/account-operator'], {
      relativeTo: this.route,
      queryParams: {
        accountId: this.fixedDepositAccountId,
        routeBack: this.currentPath(this.location),
        cus: this.queryParams.cus,
        customerId: this.fixedDepositAccount.customerId
      },
      queryParamsHandling: "merge"
    });
    this.router.navigateByUrl(url);
  }

  goToKyc() {
    let searchParam = new Map<string, string>();
    searchParam.set('accountNumber', this.fixedDepositAccount.number + '');
    this.subscribers.fetchKycesDetailsSub = this.kycService.fetchKyces(searchParam)
      .subscribe(data => {
        let routePath: string;
        if (".KycIndividual" == data.type) { routePath = '/kyc/individual'; }
        else if (".KycInstitute" == data.type) { routePath = '/kyc/institute'; }

        routePath = (data.id && data.id != 0) ? routePath.concat('/details') : routePath.concat('/edit');
        const url = this.router.createUrlTree([routePath], {
          queryParams: {
            account: this.currentPath(this.location),
            accountNumber: this.fixedDepositAccount.number
          },
          queryParamsHandling: "merge"
        });
        this.router.navigateByUrl(url);
      });
  }

  addNominee() {
    const url = this.router.createUrlTree(['/nominee', 'create'], {
      relativeTo: this.route,
      queryParams: {
        account: this.currentPath(this.location),
        accountId: this.fixedDepositAccountId,
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
        // accountId: this.fixedDepositAccountId
      },
      queryParamsHandling: "merge"
    });

    this.router.navigateByUrl(url);
  }

  deleteNominee(nominee: AccountNominee) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this nominee?',
      accept: () => {
        this.deletefixedDepositAccountNominee(nominee);
      }
    });
  }

  deletefixedDepositAccountNominee(nominee: AccountNominee) {
    this.subscribers.deleteNominee = this.nomineeService
      .deleteAccountNominee({ nomineeId: nominee.id })
      .subscribe((data) => {
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

  activate() {
    this.showVerifierSelectionModal = of(true);
  }

  reactivate() {
    this.showVerifierSelectionModal = of(true);
  }


  setAccountFreezeStatus() {
    this.router.navigate(['account/account-freeze'], {
      queryParams: {
        accountId: this.fixedDepositAccountId,
        routeBack: this.currentPath(this.location),
        isFreeze: this.fixedDepositAccount.freeze
      },
      queryParamsHandling: "merge"
    });
  }

  onVerifierSelect(event: VerifierSelectionEvent) {

    if (this.fixedDepositAccount.status !== "ACTIVATED") {
      let view_ui = DETAILS_UI.concat("?accountId=").concat(this.fixedDepositAccountId.toString()).concat("&").concat("inactive=true&");
      let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));
      this.subscribers.activateAccountSub = this.fixedDepositAccountService
        .activateAccount(this.fixedDepositAccountId, urlSearchParams)
        .subscribe(data => {
          this.notificationService.sendSuccessMsg("approval.requst.success");
          this.navigateAway();
        });
    } else {
      let view_ui = DETAILS_UI.concat("?accountId=").concat(this.fixedDepositAccountId.toString()).concat("&");
      let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));
      // let reactivationDetail = new ReactivateDemandDepositAccountCommandDetails();
      // this.demandDepositAccountService.reactivateAccount(this.demandDepositAccountId, reactivationDetail, urlSearchParams)
      //   .subscribe(data => {
      //     this.notificationService.sendSuccessMsg(REACTIVATION_SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
      //     this.navigateAway();
      //   });
    }

  }

  reload() {
    this.fetchFixedDepositAccountDetails();
  }

  cancel() {
    this.navigateAway();
  }

  navigateAway() {
    if (this.queryParams['cus'] != undefined) {
      this.router.navigate([this.queryParams.cus]);
    } else {
      this.router.navigate(['../'], {
        relativeTo: this.route,
        queryParams: { cus: this.queryParams['cus'] },
      });
    }
  }

  navigateToNomineeDetail() {
    this.router.navigate(['nominee', this.selectedNominee.id, 'details'], {
      queryParams: {
        account: this.currentPath(this.location),
        accountId: this.fixedDepositAccountId
      },
      queryParamsHandling: 'merge'
    });
  }

  fetchFixedDepositWithdrawalAdvices() {
    this.subscribers.fatchFixedDepositWithdrawalAdviceSub = this.fixedDepositPrincipalWithdrawalAdviceService
      .fetchFixedDepositWithdrawalAdvices({ fixedDepositAccountId: this.fixedDepositAccountId })
      .subscribe(data => {
        this.FixedDepositWithdrawalAdvices = data.content;
      });
  }

  navigateToWithdrawalAdviceDetail(event) {
    this.router.navigate(['withdrawal-mapping-detail'], {
      relativeTo: this.route,
      queryParams: {
        accountId: this.fixedDepositAccountId,
        productId: this.productId,
        referenceNumber: event.data.referenceNumber
      },
      queryParamsHandling: 'merge'
    });
  }

}