import { BaseComponent } from '../../../../../common/components/base.component';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { KycService } from '../../../../../services/kyc/service-api/kyc.service';
import { KycIndividual } from '../../../../../services/kyc/domain/kyc.individual.mode';
import { ForeignerInformation } from '../../../../../services/cis/domain/individual.model';
import { KycRiskScoreTemplate } from '../../../../../services/kyc/domain/kyc.risk.score.template.model';
import { SelectItem } from 'primeng/api';
import { NatureOfAccount } from '../../../../../common/domain/nature.of.account.enum.model';
import { VisaType } from '../../../../../common/domain/cis.enum.model';
import * as ababilValidators from '../../../../../common/constants/app.validator.constants';
import { NotificationService } from '../../../../../common/notification/notification.service';
import { BeneficialOwner } from '../../../../../common/domain/beneficial.owner.enum.model';
import { KycSourceOfFundIndividual } from '../../../../../services/kyc/domain/kyc.source.of.fund.individual.model';

@Component({
    selector: 'kyc-individual-edit',
    templateUrl: './kyc.individual.edit.component.html',
    styleUrls: ['./kyc.individual.edit.component.scss']
})
export class KycIndividualEditComponent extends BaseComponent implements OnInit {

    queryParams: any;
    accountNumber: number;
    kycIndividual: KycIndividual = new KycIndividual();
    kycIndividualForm: FormGroup;
    natureOfAccount: SelectItem[] = NatureOfAccount;
    visaType: SelectItem[] = VisaType;
    beneficialOwner: SelectItem[] = BeneficialOwner;
    displayBlackListedActionTaken: boolean = false;
    balanceLength: number = ababilValidators.balanceLength;
    sourceOfFunds: KycSourceOfFundIndividual[] = [];
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
            if (this.accountNumber) { this.fetchKycIndividualByAccountNumber(); }
        });
        this.prepareKycIndividualForm(null);
    }

    prepareKycIndividualForm(formData: KycIndividual) {
        formData = formData ? formData : new KycIndividual();
        formData.foreignerInformation = formData.foreignerInformation ? formData.foreignerInformation : new ForeignerInformation();

        this.kycIndividualForm = this.formBuilder.group({
            // natureOfAccountOther: [formData.natureOfAccountOther],
            occupation: [formData.occupation],
            addressVerificationMethods: [formData.addressVerificationMethods],
            beneficialOwner: [formData.beneficialOwner],
            foreignerPurposeOfAccount: [formData.foreignerPurposeOfAccount],
            foreignerApprovalObtained: [formData.foreignerApprovalObtained],
            blackListedActionTaken: [formData.blackListedActionTaken],
            isBlackListedChecked: [formData.isBlackListedChecked],
            overallRiskScoreValue: [formData.overallRiskScore.value]
        });

        this.kycIndividualForm.controls.isBlackListedChecked.valueChanges.subscribe(data => {
            this.displayBlackListedActionTaken = data ? true : false;
            if (data) {
                this.displayBlackListedActionTaken = true;
            } else {
                this.kycIndividualForm.controls.blackListedActionTaken.reset();
                this.displayBlackListedActionTaken = false;
            }
        });

        this.kycIndividualForm.controls.overallRiskScoreValue.valueChanges.subscribe(data => {
            this.overallRiskRating = (this.overallRiskScoreValue <= data) ? 'High' : 'Low';
        });
    }

    fetchKycIndividualByAccountNumber() {
        let searchParam = new Map<string, string>();
        searchParam.set('accountNumber', this.accountNumber + '');
        this.subscribers.fetchKycIndividualByAccountNumberSub = this.kycService.fetchKyces(searchParam)
            .subscribe(data => {
                this.kycIndividual = data;
                this.sourceOfFunds = [...this.kycIndividual.sourceOfFunds];
                this.kycIndividual.monthlyIncomeRiskScore = this.kycIndividual.monthlyIncomeRiskScore ? this.kycIndividual.monthlyIncomeRiskScore : new KycRiskScoreTemplate();
                this.kycIndividual.amountOfMonthlyTransactionRiskScore = this.kycIndividual.amountOfMonthlyTransactionRiskScore ? this.kycIndividual.amountOfMonthlyTransactionRiskScore : new KycRiskScoreTemplate();
                this.kycIndividual.amountOfMonthlyCashTransactionRiskScore = this.kycIndividual.amountOfMonthlyCashTransactionRiskScore ? this.kycIndividual.amountOfMonthlyCashTransactionRiskScore : new KycRiskScoreTemplate();
                this.kycIndividual.numberOfMonthlyTransactionRiskScore = this.kycIndividual.numberOfMonthlyTransactionRiskScore ? this.kycIndividual.numberOfMonthlyTransactionRiskScore : new KycRiskScoreTemplate();
                this.kycIndividual.numberOfMonthlyCashTransactionRiskScore = this.kycIndividual.numberOfMonthlyCashTransactionRiskScore ? this.kycIndividual.numberOfMonthlyCashTransactionRiskScore : new KycRiskScoreTemplate();
                this.kycIndividual.overallRiskScore = this.kycIndividual.overallRiskScore ? this.kycIndividual.overallRiskScore : new KycRiskScoreTemplate();
                this.prepareKycIndividualForm(this.kycIndividual);

                this.calculateOverallRiskAssessment();
            });
    }

    calculateOverallRiskAssessment() {
        if (this.kycIndividual.overallRiskScore.to) {
            this.totalRiskRating = '<' + this.kycIndividual.overallRiskScore.to;
            this.overallRiskScoreValue = this.kycIndividual.overallRiskScore.to;
        } else {
            this.totalRiskRating = '>=' + this.kycIndividual.overallRiskScore.from;
            this.overallRiskScoreValue = this.kycIndividual.overallRiskScore.from;
        }

        this.overallRiskRating = this.kycIndividual.overallRiskScore.riskScore > 0 ? 'High' : 'Low';
    }

    save() {
        let kycIndividualToSave: KycIndividual = new KycIndividual();
        kycIndividualToSave = this.kycIndividual;
        kycIndividualToSave.occupation = this.kycIndividualForm.controls.occupation.value;
        // kycIndividualToSave.natureOfAccountOther = this.kycIndividualForm.controls.natureOfAccountOther.value;
        kycIndividualToSave.sourceOfFunds = this.sourceOfFunds;
        kycIndividualToSave.addressVerificationMethods = this.kycIndividualForm.controls.addressVerificationMethods.value;
        kycIndividualToSave.beneficialOwner = this.kycIndividualForm.controls.beneficialOwner.value;
        kycIndividualToSave.foreignerPurposeOfAccount = this.kycIndividualForm.controls.foreignerPurposeOfAccount.value;
        kycIndividualToSave.foreignerApprovalObtained = this.kycIndividualForm.controls.foreignerApprovalObtained.value;
        kycIndividualToSave.isBlackListedChecked = this.kycIndividualForm.controls.isBlackListedChecked.value;
        kycIndividualToSave.blackListedActionTaken = this.kycIndividualForm.controls.blackListedActionTaken.value;
        kycIndividualToSave.overallRiskScore.value = this.kycIndividualForm.controls.overallRiskScoreValue.value;

        (this.kycIndividual.id && this.kycIndividual.id != 0) ? this.updateKycIndividual(kycIndividualToSave) : this.createKycIndividual(kycIndividualToSave);
    }

    createKycIndividual(kycIndividual: KycIndividual) {
        this.subscribers.createKycIndividualSub = this.kycService
            .createKycIndividual(kycIndividual)
            .subscribe(data => {
                this.notificationService.sendSuccessMsg("kyc.save.success");
                this.navigateAway();
            });
    }

    updateKycIndividual(kycIndividual: KycIndividual) {
        this.subscribers.updateKycIndividualSub = this.kycService
            .updateKycIndividual({ kycId: this.kycIndividual.id }, kycIndividual)
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