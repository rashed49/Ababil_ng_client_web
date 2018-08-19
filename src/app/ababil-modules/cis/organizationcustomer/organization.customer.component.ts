import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../common/components/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../../services/cis/domain/cis.models';
import { Location } from '@angular/common';
import { Organization } from '../../../services/cis/domain/organization.model';
import { CISService } from '../../../services/cis/service-api/cis.service';
import { OrganizationService } from '../../../services/cis/service-api/organization.service';
import { orgMapper } from '../organization/domain/organization.servermodel.mapper';
import { OrganizationOwner } from '../organization/domain/organization.owner.model';
import { OrganizationOwnerDto } from '../organization/domain/organization.owner.dto';
import { MenuItem } from 'primeng/components/common/menuitem';


@Component({
    selector: 'organization-customer',
    templateUrl: './organization.customer.component.html'
})
export class OrganizationCustomerComponent extends BaseComponent implements OnInit {

    customerTitle: string;
    customerId: number;
    isInactive: boolean = true;
    organizationId: number = null;
    organizationFormData: Organization = new Organization();
    customer: Customer;
    orgOwner: boolean;
    sharedPercentage: number = 0;
    remainingPercentage: number = 0;
    maxAssignableShare: number;
    owners: OrganizationOwnerDto[];
    view: string;

    orgOwnerFormData: OrganizationOwner;
    orgOwnerData: OrganizationOwner;
    addAccountItems: MenuItem[];

    constructor(private route: ActivatedRoute, private router: Router,
        private cisService: CISService,
        private organizationService: OrganizationService,
        private location: Location) {
        super();
        this.organizationFormData = orgMapper(this.organizationFormData);
    }

    ngOnInit() {
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.customerTitle = params['title'];
            this.customerId = +params['cusId'];
            this.fetchCustomer();
        });
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

    editOrganization() {
        this.router.navigate(['/customer/organization-details'], {
            queryParams: { customerId: this.customerId, customerName: this.customer.name, applicantId: this.customer.applicantId },
            queryParamsHandling: 'merge'
        });
    }

    navigateAway() {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }

    cancel() {
        this.navigateAway();
    }

    fetchCustomer() {
        this.subscribers.fetchCustomerSub = this.cisService
            .fetchCustomer({ id: this.customerId + "" })
            .subscribe(data => this.prepareCustomer(data));
    }

    fetchOrganization() {
        this.subscribers.fetchSub = this.cisService.fetchSubjectDetails
            ({ id: this.customerId + "", subjectId: this.customer.applicantId + "" }).
            subscribe(data => {
                this.organizationId = data.id;
                this.organizationFormData = orgMapper(data);
            });
    }

    prepareCustomer(customer: Customer) {
        this.customer = customer;
        this.isInactive = !customer.active;
        if (this.customer.applicantId) {
            this.fetchOrganization();
        }
    }

    fetchOwners() {
        this.subscribers.fetchSub = this.organizationService.fetchOrgOwners
            ({ organizationId: this.customer.applicantId + "" }).
            subscribe(data => this.owners = data);
    }

    viewDetail(event) {
        this.router.navigate(['/customer/organization/details/:id'], {
            queryParams: { customerId: this.customerId, applicantId: this.customer.applicantId },
            // queryParamsHandling: 'merge'
        });
    }


}