import { CISMiscellaneousService } from './../../../../../services/cis/service-api/cis.misc.service';
import { TypeOfBusiness } from './../../../../../services/cis/domain/type.of.business.model';
import { Observable, of } from 'rxjs';
import { OrganizationService } from './../../../../../services/cis/service-api/organization.service';
import { ApprovalflowService } from './../../../../../services/approvalflow/service-api/approval.flow.service';
import { NotificationService } from './../../../../../common/notification/notification.service';
import { CISService } from './../../../../../services/cis/service-api/cis.service';
import { Address } from './../../../../../services/cis/domain/address.model';
import { Organization, OrganizationType } from './../../../../../services/cis/domain/organization.model';
import { ViewsBaseComponent } from './../../../view.base.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationStrategy,Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { orgMapper,orgOwnerMapper } from '../../../../cis/organization/domain/organization.servermodel.mapper';
import * as profileCode from '../../../../../common/constants/app.profile.code.constants';

@Component({
    selector: 'organization-owner-view',
    templateUrl: './organization.owner.view.component.html'
})
export class OrganizationOwnerViewComponent extends ViewsBaseComponent implements OnInit {

    id:number;
    customerId: number;
    applicantId: number;
    organizationId: number;
    organization:Organization = new Organization();
    sharedPercentage:number=0;
    maxAssignableShare:number=100;

    @ViewChild('businessAddressComponent') businessAddressComponent;
    @ViewChild('factoryAddressComponent') factoryAddressComponent;
    @ViewChild('registeredAddressComponent') registeredAddressComponent;

    businessAddress:Address = new Address();
    factoryAddress:Address = new Address();
    registeredAddress:Address = new Address();

    upperLimit:number=100;
    lowerLimit:number=0;
    customerName:string;

    organizationForm:FormGroup;
    typeOfBusiness: TypeOfBusiness[];
    organizationTypes: OrganizationType[] = []; 
    viewMode: boolean = true;
    clientId: string;
    profileCode: string = profileCode.ORGANIZATION_PROFILE_CODE;

    constructor(private cisService: CISService, private url: LocationStrategy,
        private route: ActivatedRoute, protected router: Router,
        protected notificationService: NotificationService,private organizationService: OrganizationService,
        protected location: Location, private formBuilder:FormBuilder,
        protected workflowService:ApprovalflowService,
        private cisMiscellaneousService: CISMiscellaneousService){
        super(location,router,workflowService,notificationService);
    }

    ngOnInit(){
        this.getCustomerTypeOfBusiness();
        this.showVerifierSelectionModal=of(false);
        this.organization = new Organization();        
        this.subscribers.routeSub = this.route.queryParams.subscribe(params => {
            this.id = params['id']==undefined?null:+params['id'];
            this.organizationId = +params['organizationId'];
            this.command = params['command'];
            this.processId = params['taskId'];
            this.loadAssignableShare(this.id);
            this.fetchOwnerDetails();          
        });
        this.fetchOrganizationTypes();
    }

    loadAssignableShare(id:number){
        let urlSearchMap = new Map();
        if(id!=null) urlSearchMap.set("ownerId",id);
        this.subscribers.fetchAssignableShareSub=this.organizationService.fetchAssignableShare({organizationId:this.organizationId},urlSearchMap)
        .subscribe(
             data=>{
                 this.upperLimit=data.upperLimit;
                 this.lowerLimit=data.lowerLimit;
                 if(id!=null) this.fetchOwnerDetails(); 
             }
        ); 
    }


    fetchOwnerDetails(){
        this.subscribers.fetchOwnerDetailsSub=this.organizationService.fetchOwnerDetails({organizationId:this.organizationId+"",id:this.id+""})
         .subscribe(data=>{
             this.organization = orgOwnerMapper(data);
             this.id=data.id;
             this.clientId = this.organization.uuid;
             this.sharedPercentage=data.sharePercentage;
             this.businessAddress=this.organization.businessAddress;
             this.factoryAddress=this.organization.factoryAddress;
             this.registeredAddress=this.organization.registeredAddress;                               
        });
    }

    fetchOrganizationTypes() {
        this.subscribers.fetchOrganizationTypesSub = this.cisService.fetchOrganizationTypes()
            .subscribe(data => this.organizationTypes = data);
    }

    getCustomerTypeOfBusiness(){
        this.cisMiscellaneousService.getCustomerTypeOfBusiness()
            .subscribe(data=>{
                this.typeOfBusiness = data;
            });
    }

   

}