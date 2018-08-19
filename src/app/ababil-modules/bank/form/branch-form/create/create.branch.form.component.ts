import { Component, OnInit, OnDestroy } from '@angular/core';
import { initialBranchFormData1, initialBranchFormData2 } from '../branch.form.component';
import { Branch, OwnBranch, OtherBranch } from '../../../../../services/bank/domain/bank.models';
import { BankService } from '../../../../../services/bank/service-api/bank.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/primeng';
import { Subscriber } from 'rxjs';
import { NotificationService, NotificationType } from '../../../../../common/notification/notification.service';
import { BaseComponent } from '../../../../../common/components/base.component';
import { Observable } from 'rxjs';
import * as commandConstants from '../../../../../common/constants/app.command.constants';
import * as urlSearchParameterConstants from '../../../../../common/constants/app.search.parameter.constants';
import * as mapper from '../branch.mapper';


@Component({
    selector: 'app-create-branch-form',
    templateUrl: './create.branch.form.component.html',
    styleUrls: ['./create.branch.form.component.scss']
})


export class CreateBranchFormComponent extends BaseComponent implements OnInit {

    branchFormData: Observable<any>;
    command: string;
    selectedBankId: number;
    ownbank: boolean;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private bankService: BankService,
        private notificationService: NotificationService) { super(); }



    ngOnInit() {
        
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.selectedBankId = +params['bankId'];
            this.ownbank = params['ownBank'] === 'true' ? true : false;
            if (this.ownbank) {
                this.command =  commandConstants.OWN_BRANCH_CREATE_COMMAND;
                this.branchFormData = new Observable(observer => {
                    let ownBranch = initialBranchFormData1;
                    observer.next(ownBranch);
                });
            } else {
                this.command =  commandConstants.OTHER_BRANCH_CREATE_COMMAND;
                this.branchFormData = new Observable(observer => {
                    let otherBranch = initialBranchFormData2;
                    observer.next(otherBranch);
                });
            }
        });
    }


    onSave(event: any) {
        let branch = event.branchForm;
        let urlSearchMap = new Map<string, any>();
        urlSearchMap.set('bankId', this.selectedBankId + '');
        if (event.verifier != null) urlSearchMap.set(urlSearchParameterConstants.VERIFIER, event.verifier);
        this.subscribers.saveSub = this.bankService.createBranchProfile( branch,{ bankId: this.selectedBankId  }, urlSearchMap).subscribe(
            (data) => {
                this.notificationService.sendSuccessMsg("approval.requst.success");
                this.navigateAway();
            });
    }

    onCancel(): void {
        this.navigateAway();
    }
    navigateAway() {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }
}
