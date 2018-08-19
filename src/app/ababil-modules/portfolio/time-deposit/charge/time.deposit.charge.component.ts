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
import { TimeDepositChargeService } from "../../../../services/time-deposit-charge/service-api/time.deposit.charge.service";
import { TimeDepositChargeInfo } from "../../../../services/time-deposit-charge/domain/time.deposit.charge.info.model";
import { TimeDepositChargeConfiguration, ActivateTimeDepositChargeConfigurationCommand } from "../../../../services/time-deposit-charge/domain/time.deposit.charge.configuration.model";

export const SUCCESS_MSG: string[] = ["time.deposit.charge.configuration.activated", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/time-deposit-charge-configuration?";

@Component({
    selector: 'time-deposit-charge',
    templateUrl: './time.deposit.charge.component.html'
})
export class TimeDepositChargeComponent extends FormBaseComponent implements OnInit {

    chargeInfoForm: FormGroup;
    timeDepositChargeInfos: TimeDepositChargeInfo[] = [];
    timeDepositChargeInfo: TimeDepositChargeInfo = new TimeDepositChargeInfo();
    timeDepositChargeConfigurations: TimeDepositChargeConfiguration[] = [];
    timeDepositChargeConfigurationsToSave: TimeDepositChargeConfiguration[];
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
    command: string = commandConstants.ACTIVATE_TIME_DEPOSIT_CHARGE_CONFIGURATION_COMMAND;

    constructor(private formBuilder: FormBuilder,
        protected location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private confirmationService: ConfirmationService,
        private timeDepositChargeService: TimeDepositChargeService,
        private notificationService: NotificationService,
        protected approvalFlowService: ApprovalflowService) {
        super(location, approvalFlowService);
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);
        this.subscribers.querySub = this.route.queryParams.subscribe(query => {
            this.infoRow = query['infoRow'];
            this.configRow = query['configRow'];
            this.fetchTimeDepositChargeInfos();
        });

        this.prepareChargeInfoForm(null);;
    }

    prepareChargeInfoForm(formData: TimeDepositChargeInfo) {
        formData = formData ? formData : new TimeDepositChargeInfo();
        this.timeDepositChargeInfo = formData;

        this.chargeInfoForm = this.formBuilder.group({
            chargeName: [formData.chargeName, [Validators.required, abbabilValidators.chargeNameValidator]]
        });
    }

    fetchTimeDepositChargeConfigurations(urlSearchParams: Map<string, number>) {
        this.subscribers.fetchTimeDepositChargeConfigurationsSub = this.timeDepositChargeService
            .fetchTimeDepositChargeConfigurations(urlSearchParams)
            .subscribe(data => {
                this.timeDepositChargeConfigurations = data;
                this.selectedConfigurationItem = this.configRow ? [this.timeDepositChargeConfigurations[this.configRow]] : [];
            });
    }

    fetchTimeDepositChargeInfos() {
        this.subscribers.fetchTimeDepositChargeInfosSub = this.timeDepositChargeService.fetchTimeDepositChargeInfos()
            .subscribe(data => {
                this.timeDepositChargeConfigurations = [];
                this.timeDepositChargeInfos = data;
                if (this.infoRow) {
                    this.selectedInfoItem = [this.timeDepositChargeInfos[this.infoRow]];
                    this.showChargeConfigurationButton = true;

                    let urlSearchParams = new Map([['chargeInfoId', this.timeDepositChargeInfos[this.infoRow].id]]);
                    this.fetchTimeDepositChargeConfigurations(urlSearchParams);
                }
                else if (this.timeDepositChargeInfos.length > 0) {
                    this.selectedInfoItem = [this.timeDepositChargeInfos[0]];
                    this.chargeInfoId = this.timeDepositChargeInfos[0].id;
                    this.showChargeConfigurationButton = true;
                    let urlSearchParams = new Map([['chargeInfoId', this.chargeInfoId]]);
                    this.fetchTimeDepositChargeConfigurations(urlSearchParams);
                }
            });
    }

    onChargeInfoRowSelect(rowSelectEvent) {
        this.showChargeConfigurationButton = true;
        this.infoRow = this.timeDepositChargeInfos.indexOf(rowSelectEvent.data);
        this.configRow = null;
        this.chargeInfoId = rowSelectEvent.data.id;
        
        let urlSearchParams = new Map([['chargeInfoId', rowSelectEvent.data.id]]);
        this.fetchTimeDepositChargeConfigurations(urlSearchParams);
    }

    editConfiguration(timeDepositChargeConfiguration: TimeDepositChargeConfiguration) {
        this.configRow = this.timeDepositChargeConfigurations.indexOf(timeDepositChargeConfiguration);
        this.chargeName = this.timeDepositChargeInfos.filter(info => info.id === timeDepositChargeConfiguration.chargeInfoId).map(info => info.chargeName)[0];
        this.router.navigate([timeDepositChargeConfiguration.id, 'edit'], {
            relativeTo: this.route,
            queryParams: {
                infoRow: this.infoRow,
                configRow: this.configRow,
                chargeName: this.chargeName
            }
        });
    }

    activate() {
        this.timeDepositChargeConfigurationsToSave = [];
        this.timeDepositChargeConfigurationsToSave = this.timeDepositChargeConfigurations.filter(data => data.sendToActivate);
        if (this.timeDepositChargeConfigurationsToSave.length <= 0) { return }
        this.showVerifierSelectionModal = of(true);
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let view_ui = DETAILS_UI;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("?"));

        let activateCharge = new ActivateTimeDepositChargeConfigurationCommand();
        activateCharge.timeDepositChargeInfo.id = this.chargeInfoId;
        activateCharge.timeDepositChargeInfo.chargeName = this.timeDepositChargeInfos.filter(info => info.id === this.chargeInfoId).map(info => info.chargeName)[0];
        activateCharge.timeDepositChargeInfo.timeDepositChargeConfigurations = this.timeDepositChargeConfigurationsToSave;

        this.subscribers.activateSub = this.timeDepositChargeService.activateTimeDepositChargeConfiguration(activateCharge, urlSearchParams)
            .subscribe(data =>{
                 this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]);
                 this.fetchTimeDepositChargeInfos();
                } );


    }

    saveTimeDepositChargeInfo() {
        this.markFormGroupAsTouched(this.chargeInfoForm);
        if (this.chargeInfoForm.invalid) { return }

        let timeDepositChargeInfoToSave = new TimeDepositChargeInfo();
        timeDepositChargeInfoToSave = this.timeDepositChargeInfo;
        timeDepositChargeInfoToSave.chargeName = this.chargeInfoForm.controls.chargeName.value;

        timeDepositChargeInfoToSave.id ? this.updateTimeDepositChargeInfo(timeDepositChargeInfoToSave) : this.createTimeDepositChargeInfo(timeDepositChargeInfoToSave);
    }

    createTimeDepositChargeInfo(timeDepositChargeInfo: TimeDepositChargeInfo) {
        this.subscribers.createChargeInfoSub = this.timeDepositChargeService
            .createTimeDepositChargeInfo(timeDepositChargeInfo)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("time.deposit.charge.info.save.success");
                this.chargeInfoPanel.hide();
                this.fetchTimeDepositChargeInfos();
                this.resetChargeInfoForm();
                this.infoRow = null;
            });
    }

    updateTimeDepositChargeInfo(timeDepositChargeInfo: TimeDepositChargeInfo) {
        this.subscribers.updateChargeInfo = this.timeDepositChargeService
            .updateTimeDepositChargeInfo(timeDepositChargeInfo, { id: timeDepositChargeInfo.id })
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("time.deposit.charge.info.update.success");
                this.chargeInfoPanel.hide();
                this.fetchTimeDepositChargeInfos();
                this.resetChargeInfoForm();
            });
    }

    resetChargeInfoForm() {
        this.chargeInfoForm.reset();
        this.timeDepositChargeInfo = new TimeDepositChargeInfo();
    }

    deleteChargeInfo(chargeInfo: TimeDepositChargeInfo) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this charge info?',
            accept: () => this.deleteTimeDepositChargeInfo(chargeInfo.id)
        });
    }

    deleteTimeDepositChargeInfo(chargeInfoId) {
        this.subscribers.deleteChargeInfoSub = this.timeDepositChargeService
            .deleteTimeDepositChargeInfo({ id: chargeInfoId })
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("time.deposit.charge.info.delete.success");
                this.infoRow = null;
                this.fetchTimeDepositChargeInfos();
                this.showChargeConfigurationButton = false;
                this.timeDepositChargeConfigurations = [];
            });
    }

    editChargeInfo(chargeInfo: TimeDepositChargeInfo) {
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