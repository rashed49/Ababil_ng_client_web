import { Location } from '@angular/common';
import { FormBaseComponent } from './../../common/components/base.form.component';
import { Router } from '@angular/router';
import { NotificationService } from './../../common/notification/notification.service';
import { ApprovalflowService } from './../../services/approvalflow/service-api/approval.flow.service';
import { ApprovalFlowTaskAction } from './../../services/approvalflow/domain/approval.flow.models';
import { VerifierSelectionEvent } from './../../common/components/verifier-selection/verifier.selection.component';
import { Observable, of } from 'rxjs';

export class ViewsBaseComponent extends FormBaseComponent {

    processId: string;
    command: string;
    commandReference:string;
    showVerifierSelectionModal: Observable<boolean>;    

    constructor(protected location:Location,protected router:Router,protected workflowService: ApprovalflowService, protected notificationService: NotificationService) { 
        super(location,workflowService); 
    }

    submit() {
        this.showVerifierSelectionModal = of(true);
    }

    onVerifierSelect(selectEvent: VerifierSelectionEvent) {
        this.verifyTask("ACCEPT", selectEvent.verifier);
    }

    verifyTask(task: ApprovalFlowTaskAction, verifier: string) {
        let urlSearchParam = new Map();
        if (verifier != null) urlSearchParam.set("verifier", verifier);
        this.subscribers.submitSub = this.workflowService.
            verifyTask({ action: task, comment: null }, { processId: this.processId }, urlSearchParam)
            .subscribe(data => {
                this.cancel();
                this.notificationService.sendSuccessMsg("workflow.task.verify");
        });
    }

    
    cancel() {
        this.location.back();
    }

    navigateAway() {
        this.router.navigate(['/approval-flow/pendingtasks']);
    }

}