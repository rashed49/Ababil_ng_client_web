import { TypeOfBusiness } from './../../../services/cis/domain/type.of.business.model';
import { CISMiscellaneousService } from './../../../services/cis/service-api/cis.misc.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrganizationService } from './../../../services/cis/service-api/organization.service';
import { OrganizationOwner } from './../organization/domain/organization.owner.model';
import { Address } from './../../../services/cis/domain/address.model';
import { Organization, OrganizationType } from './../../../services/cis/domain/organization.model';
import { NotificationService } from './../../../common/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CISService } from './../../../services/cis/service-api/cis.service';
import { BaseComponent } from './../../../common/components/base.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { mapper } from '../organization/domain/organization.mapper';
import { orgMapper, orgOwnerMapper } from '../organization/domain/organization.servermodel.mapper';
import { AbabilCustomValidators } from '../../../common/validators/ababil.custom.validators';
import * as profileCode from '../../../common/constants/app.profile.code.constants';
import * as ababilValidators from '../../../common/constants/app.validator.constants';
@Component({
    selector: 'subject-organization',
    templateUrl: './subject.organization.component.html'
})
export class SubjectOrganizationComponent extends BaseComponent implements OnInit {

    id: number;
    customerId: number;
    applicantId: number;
    organizationId: number;
    ownerTypeId: number;
    organization: Organization = new Organization();
    sharedPercentage: number = 0;
    maxAssignableShare: number = 100;

    @ViewChild('businessAddressComponent') businessAddressComponent;
    @ViewChild('factoryAddressComponent') factoryAddressComponent;
    @ViewChild('registeredAddressComponent') registeredAddressComponent;
    @ViewChild('docComponent') documentComponent: any;

    businessAddress: Address = new Address();
    factoryAddress: Address = new Address();
    registeredAddress: Address = new Address();
    presentAddressCheckerStatus: boolean = false;
    factoryAddressCheckerStatus: boolean = false;

    upperLimit: number = 100;
    lowerLimit: number = 0;
    customerName: string;

    organizationForm: FormGroup;
    typeOfBusiness: TypeOfBusiness[];
    organizationTypes: OrganizationType[] = [];
    balanceLength: number = ababilValidators.balanceLength;

    clientId: string;
    profileCode: string = profileCode.ORGANIZATION_PROFILE_CODE;

    constructor(private cisService: CISService,
        private route: ActivatedRoute,
        private router: Router,
        private notificationService: NotificationService,
        private organizationService: OrganizationService,
        private location: Location,
        private formBuilder: FormBuilder,
        private cisMiscellaneousService: CISMiscellaneousService) {
        super();
    }

    ngOnInit() {
        this.organization = new Organization();
        this.prepareOrganizationForm();
        this.getCustomerTypeOfBusiness();
        this.subscribers.routeSub = this.route.queryParams.subscribe(params => {
            this.id = params['id'] == undefined ? null : +params['id'];
            this.customerId = +params['customerId'];
            this.organizationId = +params['organizationId'];
            this.customerName = params['customerName'];
            this.ownerTypeId = params['ownerTypeId'];
            this.loadAssignableShare(this.id);
        });
        this.fetchOrganizationTypes();
    }

    loadAssignableShare(id: number) {
        let urlSearchMap = new Map();
        if (id != null) urlSearchMap.set("ownerId", id);
        this.subscribers.fetchAssignableShareSub = this.organizationService.fetchAssignableShare({ organizationId: this.organizationId }, urlSearchMap)
            .subscribe(
                data => {
                    this.upperLimit = data.upperLimit;
                    this.lowerLimit = data.lowerLimit;
                    if (id != null) this.fetchOwnerDetails();
                }
            );
    }

