import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Branch, OwnBranch, OtherBranch } from '../../../../services/bank/domain/bank.models';
import { BankService } from '../../../../services/bank/service-api/bank.service';
import { Subscriber, Observable } from 'rxjs';
import { PathParameters } from '../../../../services/base.service';
import { BaseComponent } from '../../../../common/components/base.component';
import { Address } from '../../../../services/cis/domain/address.model';
import { AbabilLocationService } from './../../../../services/location/service-api/location.service';
import { NotificationService } from '../../../../common/notification/notification.service';
import * as urlSearchParameterConstants from '../../../../common/constants/app.search.parameter.constants';

@Component({
    selector: 'app-branch-detail',
    templateUrl: './branch.detail.component.html',
    styleUrls: ['./branch.detail.component.scss']
})
export class BranchDetailComponent extends BaseComponent implements OnInit {

    private selectedBranchId: string;
    private selectedBankId: string;
    isOwn: boolean;
    countryId: number;
    divisionId: number;
    address: Address = new Address();
    ownBranch: OwnBranch = {};
    otherBranch: OtherBranch = {};
    bank_address: any = { addressLine1: null, addressLine2: null, addressLine3: null, country: null, division: null, district: null, upazilla: null, postCode: null };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private bankService: BankService,
        private locationService: AbabilLocationService,
        private notificationService: NotificationService ) { super(); }

    //  @ViewChild('addressComponent') addressComponent:any;

    ngOnInit() {
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.selectedBankId = params['bankId'];
            this.selectedBranchId = params['branchId'];
        });
        this.fetchBranchDetails();
    
    }


    fetchBranchDetails() {
        this.subscribers.fetchBranchSub = this.bankService.
            fetchBranchDetails({ 'bankId': this.selectedBankId + '', 'branchId': this.selectedBranchId + '' })
            .subscribe(branch => {
                if (branch.jsonType === "OWN") {
                    this.isOwn = true;
                    this.ownBranch = branch;
                    this.bank_address =  this.extractAddressData(this.ownBranch.address);

                } else {
                    this.isOwn = false;
                    this.otherBranch = branch;
                    this.bank_address =  this.extractAddressData(this.otherBranch.address);
                    
                }
            });
        

    }
    extractAddressData(address: Address) {
        this.bank_address.addressLine = address.addressLine

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

    // deleteBranch() {
    //     let urlSearchMap = new Map<string, any>();
    //     urlSearchMap.set('bankId', this.selectedBankId + '');
    //     urlSearchMap.set('branchId', this.selectedBranchId + '');
    //     if (event.verifier != null) urlSearchMap.set(urlSearchParameterConstants.VERIFIER, event.verifier);

    //     this.subscribers.delBranch = this.bankService.deleteBranch({'bankId': this.selectedBankId + '', 'branchId': this.selectedBranchId + ''}, urlSearchMap).subscribe(
    //       (data) => {
    //         this.notificationService.sendSuccessMsg("approval.request.success");
    //         this.navigateAway();
    //       }
    //     )
    //   }

    cancel() {
        this.navigateAway();
    }

    navigateAway(): void {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }

}