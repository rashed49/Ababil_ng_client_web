import { Component, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { of } from "rxjs";
import { FormBaseComponent } from "../../../../common/components/base.form.component";
import { NotificationService } from './../../../../common/notification/notification.service';
import { ApprovalflowService } from "../../../../services/approvalflow/service-api/approval.flow.service";
import * as commandConstants from "../../../../common/constants/app.command.constants";
import { VerifierSelectionEvent } from "../../../../common/components/verifier-selection/verifier.selection.component";
import * as abbabilValidators from '../../../../common/constants/app.validator.constants';
import { DemandDepositChargeService } from "../../../../services/demand-deposit-charge/service-api/demand.deposit.charge.service";
import { DemandDepositChargeInfo } from "../../../../services/demand-deposit-charge/domain/demand.deposit.charge.info.model";
import { DemandDepositChargeConfiguration, ActivateDemandDepositChargeConfigurationCommand } from "../../../../services/demand-deposit-charge/domain/demand.deposit.charge.configuration.model";

export const SUCCESS_MSG: string[] = ["demand.deposit.charge.configuration.activated", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/demand-deposit-charge-configuration?";

@Component({
    selector: 'demand-deposit-charge',
    templateUrl: './demand.deposit.charge.component.html'
})
export class DemandDepositChargeComponent extends FormBaseComponent implements OnInit {

    chargeInfoForm: FormGroup;
    demandDepositChargeInfos: DemandDepositChargeInfo[] = [];
    demandDepositChargeInfo: DemandDepositChargeInfo = new DemandDepositChargeInfo();
    demandDepositChargeConfigurations: DemandDepositChargeConfiguration[] = [];
    demandDepositChargeConfigurationsToSave: DemandDepositChargeConfiguration[];
    showChargeConfigurationButton: boolean = false;
    selectedInfoItem: any[];
    selectedConfigurationItem: any[];
    chargeInfoId: number;
    infoRow: number;
    configRow: number;
    queryParams: any;
    configurationIds: number[] = [];
    chargeName: string;
    @ViewChild('op') chargeInfoPanel: any;
    command: string = commandConstants.ACTIVATE_DEMAND_DEPOSIT_CHARGE_CONFIGURATION_COMMAND;

    constructor(private formBuilder: FormBuilder,
        protected location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private confirmationService: ConfirmationService,
        private demandDepositChargeService: DemandDepositChargeService,
        private notificationService: NotificationService,
        protected approvalFlowService: ApprovalflowService) {
        super(location, approvalFlowService);
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);
        this.subscribers.querySub = this.route.queryParams.subscribe(query => {
            this.infoRow = query['infoRow'];
            this.configRow = query['configRow'];
            this.fetchDemandDepositChargeInfos();
        });

        this.prepareChargeInfoForm(null);;
    }

    prepareChargeInfoForm(formData: DemandDepositChargeInfo) {
        formData = formData ? formData : new DemandDepositChargeInfo();
        this.demandDepositChargeInfo = formData;

        this.chargeInfoForm = this.formBuilder.group({
            chargeName: [formData.chargeName, [Validators.required, abbabilValidators.chargeNameValidator]]
        });
    }

    fetchDemandDepositChargeConfigurations(urlSearchParams: Map<string, number>) {
        this.subscribers.fetchDemandDepositChargeConfigurationsSub = this.demandDepositChargeService
            .fetchDemandDepositChargeConfigurations(urlSearchParams)
            .subscribe(data => {
                this.demandDepositChargeConfigurations = data;
                this.selectedConfigurationItem = this.configRow ? [this.demandDepositChargeConfigurations[this.configRow]] : [];
            });
    }

    fetchDemandDepositChargeInfos() {
        this.subscribers.fetchDemandDepositChargeInfosSub = this.demandDepositChargeService.fetchDemandDepositChargeInfos()
            .subscribe(data => {
                this.demandDepositChargeConfigurations = [];
                this.demandDepositChargeInfos = data;
                if (this.infoRow) {
                    this.selectedInfoItem = [this.demandDepositChargeInfos[this.infoRow]];
                    this.showChargeConfigurationButton = true;

                    let urlSearchParams = new Map([['chargeInfoId', this.demandDepositChargeInfos[this.infoRow].id]]);
                    this.fetchDemandDepositChargeConfigurations(urlSearchParams);
                }
                else if (this.demandDepositChargeInfos.length > 0) {
                    this.selectedInfoItem = [this.demandDepositChargeInfos[0]];
                    this.chargeInfoId = this.demandDepositChargeInfos[0].id;
                    this.showChargeConfigurationButton = true;
                    let urlSearchParams = new Map([['chargeInfoId', this.chargeInfoId]]);
                    this.fetchDemandDepositChargeConfigurations(urlSearchParams);
                }
            });
    }

    onChargeInfoRowSelect(rowSelectEvent) {
        this.showChargeConfigurationButton = true;
        this.infoRow = this.demandDepositChargeInfos.indexOf(rowSelectEvent.data);
        this.configRow = null;
        this.chargeInfoId = rowSelectEvent.data.id;
        
        let urlSearchParams = new Map([['chargeInfoId', rowSelectEvent.data.id]]);
        this.fetchDemandDepositChargeConfigurations(urlSearchParams);
    }

    editConfiguration(demandDepositChargeConfiguration: DemandDepositChargeConfiguration) {
        this.configRow = this.demandDepositChargeConfigurations.indexOf(demandDepositChargeConfiguration);
        this.chargeName = this.demandDepositChargeInfos.filter(info => info.id === demandDepositChargeConfiguration.chargeInfoId).map(info => info.chargeName)[0];
        this.router.navigate([demandDepositChargeConfiguration.id, 'edit'], {
            relativeTo: this.route,
            queryParams: {
                infoRow: this.infoRow,
                configRow: this.configRow,
                chargeName: this.chargeName
            }
        });
    }

    activate() {
        this.demandDepositChargeConfigurationsToSave = [];
        this.demandDepositChargeConfigurationsToSave = this.demandDepositChargeConfigurations.filter(data => data.sendToActivate);
        if (this.demandDepositChargeConfigurationsToSave.length <= 0) { return }
        this.showVerifierSelectionModal = of(true);
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let view_ui = DETAILS_UI;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("?"));

        let activateCharge = new ActivateDemandDepositChargeConfigurationCommand();
        activateCharge.demandDepositChargeInfo.id = this.chargeInfoId;
        activateCharge.demandDepositChargeInfo.chargeName = this.demandDepositChargeInfos.filter(info => info.id === this.chargeInfoId).map(info => info.chargeName)[0];
        activateCharge.demandDepositChargeInfo.demandDepositChargeConfigurations = this.demandDepositChargeConfigurationsToSave;

        this.subscribers.activateSub = this.demandDepositChargeService.activateDemandDepositChargeConfiguration(activateCharge, urlSearchParams)
            .subscribe(data => this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]));
    }

    saveDemandDepositChargeInfo() {
        this.markFormGroupAsTouched(this.chargeInfoForm);
        if (this.chargeInfoForm.invalid) { return }

        let demandDepositChargeInfoToSave = new DemandDepositChargeInfo();
        demandDepositChargeInfoToSave = this.demandDepositChargeInfo;
        demandDepositChargeInfoToSave.chargeName = this.chargeInfoForm.controls.chargeName.value;

        demandDepositChargeInfoToSave.id ? this.updateDemandDepositChargeInfo(demandDepositChargeInfoToSave) : this.createDemandDepositChargeInfo(demandDepositChargeInfoToSave);
    }

    createDemandDepositChargeInfo(demandDepositChargeInfo: DemandDepositChargeInfo) {
        this.subscribers.createChargeInfoSub = this.demandDepositChargeService
            .createDemandDepositChargeInfo(demandDepositChargeInfo)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("demand.deposit.charge.info.save.success");
                this.chargeInfoPanel.hide();
                this.fetchDemandDepositChargeInfos();
                this.resetChargeInfoForm();
                this.infoRow = null;
            });
    }

    updateDemandDepositChargeInfo(demandDepositChargeInfo: DemandDepositChargeInfo) {
        this.subscribers.updateChargeInfo = this.demandDepositChargeService
            .updateDemandDepositChargeInfo(demandDepositChargeInfo, { id: demandDepositChargeInfo.id })
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("demand.deposit.charge.info.update.success");
                this.chargeInfoPanel.hide();
                this.fetchDemandDepositChargeInfos();
                this.resetChargeInfoForm();
            });
    }

    resetChargeInfoForm() {
        this.chargeInfoForm.reset();
        this.demandDepositChargeInfo = new DemandDepositChargeInfo();
    }

    deleteChargeInfo(chargeInfo: DemandDepositChargeInfo) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this charge info?',
            accept: () => this.deleteDemandDepositChargeInfo(chargeInfo.id)
        });
    }

    deleteDemandDepositChargeInfo(chargeInfoId) {
        this.subscribers.deleteChargeInfoSub = this.demandDepositChargeService
            .deleteDemandDepositChargeInfo({ id: chargeInfoId })
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("demand.deposit.charge.info.delete.success");
                this.infoRow = null;
                this.fetchDemandDepositChargeInfos();
                this.showChargeConfigurationButton = false;
                this.demandDepositChargeConfigurations = [];
            });
    }

    editChargeInfo(chargeInfo: DemandDepositChargeInfo) {
        this.prepareChargeInfoForm(chargeInfo);
    }

    addChargeConfiguration() {
        this.router.navigate(['create'], {
            relativeTo: this.route,
            queryParams: {
                chargeInfoId: this.chargeInfoId,
                infoRow: this.infoRow
            }
        });
    }

}