import { DemandDepositAccount } from './../../../../../services/demand-deposit-account/domain/demand.deposit.account.models';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { BaseComponent } from '../../../../../common/components/base.component';
import { SpecialInstruction, SpecialInstructionType, WithdrawInstructionAction, SpecialInstructionStatus } from "../../../../../services/special-instruction/domain/special.instruction.models";
import { SpecialInstructionService } from '../../../../../services/special-instruction/service-api/special.instruction.service';
import { Observable, of } from 'rxjs';
import { NotificationService } from '../../../../../common/notification/notification.service';
import * as commandConstants from '../../../../../common/constants/app.command.constants';
import { SelectItem } from 'primeng/api';
import { DemandDepositAccountService } from '../../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';

import { SpecialInstructionTypeService } from '../../../../../services/special-instruction/service-api/special-instruction-type.service';
import { VerifierSelectionEvent } from '../../../../../common/components/verifier-selection/verifier.selection.component';
import * as urlSearchParameterConstants from '../../../../../common/constants/app.search.parameter.constants';
import { FormBaseComponent } from '../../../../../common/components/base.form.component';
import { ApprovalflowService } from '../../../../../services/approvalflow/service-api/approval.flow.service';

export const DETAILS_UI: string = "views/demand-deposit-account/special-instruction?";


@Component({
  selector: 'app-special-instruction',
  templateUrl: './special-instruction.component.html',
  styleUrls: ['./special-instruction.component.css']
})
export class SpecialInstructionComponent extends FormBaseComponent implements OnInit {

  account: DemandDepositAccount = new DemandDepositAccount();
  accountId: string;
  instructionId: string;
  @Input('command') command: string;

  specialInstructions: SpecialInstruction[];
  specialInstruction: SpecialInstruction;
  selectedSpecialInstruction: SpecialInstruction;
  display: boolean = false;
  specialInstructionCommandMap: Map<string, string> = new Map();
  showVerifierSelectionModal: Observable<boolean>;
  instructionTypes: SpecialInstructionType[];
  visible: boolean;
  queryParams: any;

  constructor(
    private specialInstructionService: SpecialInstructionService,
    private specialInstructionTypeService: SpecialInstructionTypeService,
    private accountService: DemandDepositAccountService,
    private route: ActivatedRoute,
    private router: Router,
    protected location: Location,
    protected approvalFlowService: ApprovalflowService,
    private notificationService: NotificationService
  ) {
    super(location, approvalFlowService);

  }

  ngOnInit() {
    this.showVerifierSelectionModal = of(false);
    this.subscribers.routeSub = this.route.params.subscribe(params => {
      this.accountId = params['id'];
    });

    this.route.queryParams.subscribe(params => {
      this.queryParams = params;

    });

    this.fetchSpecialInstructions();
    this.fetchInstructionTypes();
    this.fetchAccountDetails();
  }

  fetchSpecialInstructions() {
    let instructionRequestOptions = [
      { value: "accountId", text: this.accountId + '' },
      { value: "specialInstructionStatus", text: SpecialInstructionStatus[SpecialInstructionStatus.IMPOSED] }
    ];
    let instructionRequestOptionsMap = new Map(
      instructionRequestOptions.map<[string, string]>(x => [x.value, x.text])
    );
    this.subscribers.fetchSubs = this.specialInstructionService.fetchSpecialInstructions(instructionRequestOptionsMap).subscribe(
      profiles => {
        this.specialInstructions = profiles.content;
      })
  }

  fetchAccountDetails() {
    this.subscribers.fetchAccs = this.accountService.fetchDemandDepositAccountDetails({ id: this.accountId }).subscribe(
      accountDetails => {
        this.account = accountDetails;
      }
    )
  }

  fillUpSpecialInstructionCommandMap() {
    this.specialInstructionCommandMap = new Map();
    this.instructionTypes.forEach(element => {
      this.specialInstructionCommandMap.set(element.name, element.code);
    });
  }