    prepareOrganizationForm() {
        this.businessAddress = this.organization.businessAddress;
        this.factoryAddress = this.organization.factoryAddress;
        this.registeredAddress = this.organization.registeredAddress;

        this.organizationForm = this.formBuilder.group({
            orgName: [this.organization.name, [Validators.required, ababilValidators.companyNameValidator, Validators.maxLength(50)]],
            orgType: [this.organization.organizationTypeId, [Validators.required]],
            orgContactPhoneNumber: [this.organization.contactInformation.phoneNumber, [Validators.maxLength(13), ababilValidators.phoneNumberValidator]],
            orgContactMobileNumber: [this.organization.contactInformation.mobileNumber, [Validators.required, Validators.minLength(11), Validators.maxLength(13)]],
            orgContactAlternateMobileNumber: [this.organization.contactInformation.alternateMobileNumber, [Validators.minLength(11), Validators.maxLength(13)]],
            orgContactEmail: [this.organization.contactInformation.email, [ababilValidators.emailValidator]],
            orgContactFax: [this.organization.contactInformation.fax, [ababilValidators.faxValidator]],
            orgBusinessDetailsPermanentManpower: [this.organization.businessDetails.permanentManpower, [Validators.min(0)]],
            orgBusinessDetailsContractualManpower: [this.organization.businessDetails.contractualManpower, [Validators.min(0)]],
            orgBusinessDetailsNetWorth: [this.organization.businessDetails.netWorth, [AbabilCustomValidators.isNumber]],
            orgBusinessDetailsMonthlyTurnover: [this.organization.businessDetails.monthlyTurnover, [AbabilCustomValidators.isNumber]],
            orgBusinessDetailsTypeOfBusiness: [this.organization.businessDetails.typeOfBusinesses],
            orgBusinessDetailsOtherInfo: [this.organization.businessDetails.otherInformation, [Validators.maxLength(50)]],
            factoryAdressAsPresentChceker: null,
            registeredAdressAsPresentChceker: null,
            registeredAddressAsFactoryChceker: null
        });

        this.organizationForm.get('factoryAdressAsPresentChceker').valueChanges.subscribe(data => {
            this.factoryAddress = data ? this.businessAddressComponent.extractData() : new Address();
        });

        this.organizationForm.get('registeredAdressAsPresentChceker').valueChanges.subscribe(data => {
            if (data) {
                this.registeredAddress = this.businessAddressComponent.extractData();
                this.presentAddressCheckerStatus = true;
            } else {
                this.registeredAddress = new Address();
                this.presentAddressCheckerStatus = false;
            }
        });

        this.organizationForm.get('registeredAddressAsFactoryChceker').valueChanges.subscribe(data => {
            if (data) {
                this.registeredAddress = this.factoryAddressComponent.extractData();
                this.factoryAddressCheckerStatus = true;
            }
            else {
                this.registeredAddress = new Address();
                this.factoryAddressCheckerStatus = false;
            }
        });
    }

    onSelect(organizationId) {
        this.fetchOrganizationDetails(organizationId);
    }

    fetchOrganizationDetails(organizationId: number) {
        this.subscribers.fetchOrganizationDetails = this.organizationService
            .fetchOrganizationDetails({ organizationId: organizationId + "" })
            .subscribe(data => {
                this.organization = data;
                this.clientId = this.organization.uuid;
                this.prepareOrganizationForm();
            });
    }

    markAsTouched() {
        this.markFormGroupAsTouched(this.organizationForm);
        this.businessAddressComponent.markAsTouched();
        this.registeredAddressComponent.markAsTouched();
        this.factoryAddressComponent.markAsTouched();
    }

    save() {
        this.markAsTouched();
        this.documentComponent.markDocumentFormsAsTouched();
        if (this.isFormsInvalid() || this.documentComponent.isFormInvalid()) {
            return;
        }
        this.mapFormValues();
        //let organiationObj: Organization = mapper(this.organization);
        let organizationOwner = new OrganizationOwner(this.organization, this.ownerTypeId, this.sharedPercentage);
        organizationOwner.id = this.id;
        organizationOwner.organizationTypeId = this.organization.organizationTypeId;
        organizationOwner.sharePercentage = this.sharedPercentage;
        organizationOwner.documents = this.documentComponent.extractFormData();
        organizationOwner.businessAddress = this.businessAddressComponent.extractData();
        organizationOwner.factoryAddress = this.factoryAddressComponent.extractData();
        organizationOwner.registeredAddress = this.registeredAddressComponent.extractData();
        this.id == null ? this.saveOwner(organizationOwner) : this.updateOwner(organizationOwner);
    }

