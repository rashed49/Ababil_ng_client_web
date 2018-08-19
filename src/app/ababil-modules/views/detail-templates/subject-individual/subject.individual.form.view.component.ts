import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';
import { of } from 'rxjs';
import { Customer } from '../../../../services/cis/domain/customer.model';
import { OrganizationService } from '../../../../services/cis/service-api/organization.service';
import { ApplicantType } from '../../../../services/cis/domain/applicant.type.model';
import { IndividualInformation } from '../../../../services/cis/domain/individual.model';
import { NotificationService } from '../../../../common/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationStrategy, Location } from '@angular/common';
import { CISService } from '../../../../services/cis/service-api/cis.service';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import * as commandConstants from '../../../../common/constants/app.command.constants';
import { FatcaCisIndividualInformation } from '../../../../services/cis/domain/fatca.cis.individual.information';
import { CISMiscellaneousService } from '../../../../services/cis/service-api/cis.misc.service';
import { Document } from '../../../../services/document/domain/document.models';
import { SelectItem } from 'primeng/api';
import { ViewsBaseComponent } from '../../view.base.component';
import * as profileCodes from '../../../../common/constants/app.profile.code.constants';
import { map } from 'rxjs/operators';
export const DETAILS_UI: string = "views/personal-customer";
export const ACTIVATION_SUCCESS_MSG: string[] = ["customer.active.success", "approval.requst.success"];

@Component({
    selector: 'subject-individual-view',
    templateUrl: './subject.individual.form.view.component.html',
    styleUrls: ['./subject.individual.form.view.css']
})
export class SubjectIndividualViewComponent extends ViewsBaseComponent implements OnInit {

