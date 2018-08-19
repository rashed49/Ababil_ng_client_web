import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApprovalflowProfile, ApprovalflowTask } from '../../../../services/approvalflow/domain/approval.flow.models';
import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';
import { Subscriber, Observable } from 'rxjs';
import { PathParameters } from '../../../../services/base.service';
import { NotificationService, NotificationType } from '../../../../common/notification/notification.service';
import { BaseComponent } from '../../../../common/components/base.component';
import { TreeNode } from 'primeng/components/common/treenode';

@Component({
    selector: 'approvalflow-detail',
    templateUrl: './approval.flow.detail.component.html',
    styleUrls: ['./approval.flow.detail.component.scss']
})
export class ApprovalflowDetailComponent extends BaseComponent implements OnInit, OnDestroy {

    approvalflowId: number;
    tasks: Observable<ApprovalflowTask[]>;
    taskNodes: TreeNode[];
    approverAssignmentRestrictionMap: Map<string, string> = new Map();
    approverBranchRestrictionMap: Map<string, string> = new Map();
    userLevelRestrictionMap: Map<string, string> = new Map();
    approvalflowProfile: ApprovalflowProfile = new ApprovalflowProfile();
    @ViewChild('approvalFlowDialog') approvalFlowDialog: any;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private approvalflowService: ApprovalflowService,
        private notificationService: NotificationService) {
        super();
    }

    ngOnInit(): void {
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.approvalflowId = +params['id'];
            this.fetchApprovalflowDetail();
            this.fetchApprovalflowTasks();
        });

        this.approverAssignmentRestrictionMap.set("ROLE", "Role");
        this.approverAssignmentRestrictionMap.set("SPECIFIC_USER", "Specific User");

        this.approverBranchRestrictionMap.set("SAME_BRANCH", "Same Branch");
        this.approverBranchRestrictionMap.set("SPECIFIC_BRANCH", "Specific Branch");
        this.approverBranchRestrictionMap.set("ACCOUNT_OWNER_BRANCH", "Account Owner Branch");
        this.approverBranchRestrictionMap.set("ANY_BRANCH", "Any Branch");

        this.userLevelRestrictionMap.set("ANY", "Any");
        this.userLevelRestrictionMap.set("HIGHER", "Higher");
        this.userLevelRestrictionMap.set("SAME", "Same");
        this.userLevelRestrictionMap.set("SPECIFIC", "Specific");

    }

    fetchApprovalflowDetail() {
        this.subscribers.approvalflowDetailSub = this.approvalflowService
            .fetchApprovalflowProfileDetail({ "id": this.approvalflowId + "" })
            .subscribe(profileDetails => this.approvalflowProfile = profileDetails);
    }

    fetchApprovalflowTasks() {
        let urlSearchParam = new Map([['profile', this.approvalflowId + ""]]);
        this.subscribers.fetchApprovalflowTasksSub = this.approvalflowService
            .fetchApprovalflowTasks(urlSearchParam, { "profileId": this.approvalflowId + "" })
            .subscribe(data => {
                this.tasks = data.sort((a, b) => a.id - b.id);
                this.prepareTaskTree(data);
            });
    }

    prepareTaskTree(tasks: ApprovalflowTask[]) {
        this.taskNodes = [];
        if (tasks.length === 0) return;
        this.taskNodes.push(this.addChild(tasks, 0));
    }

    addChild(tasks: ApprovalflowTask[], index: number) {
        if (index === tasks.length - 1) {
            return { type: 'person', label: tasks[index].name, data: tasks[index] };
        }
        return { type: 'person', expanded: true, label: tasks[index].name, data: tasks[index], children: [this.addChild(tasks, index + 1)] };
    }

    cancel() {
        this.navigateAway();
    }

    navigateAway(): void {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }

    createTask() {
        this.router.navigate(['task/create'], { relativeTo: this.route });
    }

    onTaskSelect(event) {
        this.router.navigate(['tasks', event.node.data.id], { relativeTo: this.route });
    }

    edit() {
        this.approvalFlowDialog.showDialog = true;
    }

    onSave(approvalflowProfile: ApprovalflowProfile): void {
        this.updateApprovalflow(approvalflowProfile);
    }

    updateApprovalflow(approvalflow: ApprovalflowProfile) {
        this.subscribers.updateApprovalflowSub = this.approvalflowService
            .updateApprovalflow(approvalflow, { "id": this.approvalflowId + "" })
            .subscribe(data => {
                this.approvalFlowDialog.close();
                this.notificationService.sendSuccessMsg("workflow.update.success");
                this.fetchApprovalflowDetail();
            });
    }
}