  fetchInstructionTypes() {
    this.subscribers.typeSub = this.specialInstructionTypeService.fetchSpecialInstructionTypes().subscribe(
      types => {
        this.instructionTypes = types;
        this.fillUpSpecialInstructionCommandMap();
      }
    )
  }

  onWithdrawClick(): void {
    this.display = true;
  }

  cancel(): void {
    this.display = false;
  }

  onWithdraw(): void {
    this.command = this.commandMapping();
    this.showVerifierSelectionModal = of(true);
    this.display = false;
  }

  onVerifierSelect(selectEvent: VerifierSelectionEvent) {
    let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, selectEvent.verifier, DETAILS_UI + "withdrawal=true" + "&" + "accountId=" + this.accountId + "&", null);
    this.subscribers.submitSub = this.specialInstructionService.
      withdrawSpecialInstruction({ action: 'WITHDRAW' }, { id: this.accountId, instructionId: this.selectedSpecialInstruction.id + "" }, urlSearchParams)
      .subscribe(
        (data) => {
          if (selectEvent.approvalFlowRequired) {
            this.notificationService.sendSuccessMsg("workflow.task.verify.send");
          } else {
            this.notificationService.sendSuccessMsg("account.special.instruction.withdraw.success");
          }
          this.fetchSpecialInstructions();
        });
  }

  create(): void {
    this.router.navigate(['impose'], {
      relativeTo: this.route,
      queryParamsHandling: "merge"
    });
  }

  onRowSelect(event) {
    // this.router.navigate(['detail', event.data.id], {relativeTo: this.route});
  }

  commandMapping(): string {


    let code = this.specialInstructionCommandMap.get(this.selectedSpecialInstruction.specialInstructionType.name);
    switch (code) {
      case 'SI1000': {
        return this.command = commandConstants.NO_TRANSACTION_WITHDRAW_COMMAND;
      }
      case 'SI1110': {
        return this.command = commandConstants.NO_CASH_DEPOSIT_WITHDRAW_COMMAND;
      }
      case 'SI1120': {
        return this.command = commandConstants.NO_DEPOSIT_BY_TRANSFER_WITHDRAW_COMMAND;
      }
      case 'SI1200': {
        return this.command = commandConstants.NO_WITHDRAW_WITHDRAW_COMMAND;
      }
      case 'SI1210': {
        return this.command = commandConstants.NO_CASH_WITHDRAW_WITHDRAW_COMMAND;
      }
      case 'SI1220': {
        return this.command = commandConstants.NO_WITHDRAW_BY_CHEQUE_WITHDRAW_COMMAND;
      }
      case 'SI1230': {
        return this.command = commandConstants.NO_WITHDRAW_BY_TRANSFER_WITHDRAW_COMMAND;
      }
      case 'SI1309': {
        return this.command = commandConstants.NO_CASH_DEPOSIT_WITHDRAW_COMMAND;
      }
      case 'SI1310': {
        return this.command = commandConstants.NO_CASH_WITHDRAW_WITHDRAW_COMMAND;
      }
      case 'SI1311': {
        return this.command = commandConstants.NO_TRANSFER_WITHDRAW_ONLINE_WITHDRAW_COMMAND;
      }
      case 'SI1312': {
        return this.command = commandConstants.NO_TRANSFER_DEPOSIT_ONLINE_WITHDRAW_COMMAND;
      }
      case 'SI2100': {
        return this.command = commandConstants.CHEQUE_STOP_WITHDRAW_COMMAND;

      }
      case 'SI5100': {
        return this.command = commandConstants.MINIMUM_BALANCE_WITHDRAW_COMMAND;
      }
      default: {
        return this.command = 'Choose a instructionType';
      }
    }
  }

  close() {
    this.navigateAway();
  }

  navigateAway() {
    if (this.queryParams['demandDeposit'] !== undefined) {
      this.router.navigate([this.queryParams['demandDeposit']], { queryParamsHandling: "merge" });
    } else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }
}
