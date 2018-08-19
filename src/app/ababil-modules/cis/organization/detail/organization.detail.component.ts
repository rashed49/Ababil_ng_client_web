import { OrganizationService } from './../../../../services/cis/service-api/organization.service';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationOwnerDto } from './../domain/organization.owner.dto';
import { Address } from './../../../../services/cis/domain/address.model';
import { ViewChild, Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '../../../../common/components/base.component';
import { Organization } from '../../../../services/cis/domain/organization.model';
import { BusinessDetails } from '../../../../services/cis/domain/business.details.model';
import { ContactInformation } from '../../../../services/cis/domain/contact.information.model';
import { MaritalStatus, Gender, ResidentStatus } from '../../../../common/domain/cis.enum.model';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { NotificationService } from '../../../../common/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CISService } from '../../../../services/cis/service-api/cis.service';
import { Subject } from '../../../../services/cis/domain/subject.model';
import { Owner, OwnerTypes } from '../domain/organization.owner';
import { DocumentComponent } from '../../../../common/components/document/document.component';
import { IdentityInformation } from '../../../../services/cis/domain/identity.information.model';
import { orgMapper } from '../domain/organization.servermodel.mapper';

@Component({
    selector: 'organization-detail',
    templateUrl: './organization.detail.component.html'
})
export class OrganizationDetailComponent extends BaseComponent implements OnInit {

    customerId: number;
    customerName: string;
    applicantId: number;
    organizationId: number;
    organization: Organization = new Organization();
    owners: OrganizationOwnerDto[] = [];
    contactInformation: ContactInformation = new ContactInformation();

    ownerTypes: SelectItem[] = OwnerTypes;
    ownerType: string;


    businessAddress: Address = new Address();
    factoryAddress: Address = new Address();
    registeredAddress: Address = new Address();

    assignableShare: number = 0;
    organizationForm: FormGroup;

    constructor(private route: ActivatedRoute, private router: Router,
        private formBuilder: FormBuilder, private modalService: NgbModal, private location: Location,
        private notificationService: NotificationService, private cisService: CISService, private organizationService: OrganizationService) {
        super();
    }

    ngOnInit() {
        this.subscribers.routeSub = this.route.queryParams.subscribe(params => {
            this.customerId = +params['customerId'];
            // this.customerId = 72;
            this.applicantId = params['applicantId'] == undefined ? null : +params['applicantId'];
            // this.applicantId = 217;
            // this.customerName = params['customerName'];
            // this.customerName = 'Agora';
            if (this.applicantId) this.fetchOrganization();
            this.loadAssignableShare();
        });
    }

    loadAssignableShare() {
        let urlSearchMap = new Map();
        this.subscribers.fetchAssignableShareSub = this.organizationService.fetchAssignableShare({ organizationId: this.applicantId }, urlSearchMap)
            .subscribe(data => this.assignableShare = data.upperLimit);
    }

    fetchOrganization() {
        this.subscribers.fetchSub = this.cisService.fetchSubjectDetails
            ({ id: this.customerId + "", subjectId: this.applicantId + "" })
            .subscribe(data => {
                this.organizationId = data.id;
                this.organization = orgMapper(data);
                this.contactInformation = this.organization.contactInformation;
                this.businessAddress = this.organization.businessAddress;
                this.registeredAddress = this.organization.registeredAddress;
                this.factoryAddress = this.organization.factoryAddress;
                this.fetchOwners();
            });
    }

    fetchOwners() {
        this.subscribers.fetchSub = this.organizationService
            .fetchOrgOwners({ organizationId: this.organizationId + "" })
            .subscribe(data => this.owners = data);
    }

    navigateAway() {
        this.router.navigate(['customer/organization', this.customerId]);
    }

    cancel() {
        this.navigateAway();
    }


}
