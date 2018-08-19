import { TimeDepositLienDetail } from "../../time-deposit-lien/domain/time.deposit.lien.detail.model";

export class TimeDepositLien {
    activityId: number;
    approveTerminal: string;
    approveUser: string;
    branchId: number;
    entryTerminal: string;
    entryTime: string;
    entryUser: string;
    id: number;
    lienReferenceNumber: string;
    note: string;
    processId: string;
    referenceTypeId: number;
    status: string;
    totalLienAmount: number;
    timeDepositLienDetails: TimeDepositLienDetail[];

    constructor() {
        this.timeDepositLienDetails = [];
    }
}

