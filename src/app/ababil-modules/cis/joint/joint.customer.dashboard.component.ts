import { BaseComponent } from '../../../common/components/base.component';
import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NotificationService } from '../../../common/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../../services/cis/domain/cis.models';
import { Observable, of } from 'rxjs';
import { Location } from '@angular/common';
import { IndividualInformation } from '../../../services/cis/domain/individual.model';
import { CISService } from '../../../services/cis/service-api/cis.service';
import * as commandConstants from '../../../common/constants/app.command.constants';
import { VerifierSelectionEvent } from '../../../common/components/verifier-selection/verifier.selection.component';
import { ApplicantType } from '../../../services/cis/domain/applicant.type.model';
import { FormBuilder } from '@angular/forms';
import { MenuItem } from 'primeng/primeng';
import { DemandDepositAccountService } from '../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'joint-customer-dashboard',
  templateUrl: './joint.customer.dashboard.component.html',
  styleUrls: ['./joint.customer.dashboard.component.scss'],
})
export class JointCustomerDashboardComponent extends BaseComponent implements OnInit {
  imageApiUrl: string;
  verifierSelectionModalVisible: Observable<boolean>;
  @ViewChild('subjectFormComponent') subjectFormComponent: any;
  subjects: IndividualInformation[] = [];
  subjectFormData: IndividualInformation;

  customerId: number;
  subjectId: number;
  customer: Customer;

  applicantTypes: ApplicantType[] = [];
  applicantTypeId: number;
  applicantTypeMap: Map<number, string>;

  addAccountItems: MenuItem[];
  isInactive: boolean = true;

  command: string = commandConstants.ACTIVATE_CUSTOMER_COMMAND;
  uuid: string;
  id: number;
  constructor(private location: Location, private cisService: CISService, private route: ActivatedRoute, private router: Router,
    private notificationService: NotificationService, private formBuilder: FormBuilder, private depositAccountService: DemandDepositAccountService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.subjects && changes.subjects.currentValue) {
      this.subjects = changes.subjects.currentValue;
    }

  }

  ngOnInit() {
    this.fetchApplicantTypes();
    this.verifierSelectionModalVisible = of(false);
    this.customer = new Customer();
    this.subscribers.routeSub = this.route.params.subscribe(params => {
      this.customerId = +params['cusId'];
      this.fetchCustomer();
    });
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

  extractData(): IndividualInformation[] {
    return this.subjects;

  }


  fetchCustomer() {
    this.cisService.fetchCustomer({ id: this.customerId + "" }).subscribe(
      data => {
        this.customer = data;
        this.isInactive = !this.customer.active;
        this.fetchJointCustomerSubjcets();
      }
    );
  }

  addNewSubject() {
    this.router.navigate(['/customer/subject-individual'], {
      queryParams: { customerType: 'JOINT', id: null, customerId: this.customerId, customerName: this.customer.name }
    });
  }

  editSubject(subjectId) {
    this.subjectId = subjectId;
    this.router.navigate(['/customer/subject-individual'], {
      queryParams: { customerType: 'JOINT', id: this.subjectId, customerId: this.customerId, customerName: this.customer.name }
    });
  }

  fetchSubjectDetails(subjectId) {
    this.subscribers.fetchSubjectDetailsSub = this.cisService.fetchSubjectDetails({ id: this.customerId + "", subjectId: subjectId + "" })
      .subscribe(
        data => {
          this.subjectFormData = data;
          this.id = this.subjectFormData.id;
          this.uuid = this.subjectFormData.uuid;
          this.applicantTypeId = data.applicantTypeId;
        }
      );
  }
  fetchJointCustomerSubjcets() {
    this.subscribers.fetchJointCustomerSubjectSub = this.cisService.fetchSubjects({ id: this.customerId + "" }).subscribe(
      data => {
        this.subjects = data;
        this.imageApiUrl = environment.serviceapiurl + "/individuals";
      }
    )
  }

  onAccountRowClicked(event, accountType: string) {
    console.log(event);
    switch (accountType) {
      case 'DD':
        this.router.navigate(['/account', event.data.id, 'details'], {
          relativeTo: this.route,
          queryParams: { cus: this.currentPath(this.location) }
        });
        break;
    }
  }

  activate() {
    this.verifierSelectionModalVisible = of(true);
  }

  onVerifierSelect(selectEvent: VerifierSelectionEvent) {
    this.cisService.activateCustomr(this.customer.id, selectEvent.verifier)
      .subscribe(data => {
        if (selectEvent.approvalFlowRequired) {
          this.notificationService.sendSuccessMsg("approval.requst.success");
        } else {
          this.notificationService.sendSuccessMsg("customer.active.success");
        }
        this.navigateAway();
      });
  }

  addDocument() {
    let routeBack = this.currentPath(this.location);
    this.router.navigate(['/customer/document'], {
      queryParams: { routeBack: this.currentPath(this.location) },
      queryParamsHandling: 'merge'
    });
  }

  cancel() {
    this.resetData();
    this.navigateAway();
  }

  resetData() {
    this.subjectId = null;
  }

  removeSubject() {
    this.notificationService.sendInfoMsg("not.implemented");
  }

  navigateAway() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  canActivate() {
    return !this.customer.active;
  }

  getApplicationTypeDescriptionById(id: number) {
    if (!this.applicantTypeMap) return 'N/A';
    return this.applicantTypeMap.get(id);
  }

  fetchApplicantTypes() {
    this.cisService.fetchApplicationType().subscribe(
      data => {
        this.applicantTypes = data;
        this.applicantTypeMap = new Map();
        for (let type of this.applicantTypes) {
          this.applicantTypeMap.set(type.id, type.description);
        }
      }
    );
  }
  // showApplicants() {
  //   this.router.navigate(['/customer/joint/form', this.customerId]);
  // }

}






