export class AccountNominee {
    accountId: number;
    id: number;
    individualId: number;
    sharePercentage: number;
    relationWithAccountHolder: string;
    guardianId: number;
    relationWithGuardian: string;
}

export class AvailablePercentage {
    lowerLimit: number;
    upperLimit: number;
}