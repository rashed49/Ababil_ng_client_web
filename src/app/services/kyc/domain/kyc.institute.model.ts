import { Kyc } from "./kyc.model";
import { KycRiskScoreTemplate } from "./kyc.risk.score.template.model";
import { KycSourceOfFundInstitute } from "./kyc.source.of.fund.institute";
import { KycOrganizationOtherInformation } from "./kyc.organization.other.information";

export class KycInstitute extends Kyc {
    natureOfInstitute: string;
    netWorthOfInstitute: number;
    foreignerPurposeOfAccount: string;
    foreignerControllingAuthority: string;
    foreignerPermissionDetails: string;
    sourceOfFunds: KycSourceOfFundInstitute[];
    businessTypeRiskScores: KycRiskScoreTemplate[];
    netWorthRiskScore: KycRiskScoreTemplate;
    kycOrganizationOtherInformation: KycOrganizationOtherInformation[];

    constructor() {
        super();
        this.sourceOfFunds = [];
        this.businessTypeRiskScores = [];
        this.netWorthRiskScore = new KycRiskScoreTemplate();
        this.kycOrganizationOtherInformation = [];
    }
}