export class IdentityType {
    id?: number;
    identitySubjectType?: string;
    typeName?: string;
    identityAdditionalAttributes?: IdentityAttributeType[];
    constructor() {
        this.identityAdditionalAttributes = [];
    }

}

export class IdentityAttributeType {
    attributeDataType: string;
    attributeName: string;
    id: number;
    length: number;
    mandatory: boolean;

}