    @HostListener("window:scroll", [])
    onWindowScroll() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("goToTop").style.display = "block";
        } else {
            document.getElementById("goToTop").style.display = "none";
        }
    }

    @ViewChild('subjectFormComponent') individualComponent: any;
    @ViewChild('applicantTypeForm') applicantTypeForm: any;
    @ViewChild('fatcaComponent') fatcaComponent: any;
    @ViewChild('individualDoc') docComponent: any;

    customerType: string;
    id: number;
    customerId: number;
    organizationId: number;
    ownerTypeId: number;

    subjectFormData: IndividualInformation;
    applicantTypeId = null;
    sharedPercentage: number = 0;

    maxAssignableShare: number = 100;

    upperLimit: number = 100;
    lowerLimit: number = 0;

    applicantTypes: ApplicantType[];

    panelHeader: string;
    customerName: string;
    customer: Customer;

    existingSubject: boolean = false;
    customerActive: boolean = false;
    command: string = commandConstants.ACTIVATE_CUSTOMER_COMMAND;

    //guardianInfo
    guardianDetails: IndividualInformation = new IndividualInformation();
    guardiansFullName: string = " ";
    guardianId: number;
    individualDetails: IndividualInformation = new IndividualInformation();
    relationWithAccountHolder: string;
    fatcaCisIndividualInformation: FatcaCisIndividualInformation = new FatcaCisIndividualInformation();
    guardianFormData: IndividualInformation = new IndividualInformation();
    foreignAccountTaxComplianceActs: number[] = [];

    documents: Document[] = [];
    clientId: string;

    profileCode: string = profileCodes.INDIVIDUAL_PROFILE_CODE;
    guardianChecker: boolean = false;
    guardianDisplayHidden: boolean = false;

    view: string = "IND";

    constructor(private cisService: CISService, private url: LocationStrategy,
        private route: ActivatedRoute, protected router: Router,
        protected notificationService: NotificationService, private organizationService: OrganizationService,
        protected location: Location, protected approvalFlowService: ApprovalflowService,
        private cisMiscellaneousService: CISMiscellaneousService
    ) {
        super(location, router, approvalFlowService, notificationService);
    }

    views: SelectItem[] = [{ label: 'Guardian', value: 'GUARDIAN' }, { label: 'Fatca', value: 'FATCA' }, { label: 'Document', value: 'DOC' }, { label: 'Individual', value: 'INDIVIDUAL' }];
    ngOnInit() {
        this.showVerifierSelectionModal = of(false);
        this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(params => {
            this.id = params['id'] == undefined ? null : +params['id'];
            this.processId = params['taskId'];
            this.customerType = params['customerType'];
            this.customerId = +params['customerId'];
            this.organizationId = +params['organizationId'];
            this.customerName = params['customerName'];
            this.ownerTypeId = params['ownerTypeId'];
            this.existingSubject = params['existing'] == undefined ? false : params['existing'];
            this.fetchCustomer();//redundant
            switch (this.customerType) {
                case 'INDIVIDUAL':
                    this.panelHeader = 'Individual Information: ' + this.customerName;
                    this.loadIndividual();
                    break;
                case 'ORGANIZATION':
                    this.panelHeader = 'Organization Owner: ' + this.customerName;
                    this.loadAssignableShare(this.id);
                    break;
                case 'JOINT':
                    this.panelHeader = 'Applicant Information: ' + this.customerName;
                    this.loadJointSubject();
                    break;
            }

            this.fetchApplicantTypes();
        });
    }

    fetchCustomer() {
        this.subscribers.fetchCustomerSub = this.cisService.
            fetchCustomer({ id: this.customerId + "" }).
            subscribe(
                data => {
                    this.customerActive = data.active;
                });
    }


    loadAssignableShare(id: number) {
        let urlSearchMap = new Map();
        if (id != null) urlSearchMap.set("ownerId", id);
        this.subscribers.fetchAssignableShareSub = this.organizationService.fetchAssignableShare({ organizationId: this.organizationId }, urlSearchMap)
            .subscribe(
                data => {
                    this.upperLimit = data.upperLimit;
                    this.lowerLimit = data.lowerLimit;
                    if (id != null) this.loadOrganizationOwnerIndividual();
                });
    }

    loadIndividual() {
        if (this.id == null) {
            this.subjectFormData = new IndividualInformation();
            this.guardianChecker = true;
            return;
        }
        this.subscribers.loadIndividualSub = this.cisService.fetchIindividualInformationDetails({ id: this.id })
            .subscribe(data => {
                this.subjectFormData = data;
                this.fatcaCisIndividualInformation = this.subjectFormData.fatcaCisIndividualInformation;
                this.foreignAccountTaxComplianceActs = [...this.subjectFormData.foreignAccountTaxComplianceActIds];
                this.clientId = this.subjectFormData.uuid;


                this.fetchPrevGuardianDetails(this.subjectFormData.guardianId);
                if (this.subjectFormData.guardianId) { this.guardianId = +this.subjectFormData.guardianId; }
                this.guardianChecker = false;;
                console.log(this.subjectFormData);
            });
    }

    loadJointSubject() {
        if (this.id == null) {
            this.subjectFormData = new IndividualInformation();
            this.applicantTypeId = 1;
            return;
        }
        this.subscribers.fetchSubjectDetailsSub = this.cisService.fetchSubjectDetails({ id: this.customerId + "", subjectId: this.id + "" })
            .subscribe(
                data => {
                    this.subjectFormData = data;
                    this.applicantTypeId = data.applicantTypeId;
                    console.log(this.subjectFormData);
                });
    }

    loadOrganizationOwnerIndividual() {
        if (this.id == null) {
            this.subjectFormData = new IndividualInformation();
        } else {
            this.subscribers.fetchOwnerDetailsSub = this.organizationService.fetchOwnerDetails({ organizationId: this.organizationId + "", id: this.id + "" })
                .subscribe(data => {
                    this.sharedPercentage = data.sharePercentage;
                    this.subjectFormData = data;
                    console.log(this.subjectFormData);
                });
        }
    }



    navigateAway() {
        switch (this.customerType) {
            case 'INDIVIDUAL':
                if (this.customerActive) {
                    this.router.navigate(['/customer/personal', this.customerId], { queryParams: { customerName: this.customerName } });
                } else {
                    this.router.navigate(['/customer']);
                }
                break;

            case 'JOINT':
                if (this.customerActive) {
                    this.router.navigate(['/customer/joint', this.customerId],
                        {
                            queryParams: { customerName: this.customerName }
                        });
                } else {
                    // this.router.navigate(['/customer/joint/form', this.customerId]);
                    this.cisService.fetchSubjects({ id: this.customerId + '' }).subscribe(
                        data => {
                            if (data.length > 0) {
                                this.router.navigate(['/customer/joint/form', this.customerId]);
                            } else {
                                this.router.navigate(['/customer']);
                            }
                        });
                }
                break;

            case 'ORGANIZATION':
                if (this.customerActive) {
                    this.router.navigate(['/customer/organization-details'],
                        {
                            queryParams: { customerName: this.customerName, customerId: this.customerId, applicantId: this.organizationId }
                        });
                } else {
                    this.router.navigate(['/customer']);
                }
                break;
        }
    }

    fetchApplicantTypes() {
        let urlSearchParam = new Map();
        if (this.id) urlSearchParam.set('subjectId', this.id);
        this.subscribers.fetchApplicationTypeSub = this.cisService.fetchApplicationTypeByCusId({ cusId: this.customerId }, urlSearchParam).subscribe(
            data => {
                this.applicantTypes = data;
            }
        );
    }

    //guardian


    fetchPrevGuardianDetails(individualId: number) {
        this.subscribers.fetchIndividualDetails = this.cisService
            .fetchIindividualInformationDetails({ id: individualId + "" })
            .pipe(map(individual => {
                this.guardianFormData = individual;
                this.guardiansFullName = this.getFullName(this.guardianFormData.firstName, this.guardianFormData.middleName, this.guardianFormData.lastName);
                this.relationWithAccountHolder = this.subjectFormData.relationWithGuardian;
            })).subscribe();
    }

    fetchGuardianDetails(individualId: number) {
        this.subscribers.fetchIndividualDetails = this.cisService
            .fetchIindividualInformationDetails({ id: individualId + "" })
            .pipe(map(individual => {
                this.guardianDetails = individual;
                this.guardianId = this.guardianDetails.id;
                this.guardiansFullName = this.getFullName(this.guardianDetails.firstName, this.guardianDetails.middleName, this.guardianDetails.lastName);
            })).subscribe();
    }

    getFullName(firstName: string, middleName: string, lastName: string): string {
        let name: string = '';
        name = name + (firstName ? firstName : "") + " " + (middleName ? middleName : "") + " " + (lastName ? lastName : "");
        name = name.trim();
        return name;
    }


    addGuardian() {
        this.view = "GUARD";
        this.goToTop();
    }


    guardianBack(event) {
        if (event) {
            this.view = "IND";
        }
    }
    onAgeCheck(event) {
        this.subscribers.fetchBaseCountryIdSub = this.cisMiscellaneousService.getConfiguration({ key: 'MINOR_AGE_LIMIT' }).subscribe(
            data => {
                if (data) {
                    if (data.value < event) {
                        this.guardianDisplayHidden = true;
                    }
                    else {
                        this.guardianDisplayHidden = false;
                    }
                }
            }
        )
    }

    goToTop() {

        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    documentShow() {
        this.view = 'DOCUMENT';
    }


    infoShow() {
        this.individualComponent.calculateAge();
        this.view = 'INDIVIDUAL';
    }

}