import { OrganizationFormComponent } from './organization/form/organization.form.component';
import { OrganizationDetailComponent } from './organization/detail/organization.detail.component';
import { SubjectOrganizationComponent } from './subject-organization/subject.organization.component';
import { SubjectIndividualComponent } from './subject-individual/subject.individual.component';
import { Routes } from '@angular/router';
import { CISInactiveCustomerComponent } from './cis.inactive.customer.component';
import { CISActiveCustomerComponent } from './cis.active.customer.component';
import { OrganizationCustomerComponent } from './organizationcustomer/organization.customer.component';
import { JointCustomerDashboardComponent } from './joint/joint.customer.dashboard.component';
import { PersonalCustomerComponent } from './personal/personal.customer.component';
import { DemandDepositAccountDetailComponent } from '../portfolio/demand-deposit/account/detail/demand.deposit.account.detail.component';
import { EditIndividualFormComponent } from './individual/edit/edit.individual.form.component';
import { IndividualDetailComponent } from './individual/detail/individual.detail.component';
import { CustomerSearchComponent } from './customer-search/customer.search.component';
import { JointCustomerFormComponent } from './joint/form/joint.customer.form.component';
import { ShortIndividualComponent } from './individual/short-individual-form/short.individual.form.component';
import { JointCustomerViewComponent } from '../views/detail-templates/joint-customer/joint.customer.view.component';
import { ShortIndividualDetailComponent } from './individual/short-individual-form/detail/short.individual.detail.component';
import { EditShortIndividualComponent } from './individual/short-individual-form/edit/edit.short.individual.component';
import { OrganizationOwnerTypeComponent } from './organization-type-owner-type/organization.owner.type.component';

export const CISRoutes: Routes = [
  { path: '', component: CISInactiveCustomerComponent, data: { jobIdReset: true } },
  { path: 'inactivecustomer', component: CISInactiveCustomerComponent, data: { jobIdReset: true } },
  { path: 'activecustomer', component: CISActiveCustomerComponent, data: { jobIdReset: true } },
  { path: 'organization/:cusId', component: OrganizationCustomerComponent },
  { path: 'organization-details', component: OrganizationFormComponent },
  { path: 'organization/details/:id', component: OrganizationDetailComponent },
  { path: 'joint/:cusId', component: JointCustomerDashboardComponent },
  { path: 'joint/form/:cusId', component: JointCustomerFormComponent },
  { path: 'personal/:cusId', component: PersonalCustomerComponent },
  { path: 'individual/detail/:id', component: IndividualDetailComponent, pathMatch: 'full' },
  { path: 'individual/edit', component: EditIndividualFormComponent },
  { path: 'subject-individual', component: SubjectIndividualComponent },
  { path: 'subject-organization', component: SubjectOrganizationComponent },
  { path: 'short-individual', component: ShortIndividualComponent },
  { path: 'short-individual-details', component: ShortIndividualDetailComponent },
  { path: 'short-individual-edit', component: EditShortIndividualComponent },
  { path: 'customer-search', component: CustomerSearchComponent },
  { path: 'organizationtypemappingwithownertype', component: OrganizationOwnerTypeComponent }
];
