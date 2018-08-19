import { ApprovalflowService } from './../../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from './../../../../common/components/base.form.component';
import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NotificationService } from '../../../../common/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../../../services/cis/domain/cis.models';
import { Observable, of } from 'rxjs';
import { Location } from '@angular/common';
import { IndividualInformation } from '../../../../services/cis/domain/individual.model';
import { CISService } from '../../../../services/cis/service-api/cis.service';
import * as commandConstants from '../../../../common/constants/app.command.constants';
import { VerifierSelectionEvent } from '../../../../common/components/verifier-selection/verifier.selection.component';
import { ApplicantType } from '../../../../services/cis/domain/applicant.type.model';
import { FormBuilder } from '@angular/forms';
import { MenuItem } from 'primeng/primeng';
import { DemandDepositAccountService } from '../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { environment } from '../../../../../environments/environment';

export const DETAILS_UI: string = "views/joint-customer";
export const ACTIVATION_SUCCESS_MSG: string[] = ["customer.active.success", "approval.requst.success"];

@Component({
  selector: 'joint-customer-form',
  templateUrl: './joint.customer.form.component.html',
//   styleUrls: ['./joint.customer.dashboard.component.scss'],
})
export class JointCustomerFormComponent extends FormBaseComponent implements OnInit {
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
  
  constructor(protected approvalFlowservice:ApprovalflowService,protected location: Location, private cisService: CISService, private route: ActivatedRoute, private router: Router,
    private notificationService: NotificationService, private formBuilder: FormBuilder, private depositAccountService: DemandDepositAccountService) {
    super(location,approvalFlowservice);
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
        // this.fetchSubjectDetails(data.id);
      }
    );
  }

  getApplicationTypeDescriptionById(id: number) {
    if (!this.applicantTypeMap) return 'N/A';
    return this.applicantTypeMap.get(id);
  }

  activate() {
    this.verifierSelectionModalVisible = of(true);
  }

  onVerifierSelect(event: VerifierSelectionEvent) {
    let view_ui = DETAILS_UI.concat("?cusId=").concat(`${this.customerId}`.toString()).concat("&");
    let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("?"));
    this.cisService.activateCustomer(this.customer.id, urlSearchParams)
      .subscribe(data => {
           this.notificationService.sendSuccessMsg(ACTIVATION_SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
           this.navigateAway();
      });
  }


  cancel() {
    this.resetData();
    this.navigateAway();
  }

  resetData() {
    this.subjectId = null;
  }

  removeSubject(subjectId) {
    this.cisService.removeSubject({id:this.customerId,subjectId:subjectId})
    .subscribe(data=>{
      this.notificationService.sendSuccessMsg("subject.delete.success");
      this.fetchJointCustomerSubjcets();
    })
    //this.notificationService.sendInfoMsg("not.implemented");
  }

  navigateAway() {
    this.router.navigate(['../../../'], { relativeTo: this.route });
  }

  canActivate() {
    return !this.customer.active;
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
}






