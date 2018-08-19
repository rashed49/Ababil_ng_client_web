import { BaseComponent } from '../../../../../common/components/base.component';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { KycService } from '../../../../../services/kyc/service-api/kyc.service';
import { KycRiskScoreTemplate } from '../../../../../services/kyc/domain/kyc.risk.score.template.model';
import { SelectItem } from 'primeng/api';
import { NatureOfAccount } from '../../../../../common/domain/nature.of.account.enum.model';
import { VisaType } from '../../../../../common/domain/cis.enum.model';
import { NotificationService } from '../../../../../common/notification/notification.service';
import { BeneficialOwner } from '../../../../../common/domain/beneficial.owner.enum.model';
import { KycInstitute } from '../../../../../services/kyc/domain/kyc.institute.model';
import { KycSourceOfFundInstitute } from '../../../../../services/kyc/domain/kyc.source.of.fund.institute';
import { MergedKycOrganizationOtherInformation } from '../../../../../services/kyc/domain/kyc.organization.other.information';
import { RiskGrade } from '../../../../../common/domain/risk.grade.enum.model';

@Component({
    selector: 'kyc-institute-edit',
    templateUrl: './kyc.institute.edit.component.html',
    styleUrls: ['./kyc.institute.edit.component.scss']
})
export class KycInstituteEditComponent extends BaseComponent implements OnInit {

