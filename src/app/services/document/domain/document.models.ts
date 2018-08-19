export class Document {
    id: number;
    documentType: DocumentType;
    verified: boolean;
    verificationDetails: string;
    properties: Properties[];
    filePaths: string;
    files: Files[];
    profileCode: string;
    clientId:string;

    constructor() {
        this.documentType = new DocumentType();
        this.properties = [];
        this.files = [];
    }
}
export class Files {
    id: string;
    type: string;    
}
export class DocumentType {
    id: number;
    name: string;
    mandatory: boolean;
    properties: null;
}

export class Properties {
    id: number;
    propertyValue: string;
    documentPropertyType: DocumentPropertyType;

    constructor() {
        this.documentPropertyType = new DocumentPropertyType();
    }
}

export class DocumentPropertyType {
    id: number;
    propertyName: string;
    mandatory: boolean;
    propertyDataType: string;
}
