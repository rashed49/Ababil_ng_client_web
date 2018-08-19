import { BaseComponent } from '../../../common/components/base.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../../../common/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../../services/cis/domain/cis.models';
import { Observable, of } from 'rxjs';;
import { LocationStrategy } from '@angular/common';
import { Subject } from '../../../services/cis/domain/subject.model';
import { IndividualInformation } from '../../../services/cis/domain/individual.model';
import { CISService } from '../../../services/cis/service-api/cis.service';
import * as commandConstants from '../../../common/constants/app.command.constants';
import { VerifierSelectionEvent } from '../../../common/components/verifier-selection/verifier.selection.component';
import { MenuItem } from 'primeng/primeng';
import { DemandDepositAccountService } from '../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { Location } from '@angular/common';
import { ImageUploadService } from '../../../services/cis/service-api/image.upload.service';
import { environment } from '../../../../environments/environment';
import * as urlSearchParameterConstants from '../../../common/constants/app.search.parameter.constants';

export class DashBoardIndividualInfo {
    name: string;
    gender: string;
    email: string;
    cellPhone: string;
    presentAddress: string;
    permanentAddress: string;
    dob: string;

    constructor() {
        this.name = 'N/A';
        this.gender = 'N/A';
        this.email = 'N/A';
        this.cellPhone = 'N/A';
        this.presentAddress = 'N/A';
        this.permanentAddress = 'N/A';
        this.dob = 'N/A';
    }
}

@Component({
    selector: 'personal-customer',
    templateUrl: './personal.customer.component.html',
    styleUrls: ['./personal.customer.component.css']
})
export class PersonalCustomerComponent extends BaseComponent implements OnInit {
    imageApiUrl: string;
    verifierSelectionModalVisible: Observable<boolean>;

    @ViewChild('individualForm') individualComponent: any;
    @ViewChild('individualLookup') individualLookup: any;

    individualInfoFormData: any;
    individualSubject: any;//needed??
    dashboardIndividualInfo: DashBoardIndividualInfo = new DashBoardIndividualInfo();
    customer: Customer;
    customerId: number;
    addAccountItems: MenuItem[];

    isInactive: boolean = true;
    command: string = commandConstants.ACTIVATE_CUSTOMER_COMMAND;
    constructor(private cisService: CISService, private url: LocationStrategy,
        private route: ActivatedRoute, private router: Router,
        private notificationService: NotificationService,
        private depositAccountService: DemandDepositAccountService,
        private location: Location,
        private imageUploadService: ImageUploadService) {
        super();
    }

    ngOnInit() {
        this.customer = new Customer();
        this.individualInfoFormData = new IndividualInformation();
        this.verifierSelectionModalVisible = of(false);
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.customerId = +params['cusId'];
            this.fetchCustomer();
        });
        this.imageApiUrl = environment.serviceapiurl + "/individuals";
        this.initAccountMenus();
    }

    initAccountMenus() {
        this.addAccountItems = [
            {
                label: 'Demand Deposit', icon: 'ui-icon-toll', command: () => {
                    this.router.navigate(['/demand-deposit-account/create', { customerId: this.customerId }], {
                        queryParams: { cus: this.currentPath(this.location) }
                    });
                }
            },
            {
                label: 'Fixed Deposit', icon: 'ui-icon-business-center', command: () => {
                    this.router.navigate(['/fixed-deposit-account/create', { customerId: this.customerId }], {
                        queryParams: { cus: this.currentPath(this.location) }
                    });
                }
            },
            {
                label: 'Installment Deposit', icon: 'ui-icon-watch-later', command: () => {
                    this.router.navigate(['/recurring-deposit-account/create', { customerId: this.customerId }], {
                        queryParams: { cus: this.currentPath(this.location) }
                    });
                }
            },
            {
                label: 'Investment', icon: 'ui-icon-account-balance', command: () => {
                }
            }];
    }

    fetchCustomer() {
        this.subscribers.fetchCustomerSub = this.cisService.
            fetchCustomer({ id: this.customerId + "" }).
            subscribe(
            data => {
                this.prepareCustomer(data);
            }
            );
    }

    prepareCustomer(customer: Customer) {
        this.customer = customer;
        this.isInactive = !this.customer.active;
        this.fetchSingleCustomerSubject();

    }

    fetchSingleCustomerSubject() {
        this.subscribers.fetchSingleCustomerSubjectSub = this.cisService.fetchSubjects({ id: this.customerId + "" }).subscribe(
            data => {
                if (data.length > 0) {
                    this.individualSubject = data[0];
                    this.dashboardIndividualInfo.name = this.individualSubject.name;
                    this.fetchSubjectDetails(data[0]);
                } else {
                    this.individualInfoFormData = new IndividualInformation();
                }
            }
        )
    }

    fetchSubjectDetails(subject: Subject) {
        this.subscribers.fetchSubjectDetailsSub = this.cisService.fetchSubjectDetails({ id: this.customerId + "", subjectId: subject.id + "" })
            .subscribe(
            data => {
                this.individualInfoFormData = data;
                this.dashboardIndividualInfo.gender = this.individualInfoFormData.gender;
                this.dashboardIndividualInfo.email = this.individualInfoFormData.contactInformation.email;
                this.dashboardIndividualInfo.cellPhone = this.individualInfoFormData.contactInformation.mobileNumber;
                this.dashboardIndividualInfo.presentAddress = this.individualInfoFormData.presentAddress.addressLine1;
                this.dashboardIndividualInfo.permanentAddress = this.individualInfoFormData.permanentAddress.addressLine1;
                this.dashboardIndividualInfo.dob = this.individualInfoFormData.dateOfBirth;
            });
    }

    editSubject() {
        this.router.navigate(['/customer/subject-individual'],
            {
                queryParams: { routeBack: this.currentPath(this.location), customerType: 'INDIVIDUAL', id: this.individualSubject ? this.individualSubject.id : null, customerId: this.customerId, customerName: this.customer.name },
                queryParamsHandling: 'merge'
            }
        );
    }

    lookUpExistingIndividual() {
        this.individualLookup.display = true;
    }

    onExistingIndividualSelect(data) {
        console.log('Id:' + data);
        this.router.navigate(['/customer/subject-individual'],
            {
                queryParams: { routeBack: this.currentPath(this.location), customerType: 'INDIVIDUAL', id: data, customerId: this.customerId, customerName: this.customer.name, existing: true },
                queryParamsHandling: 'merge'
            }
        );
    }

    activate() {
        this.verifierSelectionModalVisible = of(true);
    }

    onVerifierSelect(selectEvent: VerifierSelectionEvent) {
        let urlSearchParams = new Map<string, string>();
        if (selectEvent.verifier != null) urlSearchParams.set(urlSearchParameterConstants.VERIFIER, selectEvent.verifier);
        urlSearchParams.set("view", "views/personal-customer?individualId=" + this.customer.applicantId);

        this.cisService.activateCustomer(this.customer.id, urlSearchParams)
            .subscribe(data => {
                if (selectEvent.approvalFlowRequired) {
                    this.notificationService.sendSuccessMsg("approval.requst.success");
                } else {
                    this.notificationService.sendSuccessMsg("customer.active.success");
                }
                this.navigateAway();
            });
    }

    // addDocument() {
    //     this.router.navigate(['/document'], {
    //         queryParams: { routeback: this.currentPath(this.location)},
    //         queryParamsHandling: 'merge'
    //     });
    // }

    cancel() {
        this.navigateAway();
    }

    navigateAway() {
        this.router.navigate(['customer/activecustomer']);
    }
}