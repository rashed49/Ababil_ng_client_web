import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OwnBranch, OtherBranch} from '../../../../services/bank/domain/bank.models';
import { BaseComponent } from '../../../../common/components/base.component';
import { Observable, of } from 'rxjs';
import { VerifierSelectionEvent } from '../../../../common/components/verifier-selection/verifier.selection.component';
import { Address } from '../../../../services/cis/domain/address.model';
import * as mapper from './branch.mapper';
import { AbabilLocationService } from './../../../../services/location/service-api/location.service';
import { SelectItem } from 'primeng/primeng';
import { BranchTypes } from '../../../../services/bank/domain/branch.enum.model';


export let initialBranchFormData1: OwnBranch = new OwnBranch();
initialBranchFormData1.headOffice = false;
initialBranchFormData1.online = false;

export let initialBranchFormData2: OtherBranch = new OtherBranch();

@Component({
    selector: 'app-branch-form',
    templateUrl: './branch.form.component.html',
    styleUrls: ['./branch.form.component.scss']
})

export class BranchFormComponent extends BaseComponent implements OnInit {
    
    constructor(private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private ababilLocationService: AbabilLocationService) { super() }

    ownBranchForm: FormGroup;
    otherBranchForm: FormGroup;
    branchId: number;
    selectedBankId: number;
    branchTypes: SelectItem[] = BranchTypes;
    address: Address =new Address();
    @Input('ownbank') ownBank: boolean;

    @Input('formData') set formData(formData: any) {
        if (this.ownBank) {
            this.prepareOwnBranchForm(formData);
        } else {
            this.prepareOtherBranchForm(formData);
        }
    }

    @Input('command') command: string;
    @Input('editMode') editMode: boolean;
    @Input('backRoute') backRoute: string;
    @Output('onSave') onSave = new EventEmitter<any>();
    @Output('onCancel') onCancel = new EventEmitter<void>();
    @ViewChild('addressComponent') addressComponent:any;

    verifierSelectionModalVisible: Observable<boolean>;

    ngOnInit() {
        this.subscribers.routeSub = this.route.params.subscribe(
            params => {
                this.selectedBankId = +params['bankId'];
            });
        this.verifierSelectionModalVisible = of(false);
    }

    prepareOwnBranchForm(formData: OwnBranch) {
        formData = (formData == null) ? initialBranchFormData1 : formData;
        this.branchId = formData.id;
        this.address=formData.address?formData.address:new Address();
        this.ownBranchForm = this.formBuilder.group({
            name: [formData.name],
            code: [formData.code],
            adCode: [formData.adCode],
            phoneNumber: [formData.phoneNumber],
            mobileNumber: [formData.mobileNumber],
            email: [formData.email],
            routingNumber: [formData.routingNumber],
            branchType: [formData.branchType],
            swiftCode: [formData.swiftCode],
            managerName: [formData.managerName],
            managerDesignation: [formData.managerDesignation],
            online: [formData.online],
            numberOfConcurrentUser: [formData.numberOfConcurrentUser],
            headOffice: [formData.headOffice]
        });
    }
    prepareOtherBranchForm(formData: OtherBranch) {
        formData = (formData == null) ? initialBranchFormData2 : formData;
        this.address=formData.address?formData.address:new Address();
        this.branchId = formData.id;
        this.otherBranchForm = this.formBuilder.group({
            name: [formData.name, [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
            code: [formData.code],
            adCode: [formData.adCode],
            phoneNumber: [formData.phoneNumber],
            mobileNumber: [formData.mobileNumber],
            email: [formData.email],
            routingNumber: [formData.routingNumber]
        });
    }

    submit() {
        this.verifierSelectionModalVisible = of(true);
    }

    onVerifierSelect(selectEvent: VerifierSelectionEvent) {
        this.emitSaveEvent(selectEvent.verifier);
    }

    emitSaveEvent(verifier: string) {
        if (this.ownBank) {
            let ownBranch = this.extractData();
            ownBranch.id = this.branchId;
            this.onSave.emit({
                branchForm: ownBranch,
                verifier: verifier
            });
        } else {
            let otherBranch = this.extractData1();  
            otherBranch.id = this.branchId;          
            this.onSave.emit({
                branchForm: otherBranch,
                verifier: verifier
            });
        }
    }

    cancel() {
        this.onCancel.emit();
    }

    navigateAway() {
        this.router.navigate([this.backRoute], { relativeTo: this.route });
    }

    extractData(): OwnBranch {
        let ownBranch : OwnBranch = mapper.mapOwnBranch(this.ownBranchForm.value);
            ownBranch.address =  this.addressComponent.extractData();
            ownBranch.bankId = this.selectedBankId;
            ownBranch.jsonType = "OWN";
        return ownBranch;
    }
    extractData1(): OtherBranch {
        let otherBranch : OtherBranch = mapper.mapOtherBranch(this.otherBranchForm.value);
            otherBranch.address =  this.addressComponent.extractData();
            otherBranch.bankId = this.selectedBankId;
            otherBranch.jsonType = "OTHER";
        return otherBranch;
        }
  
}
