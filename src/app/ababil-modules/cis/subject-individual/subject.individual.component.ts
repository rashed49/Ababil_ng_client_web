import { ApprovalflowService } from './../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from './../../../common/components/base.form.component';
import { VerifierSelectionEvent } from './../../../common/components/verifier-selection/verifier.selection.component';
import { of } from 'rxjs';
import { map }from 'rxjs/operators';
import { Customer } from './../../../services/cis/domain/customer.model';
import { IndividualOwner } from './../organization/domain/individual.owner.model';
import { OrganizationService } from './../../../services/cis/service-api/organization.service';
import { ApplicantType } from './../../../services/cis/domain/applicant.type.model';
import { IndividualInformation } from './../../../services/cis/domain/individual.model';
import { NotificationService } from './../../../common/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationStrategy, Location } from '@angular/common';
import { CISService } from './../../../services/cis/service-api/cis.service';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import * as commandConstants from '../../../common/constants/app.command.constants';
import { FatcaCisIndividualInformation } from '../../../services/cis/domain/fatca.cis.individual.information';
import { CISMiscellaneousService } from '../../../services/cis/service-api/cis.misc.service';
import { Document } from '../../../services/document/domain/document.models';
import { SelectItem } from 'primeng/api';
import * as profileCodes from '../../../common/constants/app.profile.code.constants';
export const DETAILS_UI: string = "views/subject-individual";
export const ACTIVATION_SUCCESS_MSG: string[] = ["customer.active.success", "approval.requst.success"];

@Component({
    selector: 'subject-individual',
    templateUrl: './subject.individual.component.html',
    styleUrls: ['./subject.individual.component.css']
})
export class SubjectIndividualComponent extends FormBaseComponent implements OnInit {

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
    id: number = null;
    customerId: number = null;
    organizationId: number = null;
    ownerTypeId: number = null;

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
    isMinor: boolean = false;

    view: string = "IND";

    @ViewChild('applicantTypeControl') applicantTypeControl: any;

    constructor(private cisService: CISService, private url: LocationStrategy,
        private route: ActivatedRoute, private router: Router,
        private notificationService: NotificationService, private organizationService: OrganizationService,
        protected location: Location, protected approvalFlowService: ApprovalflowService,
        private cisMiscellaneousService: CISMiscellaneousService) {
        super(location, approvalFlowService);
    }

