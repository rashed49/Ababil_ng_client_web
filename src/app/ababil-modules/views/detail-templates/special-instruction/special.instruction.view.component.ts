import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BaseComponent } from '../../../../common/components/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApprovalflowService } from './../../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from './../../../../common/components/base.form.component';
import { Subscriber, Observable, of } from 'rxjs';
import * as commandConstants from '../../../../common/constants/app.command.constants';
import { VerifierSelectionEvent } from '../../../../common/components/verifier-selection/verifier.selection.component';
import value from '*.json';
import { Notice } from './../../../../services/bank-notice/domain/notice.models';
import { NotificationService } from '../../../../common/notification/notification.service';
import { ViewsBaseComponent } from './../../view.base.component';
import { SpecialInstruction, SpecialInstructionType } from '../../../../services/special-instruction/domain/special.instruction.models';
import { SpecialInstructionService } from '../../../../services/special-instruction/service-api/special.instruction.service';
import { SpecialInstructionTypeService } from '../../../../services/special-instruction/service-api/special-instruction-type.service';
import { DemandDepositAccountService } from '../../../../services/demand-deposit-account/service-api/demand.deposit.account.service';
import { DemandDepositAccount } from '../../../../services/demand-deposit-account/domain/demand.deposit.account.models';


@Component({
    selector: 'special-instruction-view',
    templateUrl: './special.instruction.view.component.html'
})

export class SpecialInstructionViewComponent extends ViewsBaseComponent implements OnInit {
    instructionTypes: SpecialInstructionType[];
    withdrawal: boolean ;
    specialInstruction: SpecialInstruction = new SpecialInstruction;
    accountId: number;
    specialInstructionId: number;
    demandDepositAccount: DemandDepositAccount = new DemandDepositAccount();
    constructor(protected location: Location,
        protected notificationService: NotificationService,
        protected approvalflowService: ApprovalflowService,
        private specialInstructionService: SpecialInstructionService,
        private specialInstructionTypeService: SpecialInstructionTypeService,
        private demandDepositAccountService: DemandDepositAccountService,
        private route: ActivatedRoute,
        protected router: Router,
        private formBuilder: FormBuilder) {
        super(location, router, approvalflowService, notificationService);
    }

    ngOnInit() {
        this.showVerifierSelectionModal = of(false);

        this.subscribers.routeSub = this.route.queryParams.subscribe(queryParams => {
            this.command = queryParams['command'];
            this.processId = queryParams['taskId'];
            this.taskId = queryParams['taskId'];
            this.commandReference = queryParams['commandReference'];
            this.withdrawal = queryParams['withdrawal'] === "true" ? true : false;
            this.accountId = queryParams['accountId'];
            this.fetchDDAcountDetail(this.accountId);
            this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                .subscribe(data => {
                    if (this.withdrawal) {
                        this.specialInstructionId = data;
                        this.fetchSpecialInstructionDetail();
                    } else {
                        this.specialInstruction = data;
                    }

                });
        });
        this.fetchInstructionTypes();
    }

    fetchInstructionTypes() {
        this.subscribers.typeSub = this.specialInstructionTypeService.fetchSpecialInstructionTypes().subscribe(
            types => {
                this.instructionTypes = types;
            }
        )
    }

    fetchSpecialInstructionDetail() {
        this.specialInstructionService.fetchSpecialInstructionDetail({ id: this.accountId, instructionId: this.specialInstructionId }).subscribe(
            detail => {
                this.specialInstruction = detail;
            }
        );
    }
    fetchDDAcountDetail(accountId : number){
        this.subscribers.ddDetailSub = this.demandDepositAccountService.fetchDemandDepositAccountDetails({id: this.accountId}).subscribe(
            accountDetail => {
                this.demandDepositAccount = accountDetail;
            }
        )
    }


    cancel() {
        this.location.back();
    }
}
