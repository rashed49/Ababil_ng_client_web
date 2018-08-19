import { CustomValidators } from 'ng2-validation';
import { Address, PostCode } from './../../../services/cis/domain/address.model';
import { AbabilLocationService } from './../../../services/location/service-api/location.service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange, ViewChild } from '@angular/core';
import { BaseComponent } from '../base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CISMiscellaneousService } from '../../../services/cis/service-api/cis.misc.service';

export interface AddressSubmitEvent {
    address: Address;
    identfier: string;
}

@Component({
    selector: 'address-component',
    templateUrl: './address.component.html'
})
export class AddressComponent extends BaseComponent implements OnInit {

    address: Address;
    addressForm: FormGroup;
    postCodeDetails: any;
    postCode: string;
    baseCountryId: number;
    baseCountry: boolean ;

    @Input('viewMode') viewMode: boolean;
    @Input('address') set setAddress(address: Address) {

        this.initAddress(address);

    };
    @Output('onAddressChange') onAddressChange = new EventEmitter<Address>();

    countries: any[] = [];
    divisions: any[] = [];
    districts: any[] = [];
    upazillas: any[] = [];
    division: any;
    postCodeIdMap: Map<number, string>;
    constructor(private locationService: AbabilLocationService, private formBuilder: FormBuilder, private cisMiscellaneousService: CISMiscellaneousService) {
        super();

    }