    //jj block
    mapFormValues() {
        this.organization.name = this.organizationForm.get('orgName').value;
        this.organization.organizationTypeId = this.organizationForm.get('orgType').value;
        this.organization.contactInformation.phoneNumber = this.organizationForm.get('orgContactPhoneNumber').value;
        this.organization.contactInformation.mobileNumber = this.organizationForm.get('orgContactMobileNumber').value;
        this.organization.contactInformation.alternateMobileNumber = this.organizationForm.get('orgContactAlternateMobileNumber').value;
        this.organization.contactInformation.email = this.organizationForm.get('orgContactEmail').value;
        this.organization.contactInformation.fax = this.organizationForm.get('orgContactFax').value;
        this.organization.businessDetails.permanentManpower = this.organizationForm.get('orgBusinessDetailsPermanentManpower').value;
        this.organization.businessDetails.contractualManpower = this.organizationForm.get('orgBusinessDetailsContractualManpower').value;
        this.organization.businessDetails.netWorth = this.organizationForm.get('orgBusinessDetailsNetWorth').value;
        this.organization.businessDetails.monthlyTurnover = this.organizationForm.get('orgBusinessDetailsMonthlyTurnover').value;
        this.organization.businessDetails.otherInformation = this.organizationForm.get('orgBusinessDetailsOtherInfo').value;
        this.organization.businessDetails.typeOfBusinesses = this.organizationForm.get('orgBusinessDetailsTypeOfBusiness').value;

    }

    fetchOwnerDetails() {
        this.subscribers.fetchOwnerDetailsSub = this.organizationService.fetchOwnerDetails({ organizationId: this.organizationId + "", id: this.id + "" })
            .subscribe(data => {
                this.organization = orgOwnerMapper(data);
                this.id = data.id;
                this.clientId = this.organization.uuid;
                this.sharedPercentage = data.sharePercentage;
                this.businessAddress = this.organization.businessAddress;
                this.factoryAddress = this.organization.factoryAddress;
                this.registeredAddress = this.organization.registeredAddress;
                this.prepareOrganizationForm();
            });
    }

    fetchOrganizationTypes() {
        this.subscribers.fetchOrganizationTypesSub = this.cisService.fetchOrganizationTypes()
            .subscribe(data => this.organizationTypes = data);
    }

    saveOwner(organizationOwner: OrganizationOwner) {
        this.subscribers.saveOwnerSub = this.organizationService.addOwner
            (organizationOwner, { organizationId: this.organizationId + "" }).
            subscribe(
                data => {
                    this.notificationService.sendSuccessMsg("owner.save.success");
                    this.navigateAway()
                }
            );
    }

    updateOwner(organizationOwner: OrganizationOwner) {
        this.subscribers.createOwnerSub = this.organizationService.updateOwner(
            organizationOwner, { organizationId: this.organizationId + "", ownerId: organizationOwner.id + "" }
        ).subscribe(data => {
            this.notificationService.sendSuccessMsg("owner.update.success");
            this.navigateAway();
        }
        );
    }

    addDocument() {
        this.router.navigate(['/customer/document'], {
            queryParams: { routeback: this.currentPath(this.location), resourceType: 'ORGANIZATION' },
            queryParamsHandling: 'merge'
        });
    }

    isFormsInvalid() {
        return this.organizationForm.invalid || this.businessAddressComponent.isInvalid() || this.factoryAddressComponent.isInvalid() || this.registeredAddressComponent.isInvalid();
    }

    navigateAway() {
        this.router.navigate(['/customer/organization-details'], {
            queryParams: { customerId: this.customerId, applicantId: this.organizationId, customerName: this.customerName }
        });
    }

    getCustomerTypeOfBusiness() {
        this.cisMiscellaneousService.getCustomerTypeOfBusiness()
            .subscribe(data => {
                this.typeOfBusiness = data;
            });
    }

    cancel() {
        this.navigateAway();
    }
}