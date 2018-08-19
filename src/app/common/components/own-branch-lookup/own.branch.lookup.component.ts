import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { BankService } from "../../../services/bank/service-api/bank.service";
import { Branch } from "../../../services/bank/domain/bank.models";
import { LazyLoadEvent } from "primeng/api";
import { BaseComponent } from "../base.component";
import { BranchTypes, TransactionStatus, TransactionTypes } from "../../../services/bank/domain/branch.enum.model";

@Component({
    selector: 'own-branch-lookup',
    templateUrl: 'own.branch.lookup.component.html'
})

export class OwnBranchLookUpComponent extends BaseComponent implements OnInit {
    branches: Branch[] = [];
    pageSize: number = 20;
    totalRecords: number;
    pageCount: number;
    urlSearchParam: Map<string, any> = new Map();

    branchName = null;
    branchId = null;
    selectedBranchType = null;
    branchTypes = BranchTypes;

    selectedTransactionStatus = null;
    transactionStatus = TransactionStatus;

    selectedTransactionType = null;
    transactionTypes = TransactionTypes;

    routingNumber = null;
    swiftCode = null;

    online: boolean = false;

    selectedBranch: Branch = new Branch();

    @Output() rowClick: EventEmitter<any> = new EventEmitter();

    constructor(private bankService: BankService) {
        super();
    }
    ngOnInit() {
        this.fetchBranches(this.urlSearchParam);
    }

    search() {
        this.urlSearchParam.set('name', this.branchName);
        this.urlSearchParam.set('branchId', this.branchId);
        this.urlSearchParam.set('branchType', this.selectedBranchType);
        this.urlSearchParam.set('transactionStatus', this.selectedTransactionStatus);
        this.urlSearchParam.set('routingNumber', this.routingNumber);
        this.urlSearchParam.set('swiftCode', this.swiftCode);
        this.urlSearchParam.set('online', this.selectedTransactionType);
        this.fetchBranches(this.urlSearchParam);
    }



    fetchBranches(urlSearchParam: any) {

        this.subscribers.fetchTellerSub = this.bankService.fetchOwnBranches(urlSearchParam).subscribe(
            profiles => {
                this.branches = [...profiles.content];
                this.pageSize = profiles.pageSize;
                this.pageCount = profiles.pageCount;
                this.totalRecords = (profiles.pageSize * profiles.pageCount)
            }
        );
    }

    loadBranchesLazily(event: LazyLoadEvent) {
        if (event.first != 0) {
            this.fetchBranches(new Map().set('page', event.first / this.pageSize));
        }

    }

    onRowSelect(event) {
        this.selectedBranch = event.data;
        // this.selectedBranch.name = event.data.name;
        this.rowClick.emit(true);
    }

    extractData() {
        return this.selectedBranch;
    }


}