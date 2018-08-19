import { Component, ViewChild, OnInit, Input, Output, SimpleChanges, EventEmitter, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../../common/components/base.component';
import { IndividualInformation } from '../../../../services/cis/domain/individual.model';
import { Message, SelectItem } from 'primeng/primeng';
import { Location } from '@angular/common';
import { CISService } from '../../../../services/cis/service-api/cis.service';
import { AccountOperatorService } from '../../../../services/account-operator/service-api/account.operator.service';
import { NotificationService } from '../../../../common/notification/notification.service';
import { AccountSignatory, SignatoryType } from '../../../../services/account-operator/domain/account.operator.models';
import { environment } from "../../../../../environments/environment";
import * as commandConstants from '../../../../common/constants/app.command.constants';
import { Observable } from 'rxjs';
import { VerifierSelectionEvent } from '../../../../common/components/verifier-selection/verifier.selection.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CustomValidators } from 'ng2-validation';
import { Observer } from 'rxjs';

export let initialAccountSignatoryFormData: AccountSignatory = new AccountSignatory();

@Component({
    selector: 'signatory-form',
    templateUrl: './signatory.form.component.html'
})
export class SignatoryFormComponent extends BaseComponent implements OnInit {

    @Input('formData') set formData(formData: AccountSignatory) {
        this.prepareAccountSignatoryForm(formData);
    }
    @ViewChild('individualImage') individualImage: any;
    @ViewChild('signatorySignature') signatorySignature: any;
    @ViewChild('ababilImage') ababilImage: any;


    @Input('command') command: string;
    @Output('onSave') onSave = new EventEmitter<any>();
    @Output('onCancel') onCancel = new EventEmitter<void>();

    signature: any;
    accountSignatoryForm: FormGroup;
    signatoryId: number;
    selectedIndividualId: number;
    accountId: number;
    operatorId: number;
    uuid: string;
    isOwnerSignature: boolean;
    selectedOwner: number;
    individualDetails: IndividualInformation = new IndividualInformation();
    minStartDate: Date;
    subjects: SelectItem[] = [];
    owners: any[];
    imageApiUrl: any;
    queryParams: any;
    signatureImage: any;
    signatoryName: string;
    date: boolean = false;
    fromDate: Date;
    customerId: any;
    label: string;
    mobileNumber: string;
    individualId: number;
    individualMobileNumber: string;
    individual_id: number;
    imageBody: any;
    constructor(
        private formBuilder: FormBuilder,
        private cisService: CISService,
        private sanitizer: DomSanitizer,
        private location: Location, private router: Router,
        private route: ActivatedRoute,
        private accountOperatorService: AccountOperatorService,
        private notificationService: NotificationService) {
        super();
    }

    ngOnInit() {
        this.minStartDate = new Date();
        this.imageApiUrl = environment.serviceapiurl;
        this.route.queryParams.subscribe(queryParams => {
            this.queryParams = queryParams;
            this.accountId = this.queryParams['accountId'];
            this.operatorId = this.queryParams['operatorId'];
            this.isOwnerSignature = this.queryParams['signatoryType'] === "OWNER" ? true : false;
            this.customerId = this.queryParams['customerId'];
        });
        if (this.queryParams.individualId !== undefined &&
            this.queryParams.individualId !== 'null') {
            this.accountSignatoryForm.get('individualId').setValue(this.queryParams.individualId);
            this.accountSignatoryForm.get('individualId').updateValueAndValidity();
        }
        this.fetchOwners();


    }


    prepareAccountSignatoryForm(formData: AccountSignatory) {
        formData = (formData == null ? initialAccountSignatoryFormData : formData);
        this.signatorySignature.nativeElement.src = (formData.id == null ? null : this.imageApiUrl + "/accounts/" + this.accountId + "/operator-information/" + this.operatorId + "/signatories/" + formData.id + "/signature?t=" + new Date().getTime());
        this.signatoryId = formData.id;
        this.individualId = formData.individualId;
        this.mobileNumber = formData.mobileNumber;

        this.fromDate = new Date(formData.dateFrom);
        this.uuid = formData.uuid;

        this.accountSignatoryForm = this.formBuilder.group({
            individualId: [formData.individualId, [Validators.required]],
            signatoryName: [{ value: formData.signatoryName, disabled: true }, [Validators.required, Validators.pattern(new RegExp(/^[a-z ,.'-]+$/i))]],
            mobileNumber: [formData.mobileNumber, [Validators.required, CustomValidators.phone]],
            remarks: [formData.remarks],
            dateFrom: [formData.dateFrom == null ? null : new Date(formData.dateFrom), [Validators.required]],
            dateTo: [formData.dateTo == null ? null : new Date(formData.dateTo), [Validators.required]],
        });
        if (this.isOwnerSignature) {
            this.accountSignatoryForm.removeControl('dateFrom');
            this.accountSignatoryForm.removeControl('dateTo');
            this.accountSignatoryForm.updateValueAndValidity();
        }
        if (this.signatoryId) {
            this.updateSignature();
        }

        this.accountSignatoryForm.get('individualId').valueChanges.subscribe(
            value => {
                this.selectedIndividualId = value;
                this.fetchIndividualDetails(this.selectedIndividualId);
            });



        if (!(this.isOwnerSignature)) {
            this.accountSignatoryForm.get('dateFrom').valueChanges.subscribe(
                value => {
                    console.log(value);
                    if (!value) {
                        this.accountSignatoryForm.get('dateFrom').setValue(new Date());
                        this.accountSignatoryForm.get('dateFrom').updateValueAndValidity();
                    }

                    if (this.accountSignatoryForm.get('dateTo').value < value) {
                        this.accountSignatoryForm.get('dateTo').setValue(value);
                        this.accountSignatoryForm.get('dateTo').updateValueAndValidity();
                    }
                    if (value < this.minStartDate) {
                        this.accountSignatoryForm.get('dateFrom').disable();
                        this.accountSignatoryForm.get('dateFrom').setValue(value);
                        this.accountSignatoryForm.get('dateFrom').setValidators(null);
                        this.accountSignatoryForm.get('dateFrom').updateValueAndValidity();
                    }

                }
            );

            this.accountSignatoryForm.get('dateTo').valueChanges.subscribe(
                value => {
                    if (!value) {
                        this.accountSignatoryForm.get('dateTo').setValue(this.accountSignatoryForm.get('dateFrom').value);
                        this.accountSignatoryForm.get('dateTo').updateValueAndValidity();
                    }
                }
            );

            if (!this.accountSignatoryForm.get('dateFrom').value) {
                this.accountSignatoryForm.get('dateFrom').setValue(new Date());
                this.accountSignatoryForm.get('dateFrom').updateValueAndValidity();
            }
            if (this.accountSignatoryForm.get('dateTo').value < this.accountSignatoryForm.get('dateFrom').value) {
                this.accountSignatoryForm.get('dateTo').setValue(this.accountSignatoryForm.get('dateFrom').value);
                this.accountSignatoryForm.get('dateTo').updateValueAndValidity();
            }
            if (!this.accountSignatoryForm.get('dateTo').value) {
                this.accountSignatoryForm.get('dateTo').setValue(this.accountSignatoryForm.get('dateFrom').value);
                this.accountSignatoryForm.get('dateTo').updateValueAndValidity();
            }
        }
    }

    fetchIndividualDetails(individualId: number) {
        this.subscribers.fetchIndividualDetails = this.cisService
            .fetchIindividualInformationDetails({ id: individualId + "" })
            .subscribe(individual => {
                this.individualDetails = individual;
                if ((this.individualId !== individual.id)) { this.signatorySignature.nativeElement.src = ""; this.signature = null; }

                this.signatoryName = this.getFullName(individual.firstName, individual.middleName, individual.lastName);
                this.individualMobileNumber = individual.contactInformation.mobileNumber;
                this.individual_id = individual.id;
                this.accountSignatoryForm.get('signatoryName').setValue(this.getFullName(individual.firstName, individual.middleName, individual.lastName));
                if (!(this.signatoryId) || this.signatoryId && (this.individualId === this.individual_id)) {
                    this.accountSignatoryForm.get("mobileNumber").setValue(this.individualMobileNumber);
                }
                if (this.signatoryId && (this.mobileNumber !== this.individualMobileNumber) && (this.individualId !== this.individual_id)) {
                    this.accountSignatoryForm.get("mobileNumber").setValue(this.individualMobileNumber);
                }
            });
    }

    ngOnChanges() {
        if(this.signatoryId && (this.individualId === this.individual_id)){
                this.accountSignatoryForm.get("mobileNumber").setValue(this.mobileNumber);
        }
    }

    extractData(): AccountSignatory {
        let accountSignatory: AccountSignatory = this.accountSignatoryForm.value;
        accountSignatory.id = this.signatoryId;
        accountSignatory.signatoryName = this.signatoryName;
        accountSignatory.individualId = this.selectedIndividualId;
        accountSignatory.uuid = this.uuid;
        accountSignatory.signatoryType = this.queryParams['signatoryType'];
        accountSignatory.signature = this.signature;
        console.log(accountSignatory);
        return accountSignatory;
    }

    submit() {
        this.emitSaveEvent();
    }

    emitSaveEvent() {
        let accountSignatory = this.extractData();
        accountSignatory.accountOperatorInformationId = this.operatorId;
        this.onSave.emit({
            accountSignatoryForm: accountSignatory
        });
    }


    addNominated() {
        this.router.navigate(['/customer/individual/edit'],
            {
                queryParams: { signature: this.currentPath(this.location) },
                queryParamsHandling: 'merge'
            });
    }
    onSelect(individualId) {
        this.individualImage.nativeElement.src = this.sanitizer.bypassSecurityTrustUrl(this.imageApiUrl + "/individuals/" + individualId + "/image");
        this.accountSignatoryForm.get('individualId').setValue(individualId);
        this.accountSignatoryForm.get('individualId').updateValueAndValidity();
    }

    fetchOwners() {
        if (this.isOwnerSignature) {
            this.label = "Owner";
            this.fetchSingleCustomerSubject(this.customerId);
        }
        else {
            this.label = "Nominated";
        }

    }

    fetchSingleCustomerSubject(customerId: number) {
        this.subscribers.fetchSingleCustomerSubjectSub = this.cisService.fetchSubjects({ id: customerId }).subscribe(
            subjects => {
                this.owners = subjects;
            }
        );
    }

    getFullName(firstName: string, middleName: string, lastName: string): string {
        let name: string = '';
        name = name + (firstName ? firstName : "") + " " + (middleName ? middleName : "") + " " + (lastName ? lastName : "");
        name = name.trim();
        return name;
    }
    //add signature
    uploadImage() {
        this.ababilImage.show = true;
    }

    setImage(event) {
        this.imageBody = event;
        this.signatorySignature.nativeElement.src = this.imageBody;
        this.imageBody = this.imageBody.split(',')[1];
        this.getSignature(this.imageBody);
    }

    //update signature
    getBase64Image(img: HTMLImageElement) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }
    getBase64ImageFromURL(url: string) {
        return Observable.create((observer: Observer<string>) => {
            let img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;
            if (!img.complete) {
                img.onload = () => {
                    observer.next(this.getBase64Image(img));
                    observer.complete();
                };
                img.onerror = (err) => {
                    observer.error(err);
                };
            } else {
                observer.next(this.getBase64Image(img));
                observer.complete();
            }
        });
    }

    updateSignature() {
        let imageBodyUrl = this.signatorySignature.nativeElement.src;
        this.getBase64ImageFromURL(imageBodyUrl).subscribe(
            (data) => {
                this.imageBody = data;
            });
        this.getSignature(this.imageBody);
    }

    getSignature(data: any) {
        var binary_string = atob(data);
        var len = binary_string.length;
        var bytes = [];
        for (var i = 0; i < len; i++) {
            bytes.push(binary_string.charCodeAt(i));
        }
        this.signature = bytes;
    }

    formInvalid() {
        return (this.accountSignatoryForm.invalid || (this.signature == null));
    }
    cancel(): void {
        this.onCancel.emit();
    }
}
