import { BalanceSheetReportMappingCofigurationService } from './../../../services/glaccount/service-api/balance.sheet.report.configuration.service';
import { MenuItem } from 'primeng/primeng';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlAccountService } from './../../../services/glaccount/service-api/gl.account.service';
import { NotificationService } from './../../../common/notification/notification.service';
import { BalanceSheetMappingType, BalanceSheetReportConfiguration, AccountNature } from './../../../services/glaccount/domain/balance.sheet.report.config.model';
import { NodeService } from './../../../demo/service/nodeservice';
import { ApprovalflowService } from './../../../services/approvalflow/service-api/approval.flow.service';
import { Location } from '@angular/common';
import { TreeNode } from 'primeng/components/common/treenode';
import { OnInit, AfterViewInit } from '@angular/core';
import { FormBaseComponent } from './../../../common/components/base.form.component';
import { Component } from '@angular/core';

@Component({
    selector: 'balance-sheet-report-configuration',
    templateUrl: './balance.sheet.report.configuration.component.html',
    styleUrls: ['./balance.sheet.report.configuration.component.scss']
})
export class BalanceSheetReportConfigurationComponent extends FormBaseComponent implements OnInit, AfterViewInit {


    glAccounts: TreeNode[];
    balanceSheetMappings: TreeNode[];
    selectedFiles: any[];

    selectedBalanceSheetType: BalanceSheetMappingType = "BALANCE_SHEET";
    balanceSheetMappingTypes: any[] = [];

    selectedAccountNature: AccountNature = "ASSET";
    accountNatures: any[] = [];

    glLevel: number;
    showAddGroupModal: boolean;

    addGroupForm: FormGroup;
    loading: boolean = false;
    selectedBalanceSheetMappingConfig: TreeNode;
    contextMenu: MenuItem[];

    addedGlAccounts:Set<number> = new Set([]);

    accountNumber:string;

    constructor(protected location: Location,
        protected approvalFlowService: ApprovalflowService,
        private nodeService: NodeService,
        private notificationService: NotificationService,
        private glAccountService: GlAccountService,
        private formBuilder: FormBuilder,
        private balanceSheetMappingService: BalanceSheetReportMappingCofigurationService) {
        super(location, approvalFlowService);
    }

    ngOnInit() {
        this.balanceSheetMappingTypes = [
            { label: 'Balance Sheet', value: 'BALANCE_SHEET' },
            { label: 'Profit & Loss', value: 'PROFIT_AND_LOSE' }
        ];

        this.accountNatures = [
            { label: 'Asset', value: 'ASSET' },
            { label: 'Liability', value: 'LIABILITY' },
            { label: 'Income', value: 'INCOME' },
            { label: 'Expenditure', value: 'EXPENDITURE' }
        ];

        this.balanceSheetMappings = [];
        this.glAccounts = [];
        this.showAddGroupModal = false;
        this.loading = false;
        this.prepareAddGroupForm();

        this.contextMenu = [
            { label: 'Remove node', icon: 'ui-icon-cancel', command: (event) => { console.log(event) } }
        ];

        this.loadBalanceSheetMappings(true);
    }

    ngAfterViewInit() {

    }

    prepareAddGroupForm() {
        this.addGroupForm = this.formBuilder.group({
            name: ['', [Validators.required]]
        });
    }

    loadBalanceSheetMappings(reset:boolean) {
        if(reset){
           this.glAccounts = [];
           this.glLevel = null;  
        }
        this.addedGlAccounts =new Set([]);
        this.balanceSheetMappings = [];
        this.selectedBalanceSheetMappingConfig = null;
        let urlSearchMap = new Map();
        urlSearchMap.set('type', this.selectedBalanceSheetType);
        urlSearchMap.set('account-nature', this.selectedAccountNature);
        this.subscribers.balanceSheetMappingFetchSub = this.balanceSheetMappingService.fetchBalanceSheetMappings(urlSearchMap)
            .subscribe(data => {
                if (data && data.length > 0) {
                    data.forEach(element => {
                         if(element.parentBalanceSheetMappingId==null){
                             this.balanceSheetMappings.push(this.fromNodeToTree(data,element));
                         }
                    });                    
                }               
        });
    }

    fromNodeToTree(data, element) {
        if(element.generalLedgerAccountId){
            if(!this.addedGlAccounts.has(element.generalLedgerAccountId)){
               this.addedGlAccounts.add(element.generalLedgerAccountId);   
            }
            if(this.glLevel==null){
                this.getGlAccountDetails(element.generalLedgerAccountId);
            }
        }

        if(element.generalLedgerAccountId && !this.glLevel){
             this.getGlAccountDetails(element.generalLedgerAccountId);
        }
        let balanceSheetMapping = {
            expandedIcon: "ui-icon-ac-unit",
            collapsedIcon: "ui-icon-ac-unit",
            expanded: false,
            data: element,
            label: element.name,
            children: null
        };
        let childrenTree = [];
        let children = data.filter(mapping => element.id == mapping.parentBalanceSheetMappingId);
        if (children.length != 0) {            
            children.forEach(child => {
                childrenTree.push(this.fromNodeToTree(data,child));
            });
            balanceSheetMapping.children = childrenTree;            
        }
        return balanceSheetMapping;
    }

