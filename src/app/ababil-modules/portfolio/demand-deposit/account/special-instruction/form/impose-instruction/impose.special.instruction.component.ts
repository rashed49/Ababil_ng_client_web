import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { BaseComponent } from '../../../../../../../common/components/base.component';
import { Router, ActivatedRoute } from "@angular/router";
import { SpecialInstructionType, SpecialInstruction, SpecialInstructionStatus } from "../../../../../../../services/special-instruction/domain/special.instruction.models";
import { SpecialInstructionService } from '../../../../../../../services/special-instruction/service-api/special.instruction.service';
import { SpecialInstructionTypeService } from '../../../../../../../services/special-instruction/service-api/special-instruction-type.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../../../../../common/notification/notification.service';
import { Message } from 'primeng/primeng';
import { Subscriber, of } from 'rxjs';
import { Observable } from 'rxjs';
import * as commandConstants from '../../../../../../../common/constants/app.command.constants';
import { SpecialInstructionComponent } from '../../special-instruction.component';
import { DemandDepositAccountService } from '../../../../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { DemandDepositAccount } from '../../../../../../../services/demand-deposit-account/domain/demand.deposit.account.models';
import { VerifierSelectionEvent } from '../../../../../../../common/components/verifier-selection/verifier.selection.component';
import { ApprovalflowService } from '../../../../../../../services/approvalflow/service-api/approval.flow.service';
import * as urlSearchParameterConstants from '../../../../../../../common/constants/app.search.parameter.constants';
import { FormBaseComponent } from '../../../../../../../common/components/base.form.component';

export const DETAILS_UI: string = "views/demand-deposit-account/special-instruction?";

