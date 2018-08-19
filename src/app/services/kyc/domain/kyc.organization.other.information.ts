import { OtherInformation } from "../../cis/domain/individual.model";
import { OtherInformationTopics } from "../../cis/domain/other.information.topics.model";

export class KycOrganizationOtherInformation {
    name: string;
    otherInformation: OtherInformation[];

    constructor() {
        this.otherInformation = [];
    }
}

export class MergedKycOrganizationOtherInformation {
    name?: string;
    topic?: string;
    status?: boolean;
    permissionGranted?: boolean;
    customerInterviewed?: boolean;
    seniorManagementPermissionRequired: string;
    interviewWithCustomerRequired: string;
}