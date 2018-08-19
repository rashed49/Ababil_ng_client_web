import { Kyc } from './kyc.model';
import { ForeignerInformation, OtherInformation } from "../../cis/domain/individual.model";
import { KycSourceOfFundIndividual } from "../domain/kyc.source.of.fund.individual.model";
import { KycRiskScoreTemplate } from "./kyc.risk.score.template.model";

export class KycIndividual extends Kyc {
    occupation: string;
    monthlyProbableIncome: number;
    sourceOfFunds: KycSourceOfFundIndividual[];
    residenceStatus: string;
    foreignerInformation: ForeignerInformation;
    foreignerPurposeOfAccount: string;
    foreignerApprovalObtained: boolean;
    monthlyIncomeRiskScore: KycRiskScoreTemplate;
    occupationTypeRiskScores: KycRiskScoreTemplate[];
    otherInformation: OtherInformation[];

    constructor() {
        super();
        this.foreignerInformation = new ForeignerInformation();
        this.sourceOfFunds = [];
        this.otherInformation = [];
        this.monthlyIncomeRiskScore = new KycRiskScoreTemplate();
        this.occupationTypeRiskScores = [];
    }
}
