import { Document } from '../../document/domain/document.models';
import { KycRiskScoreTemplate } from './kyc.risk.score.template.model';
import { OtherInformation } from '../../cis/domain/individual.model';

export class Kyc {
    id: number;
    customerId: number;
    accountNumber: string;
    accountName: string;
    natureOfAccount: string;
    natureOfAccountOther: string;
    addressVerificationMethods: string;
    beneficialOwner: string;
    documents: Document[];
    isBlackListedChecked: boolean;
    blackListedActionTaken: string;
    accountOpeningChannelRiskScore: KycRiskScoreTemplate;
    amountOfMonthlyTransactionRiskScore: KycRiskScoreTemplate;
    numberOfMonthlyTransactionRiskScore: KycRiskScoreTemplate;
    amountOfMonthlyCashTransactionRiskScore: KycRiskScoreTemplate;
    numberOfMonthlyCashTransactionRiskScore: KycRiskScoreTemplate;
    overallRiskScore: KycRiskScoreTemplate;
    type: string;
    subjectId: number;

    constructor() {
        this.documents = [];
        this.accountOpeningChannelRiskScore = new KycRiskScoreTemplate();
        this.amountOfMonthlyTransactionRiskScore = new KycRiskScoreTemplate();
        this.numberOfMonthlyTransactionRiskScore = new KycRiskScoreTemplate();
        this.amountOfMonthlyCashTransactionRiskScore = new KycRiskScoreTemplate();
        this.numberOfMonthlyCashTransactionRiskScore = new KycRiskScoreTemplate();
        this.overallRiskScore = new KycRiskScoreTemplate();
    }
}