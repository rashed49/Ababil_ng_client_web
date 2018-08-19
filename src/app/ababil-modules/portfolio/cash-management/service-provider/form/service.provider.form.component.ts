import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBaseComponent } from "../../../../../common/components/base.form.component";
import { Location } from "@angular/common";
import { ApprovalflowService } from "../../../../../services/approvalflow/service-api/approval.flow.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { Branch } from "../../../../../services/bank/domain/bank.models";
import { NotificationService } from "../../../../../common/notification/notification.service";
import { ServiceProvider } from "../../../../../services/teller/domain/service.provider.model";
import { ServiceProviderService } from "../../../../../services/teller/service-api/service.provider.service";
import { BillCollectionAccountType } from "../../../../../services/teller/domain/service.provider.enum.model";
import * as commandConstants from '../../../../../common/constants/app.command.constants';
import { VerifierSelectionEvent } from "../../../../../common/components/verifier-selection/verifier.selection.component";
import { DocumentService } from "../../../../../services/document/service-api/document.service";
export const DETAILS_UI: string = "views/service-provider";


@Component({
    selector: 'service-provider-form',
    templateUrl: './service.provider.form.component.html'

})

export class ServiceProviderFormComponent extends FormBaseComponent implements OnInit {
    providerForm: FormGroup;
    branchLookupDisplay = false;
    newBranch: Branch = new Branch;
    branches: any[] = [];
    billCollectionId: number;
    taskId: number;
    billCollectionAccountTypes = BillCollectionAccountType;
    fileType: string = '';
    imageBody: any;
    logo: any;

    @ViewChild('ownBranch') ownBranch: any;
    @ViewChild('ababilImage') ababilImage: any;
    ngOnInit() {
        this.showVerifierSelectionModal = of(false);
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.billCollectionId = +params['billCollectionId'];
        });

        if (this.taskId) { }
        else {

            if (this.billCollectionId) {
                this.serviceProviderService.fetchServiceProviderDetail({ billCollectionId: this.billCollectionId })
                    .subscribe(
                        data => this.prepareProviderForm(data)
                    )
            }
        }
        this.prepareProviderForm(new ServiceProvider());

    }


    constructor(
        protected location: Location,
        protected approvalFlowService: ApprovalflowService,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private serviceProviderService: ServiceProviderService,
    ) {
        super(location, approvalFlowService);
    }

    prepareProviderForm(formData: ServiceProvider) {
        formData = formData ? formData : new ServiceProvider();
        if (formData.branches) { this.branches = formData.branches }
        this.providerForm = this.formBuilder.group({
            providerName: [formData.providerName],
            shortName: [formData.shortName],
            billCollectionAccountType: [formData.billCollectionAccountType],
            accountId: [formData.accountId],
            vatGlAccountId: [formData.vatGlAccountId],
            isIntegrated: [formData.isIntegrated],
            isStampChargeApplicable: [formData.isStampChargeApplicable],
        })
    }

    showOwnBranches() {
        this.branchLookupDisplay = true;
    }

    onRowClick(event) {
        this.newBranch = this.ownBranch.extractData();
        if (this.branches.findIndex(branch => branch.id == this.newBranch.id) < 0) {
            this.branches = [...this.branches, this.newBranch];
            this.branchLookupDisplay = false;
        }
        else {
            this.notificationService.sendErrorMsg("same.branch.addition.error")
        }

    }

    deleteBranch(index) {
        this.branches.splice(index, 1);
        this.branches = [... this.branches];
    }

    formInvalid() {
        if (!this.providerForm) return true;
        else {
            return this.providerForm.invalid;
        }
    }
    uploadLogo() {
        this.ababilImage.show = true;
    }

    setImage(event) {
        this.imageBody = event;
        // this.signatorySignature.nativeElement.src = this.imageBody;
        this.imageBody = this.imageBody.split(',')[1];
        this.getSignature(this.imageBody);
    }

    getSignature(data: any) {
        var binary_string = atob(data);
        var len = binary_string.length;
        var bytes = [];
        for (var i = 0; i < len; i++) {
            bytes.push(binary_string.charCodeAt(i));
        }
        this.logo = bytes;
    }

    onFileUpload(event) {
        console.log(event.files[0].objectURL);
        // let urlQueryParamMap = new Map();
        // urlQueryParamMap.set("temporary", true);
        // this.fileType = null;
        // switch (event.files[0].type) {
        //   case 'image/png':
        //     urlQueryParamMap.set("fileType", "PNG");
        //     this.fileType = "PNG";
        //     break;
        //   case 'text/plain':
        //     urlQueryParamMap.set("fileType", "TXT");
        //     this.fileType = "TXT";
        //     break;
        //   case 'application/pdf':
        //     urlQueryParamMap.set("fileType", "PDF");
        //     this.fileType = "PDF";
        //     break;
        //   case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        //     urlQueryParamMap.set("fileType", "DOCX");
        //     this.fileType = "DOCX";
        //     break;
        //   case 'application/msword':
        //     urlQueryParamMap.set("fileType", "DOC");
        //     this.fileType = "DOC";
        //     break;
        //   case 'text/csv':
        //     urlQueryParamMap.set("fileType", "CSV");
        //     this.fileType = "CSV";
        //     break;
        //   case 'application/mp4':
        //     urlQueryParamMap.set("fileType", "MP4");
        //     this.fileType = "MP4";
        //     break;
        //   case 'video/mp4':
        //     urlQueryParamMap.set("fileType", "MP4");
        //     this.fileType = "MP4";
        //     break;
        //   default:
        //     urlQueryParamMap.set("fileType", "JPG");
        //     this.fileType = "JPG";
        //     break;
        // }

        // console.log(event.files[0]);
        // this.documentService.uploadDocumentFile(event.files[0], urlQueryParamMap).subscribe(
        //   data => {
        // this.notificationService.sendSuccessMsg("doc.upload.success");
        // this.resultantFormGroupSet[index].doc.files.push({id: data.content, type:this.fileType});
        //     // this.fileUploader.clear();
        //   }
        // );
    }


    submit() {

        this.markFormGroupAsTouched(this.providerForm);
        if (this.formInvalid()) return;
        if (!this.formInvalid()) {
            this.showVerifierSelectionModal = of(true);
            if (!this.billCollectionId) {
                this.command = commandConstants.CREATE_SERVICE_PROVIDER_COMMAND;
            }
            else {
                this.command = commandConstants.UPDATE_SERVICE_PROVIDER_COMMAND;
            }
        }

    }

    onVerifierSelect(event: VerifierSelectionEvent) {
        let view_ui = DETAILS_UI;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, event.verifier, view_ui, this.location.path().concat("&"));

        let newServiceProvider: ServiceProvider = this.providerForm.value;
        newServiceProvider.branches = this.branches;
        newServiceProvider.logo = this.logo;
        console.log(newServiceProvider);
        this.subscribers.createProviderSub = this.serviceProviderService.createServiceProvider(newServiceProvider, urlSearchParams).subscribe();

        if (!event.approvalFlowRequired) {
            this.notificationService.sendSuccessMsg("service.provider.create.success");
        }
        else {
            this.notificationService.sendSuccessMsg("workflow.task.verify.send");
        }
        if (this.taskId) {
            this.router.navigate(['/approval-flow/pendingtasks']);
        }
    }
    cancel() {
        if (this.billCollectionId) {
            this.router.navigate(['service-provider/detail', this.billCollectionId])
        }
        else {
            this.router.navigate(['../../'], {
                relativeTo: this.route,
            });
        }
    }
}