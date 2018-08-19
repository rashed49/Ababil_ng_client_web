export class InlandRemittanceLot {
    id: number;
    inlandRemittanceProduct: InlandRemittanceProduct;
    startLeafNo: number;
    endLeafNo: number;
    noOfLeaf: number;
    branch: number;
    currencyCode: string;

    constructor() {
        this.inlandRemittanceProduct = new InlandRemittanceProduct();
    }
}
export class InlandRemittanceProduct {
    id: number;
    name: string;
    payableGL: boolean;

    constructor() {
    }
}
