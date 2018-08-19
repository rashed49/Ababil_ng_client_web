import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { CommandService } from '../../../../services/command/service-api/command.service';
import { Command } from '../../../../services/command/domain/command.model';
import { NotificationService } from '../../../../common/notification/notification.service';
import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NodeService } from '../../../../demo/service/nodeservice';
import { SelectItem } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '../../../../common/components/base.component';

export interface CommandSearch {
    name?: string,
    group?: string
}

@Component({
    selector: 'approvalflow-command-mapping-detail',
    templateUrl: './approval.flow.command.mapping.detail.component.html'
})
export class ApprovalflowCommandMappingComponent extends BaseComponent implements OnInit{

    allCommands: any[];
    changedCommands: Map<number, Command>;
    approvalFlows: SelectItem[];
    commandSearch: CommandSearch;
    searchForm: FormGroup;
    totalRecords:number;
    totalPages:number;

    @ViewChild('op') searchPanel:any;

    constructor( private renderer:Renderer2,private formBuilder: FormBuilder, private nodeService: NodeService, private route: ActivatedRoute, private router: Router, private commandService: CommandService, private workflowService: ApprovalflowService, private notificationService: NotificationService) {
      super();
    }

    ngOnInit() {
        this.changedCommands = new Map();
        this.approvalFlows = [];
        this.prepareSearchForm();
        this.fetchAllApprovalFlow();

        this.renderer.listen('window', 'scroll', (evt) => { 
          this.searchPanel.hide();                  
    });
              
    }

    prepareSearchForm() {
        this.searchForm = this.formBuilder.group({
            name: ['', [Validators.maxLength(32)]],
            group: ['', [Validators.maxLength(32)]]
        });
    }

    search(){
        this.fetchAllCommands(this.getSearchMap());
    }

    refresh(){
        this.prepareSearchForm();
        this.fetchAllApprovalFlow();
    }

    fetchAllApprovalFlow() {
       this.approvalFlows.push({label:"Select approval flow",value:null});       
       let urlSearchParam = new Map([[ 'all',  'true' ]]);

       this.subscribers.fetchWorkflowSub=this.workflowService.fetchApprovalFlowProfiles(urlSearchParam).subscribe(data=>{
            data.forEach(element=>{
                this.approvalFlows.push({label:element.name,value:element.id});
            });
            this.fetchAllCommands(this.getSearchMap());    
       });
    }

    updateCommandApprovalMappings() {
        let commandsToUpdate: Command[] = [];

        this.changedCommands.forEach(element => {
            commandsToUpdate.push(element);
        });

        this.subscribers.updateSub=this.commandService.
        updateCommandMappings(commandsToUpdate).subscribe(
            data=>{this.notificationService.sendSuccessMsg("workflow.comman.mapping.save.success");}
        );
        console.log(commandsToUpdate);
    }

    fetchAllCommands(searchMap:Map<string,any>) {
        this.changedCommands = new Map();
        this.subscribers.fetchSub=this.commandService.fetchAllCommands(searchMap).subscribe(
            data=>{
               this.allCommands=data.content;
               this.totalRecords=(data.pageSize*data.pageCount);
               this.totalPages=data.pageCount;
            }
        );
    }

    getSearchMap(): Map<string, any> {
        let searchMap = new Map();
        if (this.searchForm.get('name').value.trim() != '') {
            searchMap.set("name", this.searchForm.get('name').value.trim());
        }
        if (this.searchForm.get('group').value.trim() != '') {
            searchMap.set("group", this.searchForm.get('group').value.trim());
        }
        return searchMap;
    }

    loadCommandMappingsLazy(event: LazyLoadEvent){
       let searchMap=this.getSearchMap();
       searchMap.set("page",(event.first/20));
       //set page
       this.fetchAllCommands(searchMap);
    }

    handleValueChange(data) {
        this.changedCommands.set(data.id, data);
    }


}