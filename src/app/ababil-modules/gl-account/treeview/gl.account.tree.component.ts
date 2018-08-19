import { GlAccount } from './../../../services/glaccount/domain/gl.account.model';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { VerifierSelectionEvent } from './../../../common/components/verifier-selection/verifier.selection.component';
import { FormBaseComponent } from './../../../common/components/base.form.component';
import { ApprovalflowService } from './../../../services/approvalflow/service-api/approval.flow.service';
import { BankService } from './../../../services/bank/service-api/bank.service';
import { CurrencyService } from './../../../services/currency/service-api/currency.service';
import { GlSubType, GlType, ReconciliationType, ReEvaluationFrequency, Status, GLCurrencyRestriction, GlBranchRestrictions } from './../../../common/domain/gl.enum.model';
import { SelectItem } from 'primeng/api';
import { ViewChild, AfterViewInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { GlAccountService } from '../../../services/glaccount/service-api/gl.account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { NotificationService } from '../../../common/notification/notification.service';
import { MenuItem, TreeNode } from 'primeng/primeng';
import { Location } from '@angular/common';
import { v4 as uuid } from 'uuid';
import * as commandConstants from '../../../common/constants/app.command.constants';


export const SUCCESS_MSG: string[] = ["glaccount.save.success", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/gl-account?";

@Component({
    selector: 'gl-account-tree',
    templateUrl: './gl.account.tree.component.html',
    styleUrls: ['./gl.account.tree.component.scss']
})
export class GlAccountTreeViewComponent extends FormBaseComponent implements OnInit, AfterViewInit {

    constructor(private confirmationService: ConfirmationService,
        protected location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private glAccountService: GlAccountService,
        private notificationService: NotificationService,
        private currencyService: CurrencyService,
        private bankService: BankService,
        protected approvalFlowService: ApprovalflowService) {
        super(location, approvalFlowService);
    }

    currencyRestrictions: SelectItem[] = GLCurrencyRestriction;

    glSubTypes: SelectItem[] = GlSubType;
    glTypes: SelectItem[] = GlType;
    //leafTypes: SelectItem[] = LeafType;
    reconciliationTypes: SelectItem[] = ReconciliationType;
    reEvaluationFrequencies: SelectItem[] = ReEvaluationFrequency;
    statuses: SelectItem[] = Status;
    branchRestrinction: SelectItem[] = GlBranchRestrictions;

    glAccounts: GlAccount[];
    glAccountTree: TreeNode[] = [];
    parentNodeMenus: MenuItem[];
    childNodeMenus: MenuItem[];
    rootNodeMenus: MenuItem[];
    selectedNode: TreeNode = { data: { gl: new GlAccount() } };
    rootNode: TreeNode;

    glAccountFormData: GlAccount = new GlAccount();
    selectedGl: GlAccount;
    branches: SelectItem[] = [];
    invalidNodes = new Set([]);
    currencies: SelectItem[] = [];

    generalLedgerCategories: any[] = [];
    glAccountLookUpMode: string = 'GL_ACCOUNT_PATH';
    glAccountLookUpDisplay: boolean = false;
    switchableParentGl: GlAccount = new GlAccount();

    generalLedgerCodeLengthConfiguration: number = 10;
    showContextMenu: boolean = false;

    glSubTypesForLiabilityHead: SelectItem[] = [
        { label: "Select Gl SubType", value: null },
        { label: "General", value: "GENERAL" },
        { label: "Inter branch", value: "INTER_BRANCH" },
        { label: "Adjustable debit", value: "ADJUSTABLE_DEBIT" }
    ];

    glSubTypesForAssetHead: SelectItem[] = [
        { label: "Select Gl SubType", value: null },
        { label: "General", value: "GENERAL" },
        { label: "Inter branch", value: "INTER_BRANCH" },
        { label: "Adjustable credit", value: "ADJUSTABLE_CREDIT" }
    ];

    @ViewChild('glAccountForm') glAccountForm: any;
    @ViewChild('glTreeComponent') glTreeComponent: any;

    ngOnInit() {

        this.fetchCurrencies();
        this.fetchBranches();
        this.fetchGlCategories();
        this.fetchGeneralLedgerCodeLengthConfiguration();
        this.command = commandConstants.SAVE_GENERAL_LEDGER_ACCOUNTS_COMMAND;
        this.showVerifierSelectionModal = of(false);
        this.parentNodeMenus = [
            { label: 'Add Child', icon: 'ui-icon-add', command: (event) => { this.addChildGl(); } },
            //{ label: 'Configure Profit Rate', icon: 'ui-icon-settings', command: (event) => { this.goToConfigureProfitRatePage(); } },
            //{ label: 'Configure Limit', icon: 'ui-icon-settings', command: (event) => { this.goToConfigureLimit(); } }

        ];
        this.childNodeMenus = [
            //{ label: 'Configure Profit Rate', icon: 'ui-icon-settings', command: (event) => { this.goToConfigureProfitRatePage(); } },
            //{ label: 'Configure Limit', icon: 'ui-icon-settings', command: (event) => { this.goToConfigureLimit(); } }
        ];
        this.rootNodeMenus = [
            { label: 'Refresh', icon: 'ui-icon-refresh', command: (event) => { this.refresh(); } }
        ];
        this.rootNode = {
            label: "Root",
            data: { gl: null },
            expandedIcon: "ui-icon-folder-open",
            collapsedIcon: "ui-icon-folder",
            expanded: true,
            selectable: false,
            children: []
        };
        this.subscribers.routeQueryParamSub = this.route.queryParams.subscribe(queryParams => {
            if (queryParams['taskId']) {
                this.taskId = queryParams['taskId'];
                this.loadCorrectionData();
                if (queryParams['commandReference']) {
                    this.commandReference = queryParams['commandReference'];
                }
            } else {
                this.taskId = null;
                this.commandReference = null;
                this.glAccountTree = [];
                this.glAccountTree.push(this.rootNode);
                this.fetchRootGlAccounts();
            }
        });
    }

    ngAfterViewInit() {
        this.glAccountForm.statusChanges.subscribe(status => {
            if (this.selectedNode.data.gl.isModified) {
                this.markFormGroupAsTouched(this.glAccountForm.form);
            }
            this.updateCSSBasedOnFormValidity();
            this.initEnterNavigation('gl-account-tree');
        });

        this.glAccountForm.valueChanges.subscribe(value => {
            if (this.selectedNode.data.gl.isModified) {
                this.markFormGroupAsTouched(this.glAccountForm.form);
            }
            this.initEnterNavigation('gl-account-tree');
        });


    }

    addChildGl() {
        this.fetchChildGlAccounts(this.selectedNode, true);
    }

    goToConfigureProfitRatePage() {

        if (!this.selectedNode.data.gl.isProfitCalculationAllowed) {
            this.notificationService.sendInfoMsg("can.not.configure.profit");
            return;
        }

        if (this.selectedNode.data.gl.id && !this.selectedNode.data.modificationId) {
            if (this.getChangedGlAccountTree().length > 0) {
                this.confirmationService.confirm({
                    message: 'You have some unsaved changes. Do you want to proceed?',
                    accept: () => {
                        this.router.navigate(['profit-rate', this.selectedNode.data.gl.id], { relativeTo: this.route });
                    }
                });
            } else {
                this.router.navigate(['profit-rate', this.selectedNode.data.gl.id], { relativeTo: this.route });
            }
        } else {
            this.notificationService.sendInfoMsg("save.glnode.for.profit.rate.info");
        }
    }

    goToConfigureLimit() {

        if (!this.selectedNode.data.gl.isLimitRequired) {
            this.notificationService.sendInfoMsg("can.not.configure.limit");
            return;
        }

        if (this.selectedNode.data.gl.id && !this.selectedNode.data.modificationId) {
            if (this.getChangedGlAccountTree().length > 0) {
                this.confirmationService.confirm({
                    message: 'You have some unsaved changes. Do you want to proceed?',
                    accept: () => {
                        this.router.navigate(['limit/detail', this.selectedNode.data.gl.id], { relativeTo: this.route });
                    }
                });
            } else {
                this.router.navigate(['limit/detail', this.selectedNode.data.gl.id], { relativeTo: this.route });
            }
        } else {
            this.notificationService.sendInfoMsg("save.glnode.for.limit.info");
        }
    }

    searchGlAccount(mode: string) {
        this.glAccountLookUpMode = mode;
        this.glAccountLookUpDisplay = true;
    }

    onSearchResult(event) {
        this.rootNode.expanded = true;
        this.switchableParentGl = new GlAccount();
        if (event.mode == 'GL_ACCOUNT_PATH') {
            let path = event.data.split("/").filter(val => val.trim() != '').map(val => {
                return +val;
            });
            this.searchOnGlTreeByPath(path);

        } else {
            this.selectedNode.data.gl.switchableGeneralLedgerAccountId = event.data.id;
            this.glAccountChangeByUserInput(null);
            this.getSwitchableParentGlAccountDetails(this.selectedNode.data.gl.switchableGeneralLedgerAccountId);
        }
    }

    onSearchModalClose(event) {
        this.glAccountLookUpMode = 'GL_ACCOUNT_PATH';
        this.glAccountLookUpDisplay = false;
    }

    removeSwicthableParentGl() {
        this.selectedNode.data.gl.switchableGeneralLedgerAccountId = null;
        this.switchableParentGl = new GlAccount();
        this.glAccountChangeByUserInput(null);
    }

    async searchOnGlTreeByPath(path: number[]) {
        let currentNode: TreeNode = this.rootNode;
        let currentIndex = 0;
        let indexLength = path.length;

        while (currentIndex < indexLength) {
            currentNode = currentNode.children.filter(
                node => node.data.gl.id === path[currentIndex]
            )[0];
            if (currentNode.data.gl.parent && (!currentNode.children || currentNode.children.length == 0)) {
                await this.glAccountService.
                    fetchGlAccounts(new Map([["aspage", "false"], ["parentId", currentNode.data.gl.id + ""]]))
                    .pipe(first()).toPromise()
                    .then(data => {
                        currentNode.children = [];
                        data.forEach(node => {
                            let childNode: any = {};
                            childNode = {
                                label: node.name,
                                data: { gl: node, modificationId: null },
                                expanded: false
                            }
                            if (childNode.data.gl.parent) {
                                childNode.expandedIcon = "ui-icon-folder-open";
                                childNode.collapsedIcon = "ui-icon-folder";
                                childNode.children = [];
                            } else {
                                childNode.expandedIcon = "ui-icon-fiber-manual-record";
                                childNode.collapsedIcon = "ui-icon-fiber-manual-record";
                            }
                            currentNode.children.
                                push(childNode);
                        });
                    });
            }
            currentNode.expanded = true;
            currentIndex = currentIndex + 1;
        }
        this.selectedNode = currentNode;
        this.glTreeComponent.selection = this.selectedNode;
        if (this.selectedNode.data.modificationId) {
            this.markFormGroupAsTouched(this.glAccountForm);
        } else {
            this.markFormGroupAsUnTouched(this.glAccountForm);
        }
    }

    refresh() {
        if (this.taskId) {
            this.loadCorrectionData();
        } else {
            this.fetchRootGlAccounts();
        }
        this.selectedNode = { data: { gl: new GlAccount() } };
        this.switchableParentGl = new GlAccount();
        this.glAccountForm.form.markAsUntouched();
        this.glAccountForm.form.markAsPristine();
        this.invalidNodes = new Set([]);
    }

    createChildGl() {
        let tempGl = new GlAccount();
        tempGl.parentGeneralLedgerAccountId = this.selectedNode.data.gl.id ? this.selectedNode.data.gl.id : null;
        tempGl.parent = false;
        tempGl.name = "Node-".concat(uuid().substring(1, 8));
        let node = {
            expandedIcon: "ui-icon-fiber-manual-record",
            collapsedIcon: "ui-icon-fiber-manual-record",
            expanded: false,
            data: { gl: tempGl, modificationId: uuid() },
            label: tempGl.name,
            styleClass: 'unsaved-invalid'
        }
        this.selectedNode.children.push(node);
        this.selectedNode = node;
        this.glTreeComponent.selection = node;
        if (this.selectedNode.data.modificationId != null) this.invalidNodes.add(this.selectedNode.data.modificationId);
        this.markFormGroupAsTouched(this.glAccountForm.form);
    }

    glAccountChangeByUserInput(event) {
        if (!this.selectedNode.data.gl.isDirectPostingAllowed) {
            this.selectedNode.data.gl.isDirectPostingDebitAllowed = false;
            this.selectedNode.data.gl.isDirectPostingCreditAllowed = false;
        }

        if (this.selectedNode.data.gl.parent) {
            this.selectedNode.data.gl.isDirectPostingAllowed = false;
            this.selectedNode.data.gl.isDirectPostingDebitAllowed = false;
            this.selectedNode.data.gl.isDirectPostingCreditAllowed = false;
        }

        if (this.selectedNode.data.gl.type == 'PRODUCT_GL') {
            this.selectedNode.data.gl.isNegativeBalanceAllowed = false;
            this.selectedNode.data.gl.isProfitCalculationAllowed = false;
            this.selectedNode.data.gl.isLimitRequired = false;
            this.selectedNode.data.gl.isTemporary = false;
        }

        if (this.selectedNode.data.gl.subType !== 'INTER_BRANCH') {
            this.selectedNode.data.gl.isIbtaRequired = false;
        }

        if (this.selectedNode.data.gl.currencyRestriction == 'LOCAL_CURRENCY') {
            this.selectedNode.data.gl.currencies = [];
        }

        if (this.selectedNode.data.gl.branchRestriction != 'SPECIFIC_BRANCH') {
            this.selectedNode.data.gl.branches = [];
        }

        if (this.selectedNode.data.gl.parent) {
            this.showContextMenu = true;
            this.selectedNode.expandedIcon = "ui-icon-folder-open";
            this.selectedNode.collapsedIcon = "ui-icon-folder";
            this.selectedNode.children = this.selectedNode.children ? this.selectedNode.children : [];
        } else {
            this.showContextMenu = false;
            this.selectedNode.expandedIcon = "ui-icon-fiber-manual-record";
            this.selectedNode.collapsedIcon = "ui-icon-fiber-manual-record";
        }

        if (this.selectedNode.data.modificationId == null) {
            this.selectedNode.data.modificationId = uuid();
            this.updateCSSBasedOnFormValidity();
        }
        this.markFormGroupAsTouched(this.glAccountForm.form);
    }

    updateCSSBasedOnFormValidity() {
        if (this.selectedNode.data.modificationId == null) {
            return;
        }
        if (this.glAccountForm.valid) {
            if (this.invalidNodes.has(this.selectedNode.data.modificationId)) {
                this.invalidNodes.delete(this.selectedNode.data.modificationId);
            }
            this.changeCSSClassOfNode(this.selectedNode, 'unsaved');
        } else {
            if (this.selectedNode.data.modificationId != null) {
                if (!this.invalidNodes.has(this.selectedNode.data.modificationId)) {
                    this.invalidNodes.add(this.selectedNode.data.modificationId);
                }
                this.changeCSSClassOfNode(this.selectedNode, 'unsaved-invalid');
            }
        }
    }

    changeCSSClassOfNode(node, state) {
        node.styleClass = state;
        if (node.children) {
            node.children.forEach(child => {
                if (child.data.modificationId) {
                    if (this.invalidNodes.has(child.data.modificationId)) {
                        this.changeCSSClassOfNode(child, 'unsaved-invalid');
                    } else {
                        this.changeCSSClassOfNode(child, 'unsaved');
                    }
                } else {
                    this.changeCSSClassOfNode(child, 'unchanged');
                }
            });
        }
    }

    fetchRootGlAccounts() {
        this.subscribers.glAccountFetchSub = this.glAccountService.
            fetchGlAccounts(new Map([["roots", "true"], ["aspage", "false"]]))
            .subscribe(data => {
                this.glAccounts = data.sort(function (a, b) {
                    return a.sortOrder - b.sortOrder;
                });
                this.createGlAccountTree();
                this.invalidNodes.clear();
            });
    }

    loadCorrectionData() {
        if (!!this.taskId) {
            this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload().subscribe(
                data => {
                    this.prepareCorrectionGlAccountTree(data);
                }
            );
        }
    }

    prepareCorrectionGlAccountTree(treeData) {
        this.glAccountTree = [];
        this.rootNode.children = [];
        treeData.forEach(gl => {
            let glAcc: any = {
                label: gl.name,
                data: { gl: gl, modificationId: gl.isModified ? uuid() : null },
                expandedIcon: "ui-icon-folder-open",
                collapsedIcon: "ui-icon-folder",
                expanded: true,
                styleClass: gl.isModified ? (gl.id ? "unsaved" : "created") : "unchanged"
            };
            if (glAcc.data.gl.parent) {
                glAcc.expandedIcon = "ui-icon-folder-open";
                glAcc.collapsedIcon = "ui-icon-folder";
                glAcc.children = this.getCorrectionGlNodeChildren(gl);
            } else {
                glAcc.expandedIcon = "ui-icon-fiber-manual-record";
                glAcc.collapsedIcon = "ui-icon-fiber-manual-record";
            }
            this.rootNode.children.push(glAcc);
        });

        this.glAccountTree.push(this.rootNode);
        if (this.rootNode.children.length > 0) {
            this.selectedNode = this.rootNode.children[0];
            this.glTreeComponent.selection = this.rootNode.children[0];
        }
    }

    getCorrectionGlNodeChildren(node) {
        if (!node.children || node.children.length < 1) {
            return;
        }
        let childrens = node.children.map(child => {
            return {
                label: child.name,
                data: { gl: child, modificationId: child.isModified ? uuid() : null },
                expandedIcon: (child.parent) ? "ui-icon-folder-open" : "ui-icon-fiber-manual-record",
                collapsedIcon: (child.parent) ? "ui-icon-folder" : "ui-icon-fiber-manual-record",
                expanded: true,
                children: this.getCorrectionGlNodeChildren(child),
                styleClass: child.isModified ? (child.id ? "unsaved" : "created") : "unchanged"
            }
        });
        return childrens;
    }

    createGlAccountTree() {
        this.rootNode.children = [];//reset              
        this.glAccounts.forEach(gl => {
            let glAcc: any = {
                label: gl.name,
                data: { gl: gl, modificationId: null },
                expandedIcon: "ui-icon-folder-open",
                collapsedIcon: "ui-icon-folder",
                expanded: false
            };
            if (glAcc.data.gl.parent) {
                glAcc.expandedIcon = "ui-icon-folder-open";
                glAcc.collapsedIcon = "ui-icon-folder";
                glAcc.children = [];
            } else {
                glAcc.expandedIcon = "ui-icon-fiber-manual-record";
                glAcc.collapsedIcon = "ui-icon-fiber-manual-record";
            }
            this.rootNode.children.push(glAcc);
        });

        if (this.rootNode.children.length > 0) {
            this.fetchChildGlAccounts(this.rootNode.children[0], false);
            this.selectedNode = this.rootNode.children[0];
            this.glTreeComponent.selection = this.rootNode.children[0];
            if (this.rootNode.children[0].data.gl.switchableGeneralLedgerAccountId) {
                this.getSwitchableParentGlAccountDetails(this.rootNode.children[0].data.gl.switchableGeneralLedgerAccountId);
            }
        }
    }

    fetchChildGlAccounts(selectedNode: any, createGlAccountEvent: boolean) {
        if (!selectedNode.data.gl.id || (selectedNode.data.gl.parent && selectedNode.children.length) > 0) {
            selectedNode.expanded = true;
            if (createGlAccountEvent) this.createChildGl();
        } else {
            this.subscribers.childGlAccountFetchSub = this.glAccountService.
                fetchGlAccounts(new Map([["aspage", "false"], ["parentId", selectedNode.data.gl.id + ""]])).subscribe(data => {
                    selectedNode.children = [];
                    data.forEach(node => {
                        let childNode: any = {};
                        childNode = {
                            label: node.name,
                            data: { gl: node, modificationId: null },
                            expanded: false
                        }
                        if (childNode.data.gl.parent) {
                            childNode.expandedIcon = "ui-icon-folder-open";
                            childNode.collapsedIcon = "ui-icon-folder";
                            childNode.children = [];
                        } else {
                            childNode.expandedIcon = "ui-icon-fiber-manual-record";
                            childNode.collapsedIcon = "ui-icon-fiber-manual-record";
                        }
                        selectedNode.children.
                            push(childNode);
                    });
                    selectedNode.expanded = true;
                    if (createGlAccountEvent) this.createChildGl();
                });
        }
    }

    nodeSelect(event) {

        if (!event.node.expanded) {
            this.fetchChildGlAccounts(event.node, false);
        } else {
            this.glTreeComponent.selection = event.node;
        }
        this.switchableParentGl = new GlAccount();
        this.selectedNode = event.node;

        if (this.selectedNode.data.gl.parent) {
            this.showContextMenu = true;
        } else {
            this.showContextMenu = false;
        }

        this.glAccountForm.form.updateValueAndValidity();
        if (this.selectedNode.data.modificationId == null) {
            this.markFormGroupAsUnTouched(this.glAccountForm.form);
        } else {
            this.markFormGroupAsTouched(this.glAccountForm.form);
        }
        if (this.selectedNode.data.gl.switchableGeneralLedgerAccountId) {
            this.getSwitchableParentGlAccountDetails(this.selectedNode.data.gl.switchableGeneralLedgerAccountId);
        }
    }

    save() {
        if (this.selectedNode.data.modificationId != null && this.glAccountForm.invalid) {
            if (!this.invalidNodes.has(this.selectedNode.data.modificationId)) {
                this.invalidNodes.add(this.selectedNode.data.modificationId);
            }
        }
        if (this.invalidNodes.size > 0) {
            this.notificationService.sendErrorMsg("tree.nodes.invalid");
            return;
        }
        this.showVerifierSelectionModal = of(true);
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, DETAILS_UI, this.location.path().concat("?"));
        let changedGlAccounts = this.getChangedGlAccountTree();
        if (changedGlAccounts.length == 0) {
            this.notificationService.sendInfoMsg("no.change.info");
            return;
        }
        this.subscribers.glAccountPostSubscribe = this.glAccountService.postGlAccounts(changedGlAccounts, urlSearchParams).subscribe(data => {
            this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
            if (this.taskId) {
                this.navigateAway();
            } else {
                this.refresh();
            }
        });
    }

    getChangedGlAccountTree() {
        let glAccounts = [];
        this.rootNode.children.forEach(element => {
            let glAccount = this.traverseTreeNode(element);
            glAccounts.push(glAccount);
        });
        glAccounts = glAccounts.filter(val => val != null);
        return glAccounts;
    }


    //recursively traverse node and returns modified only tree path
    traverseTreeNode(element) {
        if (!this.taskId && !element.data.modificationId && !element.children) return null;
        let glAccount = new GlAccount();
        if (element.data.modificationId != null) {
            glAccount = element.data.gl;
            glAccount.isModified = true;
        } else {
            glAccount = element.data.gl;
            glAccount.isModified = false;
        }
        if (element.children) {
            glAccount.children = [...element.children.map(child => {
                return this.traverseTreeNode(child);
            })].filter(val => val != null);
        }
        if (!this.taskId && !glAccount.isModified && glAccount.children.length == 0) {
            return null;
        }
        return glAccount;
    }

    fetchCurrencies() {
        this.subscribers.fetchCurrencySub = this.currencyService.fetchCurrencies(new Map())
            .subscribe(data => {
                this.currencies = data.content.map(currency => {
                    return { label: currency.name, value: currency.code }
                });
            });
    }

    fetchBranches() {
        this.bankService.fetchBranchProfiles({ bankId: 1 }, new Map()).subscribe(
            data => {
                this.branches = [...data.map(branch => {
                    return { label: branch.name, value: branch.id }
                })];
            }
        )
    }

    fetchGlCategories() {
        this.glAccountService.fetchGLCategories().subscribe(
            data => {
                this.generalLedgerCategories = [{ label: 'Select Gl Category', value: null }, ...data.map(category => {
                    return { label: category.name, value: category.id }
                })];
            }
        )
    }

    getSwitchableParentGlAccountDetails(id: number) {
        this.glAccountService.fetchGlAccountDetails({ id: id })
            .subscribe(data => {
                this.switchableParentGl = data;
            });
    }

    cancel() {
        this.navigateAway();
    }

    navigateAway() {
        if (this.taskId) {
            this.router.navigate(['approval-flow/pendingtasks']);
        } else {
            this.router.navigate(['../'], { relativeTo: this.route });
        }
    }

    loadNodes(event) {
        if (event.node.data == null) return;
        if (event.node.children && event.node.children.length > 0) return;
        event.node.children = this.fetchChildGlAccounts(event.node, false);
    }

    fetchGeneralLedgerCodeLengthConfiguration() {
        let queryParamsMap = new Map();
        queryParamsMap.set('name', 'GENERAL_LEDGER_CODE_LENGTH');
        this.glAccountService.fetchGeneralLedgerConfigurations(queryParamsMap).subscribe(
            data => {
                this.generalLedgerCodeLengthConfiguration = data.value;
            }
        );
    }
    addProfitRate() {
        this.router.navigate(['/glaccount/profit-rate']);
    }

    addSubsidiaryLedger() {
        this.router.navigate(['/glaccount/sub-ledger']);
    }

    limitConfiguration() {
        this.router.navigate(['limit'], { relativeTo: this.route });
    }
}