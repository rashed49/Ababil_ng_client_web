import { RiskGradingType } from './../../../common/domain/risk.grading.type.enum.model';

export class KycRiskScoreTemplate {
    id: number;
    externalId: number;
    name: string;
    code: string;
    riskGradingType: string;
    from: number;
    to: number;
    riskScore: number;
    profitBearing: boolean;
    value: number;
}