@Component({
  selector: 'app-impose-special-instruction',
  templateUrl: './impose.special.instruction.component.html',
  styleUrls: ['./impose.special.instruction.component.scss']
})
export class ImposeSpecialInstructionComponent extends FormBaseComponent implements OnInit {
  account: DemandDepositAccount = new DemandDepositAccount();
  instructionTypeId: number;
  instructionType: SpecialInstructionType;
  accountId: number;
  instructionForm: FormGroup;
  instructionTypes: SpecialInstructionType[];
  specialInstructionTypeCodeMap: Map<SpecialInstructionType, boolean[]> = new Map();
  specialInstructionCommandMap: Map<SpecialInstructionType, string> = new Map();
  specialInstruction: SpecialInstruction = new SpecialInstruction();
  specialInstructionSaveEvent: SpecialInstruction;
  queryParams: any;
  @Input('command') command: string;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private specialInstructionService: SpecialInstructionService,
    private specialInstructionTypeService: SpecialInstructionTypeService,
    private accountService: DemandDepositAccountService,
    protected location: Location,
    private workflowService: ApprovalflowService,
    private notificationService: NotificationService) {
    super(location,workflowService);
  }

  ngOnInit() {
    this.showVerifierSelectionModal = of(false);
        this.subscribers.routeSub = this.route.params.subscribe(
      params => {
        this.accountId = +params['id'];
        this.subscribers.queryParamSub = this.route.queryParams.subscribe(
          queryParams => {
              this.queryParams = queryParams;
              this.commandReference = queryParams['commandReference'];
              this.taskId = this.queryParams['taskId'];
              if (this.queryParams['taskId']) {
                  this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                      data => {
                          this.specialInstruction  = data;
                          this.specialInstructionTypeCodeMap.set((data.specialInstructionType), [data.chequeRelated, data.amountRelated]);

                      });
              }
          });
      });

    this.fetchInstructionTypes();
    this.fetchAccountDetails();
  }

  submit() {
    this.command = this.commandMapping();
    this.specialInstruction.demandDepositAccountId = this.accountId;
    this.specialInstruction.description = this.specialInstruction.description != null ? this.specialInstruction.description : this.specialInstruction.specialInstructionType.name;
    this.showVerifierSelectionModal = of(true);
  }



  onVerifierSelect(selectEvent: VerifierSelectionEvent) {
        this.imposeInstruction(selectEvent,null);
  }

  imposeInstruction(selectEvent: VerifierSelectionEvent, taskId: string) {
    let specialInstruction1 = this.specialInstruction;
    let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, selectEvent.verifier, DETAILS_UI + "accountId=" + this.accountId + "&", this.location.path().concat("&"));

    this.subscribers.insSubs = this.specialInstructionService.imposeSpecialInstruction(specialInstruction1, urlSearchParams).subscribe(
      (data) => {
        if(selectEvent.approvalFlowRequired){
          this.notificationService.sendSuccessMsg("workflow.task.verify.send");
        }else{
          this.notificationService.sendSuccessMsg("account.special.instruction.impose.success");
        }

        this.navigateAway();
      });
  }


  fillUpSpecialInstructionTypeCodeMap() {
    this.specialInstructionTypeCodeMap = new Map();
    this.instructionTypes.forEach(element => {
      this.specialInstructionTypeCodeMap.set(element, [element.chequeRelated, element.amountRelated]);
    });
  }

  fillUpSpecialInstructionCommandMap() {
    this.specialInstructionCommandMap = new Map();
    this.instructionTypes.forEach(element => {
      this.specialInstructionCommandMap.set(element, element.code);
    });
  }

  fetchInstructionTypes() {
    this.subscribers.typeSub = this.specialInstructionTypeService.fetchSpecialInstructionTypes().subscribe(
      types => {
        this.instructionTypes = types;
        this.fillUpSpecialInstructionTypeCodeMap();
        this.fillUpSpecialInstructionCommandMap();
      }
    )
  }

  showChequeInputs() {
    if (!this.specialInstruction.specialInstructionType) return null;
    else {
      let chequeRelated = this.specialInstructionTypeCodeMap.get(this.specialInstruction.specialInstructionType);
      return chequeRelated[0];
    }
   // return true;
  }
  showLienInputs() {
    if (!this.specialInstruction.specialInstructionType) return null;
    else {
      let amountRelated = this.specialInstructionTypeCodeMap.get(this.specialInstruction.specialInstructionType);
      return amountRelated[1];
    }
   // return true;
  }

  commandMapping(): string {
    if (!this.specialInstruction.specialInstructionType) return null;
    else {
      let code = this.specialInstructionCommandMap.get(this.specialInstruction.specialInstructionType);
      switch (code) {
        case 'SI1000': {
          return this.command = commandConstants.NO_TRANSACTION_IMPOSE_COMMAND;

        }
        case 'SI1110': {
          return this.command = commandConstants.NO_CASH_DEPOSIT_IMPOSE_COMMAND;

        }
        case 'SI1120': {
          return this.command = commandConstants.NO_DEPOSIT_BY_TRANSFER_IMPOSE_COMMAND;

        }
        case 'SI1200': {
          return this.command = commandConstants.NO_WITHDRAW_IMPOSE_COMMAND;

        }
        case 'SI1210': {
          return this.command = commandConstants.NO_CASH_WITHDRAW_IMPOSE_COMMAND;

        }
        case 'SI1220': {
          return this.command = commandConstants.NO_WITHDRAW_BY_CHEQUE_IMPOSE_COMMAND;

        }
        case 'SI1230': {
          return this.command = commandConstants.NO_WITHDRAW_BY_TRANSFER_IMPOSE_COMMAND;

        }
        case 'SI1309': {
          return this.command = commandConstants.NO_CASH_DEPOSIT_IMPOSE_COMMAND;

        }
        case 'SI1310': {
          return this.command = commandConstants.NO_CASH_WITHDRAW_IMPOSE_COMMAND;

        }
        case 'SI1311': {
          return this.command = commandConstants.NO_TRANSFER_WITHDRAW_ONLINE_IMPOSE_COMMAND;

        }
        case 'SI1312': {
          return this.command = commandConstants.NO_TRANSFER_DEPOSIT_ONLINE_IMPOSE_COMMAND;

        }
        case 'SI2100': {
          return this.command = commandConstants.CHEQUE_STOP_IMPOSE_COMMAND;

        }
        case 'SI5100': {
          return this.command = commandConstants.MINIMUM_BALANCE_IMPOSE_COMMAND;
        }
        default: {
          return this.command = 'Choose a instructionType';

        }
      }
    }
  }


  fetchAccountDetails() {
    this.subscribers.fetchAccs = this.accountService.fetchDemandDepositAccountDetails({ id: this.accountId + '' }).subscribe(
      accountDetails => {
        this.account = accountDetails;
      }
    )
  }
  formsInvalid(): boolean {
    return false;
  }

  cancel(): void {
    this.navigateAway();
  }

  navigateAway(): void {
    this.router.navigate(['../'], { 
      relativeTo: this.route,
      queryParamsHandling: "merge"
     });
  }

}