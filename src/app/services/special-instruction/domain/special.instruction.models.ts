export class SpecialInstruction {
    id: number;
    demandDepositAccountId: number;
 specialInstructionType: SpecialInstructionType;
  chequeNumberFrom: string;
  chequeNumberTo: string;
    
    chequeAmount: string;
    lienAmount: string;
    imposeDate: Date;
    withdrawDateTime: Date;
    withdrawnBy: string;
    description: string;
    specialInstructionStatus: SpecialInstructionStatus;
}

export enum SpecialInstructionStatus {
    IMPOSED, WITHDRAWN
}

export class SpecialInstructionType {
    id: number;
    code: string;
    name: string;
    amountRelated: boolean;
    chequeRelated: boolean;
}

export type WithdrawInstructionAction = 'WITHDRAW';

export interface WithdrawInstructionCommand{
    action:WithdrawInstructionAction
}