    views: SelectItem[] = [{ label: 'Guardian', value: 'GUARDIAN' }, { label: 'Fatca', value: 'FATCA' }, { label: 'Document', value: 'DOC' }, { label: 'Individual', value: 'INDIVIDUAL' }];
    ngOnInit() {
        this.showVerifierSelectionModal = of(false);
        this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(params => {
            this.id = params['id'] == undefined ? null : +params['id'];
            this.taskId = params['taskId'];
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
                this.guardianChecker = false;
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

                    this.fatcaCisIndividualInformation = this.subjectFormData.fatcaCisIndividualInformation;
                    this.foreignAccountTaxComplianceActs = [...this.subjectFormData.foreignAccountTaxComplianceActIds];

                    this.applicantTypeId = data.applicantTypeId;
                    this.clientId = this.subjectFormData.uuid;
                    this.fetchPrevGuardianDetails(this.subjectFormData.guardianId);
                    if (this.subjectFormData.guardianId) { this.guardianId = +this.subjectFormData.guardianId; }
                    this.guardianChecker = false;
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

    submit() {

        this.fatcaComponent.markAsTouched();
        this.individualComponent.markAsTouched();
        this.docComponent.markDocumentFormsAsTouched();
        if (this.individualComponent.formInvalid() || this.fatcaComponent.formInvalid() || this.docComponent.isFormInvalid()) {
            return;
        }
        let subject;
        switch (this.customerType) {
            case 'INDIVIDUAL':
                subject = this.individualComponent.extractData();
                subject.id = this.id;

                if (this.guardianId) {
                    subject.guardianId = this.guardianId;
                    subject.relationWithGuardian = this.relationWithAccountHolder;
                }
                subject.fatcaCisIndividualInformation = this.fatcaComponent.extractFatcaCisIndividualInformation();
                subject.foreignAccountTaxComplianceActIds = this.fatcaComponent.extractforeignAccountTaxComplianceActs();
                subject.documents = this.docComponent.extractFormData();
                console.log(JSON.stringify(subject));
                this.id ? this.updateSubject(subject) : this.saveSubject(subject);
                break;
            case 'ORGANIZATION':
                subject = this.individualComponent.extractData();
                subject.id = this.id;

                subject.ownerTypeId = this.ownerTypeId;
                if (this.guardianId) {
                    subject.guardianId = this.guardianId;
                    subject.relationWithGuardian = this.relationWithAccountHolder;
                }
                subject.fatcaCisIndividualInformation = this.fatcaComponent.extractFatcaCisIndividualInformation();
                subject.foreignAccountTaxComplianceActIds = this.fatcaComponent.extractforeignAccountTaxComplianceActs();
                subject.documents = this.docComponent.extractFormData();

                this.id ? this.updateOrganizationOwner(subject) : this.saveOrganizationOwner(subject);
                break;
            case 'JOINT':
                subject = this.individualComponent.extractData();
                subject.id = this.id;

                subject.fatcaCisIndividualInformation = this.fatcaComponent.extractFatcaCisIndividualInformation();
                subject.foreignAccountTaxComplianceActIds = this.fatcaComponent.extractforeignAccountTaxComplianceActs();
                subject.documents = this.docComponent.extractFormData();
                if (!this.applicantTypeId) {
                    console.log(this.applicantTypeControl);
                    return;
                }
                if (this.guardianId) {
                    subject.guardianId = this.guardianId;
                    subject.relationWithGuardian = this.relationWithAccountHolder;
                }
                subject.applicantTypeId = this.applicantTypeId;
                this.id ? this.updateSubject(subject) : this.saveSubject(subject);
                break;
        }
    }

    saveSubject(subject: any) {
        this.subscribers.saveSubjectSub = this.cisService.addSubject(subject, { id: this.customerId + "" })
            .subscribe(
                data => {
                    this.notificationService.sendSuccessMsg('subject.save.success');
                    const urlTree = this.router.createUrlTree([], {
                        queryParams: { id: data.content },
                        queryParamsHandling: "merge",
                        preserveFragment: true
                    });
                    this.router.navigateByUrl(urlTree);
                });
    }

    updateSubject(subject: any) {
        if (this.existingSubject) {
            this.subscribers.addExistingSubject = this.cisService.addExistingSubject(subject, { id: this.customerId + "", subjectId: subject.id + "" })
                .subscribe(
                    data => {
                        this.notificationService.sendSuccessMsg('subject.update.success');
                        if (this.customerActive) this.navigateAway();
                    }
                );

        } else {
            this.subscribers.updateSubjectSub = this.cisService.updateSubject(subject, { id: this.customerId + "", subjectId: subject.id + "" })
                .subscribe(
                    data => {
                        this.notificationService.sendSuccessMsg('subject.update.success');
                        if (this.customerActive) this.navigateAway();
                    }
                );
        }

    }

    saveOrganizationOwner(subject: any) {
        let individualOwner: IndividualOwner = new IndividualOwner(subject);
        individualOwner.setSharePercentage(this.sharedPercentage);
        individualOwner.id = this.id;
        this.subscribers.saveOwnerSub = this.organizationService.addOwner
            (individualOwner, { organizationId: this.organizationId + "" }).
            subscribe(data => {
                this.notificationService.sendSuccessMsg('subject.save.success');
                const urlTree = this.router.createUrlTree([], {
                    queryParams: { id: data.content },
                    queryParamsHandling: "merge",
                    preserveFragment: true
                });
                this.router.navigateByUrl(urlTree);
            });
    }

    updateOrganizationOwner(subject: any) {
        let individualOwner: IndividualOwner = new IndividualOwner(subject);
        individualOwner.setSharePercentage(this.sharedPercentage);
        individualOwner.id = this.id;
        this.subscribers.saveOwnerSub = this.organizationService.updateOwner
            (individualOwner, { organizationId: this.organizationId + "", ownerId: this.id + "" }).
            subscribe(
                data => {
                    this.notificationService.sendSuccessMsg('subject.update.success');
                    if (this.customerActive) this.navigateAway();
                }
            );
    }

    activate() {
        this.showVerifierSelectionModal = of(true);
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let view_ui = DETAILS_UI.concat("?id=").concat(`${this.id}`.toString() + "&customerType=" + this.customerType +
            "&customerId=" + `${this.customerId}`.toString() + "&organizationId=" + `${this.organizationId}`.toString() + "&customerName=" + this.customerName + "&ownerTypeId=" + `${this.ownerTypeId}`.toString() +
            "&existingSubject=" + this.existingSubject).concat("&");
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));
        this.cisService.activateCustomer(this.customerId, urlSearchParams)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg(ACTIVATION_SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
                this.navigateAway();
            });
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
                    this.router.navigate(['/customer/organization', this.customerId]);
                } else {
                    this.router.navigate(['/customer/organization-details'],
                        {
                            queryParams: { customerName: this.customerName, customerId: this.customerId, applicantId: this.organizationId }
                        });
                }
                break;
        }
    }

    addDocument() {
        // this.router.navigate(['/document'], {
        //     queryParams: { docRouteBack: this.currentPath(this.location), profileCode: PROFILE_CODE, clientId: this.id },
        //     queryParamsHandling: 'merge'
        // });
    }

    formInvalid() {
        if (!this.customerType) return true;
        if (!this.individualComponent) return true;
        switch (this.customerType) {
            case 'INDIVIDUAL':
                return this.individualComponent.formInvalid();
            case 'JOINT':
                return this.individualComponent.formInvalid() || this.applicantTypeId == null || this.applicantTypeId == 0;
            case 'ORGANIZATION':
                return this.individualComponent.formInvalid();
            default:
                return true;
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

    cancel() {
        this.navigateAway();
    }

    onSelect(individualId) {
        this.fetchIndividualDetails(individualId);
    }
    fetchIndividualDetails(individualId: number) {
        this.subscribers.fetchIndividualDetails = this.cisService
            .fetchIindividualInformationDetails({ id: individualId + "" })
            .pipe(map(individual => {
                this.individualDetails = individual;
                this.subjectFormData = this.individualDetails;
                this.fatcaCisIndividualInformation = this.subjectFormData.fatcaCisIndividualInformation ? this.subjectFormData.fatcaCisIndividualInformation : new FatcaCisIndividualInformation();
                this.foreignAccountTaxComplianceActs = this.subjectFormData.foreignAccountTaxComplianceActIds ? this.subjectFormData.foreignAccountTaxComplianceActIds : [];
                this.clientId = this.subjectFormData.uuid.toString();
                if (this.subjectFormData.guardianId) {
                    this.guardianId = this.subjectFormData.guardianId;
                    this.fetchGuardianDetails(this.guardianId);
                }
            })).subscribe();
    }

    //guardian
    onGuardianSelect(individualId) {
        this.fetchGuardianDetails(individualId);
    }


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
                this.guardianFormData = individual;
                this.guardianId = this.guardianFormData.id;
                this.guardiansFullName = this.getFullName(this.guardianFormData.firstName, this.guardianFormData.middleName, this.guardianFormData.lastName);
                this.relationWithAccountHolder = this.subjectFormData.relationWithGuardian;
            })).subscribe();
    }

    getFullName(firstName: string, middleName: string, lastName: string): string {
        let name: string = '';
        name = name + (firstName ? firstName : "") + " " + (middleName ? middleName : "") + " " + (lastName ? lastName : "");
        name = name.trim();
        return name;
    }

    // showFatca() {
    //     this.fatcaDisplayHidden = false;
    //     this.individualFormDisplayHidden = true;
    //     this.guardianDisplayHidden = true;
    //     this.documentFormDisplayHidden = true;

    // }
    // showGuardian() {
    //     this.guardianFormDisplayHidden = false;
    //     this.individualFormDisplayHidden = true;
    //     this.documentFormDisplayHidden = true;

    // }
    // returnFromFatca() {
    //     this.fatcaDisplayHidden = true;
    //     this.individualFormDisplayHidden = false;
    //     this.documentFormDisplayHidden = true;
    //     this.individualComponent.calculateAge();
    // }
    addGuardian() {
        this.view = "GUARD";
        this.goToTop();
    }


    onNewGuardianAdded(event) {
        if (event !== -1) {
            this.guardianId = event;
            this.fetchGuardianDetails(event)
        }
        this.view = "IND";
        this.individualComponent.calculateAge();
    }
    onAgeCheck(event) {
        this.subscribers.fetchBaseCountryIdSub = this.cisMiscellaneousService.getConfiguration({ key: 'MINOR_AGE_LIMIT' }).subscribe(
            data => {
                if (data) {
                    if (data.value < event) {
                        this.isMinor = false;
                    }
                    else {
                        this.isMinor = true;
                    }
                }
            }
        )
    }

    goToTop() {

        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    documentShow() {

        // this.individualDocumentHidden = false;
        // this.infoHidden = true;
        // this.individualFormDisplayHidden = true;
        // this.guardianDisplayHidden = true;

        this.view = 'DOCUMENT';



    }


    infoShow() {

        // this.infoHidden = false;
        // this.individualDocumentHidden = true;
        // this.individualFormDisplayHidden = false;
        this.individualComponent.calculateAge();

        this.view = 'INDIVIDUAL';


    }
    tview() {
        this.view = "view";
    }
}