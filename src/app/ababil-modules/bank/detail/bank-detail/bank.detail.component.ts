import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bank, Branch } from '../../../../services/bank/domain/bank.models';
import { BankService } from '../../../../services/bank/service-api/bank.service';
import { Observable } from 'rxjs';
import { Subscriber } from 'rxjs';
import { PathParameters } from '../../../../services/base.service';
import { NotificationService, NotificationType } from '../../../../common/notification/notification.service';
import { BaseComponent } from '../../../../common/components/base.component';
import { Address } from '../../../../services/cis/domain/address.model';
import { AbabilLocationService } from './../../../../services/location/service-api/location.service';
import * as urlSearchParameterConstants from '../../../../common/constants/app.search.parameter.constants';


@Component({
  selector: 'app-bank-detail',
  templateUrl: './bank.detail.component.html',
  styleUrls: ['./bank.detail.component.scss']
})
export class BankDetailComponent extends BaseComponent implements OnInit {
  countryId: number;
  divisionId: number;
  private selectedId: number;
  profile: Bank = { code: null, name: null };
  branches: Branch[];
  urlSearchParam: Map<string, string>;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private bankService: BankService,
    private notificationService: NotificationService,
    private locationService: AbabilLocationService ) {
    super();
  }
  address: Address = new Address();
  bank_address : any = { addressLine1: null, addressLine2: null, addressLine3: null, country: null, division: null, district: null, upazilla: null, postCode: null } ;
  ngOnInit(): void {
    this.subscribers.routeSub = this.route.params.subscribe(params => {
      this.selectedId = +params['id'];
      this.fetchBankDetail();
      this.fetchBranches();

    });
  }

  fetchBankDetail() {
    this.subscribers.bankSub = this.bankService.fetchBankDetail(
      { 'id': this.selectedId + '' }).subscribe(
      profileDetails => {
        this.profile = profileDetails;
        this.bank_address =  this.extractAddressData(this.profile.address);

      });
      
  }
  extractAddressData(address: Address) {
    this.bank_address.addressLine = address.addressLine;

    this.subscribers.fetchDetail = this.locationService.fetchCountryDetail({ 'countryId': address.countryId }).subscribe(
        data => {
            this.bank_address.country = data.name;
        });
    this.subscribers.fetchDetail = this.locationService.fetchDivisionDetail({ 'countryId': address.countryId, 'divisionId': address.divisionId }).subscribe(
        data => {
            this.bank_address.division = data.name;
        });
    this.subscribers.fetchDetail = this.locationService.fetchDistrictDetail({ 'countryId': address.countryId, 'divisionId': address.divisionId, 'districtId': address.districtId }).subscribe(
        data => {
            this.bank_address.district = data.name;
        });
    this.subscribers.fetchDetail = this.locationService.fetchUpazillaDetail({ 'countryId': address.countryId, 'divisionId': address.divisionId, 'districtId': address.districtId, 'upazillaId': address.districtId }).subscribe(
        data => {
            this.bank_address.upazilla = data.name;
        });

        return this.bank_address;
}
  fetchBranches() {
    this.urlSearchParam = new Map([['bankId', this.selectedId + '']]);
    this.subscribers = this.bankService.fetchBranchProfiles({ 'bankId': this.selectedId + '' }, this.urlSearchParam).subscribe(
      profiles => {
        this.branches = profiles.content;
      });
  }
  
  deleteBank() {
    // let urlSearchMap = new Map<string, any>();
    // if (event.verifier != null) urlSearchMap.set(urlSearchParameterConstants.VERIFIER, event.verifier);
    // this.subscribers.delBank = this.bankService.deleteBank({'id': this.selectedId + ''}, this.urlSearchParam).subscribe(
    //   (data) => {
    //     this.notificationService.sendSuccessMsg("approvalflow.success.messeage");
    //     this.navigateAway();
    //   }
    // )
  }
  cancel() {
    this.navigateAway();
  }

  navigateAway(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  createBranch() {
    this.router.navigate(['branch/create', { ownBank: this.profile.ownBank }], { relativeTo: this.route });
  }

  onBranchSelect(event) {
    this.router.navigate(['branches', event.data.id], { relativeTo: this.route });
  }

}