    ngOnInit() {
        this.fetchBaseCountryId();
        this.loadCountries();
        this.viewMode = this.viewMode ? this.viewMode : false;

    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.viewMode && changes.viewMode.currentValue) {
            this.viewMode = changes.viewMode.currentValue;
        }
    }

    extractData() {
        return this.addressForm.value;
    }

    loadCountries() {
        this.subscribers.fetchCountrySub = this.locationService.fetchCountries()
            .subscribe(data => {
                this.countries = data;
            });
    }

    initAddress(address: Address) {
        this.address = address ? address : new Address();
        if (address.countryId != 0 && address.countryId != null) {

            this.subscribers.fetchDivisionsSub = this.locationService.fetchDivisionsByCountry({ countryId: this.address.countryId })
                .subscribe(data => {
                    this.divisions = data;
                });
        }



        if (address.divisionId != null && address.divisionId != 0) {
            this.subscribers.fetchDistrctSub = this.locationService.fetchDistrictsByDivision({ divisionId: this.address.divisionId })
                .subscribe(data => {
                    this.districts = data;
                });
        }
        if (address.districtId != null && address.districtId != 0) {
            this.subscribers.fetchUpazillaSub = this.locationService.fetchUpazillasByDistrict({ districtId: this.address.districtId })
                .subscribe(data => {
                    this.upazillas = data;
                });
        }
        if (address.postCodeId != null && address.postCodeId != 0) {
            this.fetchPostCodeDetails(address.countryId, address.postCodeId);
        }
        if (address.postCodeId === 0) {
            this.postCode = '';
        }
        this.prepareAddressForm();
    }

    prepareAddressForm() {
        if (this.address.countryId != 0 && this.address.countryId === 1) {
            this.baseCountry = true;
        } else {
            this.baseCountry = false;
        }
        this.addressForm = this.formBuilder.group({
            addressLine: [this.address.addressLine, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            countryId: [this.address.countryId],
            divisionId: [this.address.divisionId],
            districtId: [this.address.districtId],
            upazillaId: [this.address.upazillaId],
            postCodeId: [this.address.postCodeId]
        });
        this.addressForm.controls['countryId'].valueChanges.subscribe(data => {

            if (data == this.baseCountryId) {
                if (this.addressForm.get('postCodeId').value && this.postCodeDetails.upazilla.district.division.id !== this.addressForm.get('countryId').value) {
                    this.postCode = '';
                    this.addressForm.get('postCodeId').setValue(null);
                    this.addressForm.get('postCodeId').updateValueAndValidity();
                }
            }
            this.addressFieldValidation(this.baseCountry);
            this.onCountrySelected();
            this.addressForm.updateValueAndValidity();
        });

        this.addressForm.get('divisionId').valueChanges.subscribe(
            value => {
                if (value != 0) {
                    this.onDivisionSelected();
                    if (this.addressForm.get('postCodeId').value && this.postCodeDetails.upazilla.district.division.id !== this.addressForm.get('divisionId').value) {
                        this.postCode = '';
                        this.addressForm.get('postCodeId').setValue(null);
                        this.addressForm.get('postCodeId').updateValueAndValidity();
                    }

                }
            });
        this.addressForm.get('districtId').valueChanges.subscribe(
            value => {
                if (value != 0) {
                    this.onDistrictSelected();
                    if (this.addressForm.get('postCodeId').value && this.postCodeDetails.upazilla.district.id !== this.addressForm.get('districtId').value) {
                        this.postCode = '';
                        this.addressForm.get('postCodeId').setValue(null);
                        this.addressForm.get('postCodeId').updateValueAndValidity();
                    }

                }
            });

        this.addressForm.get('upazillaId').valueChanges.subscribe(
            value => {
                if (value != 0) {
                    if (this.addressForm.get('postCodeId').value && this.postCodeDetails.upazilla.id !== this.addressForm.get('upazillaId').value) {
                        this.postCode = '';
                        this.addressForm.get('postCodeId').setValue(null);
                        this.addressForm.get('postCodeId').updateValueAndValidity();
                    }

                }
            });


        this.addressForm.valueChanges.subscribe(
            value => {
                if (value) {
                    this.onAddressChange.emit(this.addressForm.value);
                }

            }
        )
    }

    onCountrySelected() {
        if (this.addressForm.get('countryId').value === this.baseCountryId) {
            this.addressForm.controls['divisionId'].setValidators(CustomValidators.notEqual(0));
            this.addressForm.controls['divisionId'].updateValueAndValidity();
            this.addressForm.controls['districtId'].setValidators(CustomValidators.notEqual(0));
            this.addressForm.controls['districtId'].updateValueAndValidity();
            this.addressForm.controls['upazillaId'].setValidators(CustomValidators.notEqual(0));
            this.addressForm.controls['upazillaId'].updateValueAndValidity();
            this.addressForm.get('divisionId').setValue(0);
            this.addressForm.get('divisionId').markAsTouched();
            this.addressForm.get('upazillaId').setValue(0);
            this.addressForm.get('upazillaId').markAsTouched();
            this.addressForm.get('districtId').setValue(0);
            this.addressForm.get('districtId').markAsTouched();
            this.districts = [];
            this.upazillas = [];
            this.divisions = [];
            this.addressForm.updateValueAndValidity();
            if (this.addressForm.get('countryId').value == 0) return;
            this.subscribers.fetchDivisionsSub = this.locationService.fetchDivisionsByCountry({ countryId: this.addressForm.get('countryId').value })
                .subscribe(data => {
                    this.divisions = data;
                    if (this.addressForm.get('postCodeId').value && this.postCodeDetails != null && this.postCodeDetails.upazilla != undefined) {
                        this.addressForm.get('divisionId').setValue(this.postCodeDetails.upazilla.district.division.id);
                    }

                });


        } else {

            this.addressForm.get('divisionId').setValue(0);
            this.addressForm.get('divisionId').markAsTouched();
            this.addressForm.get('upazillaId').setValue(0);
            this.addressForm.get('upazillaId').markAsTouched();
            this.addressForm.get('districtId').setValue(0);
            this.addressForm.get('districtId').markAsTouched();
            this.addressForm.get('postCodeId').setValue(0);
            this.addressForm.get('postCodeId').markAsTouched();
            this.addressForm.updateValueAndValidity();
            this.districts = [];
            this.upazillas = [];
            this.divisions = [];
            this.postCode = '';

            this.addressForm.controls['divisionId'].clearValidators();
            this.addressForm.controls['divisionId'].updateValueAndValidity();
            this.addressForm.controls['districtId'].clearValidators();
            this.addressForm.controls['districtId'].updateValueAndValidity();
            this.addressForm.controls['upazillaId'].clearValidators();
            this.addressForm.controls['upazillaId'].updateValueAndValidity();
        }

    }

    onDivisionSelected() {
        this.addressForm.get('districtId').setValue(0);
        this.addressForm.get('districtId').markAsTouched();
        this.addressForm.get('upazillaId').setValue(0);
        this.addressForm.get('upazillaId').markAsTouched();
        this.upazillas = [];
        this.districts = [];
        this.addressForm.updateValueAndValidity();
        if (this.addressForm.get('divisionId').value == 0) return;
        this.subscribers.fetchDistrctSub = this.locationService.fetchDistrictsByDivision({ divisionId: this.addressForm.get('divisionId').value })
            .subscribe(data => {
                this.districts = data;
                if (this.addressForm.get('postCodeId').value && this.postCodeDetails.upazilla != undefined) {
                    this.addressForm.get('districtId').setValue(this.postCodeDetails.upazilla.district.id);
                }

            });
    }

    onDistrictSelected() {
        this.addressForm.get('upazillaId').setValue(0);
        this.addressForm.get('upazillaId').markAsTouched();
        this.upazillas = [];
        this.addressForm.updateValueAndValidity();
        if (this.addressForm.get('districtId').value == 0) return;
        this.subscribers.fetchUpazillaSub = this.locationService.fetchUpazillasByDistrict({ districtId: this.addressForm.get('districtId').value })
            .subscribe(data => {
                this.upazillas = data;
                this.addressForm.get('upazillaId').setValue(this.postCodeDetails.upazilla.id);
                this.addressForm.updateValueAndValidity();

            });
    }


    onPostCodeSelected() {
        this.addressForm.get('divisionId').setValue(0);
        this.addressForm.get('divisionId').markAsTouched();
        this.addressForm.get('upazillaId').setValue(0);
        this.addressForm.get('upazillaId').markAsTouched();
        this.addressForm.get('districtId').setValue(0);
        this.addressForm.get('districtId').markAsTouched();
        this.districts = [];
        this.upazillas = [];

        this.addressForm.updateValueAndValidity();
        this.locationService.fetchPostCodes(new Map<string, string>().set('postalCode', this.postCode)).subscribe(
            data => {
                this.postCodeDetails = data.content[0];
                console.log(data.content[0]);
                this.addressForm.get('postCodeId').setValue(data.content[0].id);
                this.addressForm.get('countryId').setValue(data.content[0].upazilla.district.division.country.id);
                this.addressForm.get('countryId').markAsTouched();
                this.addressForm.get('postCodeId').markAsTouched();
                this.addressForm.updateValueAndValidity();

            }
        );
    }
    fetchPostCodeDetails(countryId, postCodeId) {
        this.locationService.fetchPostCodeDetails({ countryId: countryId, postCodeId: postCodeId }).subscribe(
            data => {
                this.postCode = data.code;
                this.addressForm.get('postCodeId').setValue(data.id);
            }
        );
    }


    isValid() {
        if (!this.addressForm) return false;
        return this.addressForm.valid;
    }

    isInvalid() {
        if (!this.addressForm) return true;
        return this.addressForm.invalid;
    }

    markAsTouched() {
        this.markFormGroupAsTouched(this.addressForm);
        //this.addressForm.markAsTouched();
    }

    removeControl() {
        this.addressForm.clearValidators();
        this.addressForm.updateValueAndValidity();
    }

    fetchBaseCountryId() {
        this.subscribers.fetchBaseCountryIdSub = this.cisMiscellaneousService.getConfiguration({ key: 'BASE_COUNTRY' }).subscribe(
            data => {
                this.baseCountryId = Number(data.value);
                if (!this.addressForm.get('countryId').value) {
                    this.addressForm.get('countryId').setValue(this.baseCountryId);
                    this.addressForm.get('countryId').markAsTouched();
                    this.addressForm.get('countryId').updateValueAndValidity();
                    this.onCountrySelected();
                }
            }
        )
    }

    addressFieldValidation(isNativeCountry) {
        if (isNativeCountry) {
            this.addressForm.get('divisionId').setValidators([CustomValidators.notEqual(0)]);
            this.addressForm.get('divisionId').updateValueAndValidity();
            this.addressForm.get('upazillaId').setValidators([CustomValidators.notEqual(0)]);
            this.addressForm.get('upazillaId').updateValueAndValidity();
            this.addressForm.get('districtId').setValidators([CustomValidators.notEqual(0)]);
            this.addressForm.get('districtId').updateValueAndValidity();
        } else {
            this.addressForm.get('divisionId').clearValidators();
            this.addressForm.get('divisionId').updateValueAndValidity();
            this.addressForm.get('upazillaId').clearValidators();
            this.addressForm.get('upazillaId').updateValueAndValidity();
            this.addressForm.get('districtId').clearValidators();
            this.addressForm.get('districtId').updateValueAndValidity();
            this.addressForm.updateValueAndValidity();
        }
    }

}