    loadGlAccountsByGlLevel() {
        if (this.glLevel < 2) {
            this.notificationService.sendInfoMsg("balance.sheet.gl.level.min.info");
        } else {
            this.loading = true;
            let urlSearchParams = new Map();
            urlSearchParams.set('level', this.glLevel);
            urlSearchParams.set('roots', "false");
            this.glAccountService.fetchGlAccounts(urlSearchParams).subscribe(data => {
                this.glAccounts = [];
                let tempGlAccounts = [];
                data.forEach(element => {
                    tempGlAccounts.push({
                        expandedIcon: "ui-icon-ac-unit",
                        collapsedIcon: "ui-icon-ac-unit",
                        expanded: false,
                        data: { id: null, name: element.name, generalLedgerAccountId: element.id },
                        label: element.name
                    });
                });
                this.glAccounts = tempGlAccounts.filter(acc=>!this.addedGlAccounts.has(acc.data.generalLedgerAccountId));
                this.loading = false;
            });
        }
    }

    closeAddGroupModal() {
        this.showAddGroupModal = false;
        this.prepareAddGroupForm();
    }

    addGroup() {
        this.showAddGroupModal = true;
    }

    onAddGroup() {
        let balanceSheetReportConfiguration: any = {};
        balanceSheetReportConfiguration.name = this.addGroupForm.controls['name'].value;
        balanceSheetReportConfiguration.isBaseLevel = true;

        let node = {
            expandedIcon: "ui-icon-ac-unit",
            collapsedIcon: "ui-icon-ac-unit",
            expanded: false,
            data: balanceSheetReportConfiguration,
            label: balanceSheetReportConfiguration.name
        };

        if (this.selectedBalanceSheetMappingConfig) {
            if (!this.selectedBalanceSheetMappingConfig.children) {
                this.selectedBalanceSheetMappingConfig.children = [];
            }
            this.selectedBalanceSheetMappingConfig.children.push(node);
        } else {
            this.balanceSheetMappings.push(node);
        }

        this.closeAddGroupModal();
    }

    onSubmit() {        
        let balanceSheetMappingsToSave = [];
        this.balanceSheetMappings.forEach(mapping => {
            let mappingToSave = new BalanceSheetReportConfiguration();
            if (mapping.data.id) mappingToSave.id = mapping.data.id;
            if (mapping.data.name) mappingToSave.name = mapping.data.name;
            if (mapping.data.generalLedgerAccountId) mappingToSave.generalLedgerAccountId =  mapping.data.generalLedgerAccountId;
            mappingToSave.nature = this.selectedAccountNature;
            mappingToSave.type = this.selectedBalanceSheetType;
            if (mapping.children) {
                mappingToSave.childBalanceSheetMappings = this.mapTreeNodeToBalanceSheetMapping(mapping);
            }
            balanceSheetMappingsToSave.push(mappingToSave);
        });
        this.balanceSheetMappingService.saveBalanceSheetMappings(balanceSheetMappingsToSave).subscribe(data => {
            this.notificationService.sendSuccessMsg("balance.sheet.report.mappings.save.success");
        });
    }


    mapTreeNodeToBalanceSheetMapping(node: TreeNode) {
        let balanceSheetMappings = [];
        node.children.forEach(child => {
            let balanceSheetReportConfiguration: BalanceSheetReportConfiguration = new BalanceSheetReportConfiguration();
            if (child.data.id) balanceSheetReportConfiguration.id = child.data.id;
            if (child.data.name) balanceSheetReportConfiguration.name = child.data.name;
            if (child.data.generalLedgerAccountId) balanceSheetReportConfiguration.generalLedgerAccountId = child.data.generalLedgerAccountId;
            if (child.children) balanceSheetReportConfiguration.childBalanceSheetMappings = this.mapTreeNodeToBalanceSheetMapping(child);
            balanceSheetReportConfiguration.nature = this.selectedAccountNature;
            balanceSheetReportConfiguration.type = this.selectedBalanceSheetType;
            balanceSheetMappings.push(balanceSheetReportConfiguration);
        });
        return balanceSheetMappings;
    }    

    onRemoveBalanceSheetMapping(event){           
        
        this.glAccounts = this.glAccounts.map( acc =>{
            if(acc.children) acc.children=null;  
            return acc; 
        }).filter(acc => acc.data.generalLedgerAccountId!=null);

        if(event.dragNode.data.id){
            this.balanceSheetMappingService.deleteBalanceSheetMapping({id:event.dragNode.data.id})
            .subscribe(data=>{
                this.notificationService.sendSuccessMsg("balance.sheet.report.mapping.delete.success");
                this.loadBalanceSheetMappings(false);
            });
        } 
        this.filterGlAccounts(event.dragNode);
        this.selectedBalanceSheetMappingConfig = null;
    }

    filterGlAccounts(node){

        if(node.data.generalLedgerAccountId){
            this.glAccounts.push({
                expandedIcon: "ui-icon-ac-unit",
                collapsedIcon: "ui-icon-ac-unit",
                expanded: false,
                data: { id: null, name: node.data.name, generalLedgerAccountId: node.data.generalLedgerAccountId },
                label: node.data.name 
            }); 
        }

        if(node.children){
            node.children.forEach(child => {
                this.filterGlAccounts(child);
            });
        }
    }

    getGlAccountDetails(glId){
       this.glAccountService.fetchGlAccountDetails({id:glId}).subscribe(data=>{
           this.glLevel = data.level;
           this.loadGlAccountsByGlLevel();
       }); 
    }


}