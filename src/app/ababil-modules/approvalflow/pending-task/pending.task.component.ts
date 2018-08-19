import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ApprovalflowService } from '../../../services/approvalflow/service-api/approval.flow.service';
import { User, PendingTask } from '../../../services/approvalflow/domain/approval.flow.models';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem, LazyLoadEvent } from 'primeng/primeng';
import { BaseComponent } from '../../../common/components/base.component';
import * as searchParamConst from '../../../common/constants/app.search.parameter.constants';

@Component({
    selector: 'app-pending-task',
    templateUrl: './pending.task.component.html',
    styleUrls: ['./pending.task.component.scss'],
})
export class PendingTaskComponent extends BaseComponent implements OnInit {

    totalRecords: number;
    totalPages: number;
    pendingTasks: PendingTask[];
    urlSearchParams: Map<string, number> = new Map();
    approvalFlowStatusMap: Map<string, string> = new Map();

    constructor(private workflowService: ApprovalflowService,
        private route: ActivatedRoute,
        private router: Router) {
        super();
    }

    ngOnInit() {
        this.fetchPendingTasks(new Map());
        this.approvalFlowStatusMap.set("STARTED", "Started");
        this.approvalFlowStatusMap.set("ACCEPTED", "Accepted");
        this.approvalFlowStatusMap.set("REJECTED", "Rejected");
        this.approvalFlowStatusMap.set("APPROVED", "Approved");
        this.approvalFlowStatusMap.set("REJECTED_FOR_CORRECTION", "Rejected for correction");
    }

    fetchPendingTasks(urlSearchParams) {
        urlSearchParams = urlSearchParams ? urlSearchParams : new Map();
        // this.urlSearchParams = new Map([[searchParamConst.IS_ADMIN, searchParamConst.FALSE]]);
        this.subscribers.fetchSub = this.workflowService.fetchPendingTasks(urlSearchParams)
            .subscribe(pendingTasks => {
                this.pendingTasks = pendingTasks.content;
                this.totalRecords = (pendingTasks.pageSize * pendingTasks.pageCount);
                this.totalPages = pendingTasks.pageCount;
                this.pendingTasks.sort((a, b) => { return (a.id < b.id) ? 1 : ((b.id < a.id) ? -1 : 0); });

            });
    }

    onRowSelect(rowSelectEvent) {

        let url = rowSelectEvent.data.taskUi + "taskId=" + rowSelectEvent.data.id + "&command=" + rowSelectEvent.data.commandIdentifier + "&commandReference=" + rowSelectEvent.data.commandReference;
        this.router.navigateByUrl(url);
        ;
    }

    loadLazily(event: LazyLoadEvent) {
        const searchMap: Map<string, number> = new Map();
        searchMap.set('page', (event.first / 20));
        this.fetchPendingTasks(searchMap);
    }

    refresh() {
        this.fetchPendingTasks(new Map());
    }
}