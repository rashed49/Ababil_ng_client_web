import { environment } from './../../../../../environments/environment';
import { TypeOfBusiness } from './../../../../services/cis/domain/type.of.business.model';
import { CISMiscellaneousService } from './../../../../services/cis/service-api/cis.misc.service';
import { OrganizationService } from './../../../../services/cis/service-api/organization.service';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationOwnerDto } from './../domain/organization.owner.dto';
import { Address } from './../../../../services/cis/domain/address.model';
import { ViewChild, Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Organization, OrganizationType } from '../../../../services/cis/domain/organization.model';
import { NotificationService } from '../../../../common/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CISService } from '../../../../services/cis/service-api/cis.service';
import { orgMapper } from '../domain/organization.servermodel.mapper';
import * as ababilValidators from '../../../../common/constants/app.validator.constants';
import { VerifierSelectionEvent } from '../../../../common/components/verifier-selection/verifier.selection.component';
import { Observable, of } from 'rxjs';
import * as commandConstants from '../../../../common/constants/app.command.constants';
import { FormBaseComponent } from '../../../../common/components/base.form.component';
import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';
import { OwnerTypeService } from '../../../../services/cis/service-api/owner.type.service';
import { AbabilCustomValidators } from '../../../../common/validators/ababil.custom.validators';
import { Customer } from '../../../../services/cis/domain/cis.models';
import * as profileCode from '../../../../common/constants/app.profile.code.constants';
import { SelectItem } from 'primeng/api';


export const DETAILS_UI: string = "views/organization-customer";
@Component({
    selector: 'organization-form',
    templateUrl: './organization.form.component.html'
})
export class OrganizationFormComponent extends FormBaseComponent implements OnInit {

    customerId: number;
    customerName: string;
    applicantId: number;
    organizationId: number;
    organization: Organization = new Organization();
    owners: OrganizationOwnerDto[] = [];
    organizationTypes: OrganizationType[] = [];

    ownerTypes: SelectItem[] = [];
    ownerTypeId: number;

    @ViewChild('businessAddressComponent') businessAddressComponent;
    @ViewChild('factoryAddressComponent') factoryAddressComponent;
    @ViewChild('registeredAddressComponent') registeredAddressComponent;
    @ViewChild('docComponent') documentComponent: any;

    businessAddress: Address = new Address();
    factoryAddress: Address = new Address();
    registeredAddress: Address = new Address();

    assignableShare: number = 0;
    organizationForm: FormGroup;
    typeOfBusiness: TypeOfBusiness[];
    imageApiUrl: string;
    organizationTypeId: number;
    presentAddressCheckerStatus: boolean = false;
    factoryAddressCheckerStatus: boolean = false;
    customer: Customer = new Customer();
    balanceLength: number = ababilValidators.balanceLength;

    clientId: string;
    profileCode: string = profileCode.ORGANIZATION_PROFILE_CODE;

    verifierSelectionModalVisible: Observable<boolean>;
    command: string = commandConstants.ACTIVATE_CUSTOMER_COMMAND;

    constructor(private route: ActivatedRoute, private router: Router,
        private formBuilder: FormBuilder, private modalService: NgbModal, protected location: Location,
        private notificationService: NotificationService,
        private cisService: CISService,
        private organizationService: OrganizationService,
        private ownerTypeService: OwnerTypeService,
        private cisMiscellaneousService: CISMiscellaneousService,
        protected approvalFlowService: ApprovalflowService) {
        super(location, approvalFlowService);
    }

    ngOnInit() {
        this.prepareOrganizationForm();
        this.getCustomerTypeOfBusiness();
        this.verifierSelectionModalVisible = of(false);
        this.imageApiUrl = environment.serviceapiurl + "/individuals";
        this.subscribers.routeSub = this.route.queryParams.subscribe(params => {
            this.customerId = +params['customerId'];
            this.applicantId = params['applicantId'] == undefined ? null : +params['applicantId'];
            this.customerName = params['customerName'];
            if (this.applicantId) {
                this.fetchOrganization();
            };
            if (this.applicantId) this.loadAssignableShare();
            if (this.customerId) this.fetchCustomer();
        });
        this.fetchOrganizationTypes();
    }

    loadAssignableShare() {
        let urlSearchMap = new Map();
        this.subscribers.fetchAssignableShareSub = this.organizationService
            .fetchAssignableShare({ organizationId: this.applicantId }, urlSearchMap)
            .subscribe(data => this.assignableShare = data.upperLimit);
    }

