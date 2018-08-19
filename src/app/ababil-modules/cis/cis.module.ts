import { JointCustomerComponent } from './joint/joint.customer.component';
import { CISMiscellaneousService } from './../../services/cis/service-api/cis.misc.service';
import { AbabilLocationService } from './../../services/location/service-api/location.service';
import { SubjectOrganizationComponent } from './subject-organization/subject.organization.component';
import { SubjectIndividualComponent } from './subject-individual/subject.individual.component';
import { NgModule } from '@angular/core';
import { AbabilNgSharedModule } from '../../common/ababil-ng-shared-module.module';
import { RouterModule } from '@angular/router';
import { CISRoutes } from './cis.routes';
import { CISInactiveCustomerComponent } from './cis.inactive.customer.component';
import { CISService } from '../../services/cis/service-api/cis.service';
import { EditIndividualFormComponent } from './individual/edit/edit.individual.form.component';
import { IndividualFormComponent } from './individual/form/individual.form.component';
import { OrganizationFormComponent } from './organization/form/organization.form.component';
import { OrganizationCustomerComponent } from './organizationcustomer/organization.customer.component';
import { ApprovalflowService } from '../../services/approvalflow/service-api/approval.flow.service';
import { JointCustomerDashboardComponent } from '../cis/joint/joint.customer.dashboard.component';
import { PersonalCustomerComponent } from './personal/personal.customer.component';
import { OrganizationService } from '../../services/cis/service-api/organization.service';
import { IdentityService } from '../../services/identity/service-api/identity.service';
import { DemandDepositAccountService } from '../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { CISDashboardAccountsComponent } from '../cis/cis-dashboard-accounts/cis.dashboard.accounts.component';
import { IndividualDetailComponent } from './individual/detail/individual.detail.component';
import { OrganizationDetailComponent } from './organization/detail/organization.detail.component';
import { ImageUploadService } from '../../services/cis/service-api/image.upload.service';
import { ChartModule } from 'primeng/components/chart/chart';
import { FixedDepositAccountService } from '../../services/fixed-deposit-account/service-api/fixed.deposit.account.service';
import { RecurringDepositAccountService } from '../../services/recurring-deposit-account/service-api/recurring.deposit.account.service';
import { CustomerSearchComponent } from './customer-search/customer.search.component';
import { JointCustomerFormComponent } from './joint/form/joint.customer.form.component';
import { CISActiveCustomerComponent } from './cis.active.customer.component';
import { ShortIndividualComponent } from './individual/short-individual-form/short.individual.form.component';
import { ShortIndividualDetailComponent } from './individual/short-individual-form/detail/short.individual.detail.component';
import { EditShortIndividualComponent } from './individual/short-individual-form/edit/edit.short.individual.component';
import { FatcaFormComponent } from './fatca/form/fatca.form.component';
import { FatcaDescriptionService } from '../../services/cis/service-api/fatca.description.service';
import { DocumentService } from '../../services/document/service-api/document.service';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { OwnerTypeService } from '../../services/cis/service-api/owner.type.service';
import { MatTabsModule } from '@angular/material/tabs';
import { OrganizationOwnerTypeComponent } from './organization-type-owner-type/organization.owner.type.component';
import { OrganizationTypeService } from '../../services/cis/service-api/organization.type.service';
import { CreateOrganizationTypeComponent } from './organization-type-owner-type/organization/create/create.organization.type.component';
import { CreateOwnerTypeComponent } from './organization-type-owner-type/owner/create/create.owner.type.component';

@NgModule({
  imports: [
    AbabilNgSharedModule,
    RouterModule.forChild(CISRoutes),
    ChartModule,
    ScrollPanelModule,
    MatTabsModule
  ],
  declarations: [
    CISInactiveCustomerComponent,
    CISActiveCustomerComponent,
    IndividualFormComponent,
    IndividualDetailComponent,
    EditIndividualFormComponent,
    FatcaFormComponent,
    OrganizationFormComponent,
    OrganizationDetailComponent,
    OrganizationCustomerComponent,
    JointCustomerDashboardComponent,
    JointCustomerFormComponent,
    PersonalCustomerComponent,
    CISDashboardAccountsComponent,
    SubjectIndividualComponent,
    SubjectOrganizationComponent,
    CustomerSearchComponent,
    JointCustomerComponent,
    ShortIndividualComponent,
    ShortIndividualDetailComponent,
    EditShortIndividualComponent,
    OrganizationOwnerTypeComponent,
    CreateOrganizationTypeComponent,
    CreateOwnerTypeComponent
  ],
  providers: [
    AbabilLocationService,
    ApprovalflowService,
    CISService,
    CISMiscellaneousService,
    DemandDepositAccountService,
    FatcaDescriptionService,
    FixedDepositAccountService,
    RecurringDepositAccountService,
    IdentityService,
    ImageUploadService,
    OrganizationService,
    DocumentService,
    OwnerTypeService,
    OrganizationTypeService

  ],
  exports: [
    EditIndividualFormComponent,
    IndividualFormComponent
  ]
})
export class CISModule {

}
