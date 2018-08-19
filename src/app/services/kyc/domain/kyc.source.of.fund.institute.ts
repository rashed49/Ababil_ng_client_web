import { SubjectSourceOfFund } from "../../cis/domain/subject.model";

export class KycSourceOfFundInstitute {
    id: number;
    sourceOfFund: SubjectSourceOfFund;
    documentConfirmation1: string;
    documentConfirmation2: string;
    documentConfirmation3: string;
    documentVerified: boolean;
    instituteRelatedFiles: string;
    scoreType: string;

    constructor() {
        this.sourceOfFund = new SubjectSourceOfFund();
    }
}