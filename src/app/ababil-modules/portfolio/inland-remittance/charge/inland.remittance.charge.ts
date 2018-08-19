import { Component, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { FormBaseComponent } from "../../../../common/components/base.form.component";
import { InlandRemittanceChargeInfo } from "../../../../services/inland-remittance/charge/domain/inland.remittance.charge.info.model";
import { InlandRemittanceChargeService } from "../../../../services/inland-remittance/charge/service-api/inland.remittance.charge.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotificationService } from './../../../../common/notification/notification.service';
import { InlandRemittanceChargeConfiguration, ActivateInlandRemittanceChargeConfigurationCommand } from "../../../../services/inland-remittance/charge/domain/inland.remittance.charge.configuration.model";
import { ConfirmationService } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";
import { ApprovalflowService } from "../../../../services/approvalflow/service-api/approval.flow.service";
import * as commandConstants from "../../../../common/constants/app.command.constants";
import { VerifierSelectionEvent } from "../../../../common/components/verifier-selection/verifier.selection.component";
import * as abbabilValidators from '../../../../common/constants/app.validator.constants';

export const SUCCESS_MSG: string[] = ["inland.remittance.charge.configuration.activated", "workflow.task.verify.send"];
export const DETAILS_UI: string = "views/inland-remittance-charge-configuration?";

@Component({
    selector: 'inland-remittance-charge',
    templateUrl: './inland.remittance.charge.html'
})
export class InlandRemittanceChargeComponent extends FormBaseComponent implements OnInit {

    chargeInfoForm: FormGroup;
    inlandRemittanceChargeInfos: InlandRemittanceChargeInfo[] = [];
    inlandRemittanceChargeInfo: InlandRemittanceChargeInfo = new InlandRemittanceChargeInfo();
    inlandRemittanceChargeConfigurations: InlandRemittanceChargeConfiguration[] = [];
    inlandRemittanceChargeConfigurationsToSave: InlandRemittanceChargeConfiguration[];
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
    command: string = commandConstants.ACTIVATE_INLAND_REMITTANCE_CHARGE_CONFIGURATION_COMMAND;

    constructor(private formBuilder: FormBuilder,
        protected location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private confirmationService: ConfirmationService,
        private inlandRemittanceChargeService: InlandRemittanceChargeService,
        private notificationService: NotificationService,
        protected approvalFlowService: ApprovalflowService) {
        super(location, approvalFlowService);
    }

    ngOnInit(): void {
        this.showVerifierSelectionModal = of(false);
        this.subscribers.querySub = this.route.queryParams.subscribe(query => {
            this.infoRow = query['infoRow'];
            this.configRow = query['configRow'];
            this.fetchInlandRemittanceChargeInfos();
        });

        this.prepareChargeInfoForm(null);;
    }

    prepareChargeInfoForm(formData: InlandRemittanceChargeInfo) {
        formData = formData ? formData : new InlandRemittanceChargeInfo();
        this.inlandRemittanceChargeInfo = formData;

        this.chargeInfoForm = this.formBuilder.group({
            chargeName: [formData.chargeName, [Validators.required, abbabilValidators.chargeNameValidator]]
        });
    }

    fetchInlandRemittanceChargeConfigurations(urlSearchParams: Map<string, number>) {
        this.subscribers.fetchInlandRemittanceChargeConfigurationsSub = this.inlandRemittanceChargeService
            .fetchInlandRemittanceChargeConfigurations(urlSearchParams)
            .subscribe(data => {
                this.inlandRemittanceChargeConfigurations = data;
                this.selectedConfigurationItem = this.configRow ? [this.inlandRemittanceChargeConfigurations[this.configRow]] : [];
            });
    }

    fetchInlandRemittanceChargeInfos() {
        this.subscribers.fetchInlandRemittanceChargeInfosSub = this.inlandRemittanceChargeService.fetchInlandRemittanceChargeInfos()
            .subscribe(data => {
                this.inlandRemittanceChargeConfigurations = [];
                this.inlandRemittanceChargeInfos = data;
                if (this.infoRow) {
                    this.selectedInfoItem = [this.inlandRemittanceChargeInfos[this.infoRow]];
                    this.showChargeConfigurationButton = true;

                    let urlSearchParams = new Map([['chargeInfoId', this.inlandRemittanceChargeInfos[this.infoRow].id]]);
                    this.fetchInlandRemittanceChargeConfigurations(urlSearchParams);
                }
                else if (this.inlandRemittanceChargeInfos.length > 0) {
                    this.selectedInfoItem = [this.inlandRemittanceChargeInfos[0]];
                    this.chargeInfoId = this.inlandRemittanceChargeInfos[0].id;
                    this.showChargeConfigurationButton = true;
                    let urlSearchParams = new Map([['chargeInfoId', this.chargeInfoId]]);
                    this.fetchInlandRemittanceChargeConfigurations(urlSearchParams);
                }
            });
    }

    onChargeInfoRowSelect(rowSelectEvent) {
        this.showChargeConfigurationButton = true;
        this.infoRow = this.inlandRemittanceChargeInfos.indexOf(rowSelectEvent.data);
        this.configRow = null;
        this.chargeInfoId = rowSelectEvent.data.id;

        let urlSearchParams = new Map([['chargeInfoId', rowSelectEvent.data.id]]);
        this.fetchInlandRemittanceChargeConfigurations(urlSearchParams);
    }

    editConfiguration(inlandRemittanceChargeConfiguration: InlandRemittanceChargeConfiguration) {
        this.configRow = this.inlandRemittanceChargeConfigurations.indexOf(inlandRemittanceChargeConfiguration);
        this.chargeName = this.inlandRemittanceChargeInfos.filter(info => info.id === inlandRemittanceChargeConfiguration.chargeInfoId).map(info => info.chargeName)[0];
        this.router.navigate([inlandRemittanceChargeConfiguration.id, 'edit'], {
            relativeTo: this.route,
            queryParams: {
                infoRow: this.infoRow,
                configRow: this.configRow,
                chargeName: this.chargeName
            }
        });
    }

    activate() {
        this.inlandRemittanceChargeConfigurationsToSave = [];
        this.inlandRemittanceChargeConfigurationsToSave = this.inlandRemittanceChargeConfigurations.filter(data => data.sendToActivate);
        if (this.inlandRemittanceChargeConfigurationsToSave.length <= 0) { return }
        this.showVerifierSelectionModal = of(true);
    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let view_ui = DETAILS_UI;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("?"));

        let activateCharge = new ActivateInlandRemittanceChargeConfigurationCommand();
        activateCharge.inlandRemittanceChargeInfo.id = this.chargeInfoId;
        activateCharge.inlandRemittanceChargeInfo.chargeName = this.inlandRemittanceChargeInfos.filter(info => info.id === this.chargeInfoId).map(info => info.chargeName)[0];
        activateCharge.inlandRemittanceChargeInfo.inlandRemittanceChargeConfigurations = this.inlandRemittanceChargeConfigurationsToSave;

        this.subscribers.activateSub = this.inlandRemittanceChargeService.activateInlandRemittanceChargeConfiguration(activateCharge, urlSearchParams)
            .subscribe(data => this.notificationService.sendSuccessMsg(SUCCESS_MSG[+(event.approvalFlowRequired || !!this.taskId)]));
    }

    saveInlandRemittanceChargeInfo() {
        this.markFormGroupAsTouched(this.chargeInfoForm);
        if (this.chargeInfoForm.invalid) { return }

        let inlandRemittanceChargeInfoToSave = new InlandRemittanceChargeInfo();
        inlandRemittanceChargeInfoToSave = this.inlandRemittanceChargeInfo;
        inlandRemittanceChargeInfoToSave.chargeName = this.chargeInfoForm.controls.chargeName.value;

        inlandRemittanceChargeInfoToSave.id ? this.updateInlandRemittanceChargeInfo(inlandRemittanceChargeInfoToSave) : this.createInlandRemittanceChargeInfo(inlandRemittanceChargeInfoToSave);
    }

    createInlandRemittanceChargeInfo(inlandRemittanceChargeInfo: InlandRemittanceChargeInfo) {
        this.subscribers.createChargeInfoSub = this.inlandRemittanceChargeService
            .createInlandRemittanceChargeInfo(inlandRemittanceChargeInfo)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("inland.remittance.charge.info.save.success");
                this.chargeInfoPanel.hide();
                this.fetchInlandRemittanceChargeInfos();
                this.resetChargeInfoForm();
                this.infoRow = null;
            });
    }

    updateInlandRemittanceChargeInfo(inlandRemittanceChargeInfo: InlandRemittanceChargeInfo) {
        this.subscribers.updateChargeInfo = this.inlandRemittanceChargeService
            .updateInlandRemittanceChargeInfo(inlandRemittanceChargeInfo, { id: inlandRemittanceChargeInfo.id })
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("inland.remittance.charge.info.update.success");
                this.chargeInfoPanel.hide();
                this.fetchInlandRemittanceChargeInfos();
                this.resetChargeInfoForm();
            });
    }

    resetChargeInfoForm() {
        this.chargeInfoForm.reset();
        this.inlandRemittanceChargeInfo = new InlandRemittanceChargeInfo();
    }

    deleteChargeInfo(chargeInfo: InlandRemittanceChargeInfo) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this charge info?',
            accept: () => this.deleteInlandRemittanceChargeInfo(chargeInfo.id)
        });
    }

    deleteInlandRemittanceChargeInfo(chargeInfoId) {
        this.subscribers.deleteChargeInfoSub = this.inlandRemittanceChargeService
            .deleteInlandRemittanceChargeInfo({ id: chargeInfoId })
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("inland.remittance.charge.info.delete.success");
                this.infoRow = null;
                this.fetchInlandRemittanceChargeInfos();
                this.showChargeConfigurationButton = false;
                this.inlandRemittanceChargeConfigurations = [];
            });
    }

    editChargeInfo(chargeInfo: InlandRemittanceChargeInfo) {
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