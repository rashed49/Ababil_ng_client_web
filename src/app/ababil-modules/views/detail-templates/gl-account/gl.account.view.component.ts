import { GlAccountService } from './../../../../services/glaccount/service-api/gl.account.service';
import { Currency } from './../../../../services/currency/domain/currency.models';
import { CurrencyService } from './../../../../services/currency/service-api/currency.service';
import { BankService } from './../../../../services/bank/service-api/bank.service';
import { GlAccount } from './../../../../services/glaccount/domain/gl.account.model';
import { ApprovalflowService } from './../../../../services/approvalflow/service-api/approval.flow.service';
import { ViewsBaseComponent } from './../../view.base.component';
import { Location } from '@angular/common';
import { ViewChild, Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NotificationService } from '../../../../common/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
    selector: 'gl-account-view',
    templateUrl: './gl.account.view.component.html'
})
export class GlAccountViewComponent extends ViewsBaseComponent implements OnInit {

    //currencyRestrictions: SelectItem[] = CurrencyRestriction;
    //glSubTypes: SelectItem[] = GlSubType;
    //glTypes: SelectItem[] = GlType;       
    //status: SelectItem[] = Status;

    currencyRestrictions:Map<string,string> = new Map();
    glSubTypes:Map<string,string> = new Map();
    glTypes:Map<string,string> = new Map();
    status:Map<string,string> = new Map();
    branchRestrictions:Map<string,string> = new Map();

    id: number;
    glAccountTree: TreeNode[] = [];
    rootNode: TreeNode;
    glAccountDetails:GlAccount =  new GlAccount();
    branches:any[]=[];
    currencies:Currency[]=[];
    glAccountBranches:any[]=[];
    glAccountCurrencies:Currency[]=[];
    switchableParentGl:GlAccount = new GlAccount();

    @ViewChild('glTreeComponent') glTreeComponent:any;

    constructor(
        private currencyService:CurrencyService,
        private bankService: BankService,
        private route: ActivatedRoute,
        protected location:Location, 
        protected router: Router,       
        protected notificationService: NotificationService,      
        protected approvalflowService: ApprovalflowService,
        private glAccountService:GlAccountService
        ) {
        super(location,router, approvalflowService, notificationService);
    }

    ngOnInit() {
       this.initializeEnumMapValues(); 
       this.fetchCurrencies(); 
       this.fetchBranches();
       this.showVerifierSelectionModal = of(false);        
       this.rootNode = {
            label: "Root",
            data: { gl: null },
            expandedIcon: "ui-icon-folder-open",
            collapsedIcon: "ui-icon-folder",
            expanded: true,
            selectable: false,
            children: []
       };
       this.glAccountTree.push(this.rootNode);       
       this.subscribers.routeSub = this.route.queryParams.subscribe(params => {
            this.command = params['command'];
            this.processId = params['taskId'];
            this.taskId = params['taskId'];
            this.commandReference = params['commandReference'];
            this.subscribers.fetchApprovalFlowTaskInstancePayloadSub=this.fetchApprovalFlowTaskInstancePayload()
            .subscribe(data=>{
               this.prepareGlAccountTree(data);
            });
       });
    }

    initializeEnumMapValues(){        
        this.currencyRestrictions.set("LOCAL_CURRENCY","Local Currency");
        this.currencyRestrictions.set("MULTIPLE_CURRENCY","Specific Currencies");

        this.glSubTypes.set("GENERAL","General");
        this.glSubTypes.set("INTER_BRANCH","Inter Branch");
        this.glSubTypes.set("ADJUSTABLE_DEBIT","Adjustable Debit");
        this.glSubTypes.set("ADJUSTABLE_CREDIT","Adjustable Credit");

        this.glTypes.set("INTERNAL","Internal");
        this.glTypes.set("PRODUCT_GL","Product GL");

        this.status.set("ACTIVATED","Active");
        this.status.set("LOCKED","Lock");
        this.status.set("CLOSED","Close");
        
        this.branchRestrictions.set("SPECIFIC_BRANCH","Specific Branch");
        this.branchRestrictions.set("ALL_BRANCH","All Branch");
        this.branchRestrictions.set("HEAD_OFFICE","Head Office");

    }

    prepareGlAccountTree(treeData) {                    
        treeData.forEach(gl => {
            let glAcc: any = {
                label: gl.name,
                data: gl,
                expandedIcon: "ui-icon-folder-open",
                collapsedIcon: "ui-icon-folder",
                expanded: true,
                styleClass: gl.isModified?(gl.id?"unsaved":"created"):"unchanged"
            };
            if (glAcc.data.parent) {
                glAcc.expandedIcon = "ui-icon-folder-open";
                glAcc.collapsedIcon = "ui-icon-folder";
                glAcc.children = this.getGlNodeChildren(gl);
            } else {
                glAcc.expandedIcon = "ui-icon-fiber-manual-record";
                glAcc.collapsedIcon = "ui-icon-fiber-manual-record";
            }            
            this.rootNode.children.push(glAcc);
        });
    }

    getGlNodeChildren(node){
        if(!node.children || node.children.length<1){
             return;
        }
        let childrens=node.children.map(child=>{
           return {
               label: child.name,
               data: child,
               expandedIcon : (child.parent)?"ui-icon-folder-open":"ui-icon-fiber-manual-record",
               collapsedIcon : (child.parent)?"ui-icon-folder":"ui-icon-fiber-manual-record",
               expanded: true,
               children:this.getGlNodeChildren(child),
               styleClass: child.isModified?(child.id?"unsaved":"created"):"unchanged"
           }
        });        
        return childrens;
    }

    nodeSelect(event){
       this.glAccountDetails=event.node.data;
       if(this.glAccountDetails.switchableGeneralLedgerAccountId){
           this.fetchGeneralLedgerAccount(this.glAccountDetails.switchableGeneralLedgerAccountId);
       }
       if(this.glAccountDetails.branchRestriction=='SPECIFIC_BRANCH'){
          this.glAccountBranches = [...this.branches.filter(
              branch=> {return this.glAccountDetails.branches.includes(branch.id);} 
          )];
       }
       if(this.glAccountDetails.currencyRestriction=='MULTIPLE_CURRENCY'){
          this.glAccountCurrencies = [...this.currencies.filter(
              currency=> {return this.glAccountDetails.currencies.includes(currency.code);} 
          )]; 
       }
        this.glTreeComponent.selection = event.node; 
    }

    fetchBranches() {
        this.bankService.fetchBranchProfiles({ bankId: 1 }, new Map()).subscribe(
            data => {
                this.branches = data;
        });
    }

    fetchCurrencies() {
        this.subscribers.fetchCurrencySub = this.currencyService.fetchCurrencies(new Map())
            .subscribe(data => {
                this.currencies = data.content;
        });
    }
    
    fetchGeneralLedgerAccount(id:number){
        this.subscribers.fetchGlAccountDetailsSub = this.glAccountService.fetchGlAccountDetails({id:id})
        .subscribe(data=>{
           this.switchableParentGl = data;
        });
    }


}
