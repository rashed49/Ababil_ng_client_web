import { TypeOfBusiness } from './../../../../services/cis/domain/type.of.business.model';
import { CISMiscellaneousService } from './../../../../services/cis/service-api/cis.misc.service';
import { ApprovalflowService } from './../../../../services/approvalflow/service-api/approval.flow.service';
import { ViewsBaseComponent } from './../../view.base.component';
import { OrganizationOwnerDto } from './../../../cis/organization/domain/organization.owner.dto';
import { OrganizationService } from './../../../../services/cis/service-api/organization.service';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Address } from './../../../../services/cis/domain/address.model';
import { ViewChild, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Organization, OrganizationType } from '../../../../services/cis/domain/organization.model';
import { SelectItem } from 'primeng/primeng';
import { NotificationService } from '../../../../common/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CISService } from '../../../../services/cis/service-api/cis.service';
import { OwnerTypes } from '../../../cis/organization/domain/organization.owner';
import { orgMapper } from '../../../cis/organization/domain/organization.servermodel.mapper';
import { environment } from '../../../../../environments/environment';
import * as profileCode from '../../../../common/constants/app.profile.code.constants';
import { of } from 'rxjs';

@Component({
    selector: 'organization-customer-view',
    templateUrl: './organization.customer.view.component.html'
})
export class OrganizationCustomerViewComponent extends ViewsBaseComponent implements OnInit {

    customerId: number;
    customerName: string;
    applicantId: number;
    organizationId: number;
    organization: Organization = new Organization();
    owners: OrganizationOwnerDto[] = [];
    organizationTypes: OrganizationType[] = [];

    ownerTypes: SelectItem[] = OwnerTypes;
    ownerType: string;
    imageApiUrl: string;
    viewMode: boolean = true;

    clientId: string;
    profileCode: string = profileCode.ORGANIZATION_PROFILE_CODE;

    @ViewChild('businessAddressComponent') businessAddressComponent;
    @ViewChild('factoryAddressComponent') factoryAddressComponent;
    @ViewChild('registeredAddressComponent') registeredAddressComponent;

    businessAddress: Address = new Address();
    factoryAddress: Address = new Address();
    registeredAddress: Address = new Address();

    assignableShare: number = 0;
    organizationForm: FormGroup;
    typeOfBusiness: TypeOfBusiness[];

    constructor(private route: ActivatedRoute,
        protected router: Router,
        private formBuilder: FormBuilder,
        private modalService: NgbModal,
        protected location: Location,
        protected notificationService: NotificationService,
        private cisService: CISService,
        private organizationService: OrganizationService,
        protected approvalflowService: ApprovalflowService,
        private cisMiscellaneousService: CISMiscellaneousService) {
        super(location, router, approvalflowService, notificationService);
    }

    ngOnInit() {
        this.getCustomerTypeOfBusiness();
        this.showVerifierSelectionModal = of(false);
        this.imageApiUrl = environment.serviceapiurl + "/individuals";
        this.subscribers.routeSub = this.route.queryParams.subscribe(params => {
            this.customerId = +params['customerId'];
            this.applicantId = params['applicantId'] == undefined ? null : +params['applicantId'];
            this.customerName = params['customerName'];
            this.command = params['command'];
            this.processId = params['taskId'];
            this.commandReference = params['commandReference'];
            if (this.applicantId) this.fetchOrganization();
            this.loadAssignableShare();
        });
        this.fetchOrganizationTypes();
    }

    loadAssignableShare() {
        let urlSearchMap = new Map();
        this.subscribers.fetchAssignableShareSub = this.organizationService.fetchAssignableShare({ organizationId: this.applicantId }, urlSearchMap)
            .subscribe(data => this.assignableShare = data.upperLimit);
    }

    fetchOrganization() {
        this.subscribers.fetchSub = this.cisService.fetchSubjectDetails
            ({ id: this.customerId + "", subjectId: this.applicantId + "" }).
            subscribe(data => {
                this.organizationId = data.id;
                this.clientId = data.uuid;
                this.organization = orgMapper(data);
                this.businessAddress = this.organization.businessAddress;
                this.registeredAddress = this.organization.registeredAddress;
                this.factoryAddress = this.organization.factoryAddress;
                this.fetchOwners();
            });
    }

    fetchOwners() {
        this.subscribers.fetchSub = this.organizationService.fetchOrgOwners
            ({ organizationId: this.organizationId + "" }).
            subscribe(data => this.owners = data);
    }

    fetchOrganizationTypes() {
        this.subscribers.fetchOrganizationTypesSub = this.cisService.fetchOrganizationTypes()
            .subscribe(data => this.organizationTypes = data);
    }

    view(owner: OrganizationOwnerDto) {
        if (owner.subjectType == "INDIVIDUAL") {
            this.router.navigate(['/views/subject-individual'], {
                queryParams: { individualId: owner.id },
                queryParamsHandling: 'merge'
            });
        } else if (owner.subjectType == "ORGANIZATION") {
            this.router.navigate(['/views/organization'], {
                queryParams: { id: owner.id, organizationId: this.organizationId },
                queryParamsHandling: 'merge'
            });
        }
    }

    getCustomerTypeOfBusiness() {
        this.cisMiscellaneousService.getCustomerTypeOfBusiness()
            .subscribe(data => this.typeOfBusiness = data);
    }

}
