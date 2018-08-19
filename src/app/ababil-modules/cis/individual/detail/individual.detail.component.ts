import { IndividualInformation } from './../../../../services/cis/domain/individual.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CISService } from '../../../../services/cis/service-api/cis.service';
import { Observable } from 'rxjs';
import { Subscriber } from 'rxjs';
import { PathParameters } from '../../../../services/base.service';
import { NotificationService, NotificationType } from '../../../../common/notification/notification.service';
import { BaseComponent } from '../../../../common/components/base.component';
import { Address } from '../../../../services/cis/domain/address.model';
import { AbabilLocationService } from './../../../../services/location/service-api/location.service';
import * as urlSearchParameterConstants from '../../../../common/constants/app.search.parameter.constants';


@Component({
  selector: 'individual-detail',
  templateUrl: './individual.detail.component.html'
})
export class IndividualDetailComponent extends BaseComponent implements OnInit {
  countryId: number;
  divisionId: number;
  private selectedId: number;
  profile: IndividualInformation = new IndividualInformation();
  urlSearchParam: Map<string, string>;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private cissService: CISService,
    private notificationService: NotificationService,
    private locationService: AbabilLocationService ) {
    super();
  }
  presentAddress: Address = new Address();
  idividual_present_address : any = { addressLine: null,  countryId: null, divisionId: null, districtId: null, upazillaId: null, postCodeId: null } ;
  idividual_permanent_address : any = { addressLine: null, countryId: null, divisionId: null, districtId: null, upazillaId: null, postCodeId: null } ;
  idividual_professional_address : any = { addressLine: null,  countryId: null, divisionId: null, districtId: null, upazillaId: null, postCodeId: null } ;
  
  
  ngOnInit(): void {
    this.subscribers.routeSub = this.route.params.subscribe(params => {
    this.profile.jsonType='individual'; 
    this.selectedId = 238;
    this.fetchIindividualInformation();

    });
  }

  fetchIindividualInformation() {
    this.subscribers.individualInfoFetchSub = this.cissService.fetchIindividualInformationDetails(
      { 'id': this.selectedId + '' }).subscribe(
      profileDetails => {
        this.profile = profileDetails;
        console.log(this.profile.firstName);     
        console.log(this.profile.residenceStatus);
        console.log(this.profile.spouseName);
        this.idividual_present_address =  this.extractPresentAddressData(this.profile.presentAddress);
        this.idividual_permanent_address =  this.extractPermanentAddressData(this.profile.permanentAddress);
        this.idividual_professional_address =  this.extractProfessionalAddressData(this.profile.professionalAddress);
        

      });
      
  }
  extractPresentAddressData(address: Address) {
    this.idividual_present_address.addressLine = address.addressLine;


    this.subscribers.fetchDetail = this.locationService.fetchCountryDetail({ 'countryId': address.countryId }).subscribe(
        data => {
            this.idividual_present_address.country = data.name;
        });
    this.subscribers.fetchDetail = this.locationService.fetchDivisionDetail({ 'countryId': address.countryId, 'divisionId': address.divisionId }).subscribe(
        data => {
            this.idividual_present_address.division = data.name;
        });
    this.subscribers.fetchDetail = this.locationService.fetchDistrictDetail({ 'countryId': address.countryId, 'divisionId': address.divisionId, 'districtId': address.districtId }).subscribe(
        data => {
            this.idividual_present_address.district = data.name;
        });
    this.subscribers.fetchDetail = this.locationService.fetchUpazillaDetail({ 'countryId': address.countryId, 'divisionId': address.divisionId, 'districtId': address.districtId, 'upazillaId': address.districtId }).subscribe(
        data => {
            this.idividual_present_address.upazilla = data.name;
        });

        return this.idividual_present_address;
}

extractPermanentAddressData(address: Address) {
  this.idividual_permanent_address.addressLine = address.addressLine;

  this.subscribers.fetchDetail = this.locationService.fetchCountryDetail({ 'countryId': address.countryId }).subscribe(
      data => {
          this.idividual_permanent_address.country = data.name;
      });
  this.subscribers.fetchDetail = this.locationService.fetchDivisionDetail({ 'countryId': address.countryId, 'divisionId': address.divisionId }).subscribe(
      data => {
          this.idividual_permanent_address.division = data.name;
      });
  this.subscribers.fetchDetail = this.locationService.fetchDistrictDetail({ 'countryId': address.countryId, 'divisionId': address.divisionId, 'districtId': address.districtId }).subscribe(
      data => {
          this.idividual_permanent_address.district = data.name;
      });
  this.subscribers.fetchDetail = this.locationService.fetchUpazillaDetail({ 'countryId': address.countryId, 'divisionId': address.divisionId, 'districtId': address.districtId, 'upazillaId': address.districtId }).subscribe(
      data => {
          this.idividual_permanent_address.upazilla = data.name;
      });

      return this.idividual_permanent_address;
}

extractProfessionalAddressData(address: Address) {
  this.idividual_professional_address.addressLine = address.addressLine;

  this.subscribers.fetchDetail = this.locationService.fetchCountryDetail({ 'countryId': address.countryId }).subscribe(
      data => {
          this.idividual_professional_address.country = data.name;
      });
  this.subscribers.fetchDetail = this.locationService.fetchDivisionDetail({ 'countryId': address.countryId, 'divisionId': address.divisionId }).subscribe(
      data => {
          this.idividual_professional_address.division = data.name;
      });
  this.subscribers.fetchDetail = this.locationService.fetchDistrictDetail({ 'countryId': address.countryId, 'divisionId': address.divisionId, 'districtId': address.districtId }).subscribe(
      data => {
          this.idividual_professional_address.district = data.name;
      });
  this.subscribers.fetchDetail = this.locationService.fetchUpazillaDetail({ 'countryId': address.countryId, 'divisionId': address.divisionId, 'districtId': address.districtId, 'upazillaId': address.districtId }).subscribe(
      data => {
          this.idividual_professional_address.upazilla = data.name;
      });

      return this.idividual_professional_address;
}


  cancel() {
    this.navigateAway();
  }

  navigateAway(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

}
