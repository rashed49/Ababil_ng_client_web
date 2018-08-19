import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MainComponent } from '../app-main/main.component';
import { User, PendingTask } from '../services/approvalflow/domain/approval.flow.models';
import * as searchParamConst from '../common/constants/app.search.parameter.constants';
import { ApprovalflowService } from '../services/approvalflow/service-api/approval.flow.service';
import { BaseComponent } from '../common/components/base.component';
declare var jQuery: any;

@Component({
    selector: 'app-rightpanel',
    templateUrl: './app.rightpanel.component.html',
    styleUrls: ['./app.rightpanel.component.css']
})
export class AppRightPanel extends BaseComponent implements OnInit {

    rightPanelMenuScroller: HTMLDivElement;
    date: Date;
    day: string;
    days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    pendingTasks: PendingTask[];
    pendingTask: PendingTask;
    urlSearchParams: Map<string, string>;
    totalTasks: number;
    taskUi: string;
    havePendingTasks:boolean=false;

    @ViewChild('rightPanelMenuScroller') rightPanelMenuScrollerViewChild: ElementRef;

    constructor(public app: MainComponent, 
        private workflowService:ApprovalflowService,private router:Router) {
        super();
    }


    ngOnInit() {
        this.day = this.days[new Date().getDay()];
        this.date = new Date();
        this.fetchPendingTasks();

    }



    ngAfterViewInit() {
        this.rightPanelMenuScroller = <HTMLDivElement>this.rightPanelMenuScrollerViewChild.nativeElement;

        setTimeout(() => {
            jQuery(this.rightPanelMenuScroller).nanoScroller({ flash: true });
        }, 10);
    }

    ngOnDestroy() {
        jQuery(this.rightPanelMenuScroller).nanoScroller({ flash: true });
    }

    fetchPendingTasks() {
        this.urlSearchParams = new Map([[searchParamConst.IS_ADMIN, searchParamConst.FALSE]]);
        this.subscribers.fetchSub = this.workflowService.fetchPendingTasks(this.urlSearchParams).subscribe(
            pendingTasks => {
                if(pendingTasks.content.length>0){
                this.pendingTasks = pendingTasks.content;
                this.totalTasks = +this.pendingTasks.length;
                this.havePendingTasks=true;
            }
            }
        )
    }

    onPendingTaskLinkClick(task){
       let url =task.taskUi+"taskId="+task.id+"&command="+task.commandIdentifier+"&commandReference="+task.commandReference; 
       this.router.navigateByUrl(url);
       
    }

}