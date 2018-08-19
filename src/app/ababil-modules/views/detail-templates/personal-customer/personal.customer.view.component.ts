import { Location } from '@angular/common';
import { ApprovalflowService } from './../../../../services/approvalflow/service-api/approval.flow.service';
import { ViewsBaseComponent } from './../../view.base.component';
import { IndividualInformation } from './../../../../services/cis/domain/individual.model';
import { environment } from './../../../../../environments/environment';
import { CISMiscellaneousService } from './../../../../services/cis/service-api/cis.misc.service';
import { ImageUploadService } from './../../../../services/cis/service-api/image.upload.service';
import { NotificationService } from './../../../../common/notification/notification.service';
import { FormBuilder } from '@angular/forms';
import { AbabilLocationService } from './../../../../services/location/service-api/location.service';
import { CISService } from './../../../../services/cis/service-api/cis.service';
import { ViewChild, SimpleChanges } from '@angular/core';
import { Address } from './../../../../services/cis/domain/address.model';
import { CustomerClassificationType } from './../../../../services/cis/domain/type.of.business.model';
import { SourceOfFund, SubjectSourceOfFund } from './../../../../services/cis/domain/subject.model';
import { FormGroup } from '@angular/forms';
import { MaritalStatus, Gender, ResidentStatus } from './../../../../common/domain/cis.enum.model';
import { SelectItem } from 'primeng/api';
import { BaseComponent } from './../../../../common/components/base.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'personal-customer-view',
  templateUrl: './personal.customer.view.component.html' 
})
export class PersonalCustomerViewComponent extends ViewsBaseComponent implements OnInit {

    imageApiUrl: string;
    uuid: string;
    individualId: number;
    maritalStatuses: SelectItem[] = MaritalStatus;
    genders: SelectItem[] = Gender;
    residentStatuses: SelectItem[] = ResidentStatus;
    occupations: any[];
    occupationMap: Map<number, string> = new Map();    
    selectedSourceOfFunds: SubjectSourceOfFund[] = [];
    mergedSourceOfFunds: any[] = [];// 
    customerClassificationTypes: CustomerClassificationType[] = [];
    otherSourceOfFundDetails: string = "";

    @ViewChild('individualFormContainer') individualFormContainer: any;
    @ViewChild('addressComponent') addressComponent: any;
    @ViewChild('ababilImage') ababilImage: any;

    presentAddress: Address = new Address();
    permanentAddress: Address = new Address();
    professionalAddress: Address = new Address();

    @ViewChild('presentAddressComponent') presentAddressComponent: any;
    @ViewChild('permanentAddressComponent') permanentAddressComponent: any;
    @ViewChild('professionalAddressComponent') professionalAddressComponent: any;
    @ViewChild('individualImage') individualImageComponent: any;

    individualImageSrc: string;
    maxBirthdayDate: Date = new Date();
    individualInformation:IndividualInformation = new IndividualInformation();

    constructor(private cisService: CISService,
        private ababilLocationService: AbabilLocationService,
        private route: ActivatedRoute,
        protected location:Location,
        protected router: Router,
        private formBuilder: FormBuilder,
        protected notificationService: NotificationService,
        private imageUploadService: ImageUploadService,
        private cisMiscellaneousService: CISMiscellaneousService,
        protected approvalflowService:ApprovalflowService) {
        super(location,router,approvalflowService,notificationService);
    }

    ngOnInit() {
        this.showVerifierSelectionModal=of(false);
        this.initEnterNavigation("individual-form");
        this.maxBirthdayDate.setDate(this.maxBirthdayDate.getDate() - 1);
        this.imageApiUrl = environment.serviceapiurl + "/individuals";
        this.subscribers.routeSub = this.route.queryParams.subscribe(params => {
            this.individualId = +params['individualId'];
            this.command = params['command'];
            this.processId = params['taskId'];
            this.taskId = params['taskId'];
            this.fetchIndividualInformation();            
        });
        this.fetchCustomerClassificationTypes();
        
    }

    fetchIndividualInformation(){
        this.subscribers.loadIndividualSub = this.cisService.fetchIindividualInformationDetails({ id: this.individualId })
            .subscribe(data => {
                this.individualInformation = data;
                this.presentAddress = this.individualInformation.presentAddress ? this.individualInformation.presentAddress : new Address();
                this.permanentAddress = this.individualInformation.permanentAddress ? this.individualInformation.permanentAddress : new Address();
                this.professionalAddress = this.individualInformation.professionalAddress ? this.individualInformation.professionalAddress : new Address();
                this.selectedSourceOfFunds = this.individualInformation.sourceOfFunds;                
                this.fetchSourceofFunds();
                this.fetchOccupations();
            });
    }    

    fetchOccupations() {
        this.subscribers.fetchOccupationSub = this.cisService.fetchOccupations().subscribe(
            data => {
                this.occupations = data.content;
                this.occupations.forEach(element => {
                    this.occupationMap.set(element.id, element.code);
                });               
            }
        );
    }     

    fetchCustomerClassificationTypes() {
        this.subscribers.fetchCustomerClassificationTypesSub = this.cisMiscellaneousService.getCustomerClassificationTypes().
            subscribe(data => {
                this.customerClassificationTypes = data;
            });
    }

    //jj block. service amake surf excel diye code likhte dey na!!
    fetchSourceofFunds() {
        this.subscribers.fetchCustomerSourceOfFundSub = this.cisMiscellaneousService.getCustomerSourceOfFunds().subscribe(
            data => {

                this.mergedSourceOfFunds = data.map(element => {
                    return { id: element.id, description: element.description, customDescriptionRequired: element.customDescriptionRequired, selected: false }
                });
                if (this.selectedSourceOfFunds) {
                    for (let j = 0; j < this.selectedSourceOfFunds.length; j++) {
                        for (let i = 0; i < this.mergedSourceOfFunds.length; i++) {
                            if (this.selectedSourceOfFunds[j].sourceId == this.mergedSourceOfFunds[i].id) {
                                if (this.mergedSourceOfFunds[i].customDescriptionRequired) {
                                    this.otherSourceOfFundDetails=this.mergedSourceOfFunds[i].description;                                
                                }
                                this.mergedSourceOfFunds[i].selected = true;
                            }
                        }
                    }
                }
            }
        )
    }

}
