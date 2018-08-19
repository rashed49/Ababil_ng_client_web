import { SubjectSourceOfFund } from "../../cis/domain/subject.model";

export class KycSourceOfFundIndividual {
    id: number;
    sourceOfFund: SubjectSourceOfFund;
    documentConfirmation1: string;
    documentConfirmation2: string;
    documentConfirmation3: string;
    isDocumentVerified: boolean;

    constructor() {
        this.sourceOfFund = new SubjectSourceOfFund();
    }
}