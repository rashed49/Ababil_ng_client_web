import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { ApprovalflowService } from './../../services/approvalflow/service-api/approval.flow.service';
import { BaseComponent } from './base.component';
import * as urlSearchParameterConstants from '../../common/constants/app.search.parameter.constants';

export class FormBaseComponent extends BaseComponent {

    taskId: any = null;
    processId: string;
    command: string;
    showVerifierSelectionModal: Observable<boolean>;
    commandReference: string;
    key_B = 66;
    
    constructor(protected location: Location, protected approvalFlowService: ApprovalflowService) {
        super();
    }

    protected fetchApprovalFlowTaskInstancePayload() {
        return this.approvalFlowService.fetchApprovalFlowTaskInstancePayload({ id: this.taskId });
    }

    protected getCurrentPath() {
        return this.location.path();
    }

    protected getQueryParamMapForApprovalFlow(map: Map<string, any>, verifier: string, detailsUI: string, correctionUI: string) {
        if (!map) map = new Map();
        if (!this.taskId) {
            if (verifier) map.set(urlSearchParameterConstants.VERIFIER, verifier);
            map.set(urlSearchParameterConstants.DETAILS_UI, detailsUI);
            map.set(urlSearchParameterConstants.CORRECTION_UI, correctionUI);
        } else {
            map.set(urlSearchParameterConstants.CORRECTION_TASK_ID, this.taskId);
        }
        return map;
    }

}