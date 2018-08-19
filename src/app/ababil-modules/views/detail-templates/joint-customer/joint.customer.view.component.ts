import { NotificationService } from './../../../../common/notification/notification.service';
import { ApprovalflowService } from './../../../../services/approvalflow/service-api/approval.flow.service';
import { ViewsBaseComponent } from './../../view.base.component';
import { BaseComponent } from '../../../../common/components/base.component';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../../../services/cis/domain/cis.models';
import { Observable } from 'rxjs';
import { IndividualInformation } from '../../../../services/cis/domain/individual.model';
import { CISService } from '../../../../services/cis/service-api/cis.service';
import { CustomerType } from '../../../../services/cis/domain/customer.type.model';
import { ApplicantType } from '../../../../services/cis/domain/applicant.type.model';
import { MenuItem } from 'primeng/primeng';
import { environment } from '../../../../../environments/environment';
import { Location } from '@angular/common';

@Component({
  selector: 'joint-customer-view',
  templateUrl: './joint.customer.view.component.html',
})
export class JointCustomerViewComponent extends ViewsBaseComponent implements OnInit {

  imageApiUrl: string;
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


  uuid: string;
  id: number;
  constructor(protected location:Location,protected approvalFlowService:ApprovalflowService,protected notificationService:NotificationService ,private cisService: CISService, private route: ActivatedRoute, protected router: Router) {
    super(location,router,approvalFlowService,notificationService);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.subjects && changes.subjects.currentValue) {
      this.subjects = changes.subjects.currentValue;
    }
  }

  ngOnInit() {
    this.customer = new Customer();
    this.subscribers.routeSub = this.route.queryParams.subscribe(params => {
      this.customerId = +params['cusId'];
      this.processId = params['taskId'];
      this.fetchCustomer();
    });
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

  getApplicationTypeDescriptionById(id: number) {
    if (!this.applicantTypeMap) return 'N/A';
    return this.applicantTypeMap.get(id);
  }

  editSubject(subjectId) {
    this.subjectId = subjectId;
    this.router.navigate(['views/subject-individual'], {
      queryParams: { customerType: 'JOINT', id: this.subjectId, customerId: this.customerId, customerName: this.customer.name, taskId: this.processId }
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
    );
  }
  cancel() {
    this.resetData();
    this.navigateAway();
  }
  resetData() {
    this.subjectId = null;
  }
  navigateAway() {
    this.router.navigate(['/approval-flow/pendingtasks'], { relativeTo: this.route });
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






