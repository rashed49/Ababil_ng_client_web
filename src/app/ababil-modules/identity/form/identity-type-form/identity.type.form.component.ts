import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../../common/notification/notification.service';
import { IdentityService } from '../../../../services/identity/service-api/identity.service';
import { IdentityAttributeType, IdentityType } from './../../../../services/identity/domain/identity.type.models';
import { BaseComponent } from './../../../../common/components/base.component';
import { SelectItem } from 'primeng/api';


@Component({
    selector: 'app-identity-type-form',
    templateUrl: './identity.type.form.component.html'
})
export class IdentityTypeFormComponent extends BaseComponent implements OnInit {

    identityTypeForm: FormGroup;
    identityType: IdentityType = new IdentityType();
    identityTypes: SelectItem[];
    selectedIdentityTypeId: number;

    attributeForm: FormGroup;
    attributeTypes: SelectItem[];
    selectedAttributeTypeId: number;
    selectedAttribute: IdentityAttributeType;
    selectedIndex: number;

    attributeEditView: boolean = false;

    constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
        private router: Router,
        private identityService: IdentityService,
        private notificationService: NotificationService) {
        super();

        this.identityTypes = [];
        this.identityTypes.push({ label: "Select Identity Subject Type", value: null });
        this.identityTypes.push({ label: 'INDIVIDUAL', value: 'INDIVIDUAL' });
        this.identityTypes.push({ label: 'ORGANIZATION', value: 'ORGANIZATION' });

        this.attributeTypes = [];
        this.attributeTypes.push({ label: "Select Attribute Data Type", value: null });
        this.attributeTypes.push({ label: 'Text', value: 'STRING' });
        this.attributeTypes.push({ label: 'Date', value: 'DATE' });
        this.attributeTypes.push({ label: 'Number', value: 'NUMBER' });
    }

    ngOnInit(): void {
        this.subscribers.editSub = this.route.params.subscribe(params => {
            this.selectedIdentityTypeId = +params['id'];
            this.prepareIdentityTypeForm(this.identityType);
            if (this.selectedIdentityTypeId) {
                this.fetchIdentityTypeDetail();
            }

        });
        this.prepareAttributeTypeForm(new IdentityAttributeType());
    }

    onChanges(): void {
        this.attributeForm.get('attributeDataType').valueChanges.subscribe(val => {
            if (val == 'DATE') {
                this.attributeForm.get('length').setValidators([]);
            } else {
                this.attributeForm.get('length').setValidators([Validators.required]);
            }
        });
    }

    fetchIdentityTypeDetail() {
        this.subscribers.formDatasub = this.identityService
            .fetchIdentityTypeDetail({ "id": this.selectedIdentityTypeId + "" })
            .subscribe(data => {
                this.identityType = data;
                this.prepareIdentityTypeForm(this.identityType);
            });
    }

    prepareIdentityTypeForm(formData: IdentityType) {
        this.identityTypeForm = this.formBuilder.group({
            identitySubjectType: [formData.identitySubjectType, [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
            typeName: [formData.typeName, [Validators.required, Validators.minLength(3), Validators.maxLength(32)]]
        });
    }

    prepareAttributeTypeForm(identityAttributeType: IdentityAttributeType) {
        this.attributeForm = this.formBuilder.group({
            attributeName: [identityAttributeType.attributeName, [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
            attributeDataType: [identityAttributeType.attributeDataType, [Validators.required]],
            length: [identityAttributeType.length, [Validators.required, Validators.min(0), Validators.max(99)]],
            mandatory: [identityAttributeType.mandatory]
        });
        this.onChanges();
    }

    editAttribute(data: any, index: any) {
        this.selectedIndex = index;
        this.selectedAttribute = data;
        this.prepareAttributeTypeForm(data ? data : new IdentityAttributeType());
        this.attributeEditView = true;
    }

    done() {
        if (this.selectedIndex != null) {
            this.identityType.identityAdditionalAttributes[this.selectedIndex] = this.attributeForm.value;
        } else {
            this.identityType.identityAdditionalAttributes.push(this.attributeForm.value);
        }
        this.attributeEditView = false;
    }

    deleteAttribute(index) {
        let temp = Object.assign([], this.identityType.identityAdditionalAttributes);
        temp.splice(index, 1);
        this.identityType.identityAdditionalAttributes = Object.assign([], temp);
    }

    save() {
        let identityTypeToSave = new IdentityType();
        identityTypeToSave.typeName = this.identityTypeForm.get('typeName').value;
        identityTypeToSave.identitySubjectType = this.identityTypeForm.get('identitySubjectType').value;
        identityTypeToSave.identityAdditionalAttributes = this.identityType.identityAdditionalAttributes;
        identityTypeToSave.id = this.selectedIdentityTypeId;

        if (identityTypeToSave.id) {
            this.updateAttribute(identityTypeToSave);
        } else {
            this.createAttribute(identityTypeToSave);
        }
    }

    updateAttribute(identityTypeToSave) {
        this.subscribers.saveSub = this.identityService.updateIdentityType(identityTypeToSave, { "id": identityTypeToSave.id + "" }
        ).subscribe(
            (data) => {
                this.notificationService.sendSuccessMsg("identity.type.update.success");
                this.navigateAway();
            });
    }

    createAttribute(identityTypeToSave) {
        this.subscribers.saveSub = this.identityService.createIdentityType(identityTypeToSave)
            .subscribe(
                (data) => {
                    this.notificationService.sendSuccessMsg("identity.type.create.success");
                    this.navigateAway();
                });
    }

    formsInvalid() {
        return this.identityTypeForm.invalid;
    }

    attributeformInvalid() {
        return this.attributeForm.invalid;
    }

    cancel() {
        this.navigateAway();
    }

    cancelAdd() {
        this.attributeEditView = false;
    }

    navigateAway(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
    }

}