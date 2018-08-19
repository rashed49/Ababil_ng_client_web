import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '../../../../../common/components/base.component';
import { CurrencyService } from '../../../../../services/currency/service-api/currency.service';
import { Currency } from '../../../../../services/currency/domain/currency.models';
import { Branch } from '../../../../../services/bank/domain/bank.models';
import { Subscriber, Observable, of } from 'rxjs';
import { VerifierSelectionEvent } from '../../../../../common/components/verifier-selection/verifier.selection.component';
import { initialGlAccountFormData } from '../../../../gl-account/form/gl.account.form.component';
import { TellerAllocation, Teller } from '../../../../../services/teller/domain/teller.models';
import { TellerAllocationService } from '../../../../../services/teller/service-api/teller.allocation.service';
import { Location } from '@angular/common';
import { ApprovalflowService } from '../../../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from '../../../../../common/components/base.form.component';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { BankService } from '../../../../../services/bank/service-api/bank.service';
import { TellerService } from '../../../../../services/teller/service-api/teller.service';
import { environment } from '../../../../..';
import { NgSsoService } from '../../../../../services/security/ngoauth/ngsso.service';


export let initialTellerAllocationFormData: TellerAllocation = new TellerAllocation();
initialTellerAllocationFormData.autoAllocate = false;
export interface TellerAllocationSaveEvent {
  tellerAllocationForm: TellerAllocation,
  verifier: string,
  taskId: string,
  approvalFlowRequired: boolean
}

@Component({
  selector: 'teller-allocation-form',
  templateUrl: './teller.allocation.form.component.html',
})
export class TellerAllocationFormComponent extends FormBaseComponent implements OnInit {

  tellerAllocationForm: FormGroup;
  id: number;

  @Input('formData') formData: TellerAllocation;

  @Input('editMode') editMode: boolean;
  @Input('command') command: string;

  @Output('onSave') onSave = new EventEmitter<TellerAllocationSaveEvent>();
  @Output('onCancel') onCancel = new EventEmitter<void>();

  verifierSelectionModalVisible: Observable<boolean>;
  tellers: Teller[];
  selectedCurrencyId: number;
  currencies: Currency[];
  urlSearchParams: Map<string, string>;
  branches: SelectItem[] = [];
  display: boolean = true;
  commandReference: string;
  allowedUsers: SelectItem[] = [];

  userActiveBranch: number;
  userActiveBranchName: string;
  auth: string = environment.auth;

  constructor(
    protected location: Location,
    protected approvalflowService: ApprovalflowService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private tellerAllocationService: TellerAllocationService,
    private currencyService: CurrencyService,
    private bankService: BankService,
    private tellerService: TellerService,
    private ngSsoService: NgSsoService,
  ) {
    super(location, approvalflowService);
  }

  ngOnInit() {
    this.showVerifierSelectionModal = of(false);
    this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
      if (queryParams['taskId']) {
        this.taskId = queryParams['taskId'];
      }
      if (queryParams['commandReference']) {
        this.commandReference = queryParams['commandReference'];
      }
    });

    if (environment.auth === 'NGSSO') {
      this.subscribers.fetchUserDetailSub = this.ngSsoService.account().subscribe(
        account => {
          this.userActiveBranch = account.activeBranch;
          this.subscribers.fetchBranchDetailSub = this.bankService.fetchOwnBranchDetails({ 'branchId': account.activeBranch }).subscribe(
            detail => {
              this.userActiveBranchName = detail.name;
              this.fetchTellers(this.userActiveBranch);
              this.fetchUsers(this.userActiveBranch)
            }
          )
        });
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.formData) {
      this.prepareTellerAllocationForm(changes.formData.currentValue);
    }
  }

  prepareTellerAllocationForm(formData: TellerAllocation) {
    (formData == null) ? formData = initialTellerAllocationFormData : formData;
    this.id = formData.id;
    formData.teller = formData.teller ? formData.teller : new Teller();
    this.tellerAllocationForm = this.formBuilder.group({
      allocatedTo: [formData.allocatedTo, [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
      autoAllocate: [formData.autoAllocate],
      teller: [formData.teller, [Validators.required]],
    });


  }

  fetchTellers(branchId) {
    let urlSearchParam = new Map<string, string>();
    urlSearchParam.set('branchId', branchId.toString());
    this.subscribers.fetchSubs = this.tellerAllocationService.fetchTellers(urlSearchParam).subscribe(
      profiles => {
        this.tellers = [...profiles.content];
      });
  }


  fetchUsers(branchId) {
    let queryParams = new Map<string, string>();
    queryParams.set('designatedBranches', branchId);
    this.tellerService.fetchUsersToAllocate(queryParams).subscribe(
      data => {
        this.allowedUsers = [];
        this.allowedUsers.push({ label: 'Choose a user', value: null });
        data.content.map(
          user => this.allowedUsers.push({ label: user.username, value: user.username })
        )
      }
    )
  }



  submit() {

    if (!this.taskId) {
      this.showVerifierSelectionModal = of(true);
    } else {
      this.emitSaveEvent({ verifier: null, approvalFlowRequired: null }, this.taskId);
    }
  }

  onVerifierSelect(selectEvent: VerifierSelectionEvent) {
    this.emitSaveEvent(selectEvent, null);
  }

  emitSaveEvent(selectEvent: VerifierSelectionEvent, taskid: string) {
    let tellerAllocation = this.tellerAllocationForm.value;
    tellerAllocation.id = this.id;
    this.onSave.emit({
      tellerAllocationForm: this.tellerAllocationForm.value,
      verifier: selectEvent.verifier,
      taskId: this.taskId,
      approvalFlowRequired: selectEvent.approvalFlowRequired
    });
  }


  cancel(): void {
    this.onCancel.emit();
  }

  formsInvalid(): boolean {
    return (this.tellerAllocationForm.invalid);
  }


}
