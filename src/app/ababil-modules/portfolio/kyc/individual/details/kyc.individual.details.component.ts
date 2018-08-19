import { BaseComponent } from '../../../../../common/components/base.component';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { KycService } from '../../../../../services/kyc/service-api/kyc.service';
import { KycIndividual } from '../../../../../services/kyc/domain/kyc.individual.mode';


@Component({
    selector: 'kyc-individual-details',
    templateUrl: './kyc.individual.details.component.html'
})
export class KycIndividualDetailsComponent extends BaseComponent implements OnInit {

    queryParams: any;
    accountNumber: number;
    kycIndividual: KycIndividual = new KycIndividual();
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
            if (this.accountNumber) { this.fetchKycIndividualByAccountNumber(); }
        });
    }

    fetchKycIndividualByAccountNumber() {
        let searchParam = new Map<string, string>();
        searchParam.set('accountNumber', this.accountNumber + '');
        this.subscribers.fetchKycesDetailsSub = this.kycService.fetchKyces(searchParam)
            .subscribe(data => {
                this.kycIndividual = data;
                this.overallRiskRating = this.kycIndividual.overallRiskScore.riskScore > 0 ? 'High' : 'Low';
            });
    }

    edit() {
        this.router.navigate(['/kyc/individual/edit'], { queryParamsHandling: "merge" });
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