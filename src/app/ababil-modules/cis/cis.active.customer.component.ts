import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BaseComponent } from '../../common/components/base.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CISService } from '../../services/cis/service-api/cis.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '../../services/cis/domain/cis.models';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Message, SelectItem, LazyLoadEvent } from 'primeng/primeng';
import { CustomerType } from '../../services/cis/domain/customer.type.model';
import { CustomerTypes } from '../../services/cis/domain/cis.models';
import { DraftService } from '../../services/draft/service-api/draft.service';
import { Draft } from '../../services/draft/domain/draft.model';
import * as draftConstants from '../../common/constants/app.draft.constants';
import * as abbabilValidators from '../../common/constants/app.validator.constants';

@Component({
    selector: 'ababil-cis',
    templateUrl: './cis.active.customer.component.html',
})
export class CISActiveCustomerComponent extends BaseComponent implements OnInit {
    msgs: Message[] = [];
    customer: Customer;
    customers: any;
    searchForm: FormGroup;
    urlSearchMap: Map<string, any>;
    router: Router;
    customerAppForm: FormGroup;
    customerTypes: SelectItem[];
    relationshipOfficers: SelectItem[] = [{ label: "Sakib", value: 1 }, { label: "Tamim", value: 2 }, { label: "Musfik", value: 3 }];
    totalRecords: number;
    totalPages: number;
    individualSubjectId = null;
    organizationSubjectId = null;
    identityTypes: SelectItem[];
    @ViewChild('op') searchPanel: any;

    constructor(private formBuilder: FormBuilder, private cisService: CISService,
        private _router: Router, private route: ActivatedRoute, private modalService: NgbModal,
        private draftService: DraftService, private translate: TranslateService,
        private renderer: Renderer2, private location: Location) {
        super();
        this.renderer.listen('window', 'scroll', (evt) => {
            this.searchPanel.hide();
        });
        this.customerTypes = CustomerTypes;
        this.prepareCustomerForm();
    }

    ngOnInit() {
        this.customer = { name: null, customerType: null };
        this.prepareSearchForm();
        this.fetchRelationshipOfficers();
    }

    prepareCustomerForm() {
        this.customerAppForm = this.formBuilder.group({
            name: ['', [Validators.required, abbabilValidators.personNameValidator]],
            customerType: ['', [Validators.required]],
            relationshipOfficer: ['']
        });
    }

    prepareSearchForm() {
        this.searchForm = this.formBuilder.group({
            cusid: ['', [Validators.maxLength(32)]],
            title: ['', [Validators.maxLength(50)]],
            phone: ['', [Validators.maxLength(13)]],
            identity: ['', [Validators.maxLength(32)]],
            accountnumber: ['', [Validators.maxLength(32)]],
            customerType: [''],
            tradeLicence: ['']
        });
    }

    search(searchMap: Map<string, any>) {
        if (searchMap != null) this.urlSearchMap = searchMap;
        for (let control in this.searchForm.controls) {
            this.urlSearchMap.delete(control);
            let formControlValue: string = this.searchForm.get(control).value.trim();
            if (formControlValue.length !== 0)
                this.urlSearchMap.set(control, this.searchForm.get(control).value);
        }
        this.urlSearchMap.set("page", 0);
        this.subscribers.searchSub = this.cisService.searchCustomers(this.urlSearchMap).subscribe(
            data => {
                this.customers = data.content;
                this.totalRecords = (data.pageSize * data.pageCount);
                this.totalPages = data.pageCount;
            }
        );
    }

    loadCustomerLazily(event: LazyLoadEvent) {
        if (this.urlSearchMap == null) {
            this.urlSearchMap = new Map();
        }
        this.urlSearchMap.set("page", (event.first / 20));
        this.urlSearchMap.set("active", "true");
        this.subscribers.fetchCustomerSub = this.cisService.searchCustomers(this.urlSearchMap).subscribe(
            data => {
                this.customers = data.content;
                this.totalRecords = (data.pageSize * data.pageCount);
                this.totalPages = data.pageCount;
            }
        );
    }

