import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../../common/components/base.component';
import { OrganizationTypeService } from '../../../services/cis/service-api/organization.type.service';
import { OrganizationType } from '../../../services/cis/domain/organization.model';
import { LazyLoadEvent } from '../../../../../node_modules/primeng/api';
import { NotificationService } from '../../../common/notification/notification.service';
import { ApprovalflowService } from '../../../services/approvalflow/service-api/approval.flow.service';
import { OwnerTypeService } from '../../../services/cis/service-api/owner.type.service';
import { OwnerType } from '../../../services/cis/domain/owner.type.model';
import { AnyFn } from '../../../../../node_modules/@ngrx/store/src/selector';

@Component({
  selector: 'app-org-owner-type',
  templateUrl: './organization.owner.type.component.html'
})
export class OrganizationOwnerTypeComponent extends BaseComponent implements OnInit {

  @ViewChild('childOrganizationType') childOrganizationType: any;
  @ViewChild('childOwnerType') childOwnerType: any;


  constructor(private organizationTypeService: OrganizationTypeService,
    private ownerTypeService: OwnerTypeService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    protected approvalFlowService: ApprovalflowService) { super(); }


  organizationTypes: OrganizationType[] = [];
  ownerTypes: OwnerType[] = [];
  organizationTypeId: number;
  orgTypeDisplay: boolean;
  ownTypeDisplay: boolean;
  showOwnerTypeCreateButton: Boolean = false;

  ngOnInit() {
    this.fetchOrganizationTypes();
  }

  onOrgRowSelect(event) {
    this.organizationTypeId = event.data.id;
    this.fetchOrganizationWiseOwnerTypes(this.organizationTypeId);
  }

  fetchOrganizationTypes() {
    this.subscribers.fetchSubs = this.organizationTypeService
      .fetchOrganizationTypes().subscribe(
        data => {
          this.organizationTypes = data;
        }
      );
  }

  fetchOrganizationWiseOwnerTypes(organizationTypeId) {
    ///let urlSearchParams:Map<string,number> = new Map([['organizationTypeId', organizationTypeId]]);
    let urlSearchParams: Map<string, number> = new Map();
    urlSearchParams.set('organizationTypeId', organizationTypeId);
    this.subscribers.fetchSubs = this.ownerTypeService
      .fetchOwnerTypes(urlSearchParams)
      .subscribe(ownerTypeData => this.ownerTypes = ownerTypeData);
    this.showOwnerTypeCreateButton = true;
  }

  popOrganizationTypeCreateUi() {
    this.childOrganizationType.setData(new OrganizationType());
    this.orgTypeDisplay = true;
  }

  popOwnerTypeCreateUi() {
    let ownerType = new OwnerType();
    ownerType.organizationTypeId = this.organizationTypeId;
    this.childOwnerType.setOwnerTypeData(ownerType);
    this.ownTypeDisplay = true;
  }

  orgCancel() {
    this.orgTypeDisplay = false;
  }

  ownCancel() {
    this.ownTypeDisplay = false;
  }

  organizationTypeCorrection(data) {
    this.childOrganizationType.setOrganizationTypeData(data);
    this.orgTypeDisplay = true;
  }

  ownerTypeCorrection(data) {
    this.childOwnerType.setOwnerTypeData(data);
    this.ownTypeDisplay = true;
  }

  createOrganizationType(type) {
    this.organizationTypeService
      .createOrganizationType(type)
      .subscribe(data => {
        this.notificationService.sendSuccessMsg("organization.type.creation.success");
        this.orgTypeDisplay = false;
        this.childOrganizationType.id = null;
        this.fetchOrganizationTypes();
      })
  }

  updateOrganizationType(type) {
    this.organizationTypeService
      .updateOrganizationType(type, { organizationTypeId: type.id })
      .subscribe(data => {
        this.notificationService.sendSuccessMsg("organization.type.update.success");
        this.orgTypeDisplay = false;
        this.childOrganizationType.id = null;
        this.fetchOrganizationTypes();
      })
  }

  saveOrgType() {

    this.markFormGroupAsTouched(this.childOrganizationType.organizationTypeForm);
    if (this.childOrganizationType.organizationTypeForm.invalid) return;
    let orgCreate = this.childOrganizationType.extractOrganizationTypeData()
    if (!orgCreate.id) {
      this.createOrganizationType(orgCreate);
    } else {
      this.updateOrganizationType(orgCreate);
    }

  }

  createOwnerType(type) {
    this.ownerTypeService
      .createOwnerType(type)
      .subscribe(data => {
        this.notificationService.sendSuccessMsg("owner.type.creation.success");
        this.ownTypeDisplay = false;
        this.childOwnerType.id = null;
        this.fetchOrganizationWiseOwnerTypes(this.organizationTypeId);
      })
  }

  updateOwnerType(type) {
    this.ownerTypeService
      .updateOwnerType(type, { ownerTypeId: type.id })
      .subscribe(data => {
        this.notificationService.sendSuccessMsg("owner.type.update.success");
        this.ownTypeDisplay = false;
        this.childOwnerType.id = null;
        this.fetchOrganizationWiseOwnerTypes(type.organizationTypeId);;
      })
  }

  saveOwnerType() {
    this.markFormGroupAsTouched(this.childOwnerType.ownerTypeForm);
    if (this.childOwnerType.ownerTypeForm.invalid) return;
    let ownCreate = this.childOwnerType.extractOwnerTypeData();
    if (!ownCreate.id) {
      this.createOwnerType(ownCreate);
    } else {
      this.updateOwnerType(ownCreate);
    }
  }
}