    prepareOrganizationForm() {
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
            orgBusinessDetailsMonthlyTurnover: [this.organization.businessDetails.monthlyTurnover],
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

    fetchOrganization() {
        this.subscribers.fetchSub = this.cisService
            .fetchSubjectDetails({ id: this.customerId + "", subjectId: this.applicantId + "" })
            .subscribe(data => {
                this.organizationId = data.id;
                this.clientId = data.uuid;
                this.organization = orgMapper(data);
                this.organizationTypeId = this.organization.organizationTypeId;
                this.prepareOrganizationForm();
                this.businessAddress = this.organization.businessAddress;
                this.registeredAddress = this.organization.registeredAddress;
                this.factoryAddress = this.organization.factoryAddress;
                this.fetchOwners();
                if (this.organizationTypeId) {
                    this.fetchOwnerTypes();
                }
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

    fetchCustomer() {
        this.subscribers.fetchCustomerSub = this.cisService
            .fetchCustomer({ id: this.customerId })
            .subscribe(data => {
                this.customer = data;
                this.organizationForm.get('orgName').setValue(this.customer.name);
            });
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
        this.organization.jsonType = 'organization';
        this.organization.businessAddress = this.businessAddressComponent.extractData();
        this.organization.registeredAddress = this.registeredAddressComponent.extractData();
        this.organization.factoryAddress = this.factoryAddressComponent.extractData();
        this.organization.documents = this.documentComponent.extractFormData();
        this.mapFormValues();
        this.organization.id ? this.updateOrganization() : this.saveOrganization();
    }

    saveOrganization() {
        this.subscribers.saveSubjectSub = this.cisService.addSubject
            (this.organization, { id: this.customerId + "" })
            .subscribe(
                data => {
                    this.notificationService.sendSuccessMsg("subject.save.success");
                    const urlTree = this.router.createUrlTree([], {
                        queryParams: { applicantId: data.content },
                        queryParamsHandling: "merge",
                        preserveFragment: true
                    });
                    this.router.navigateByUrl(urlTree);
                });
    }

    updateOrganization() {
        this.subscribers.updateSubjectSub = this.cisService.updateSubject
            (this.organization, { id: this.customerId + "", subjectId: this.organization.id + "" })
            .subscribe(
                data => {
                    this.notificationService.sendSuccessMsg("subject.update.success");
                    this.navigateAway();
                });
    }

    open(content: string, subject: string) {
        this.modalService.open(content).result.then((result) => {
            if (result === 'submit' && this.ownerTypeId) {
                if (subject === 'INDIVIDUAL') {
                    this.router.navigate(['/customer/subject-individual'], {
                        queryParams: { customerType: 'ORGANIZATION', customerName: this.customerName, id: null, customerId: this.customerId, organizationId: this.organizationId, ownerTypeId: this.ownerTypeId },
                        queryParamsHandling: 'merge'
                    });
                } else if (subject === 'ORGANIZATION') {
                    this.router.navigate(['/customer/subject-organization'], {
                        queryParams: { id: null, customerId: this.customerId, customerName: this.customerName, organizationId: this.organizationId, ownerTypeId: this.ownerTypeId },
                        queryParamsHandling: 'merge'
                    });
                }
            } else {
                this.ownerTypeId = null;
            }
        }, (reason) => {

        });
    }

    fetchOwnerTypes() {
        let urlSearchMap = new Map();
        urlSearchMap.set('organizationTypeId', this.organizationTypeId);
        this.subscribers.fetchOwnerTypesSub = this.ownerTypeService.fetchOwnerTypes(urlSearchMap)
            .subscribe(data => {
                this.ownerTypes = [{ label: "Select owner type", value: null }, ...data.map(owner => {
                    return { label: owner.name, value: owner.id };
                })];
            });
    }

    editOwner(owner: OrganizationOwnerDto) {
        if (owner.subjectType == "INDIVIDUAL") {
            this.router.navigate(['/customer/subject-individual'], {
                queryParams: { customerType: 'ORGANIZATION', customerName: this.customerName, id: owner.id, customerId: this.customerId, organizationId: this.organizationId },
                queryParamsHandling: 'merge'
            });
        } else if (owner.subjectType == "ORGANIZATION") {
            this.router.navigate(['/customer/subject-organization'], {
                queryParams: { id: owner.id, customerName: this.customerName, customerId: this.customerId, organizationId: this.organizationId },
                queryParamsHandling: 'merge'
            });
        }
    }

    deleteOwner(owner: OrganizationOwnerDto) {
        this.subscribers.removeOrganizationOwnerSub = this.organizationService
            .removeOrganizationOwner({ organizationId: this.organizationId, ownerId: owner.id })
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("organization.owner.remove.success");
                this.fetchOwners();
            });
    }

    isFormsInvalid() {
        return this.organizationForm.invalid || this.businessAddressComponent.isInvalid() || this.factoryAddressComponent.isInvalid() || this.registeredAddressComponent.isInvalid();
    }

    navigateAway() {
        if (this.organization.active) {
            this.router.navigate(['customer/organization', this.customerId]);
        } else {
            this.router.navigate(['/customer']);
        }
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

    onVerifierSelect(selectEvent: VerifierSelectionEvent) {
        let view_ui = DETAILS_UI.concat("?customerId=").concat(this.customerId.toString()).concat("&applicantId=").concat(this.applicantId.toString()).concat("&customerName=").concat(this.customerName.toString()).concat("&");
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, selectEvent.verifier, view_ui, this.location.path().concat("?"));

        this.cisService.activateCustomer(this.customerId, urlSearchParams)
            .subscribe(data => {
                selectEvent.approvalFlowRequired
                    ? this.notificationService.sendSuccessMsg("approval.requst.success")
                    : this.notificationService.sendSuccessMsg("customer.active.success");

                this.router.navigate(['customer/organization', this.customerId]);
            });
    }

    activate() {
        this.verifierSelectionModalVisible = of(true);
    }
}
