import { BaseComponent } from '../../../../../common/components/base.component';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { KycService } from '../../../../../services/kyc/service-api/kyc.service';
import { KycInstitute } from './../../../../../services/kyc/domain/kyc.institute.model';
import { MergedKycOrganizationOtherInformation } from '../../../../../services/kyc/domain/kyc.organization.other.information';

@Component({
    selector: 'kyc-institute-details',
    templateUrl: './kyc.institute.details.component.html'
})
export class KycInstituteDetailsComponent extends BaseComponent implements OnInit {

    queryParams: any;
    accountNumber: number;
    kycInstitute: KycInstitute = new KycInstitute();
    kycOrganizationOtherInformations: MergedKycOrganizationOtherInformation[] = [];
    totalRiskRating: string = '';
    overallRiskRating: string = '';
    
    constructor(private route: ActivatedRoute,
        private router: Router,
        private kycService: KycService) {
        super();
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.accountNumber = this.queryParams.accountNumber;
            if (this.accountNumber) { this.fetchKycInstituteByAccountNumber(); }
        });
    }

    fetchKycInstituteByAccountNumber() {
        let searchParam = new Map<string, string>();
        searchParam.set('accountNumber', this.accountNumber + '');
        this.subscribers.fetchKycesDetailsSub = this.kycService.fetchKyces(searchParam)
            .subscribe(data => {
                this.kycInstitute = data;
                this.overallRiskRating = this.kycInstitute.overallRiskScore.riskScore > 0 ? 'High' : 'Low';

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

    edit() {
        this.router.navigate(['/kyc/institute/edit'], { queryParamsHandling: "merge" });
    }

    back() {
        this.navigateAway();
    }

    navigateAway() {
        if (this.queryParams.account !== undefined) {
            this.router.navigate([this.queryParams.account], {
                queryParams: { cus: this.queryParams.cus }
            });
        }
    }

}