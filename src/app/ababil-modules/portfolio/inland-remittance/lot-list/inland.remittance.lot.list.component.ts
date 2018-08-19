import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationService } from "../../../../common/notification/notification.service";
import { ConfirmationService } from 'primeng/api';
import { LazyLoadEvent } from "primeng/components/common/lazyloadevent";
import { InlandRemittanceLotService } from "../../../../services/inland-remittance/lot/service-api/inland.remittance.lot.service";
import { InlandRemittanceLot } from "../../../../services/inland-remittance/lot/domain/inland.remittance.lot.models";
import { VerifierSelectionEvent } from "../../../../common/components/verifier-selection/verifier.selection.component";
import { FormBaseComponent } from "../../../../common/components/base.form.component";
import { of } from "rxjs";
import * as commandConstants from '../../../../common/constants/app.command.constants';
import { Location } from '@angular/common';
import { ApprovalflowService } from "../../../../services/approvalflow/service-api/approval.flow.service";
export const DETAILS_UI = 'views/lot-view';

@Component({
    selector: 'lot-list',
    templateUrl: './inland.remittance.lot.list.component.html'
})
export class LotListComponent extends FormBaseComponent implements OnInit {

    lotDisplay: boolean = false;
    lotEdit: boolean = false;
    inlandRemittanceLot: InlandRemittanceLot[] = [];
    inlandRemittanceLot1: InlandRemittanceLot = new InlandRemittanceLot();
    remittanceProductTypeMap: Map<number, any> = new Map();
    totalRecords: number;
    totalPages: number;
    urlSearchMap: Map<string, any> = new Map();
    // selected: InlandRemittanceLot;
    currencyCode: any[] = [];

    @ViewChild('instrument') instrument: any;

    constructor(private route: ActivatedRoute,
        private lotService: InlandRemittanceLotService,
        private router: Router,
        private notificationService: NotificationService,
        private confirmationService: ConfirmationService,
        protected location: Location,
        protected approvalFlowService: ApprovalflowService) {
        super(location, approvalFlowService);
    }

    ngOnInit(): void {
        this.fetchInlandRemittanceProductType();
        this.showVerifierSelectionModal = of(false);

    }
    create() {
        this.instrument.setData(new InlandRemittanceLot());
        this.lotDisplay = true;
    }
    lotEditdialogue() {
        this.lotEdit = true;
    }
    save() {

        this.markFormGroupAsTouched(this.instrument.lotForm);
        if (this.instrument.lotForm.invalid) return;
        this.showVerifierSelectionModal = of(true);
        let update = this.instrument.extractData()
        if (update.id != null) {
            this.command = commandConstants.UPDATE_INLAND_REMITTANCE_LOT;
        } else {
            this.command = commandConstants.CREATE_INLAND_REMITTANCE_LOT;
        }
    }
    createInlandRemittanceLot(lot, urlSearchParams, event) {
        this.lotService
            .createInlandRemittanceLot(lot, urlSearchParams)
            .subscribe(data => {
                event.approvalFlowRequired
                    ? this.notificationService.sendSuccessMsg("workflow.task.verify.send")
                    : this.notificationService.sendSuccessMsg("inland.remittance.lot.createtion.success");
                this.lotDisplay = false;
                this.instrument.id = null;
                this.fetchInlandRemittanceLot(new Map());
            });
    }
    updateInlandRemittanceLot(lot, urlSearchParams, event) {
        this.subscribers.updateInlandRemittanceLotSub = this.lotService
            .updateInlandRemittanceLot(lot, urlSearchParams).subscribe(
                (data) => {
                    event.approvalFlowRequired
                        ? this.notificationService.sendSuccessMsg("workflow.task.verify.send")
                        : this.notificationService.sendSuccessMsg("inland.remittance.lot.update.success");
                    this.lotDisplay = false;
                    this.instrument.id = null;
                    this.fetchInlandRemittanceLot(new Map());
                });
    }
    deleteLot(inlandRemittanceLot) {
        this.inlandRemittanceLot1 = inlandRemittanceLot;
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this Inland remittance Lot?',
            accept: () => {
                //  this.showVerifierSelectionModal = of(true);
                // this.command=commandConstants.DELETE_INLAND_REMITTANCE_LOT;
                this.deleteInlandRemittanceLot(inlandRemittanceLot);
            }
        });
    }
    deleteInlandRemittanceLot(inlandRemittanceLot: any) {
        this.subscribers.deleteInlandRemittanceLotSub = this.lotService
            .deleteInlandRemittanceLot({ lotId: this.inlandRemittanceLot1.id })
            .subscribe((data) => {
                this.notificationService.sendSuccessMsg("inland.remittance.lot.delete.success");
                this.fetchInlandRemittanceLot(new Map());
            });
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let view_ui = DETAILS_UI + `?`;
        // lotId=${this.inlandRemittanceLot1.id}&
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));
        // this.deleteInlandRemittanceLot(this.inlandRemittanceLot1.id,urlSearchParams);

        this.markFormGroupAsTouched(this.instrument.lotForm)
        if (this.instrument.lotForm.invalid) return;
        let update = this.instrument.extractData()
        if (update.id != null) {
            this.updateInlandRemittanceLot(update, urlSearchParams, event);
        } else {
            this.createInlandRemittanceLot(update, urlSearchParams, event);
        }



    }

    fetchInlandRemittanceLot(searchMap: Map<string, any>) {
        this.subscribers.fetchInlandRemittanceLotSub = this.lotService
            .fetchInlandRemittanceLot(searchMap)
            .subscribe(data => {
                this.inlandRemittanceLot = data.content;
                this.totalRecords = (data.pageSize * data.pageCount);
                this.totalPages = data.pageCount;
                console.log(data);
            });
    }
    loadInlandRemittanceLotLazily(event: LazyLoadEvent) {
        if (this.urlSearchMap == null) {
            this.urlSearchMap = new Map();
        }
        this.urlSearchMap.set("page", (event.first / 20));
        this.fetchInlandRemittanceLot(this.urlSearchMap);
    }

    correction(data) {
        this.instrument.setData(data);
        this.lotDisplay = true;
    }

    fetchInlandRemittanceProductType() {
        this.subscribers.fetchLotSub = this.lotService
            .fetchInlandRemittanceProduct()
            .subscribe(res => {
                res.forEach(element => {
                    this.remittanceProductTypeMap.set(element.id, element.name);
                });
            });
    }
    cancel() {
        this.lotDisplay = false;
    }
    back() {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }

}