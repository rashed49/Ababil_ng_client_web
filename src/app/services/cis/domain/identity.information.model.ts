export class IdentityAdditionalInfo {
    id: number;
    attributeId: number;
    attributeValue: any;
}

export class IdentityInformation {
    id: number;
    identityId: any;
    identityTypeId: string;
    additionalInfos: IdentityAdditionalInfo[];
}