    queryParams: any;
    accountNumber: number;
    kycInstitute: KycInstitute = new KycInstitute();
    kycInstituteForm: FormGroup;
    natureOfAccount: SelectItem[] = NatureOfAccount;
    visaType: SelectItem[] = VisaType;
    beneficialOwner: SelectItem[] = BeneficialOwner;
    scoreType: SelectItem[] = RiskGrade;
    displayBlackListedActionTaken: boolean = false;
    sourceOfFunds: KycSourceOfFundInstitute[] = [];
    kycOrganizationOtherInformations: MergedKycOrganizationOtherInformation[] = [];
    totalRiskRating: string = '';
    overallRiskRating: string = '';
    overallRiskScoreValue: number;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private kycService: KycService,
        private notificationService: NotificationService) {
        super();
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.accountNumber = this.queryParams.accountNumber;
            if (this.accountNumber) { this.fetchKycInstituteByAccountNumber(); }
        });
        this.prepareKycIndividualForm(null);
    }

    prepareKycIndividualForm(formData: KycInstitute) {
        formData = formData ? formData : new KycInstitute();

        this.kycInstituteForm = this.formBuilder.group({
            // natureOfAccountOther: [formData.natureOfAccountOther],
            natureOfInstitute: [formData.natureOfInstitute],
            addressVerificationMethods: [formData.addressVerificationMethods],
            beneficialOwner: [formData.beneficialOwner],
            foreignerPurposeOfAccount: [formData.foreignerPurposeOfAccount],
            foreignerControllingAuthority: [formData.foreignerControllingAuthority],
            foreignerPermissionDetails: [formData.foreignerPermissionDetails],
            blackListedActionTaken: [formData.blackListedActionTaken],
            isBlackListedChecked: [formData.isBlackListedChecked],
            overallRiskScoreValue: [formData.overallRiskScore.value]
        });

        this.kycInstituteForm.controls.isBlackListedChecked.valueChanges.subscribe(data => {
            this.displayBlackListedActionTaken = data ? true : false;
            if (data) {
                this.displayBlackListedActionTaken = true;
            } else {
                this.kycInstituteForm.controls.blackListedActionTaken.reset();
                this.displayBlackListedActionTaken = false;
            }
        });

        this.kycInstituteForm.controls.overallRiskScoreValue.valueChanges.subscribe(data => {
            this.overallRiskRating = (this.overallRiskScoreValue <= data) ? 'High' : 'Low';
        });
    }

    fetchKycInstituteByAccountNumber() {
        let searchParam = new Map<string, string>();
        searchParam.set('accountNumber', this.accountNumber + '');
        this.subscribers.fetchKycIndividualByAccountNumberSub = this.kycService.fetchKyces(searchParam)
            .subscribe(data => {
                this.kycInstitute = data;
                this.sourceOfFunds = [...this.kycInstitute.sourceOfFunds];
                this.kycInstitute.netWorthRiskScore = this.kycInstitute.netWorthRiskScore ? this.kycInstitute.netWorthRiskScore : new KycRiskScoreTemplate();
                this.kycInstitute.amountOfMonthlyTransactionRiskScore = this.kycInstitute.amountOfMonthlyTransactionRiskScore ? this.kycInstitute.amountOfMonthlyTransactionRiskScore : new KycRiskScoreTemplate();
                this.kycInstitute.amountOfMonthlyCashTransactionRiskScore = this.kycInstitute.amountOfMonthlyCashTransactionRiskScore ? this.kycInstitute.amountOfMonthlyCashTransactionRiskScore : new KycRiskScoreTemplate();
                this.kycInstitute.numberOfMonthlyTransactionRiskScore = this.kycInstitute.numberOfMonthlyTransactionRiskScore ? this.kycInstitute.numberOfMonthlyTransactionRiskScore : new KycRiskScoreTemplate();
                this.kycInstitute.numberOfMonthlyCashTransactionRiskScore = this.kycInstitute.numberOfMonthlyCashTransactionRiskScore ? this.kycInstitute.numberOfMonthlyCashTransactionRiskScore : new KycRiskScoreTemplate();
                this.kycInstitute.overallRiskScore = this.kycInstitute.overallRiskScore ? this.kycInstitute.overallRiskScore : new KycRiskScoreTemplate();
                this.prepareKycIndividualForm(this.kycInstitute);
                this.calculateOverallRiskAssessment();

                let temporaryKycOrganizationOtherInformations: MergedKycOrganizationOtherInformation[] = this.kycInstitute.kycOrganizationOtherInformation
                    .map(orgInfo => {
                        return orgInfo.otherInformation.map(otherInfo => {
                            return {
                                name: orgInfo.name,
                                topic: otherInfo.otherInformationTopic.name,
                                status: otherInfo.status,
                                permissionGranted: otherInfo.permissionGranted,
                                customerInterviewed: otherInfo.customerInterviewed,
                                seniorManagementPermissionRequired: otherInfo.otherInformationTopic.seniorManagementPermissionRequired,
                                interviewWithCustomerRequired: otherInfo.otherInformationTopic.interviewWithCustomerRequired
                            }
                        });
                    }).reduce((prev, next) => prev.concat(next), []);
                this.kycOrganizationOtherInformations = [...temporaryKycOrganizationOtherInformations];
            });
    }

    calculateOverallRiskAssessment() {
        if (this.kycInstitute.overallRiskScore.to) {
            this.totalRiskRating = '<' + this.kycInstitute.overallRiskScore.to;
            this.overallRiskScoreValue = this.kycInstitute.overallRiskScore.to;
        } else {
            this.totalRiskRating = '>=' + this.kycInstitute.overallRiskScore.from;
            this.overallRiskScoreValue = this.kycInstitute.overallRiskScore.from;
        }

        this.overallRiskRating = this.kycInstitute.overallRiskScore.riskScore > 0 ? 'High' : 'Low';
    }

    save() {
        let kycInstituteToSave: KycInstitute = new KycInstitute();
        kycInstituteToSave = this.kycInstitute;
        kycInstituteToSave.natureOfInstitute = this.kycInstituteForm.controls.natureOfInstitute.value;
        // kycInstituteToSave.natureOfAccountOther = this.kycInstituteForm.controls.natureOfAccountOther.value;
        kycInstituteToSave.sourceOfFunds = this.sourceOfFunds;
        kycInstituteToSave.addressVerificationMethods = this.kycInstituteForm.controls.addressVerificationMethods.value;
        kycInstituteToSave.beneficialOwner = this.kycInstituteForm.controls.beneficialOwner.value;
        kycInstituteToSave.foreignerPurposeOfAccount = this.kycInstituteForm.controls.foreignerPurposeOfAccount.value;
        kycInstituteToSave.foreignerControllingAuthority = this.kycInstituteForm.controls.foreignerControllingAuthority.value;
        kycInstituteToSave.foreignerPermissionDetails = this.kycInstituteForm.controls.foreignerPermissionDetails.value;
        kycInstituteToSave.isBlackListedChecked = this.kycInstituteForm.controls.isBlackListedChecked.value;
        kycInstituteToSave.blackListedActionTaken = this.kycInstituteForm.controls.blackListedActionTaken.value;
        kycInstituteToSave.overallRiskScore.value = this.kycInstituteForm.controls.overallRiskScoreValue.value;

        (this.kycInstitute.id && this.kycInstitute.id != 0) ? this.updateKycInstitute(kycInstituteToSave) : this.createKycInstitute(kycInstituteToSave);
    }

    createKycInstitute(kycInstitute: KycInstitute) {
        this.subscribers.createKycIndividualSub = this.kycService
            .createKycInstitute(kycInstitute)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("kyc.save.success");
                this.navigateAway();
            });
    }

    updateKycInstitute(kycInstitute: KycInstitute) {
        this.subscribers.updateKycIndividualSub = this.kycService
            .updateKycInstitute({ kycId: this.kycInstitute.id }, kycInstitute)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("kyc.update.success");
                this.navigateAway();
            });
    }

    back() {
        this.navigateAway();
    }

    navigateAway() {
        this.router.navigate(['../', 'details'], {
            relativeTo: this.route,
            queryParamsHandling: "merge"
        });
    }
}