
import { ViewChild, Component, OnInit, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { BaseComponent } from '../../../../common/components/base.component';
import { SelectItem } from 'primeng/api';
import { Gender, MaritalStatus, ResidentStatus } from '../../../../common/domain/cis.enum.model';
import { Country } from '../../../../services/location/domain/country.models';
import { Address } from '../../../../services/cis/domain/address.model';
import { CISService } from '../../../../services/cis/service-api/cis.service';
import { AbabilLocationService } from '../../../../services/location/service-api/location.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../common/notification/notification.service';
import { CISMiscellaneousService } from '../../../../services/cis/service-api/cis.misc.service';
import { District } from '../../../../services/location/domain/district.models';
import { IndividualInformation } from '../../../../services/cis/domain/individual.model';


export let initialIndividualInfo = new IndividualInformation();

@Component({
    selector: 'short-individual-view',
    templateUrl: './view.short.individual.form.component.html',
    styleUrls: ['./view.short.individual.form.component.scss']
})
export class ShortIndividualViewComponent extends BaseComponent implements OnInit {

    uuid: string;
    individualId: number;
    maritalStatuses: SelectItem[] = MaritalStatus;
    genders: SelectItem[] = Gender;
    residentStatuses: SelectItem[] = ResidentStatus;
    nrbBirthPlace = false;
    countries: Country = new Country();
    birthDistrict: District[];
    birthDistrictName: string = "";
    birthCountryId: number;
    birthplace: number;

    documentHidden: boolean = true;
    infoHidden: boolean = false;
    viewMode:boolean=true;

    clientId: string;
    profileCode: string = "101";
    //viewMode:boolean=true;

    @ViewChild('individualFormContainer') individualFormContainer: any;
    @ViewChild('addressComponent') addressComponent: any;
    @ViewChild('docComponent') docComponent: any;
    @ViewChild('presentAddressComponent') presentAddressComponent: any;
    @ViewChild('permanentAddressComponent') permanentAddressComponent: any;
    @ViewChild('professionalAddressComponent') professionalAddressComponent: any;
    @Input('guardianId') guardianId: number;
    @Output('onBack') onBack = new EventEmitter<boolean>();

    presentAddress: Address = new Address();
    permanentAddress: Address = new Address();
    professionalAddress: Address = new Address();
    documents: Document[] = [];

    maxBirthdayDate: Date = new Date();
    individualInformation: IndividualInformation = new IndividualInformation();
    queryParams: any;
    baseCountryId: number;
    baseCountryDistricts: District[] = [];
    imageApiUrl:string = environment.serviceapiurl;

    constructor(private cisService: CISService,
        private ababilLocationService: AbabilLocationService,
        private route: ActivatedRoute,
        protected router: Router,
        protected notificationService: NotificationService,
        private cisMiscellaneousService: CISMiscellaneousService) {
        super();

    }
    ngOnInit() {

        this.subscribers.routeSub = this.route.queryParams.subscribe(params => {
            this.individualId = +params['individualId'];
            if (this.individualId) {
                this.fetchIndividualInformation();
            }
        });
        this.subscribers.queryParamSub = this.route.queryParams.subscribe(data => {
            this.queryParams = data;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.guardianId) {
            this.individualId = changes.guardianId.currentValue;
            if (this.individualId) {
                this.fetchIndividualInformation();
            }
        }
    }

    fetchIndividualInformation() {
        this.subscribers.loadShortIndividualSub = this.cisService.fetchIindividualInformationDetails({ id: this.individualId })
            .subscribe(data => {
                this.individualInformation = data;
                this.clientId = this.individualInformation.uuid;
                this.birthCountryId = this.individualInformation.birthCountryId;
                if (this.individualInformation.birthPlaceId) {
                    this.fetchBaseCountryDistricts();
                    this.birthplace = this.individualInformation.birthPlaceId;
                    this.nrbBirthPlace = false;
                } else {
                    this.nrbBirthPlace = true;
                }
                this.presentAddress = this.individualInformation.presentAddress ? this.individualInformation.presentAddress : new Address();
                this.permanentAddress = this.individualInformation.permanentAddress ? this.individualInformation.permanentAddress : new Address();
                this.professionalAddress = this.individualInformation.professionalAddress ? this.individualInformation.professionalAddress : new Address();
                this.fetchCountryDetail();
            });
    }
    fetchCountryDetail() {
        this.subscribers.countryDetailSub = this.ababilLocationService
            .fetchCountryDetail({ countryId: this.birthCountryId })
            .subscribe(data => {
                this.countries = data;
            });
    }
    fetchBaseCountryId() {
        this.subscribers.fetchBaseCountryIdSub = this.cisMiscellaneousService.getConfiguration({ key: 'BASE_COUNTRY' }).subscribe(
            data => {
                this.baseCountryId = data.value;
            }
        )
    }
    fetchBaseCountryDistricts() {
        this.subscribers.fetchDistrictssSub = this.ababilLocationService.fetchDistrictsByCountry({ countryId: this.birthCountryId })
            .subscribe(data => {
                this.baseCountryDistricts = data;
                this.birthDistrict = this.baseCountryDistricts.filter(data =>
                    data.id = this.birthplace);
                this.birthDistrictName = this.birthDistrict[0].name;
            });
    }
    back() {
        if (this.guardianId) {
            this.onBack.emit(true);
        }
        else {
            this.router.navigate([this.queryParams.nominee], {
                queryParamsHandling: 'merge'
            });
        }
    }
    documentShow() {
        this.documentHidden = false;
        this.infoHidden = true;
    }
    infoShow() {
        this.docComponent.extractFormData();
        this.infoHidden = false;
        this.documentHidden = true;

    }


}



