import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/primeng';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { Branch, OwnBranch, OtherBranch } from '../../../../../services/bank/domain/bank.models';
// import { OwnBranchSaveEvent } from '../branch.form.component';
import { BankService } from '../../../../../services/bank/service-api/bank.service';
import { NotificationService, NotificationType } from '../../../../../common/notification/notification.service';
import { BaseComponent } from '../../../../../common/components/base.component';
import * as commandConstants from '../../../../../common/constants/app.command.constants';
import * as urlSearchParameterConstants from '../../../../../common/constants/app.search.parameter.constants';
import * as mapper from '../branch.mapper';
import { Address } from '../../../../../services/cis/domain/address.model';

@Component({
    selector: 'app-edit-branch-form',
    templateUrl: './edit.branch.form.component.html',
})

export class EditBranchFormComponent extends BaseComponent implements OnInit {

    constructor(private bankService: BankService,
        private route: ActivatedRoute,
        private router: Router,
        private notificationService: NotificationService) { super(); }

    selectedBranchId: number;
    selectedBankId: number;
    branchFormData: Observable<any>;
    command: string;
    ownBank: boolean = false;

    ngOnInit() {
        this.command = commandConstants.OWN_BRANCH_UPDATE_COMMAND || commandConstants.OTHER_BRANCH_UPDATE_COMMAND;
        this.subscribers.routeSub = this.route.params.subscribe(
            params => {
                this.selectedBankId = +params['bankId'];
                this.selectedBranchId = +params['branchId'];
            });
        this.fetchBranchDetails();
    }
    fetchBranchDetails() {
        this.subscribers.fetchSub = this.bankService.fetchBranchDetails({ bankId: this.selectedBankId, branchId: this.selectedBranchId })
            .subscribe(branch => {
                this.branchFormData = branch;
                if (branch.jsonType === "OWN") {
                    this.ownBank = true;
                } 
            });
    }

    onSave(event: any): void {
            let branch = event.branchForm;
            let urlSearchMap = new Map<any, any>();
            urlSearchMap.set('bankId', this.selectedBankId + '');
            urlSearchMap.set('branchId', this.selectedBranchId + '');
            if (event.verifier != null) urlSearchMap.set(urlSearchParameterConstants.VERIFIER, event.verifier);
            this.subscribers.saveSub = this.bankService.updateBranchProfile(branch, { 'bankId': this.selectedBankId + "", 'branchId': this.selectedBranchId + "" }, urlSearchMap).subscribe(
                (data) => {
                    this.notificationService.sendSuccessMsg("approval.requst.success");
                });
    }

    onCancel(): void {
        this.navigateAway();
    }

    navigateAway() {
        this.router.navigate(['../'], { relativeTo: this.route })
    }
}