    onRowSelect(event) {
        switch (event.data.customerType) {
            case 'INDIVIDUAL_SINGLE':
                if (event.data.active) {
                    this._router.navigate(['/customer/personal', event.data.id]);
                }
                break;

            case 'INDIVIDUAL_JOINT':
                if (event.data.active) {
                    this._router.navigate(['/customer/joint', event.data.id]);
                }
                break;

            case 'ORGANIZATION':
                if (event.data.active) {
                    this._router.navigate(['/customer/organization', event.data.id]);
                }
                break;
        }
    }

    create() {
        this._router.navigateByUrl('/customer/new');
    }

    saveCustomer(title: string, type: string, relationshipOfficer: string, uri: string) {
        const customer: Customer = { id: null, name: title, customerType: type, relationshipOfficer: relationshipOfficer };
        this.subscribers.saveSub = this.cisService.createCustomer(customer, new Map())
            .subscribe(data => this.getCustomerById(data.content, type));
    }

    getCustomerById(cusId: any, cusType: any) {
        this.subscribers.fetchCustomerSub = this.cisService.fetchCustomer({ id: cusId }).subscribe(
            data => {
                if (cusType === 'INDIVIDUAL_SINGLE') {
                    this._router.navigate(['/customer/subject-individual'],
                        {
                            queryParams: {
                                routeBack: this.currentPath(this.location),
                                customerType: 'INDIVIDUAL', id: null, customerId: data.id,
                                customerName: data.name
                            },
                            queryParamsHandling: 'merge'
                        });
                } else if (cusType === 'INDIVIDUAL_JOINT') {
                    // this._router.navigate(['/customer/joint', data.id], {
                    //   queryParams: {
                    //     routeBack: this.currentPath(this.location),
                    //     customerType: 'INDIVIDUAL_JOINT', id: null, customerId: data.id,
                    //     customerName: data.name
                    //   },
                    //   queryParamsHandling: 'merge'
                    // });
                    this._router.navigate(['/customer/subject-individual'], {
                        queryParams: { customerType: 'JOINT', id: null, customerId: data.id, customerName: this.customer.name }
                    });
                } else if (cusType === 'ORGANIZATION') {
                    this._router.navigate(['customer/organization-details'], {
                        queryParams: {
                            routeBack: this.currentPath(this.location),
                            customerType: 'ORGANIZATION', applicantId: null, customerId: data.id,
                            customerName: data.name
                        },
                        queryParamsHandling: 'merge'
                    });
                }
            });
    }


    open(content) {
        this.modalService.open(content).result.then((result) => {
            if (result === 'submit') {
                const type = this.customerAppForm.get('customerType').value;
                const name = this.customerAppForm.get('name').value;
                const relationshipOfficer = this.customerAppForm.get('relationshipOfficer').value;
                switch (this.customerAppForm.get('customerType').value) {
                    case 'INDIVIDUAL_SINGLE':
                        this.saveCustomer(name, type, relationshipOfficer, '/customer/personal');
                        break;
                    case 'INDIVIDUAL_JOINT':
                        this.saveCustomer(name, type, relationshipOfficer, '/customer/joint');
                        break;
                    case 'ORGANIZATION':
                        this.saveCustomer(name, type, relationshipOfficer, '/customer/organization');
                        break;
                }
            } else {
                this.prepareCustomerForm();
            }
        }, (reason) => {
            this.prepareCustomerForm();
        });
    }

    fetchRelationshipOfficers() {//service not developed yet
        // this.subscribers.fetchRelationshipOfficersSub = this.cisService.fetchRelationshipOfficers()
        //     .subscribe(data => this.relationshipOfficers = data.map(rf => { return { label: rf.name, value: rf.id } }));
    }
}
