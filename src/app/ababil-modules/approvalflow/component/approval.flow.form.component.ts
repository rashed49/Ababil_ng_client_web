import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from './../../../common/notification/notification.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../common/components/base.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApprovalflowProfile } from '../../../services/approvalflow/domain/approval.flow.models';
import { ApprovalflowService } from '../../../services/approvalflow/service-api/approval.flow.service';

@Component({
    selector: 'approvalflow-form',
    templateUrl: './approval.flow.form.component.html'
})
export class ApprovalflowFormComponent extends BaseComponent {

    approvalflowForm: FormGroup;
    approvalflowProfile: ApprovalflowProfile;
    showDialog: boolean = false;

    @Input('formData') set formData(formData: ApprovalflowProfile) {
        this.prepareApprovalflowForm(formData);
    }
    @Output('onSave') onSave = new EventEmitter<ApprovalflowProfile>();

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private approvalflowService: ApprovalflowService) {
        super();
    }

    prepareApprovalflowForm(formData: ApprovalflowProfile) {
        formData = formData ? formData : new ApprovalflowProfile();
        this.approvalflowProfile = formData;
        this.approvalflowForm = this.formBuilder.group({
            code: [formData.code, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
            name: [formData.name, [Validators.required, Validators.minLength(2), Validators.maxLength(32)]]
        });

        this.initEnterNavigation("approvalflow-form");
    }

    save(): void {
        this.markFormGroupAsTouched(this.approvalflowForm);
        if (this.approvalflowForm.invalid) return;
        let approvalflow = this.approvalflowForm.value;
        approvalflow.id = this.approvalflowProfile.id;
        this.onSave.emit(approvalflow);
    }

    close() {
        this.showDialog = false;
        this.approvalflowForm.reset();
    }
}