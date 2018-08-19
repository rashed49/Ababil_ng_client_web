import { DemandDepositAccount } from '../../../services/demand-deposit-account/domain/demand.deposit.account.models';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { BaseComponent } from '../../components/base.component';
import { SpecialInstruction, SpecialInstructionType, WithdrawInstructionAction, SpecialInstructionStatus } from "../../../services/special-instruction/domain/special.instruction.models";
import { SpecialInstructionService } from '../../../services/special-instruction/service-api/special.instruction.service';
import { Observable } from 'rxjs';
import { DemandDepositAccountService } from '../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { SpecialInstructionTypeService } from '../../../services/special-instruction/service-api/special-instruction-type.service';
import { ApprovalflowService } from '../../../services/approvalflow/service-api/approval.flow.service';



@Component({
    selector: 'common-special-instruction',
    templateUrl: './special.instruction.component.html',
})

export class CommonSpecialInstructionComponent extends BaseComponent implements OnInit, OnChanges {

    account: DemandDepositAccount = new DemandDepositAccount();
    instructionId: string;
    @Input('accountId') accountId: number;

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
    ) {
        super();

    }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.accountId.currentValue) {
            this.accountId = changes.accountId.currentValue;
            this.fetchSpecialInstructions();
            this.fetchInstructionTypes();
            this.fetchAccountDetails();
        }
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



}
